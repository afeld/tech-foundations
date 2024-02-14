// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
const { ServicesClient } = require("@google-cloud/appengine-admin");
const fs = require("fs");
const { parse } = require("csv-parse");

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

const checkProjects = () => {
  fs.createReadStream("./terraform/students.csv")
    .pipe(parse({ columns: true }))
    .on("data", (row) => checkProject(row.Uni));
};
checkProjects();
