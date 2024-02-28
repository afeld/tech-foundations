// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
import { ServicesClient } from "@google-cloud/appengine-admin";
import { CloudBuildClient } from "@google-cloud/cloudbuild";
import fs from "fs";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

const INPUT_FILE = "./terraform/students.csv";
const OUTPUT_FILE = "cd_results.csv";

const appEngineClient = new ServicesClient();
const cloudBuildClient = new CloudBuildClient();

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

const isValidTrigger = (trigger) => {
  // https://cloud.google.com/nodejs/docs/reference/cloudbuild/latest/cloudbuild/protos.google.devtools.cloudbuild.v1.ibuildtrigger
  if (
    trigger.buildTemplate == "filename" &&
    trigger.triggerTemplate &&
    trigger.triggerTemplate.repoName
  ) {
    return true;
  }
  return false;
};

const hasCloudBuildTrigger = async (projectId) => {
  try {
    // https://cloud.google.com/nodejs/docs/reference/cloudbuild/latest/cloudbuild/v1.cloudbuildclient#_google_cloud_cloudbuild_v1_CloudBuildClient_listBuildTriggersAsync_member_1_
    const triggers = cloudBuildClient.listBuildTriggersAsync({ projectId });
    for await (const trigger of triggers) {
      // console.log(trigger);
      return isValidTrigger(trigger);
    }
  } catch (e) {
    // "Cloud Build has not been used in project [number] before or it is disabled."
    if (e.code !== 7) {
      throw e;
    }
  }

  return false;
};

const checkProject = async (uni) => {
  const projectId = `columbia-ops-mgmt-${uni}`;
  const appExists = await hasAppEngine(projectId);
  const buildTrigger = await hasCloudBuildTrigger(projectId);
  return { uni, app_engine: appExists, build_trigger: buildTrigger };
};

const checkProjects = async () => {
  const parser = fs.createReadStream(INPUT_FILE).pipe(parse({ columns: true }));
  const stringifier = createCSVWriter(OUTPUT_FILE, [
    "uni",
    "app_engine",
    "build_trigger",
  ]);

  // do them all in parallel
  const promises = [];
  for await (const row of parser) {
    const promise = checkProject(row.Uni).then((result) =>
      stringifier.write(result)
    );
    promises.push(promise);
  }
  // wait for them all to finish
  await Promise.all(promises);
  console.log(`Done, see ${OUTPUT_FILE} for results.`);
};

if (process.argv.length == 3) {
  checkProject(process.argv[2]).then((result) => console.log(result));
} else {
  checkProjects();
}
