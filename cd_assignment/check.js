// https://cloud.google.com/nodejs/docs/reference/appengine-admin/latest#using-the-client-library
import { ServicesClient } from "@google-cloud/appengine-admin";
import { CloudBuildClient } from "@google-cloud/cloudbuild";
import { exec } from "child_process";
import fs from "node:fs";
import { promisify } from "node:util";
import { parse } from "csv-parse";
import fetch from "node-fetch";
import { DateTime } from "luxon";
import { createCSVWriter } from "./helpers.js";

const INPUT_FILE = "../terraform/students.csv";
// write one per day for checking late work
const date = DateTime.local().toISODate();
const OUTPUT_FILE = `cd_results_${date}.csv`;

const appEngineClient = new ServicesClient();
const cloudBuildClient = new CloudBuildClient();

const execP = promisify(exec);

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

const appEngineURL = (projectId) => {
  // assume it's the default service for that Project
  return `https://${projectId}.appspot.com`;
};

const appEngineStatus = async (projectId) => {
  const url = appEngineURL(projectId);
  // we only really need a HEAD request, but that's not allowed by default
  const response = await fetch(url);
  return response.ok;
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
    // check if any valid
    for await (const trigger of triggers) {
      if (isValidTrigger(trigger)) {
        return true;
      }
    }
  } catch (e) {
    // "Cloud Build has not been used in project [number] before or it is disabled."
    if (e.code !== 7) {
      throw e;
    }
  }

  return false;
};

const cloudBuilds = async (projectId) => {
  try {
    // https://cloud.google.com/nodejs/docs/reference/cloudbuild/latest/cloudbuild/v1.cloudbuildclient#_google_cloud_cloudbuild_v1_CloudBuildClient_listBuilds_member_1_
    const response = await cloudBuildClient.listBuilds({
      projectId,
      maxResults: 10,
    });
    return response[0];
  } catch (e) {
    // "Cloud Build has not been used in project [number] before or it is disabled."
    if (e.code !== 7) {
      throw e;
    }
  }

  return [];
};

const hasRepo = async (projectId) => {
  // there isn't a Node.js client for Source Repositories, so go through the CLI
  // https://cloud.google.com/nodejs/docs/reference
  const { stdout } = await execP(
    `gcloud source repos list --project=${projectId} --format=json`
  );
  const repos = JSON.parse(stdout);

  if (repos.length > 0) {
    return true;
  }
  return false;
};

// https://cloud.google.com/nodejs/docs/reference/cloudbuild/latest/cloudbuild/protos.google.devtools.cloudbuild.v1.ibuild
const isValidBuild = (build) =>
  build.status === "SUCCESS" && build.source.source == "repoSource";

const checkProject = async (uni) => {
  const projectId = `columbia-ops-mgmt-${uni}`;

  // check in parallel
  const results = await Promise.all([
    hasAppEngine(projectId),
    appEngineStatus(projectId),
    hasRepo(projectId),
    hasCloudBuildTrigger(projectId),
    cloudBuilds(projectId),
  ]);

  const builds = results[4];
  const successfulBuild = builds.some(isValidBuild);

  return {
    uni,
    app_engine: results[0],
    app_engine_200: results[1],
    repo: results[2],
    build_trigger: results[3],
    build: builds.length > 0,
    build_success: successfulBuild,
  };
};

const checkProjects = async () => {
  const parser = fs.createReadStream(INPUT_FILE).pipe(parse({ columns: true }));
  const csvWriter = createCSVWriter(OUTPUT_FILE, [
    "uni",
    "app_engine",
    "app_engine_200",
    "build_trigger",
    "build",
    "build_success",
  ]);

  // do them all in parallel
  const promises = [];
  for await (const row of parser) {
    const promise = checkProject(row.Uni).then((result) =>
      csvWriter.write(result)
    );
    promises.push(promise);
  }
  // wait for them all to finish
  await Promise.all(promises);
  console.log(`Done, see ${OUTPUT_FILE} for results.`);
};

if (process.argv.length == 3) {
  // UNI specified
  const uni = process.argv[2];
  checkProject(uni).then(console.log);
} else {
  checkProjects();
}
