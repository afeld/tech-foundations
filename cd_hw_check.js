// https://cloud.google.com/nodejs/docs/reference/resource-manager/latest#using-the-client-library
// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
const { ServicesClient } = require("@google-cloud/appengine-admin");
const { ProjectsClient } = require("@google-cloud/resource-manager");

const appEngineClient = new ServicesClient();
const projClient = new ProjectsClient();

const getUni = (projectId) => {
  // check that it matches the naming convention
  const match = projectId.match(/^columbia-ops-mgmt-(\w+)$/);
  if (match) {
    return match[1];
  }
  return null;
};

async function checkProject(projectId) {
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
  const uni = getUni(projectId);
  console.warn(`${uni} has App Engine application:\t${appExists}`);
}

async function quickstart() {
  const projects = projClient.searchProjectsAsync();

  for await (const project of projects) {
    const projectId = project.projectId;
    const uni = getUni(projectId);
    if (!uni) {
      // not a student Project
      continue;
    }
    // don't wait; allow to run in parallel
    checkProject(projectId);
  }
}
quickstart();
