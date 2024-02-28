// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
import { ServicesClient } from "@google-cloud/appengine-admin";
import fs from "fs";
import { parse } from "csv-parse";

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
  console.log(`${uni} has App Engine application:\t${appExists}`);
};

const checkProjects = async () => {
  const parser = fs
    .createReadStream("./terraform/students.csv")
    .pipe(parse({ columns: true }));

  const promises = [];
  for await (const row of parser) {
    const checkPromise = checkProject(row.Uni);
    promises.push(checkPromise);
  }
  await Promise.all(promises);
  console.log("done");
};
checkProjects();
