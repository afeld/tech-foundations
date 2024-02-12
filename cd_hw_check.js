// https://cloud.google.com/nodejs/docs/reference/resource-manager/latest#using-the-client-library
const { ProjectsClient } = require("@google-cloud/resource-manager");

const client = new ProjectsClient();

async function quickstart() {
  const projects = client.searchProjectsAsync();
  console.log("Projects:");
  for await (const project of projects) {
    console.info(project.projectId);
  }
}
quickstart();
