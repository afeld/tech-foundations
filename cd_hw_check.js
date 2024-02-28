// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
import { ServicesClient } from "@google-cloud/appengine-admin";
import fs from "fs";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

const appEngineClient = new ServicesClient();

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
  const parser = fs
    .createReadStream("./terraform/students.csv")
    .pipe(parse({ columns: true }));

  const stringifier = stringify({
    header: true,
    columns: ["uni", "app_engine"],
    cast: {
      boolean: (value) => (value ? "Y" : "N"),
    },
  });
  const outFile = "cd_results.csv";
  const writableStream = fs.createWriteStream(outFile);
  stringifier.pipe(writableStream);

  const promises = [];
  for await (const row of parser) {
    const checkPromise = checkProject(row.Uni);
    promises.push(checkPromise);

    checkPromise.then((result) => stringifier.write(result));
  }
  await Promise.all(promises);
  console.log(`Done, see ${outFile} for results.`);
};
checkProjects();
