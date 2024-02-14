// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
const { ServicesClient } = require("@google-cloud/appengine-admin");
const fs = require("fs");
const { parse } = require("csv-parse");

const appEngineClient = new ServicesClient();

async function checkProject(uni) {
  const projectId = `columbia-ops-mgmt-${uni}`;

  let appExists = false;
  try {
    await appEngineClient.listServices({
      parent: `apps/${projectId}`,
    });
    appExists = true;
  } catch (e) {
    // 5 is NOT_FOUND
    // https://cloud.google.com/apis/design/errors#error_codes
    if (e.code !== 5) {
      throw e;
    }
  }
  console.warn(`${uni} has App Engine application:\t${appExists}`);
}

const checkProjects = () => {
  fs.createReadStream("./terraform/students.csv")
    .pipe(parse({ columns: true }))
    .on("data", (row) => checkProject(row.Uni));
};
checkProjects();
