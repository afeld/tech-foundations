// https://cloud.google.com/nodejs/docs/reference/resource-manager/latest#using-the-client-library
// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
const { ServicesClient } = require("@google-cloud/appengine-admin");
const { ProjectsClient } = require("@google-cloud/resource-manager");

const appEngineClient = new ServicesClient();

async function listVersions(projectId) {
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
  console.warn(`${projectId} has App Engine application:\t${appExists}`);
}

const projClient = new ProjectsClient();

async function quickstart() {
  const projects = projClient.searchProjectsAsync();

  for await (const project of projects) {
    const projectId = project.projectId;
    const match = projectId.match(/^columbia-ops-mgmt-(\w+)$/);
    if (!match) {
      continue;
    }
    const uni = match[1];
    // console.info(uni);

    try {
      await listVersions(projectId);
    } catch (e) {
      if (e.reason === "SERVICE_DISABLED") {
        continue;
      } else {
        console.error(e);
      }
    }
  }
}
quickstart();
