// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
import { ServicesClient } from "@google-cloud/appengine-admin";
import fs from "fs";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

const INPUT_FILE = "./terraform/students.csv";
const OUTPUT_FILE = "cd_results.csv";

const appEngineClient = new ServicesClient();

const createCSVWriter = (filename, columns) => {
  const stringifier = stringify({
    header: true,
    columns: columns,
    cast: {
      boolean: (value) => (value ? "Y" : "N"),
    },
  });
  const writableStream = fs.createWriteStream(filename);
  stringifier.pipe(writableStream);

  return stringifier;
};

const hasAppEngine = async (projectId) => {
  try {
    await appEngineClient.listServices({
      parent: `apps/${projectId}`,
    });
    return true;
  } catch (e) {
    // 5 is NOT_FOUND
    // https://cloud.google.com/apis/design/errors#error_codes
    if (e.code !== 5) {
      throw e;
    }
  }

  return false;
};

const checkProject = async (uni) => {
  const projectId = `columbia-ops-mgmt-${uni}`;
  const appExists = await hasAppEngine(projectId);
  return { uni, app_engine: appExists };
};

const checkProjects = async () => {
  const parser = fs.createReadStream(INPUT_FILE).pipe(parse({ columns: true }));
  const stringifier = createCSVWriter(OUTPUT_FILE, ["uni", "app_engine"]);

  // do them all in parallel
  const promises = [];
  for await (const row of parser) {
    const promise = checkProject(row.Uni).then((result) =>
      stringifier.write(result)
    );
    promises.push(promise);
  }
  // wait for them all to fininsh
  await Promise.all(promises);
  console.log(`Done, see ${OUTPUT_FILE} for results.`);
};

if (process.argv.length == 3) {
  checkProject(process.argv[2]).then((result) => console.log(result));
} else {
  checkProjects();
}
