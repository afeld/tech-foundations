import util from "util";
// import { v1 } from "@google-cloud/asset";
import { AssetServiceClient } from "@google-cloud/asset/v1";

// const client = new v1.AssetServiceClient();
const client = new AssetServiceClient();

const projectId = "columbia-ops-mgmt-tb3089";
const projectResource = `projects/${projectId}`;
// TODO(developer): Choose types of assets to list, such as 'storage.googleapis.com/Bucket':
//   const assetTypes = 'storage.googleapis.com/Bucket,bigquery.googleapis.com/Table';
// Or simply use empty string to list all types of assets:
//   const assetTypes = '';
const assetTypesList = ["cloudbuild.googleapis.com/BuildTrigger"]; // ["cloudbuild.BuildTrigger"];
const contentType = "RESOURCE";

async function listAssets() {
  const request = {
    parent: projectResource,
    assetTypes: assetTypesList,
    contentType: contentType,
    // (Optional) Add readTime parameter to list assets at the given time instead of current time:
    //   readTime: { seconds: 1593988758 },
  };

  // Call cloud.assets.v1.ListAssets API.
  const result = await client.listAssets(request);
  // Handle the response.
  const assets = result[0];
  //   console.log(assets.map((asset) => asset.assetType));
  console.log(util.inspect(assets, { depth: null }));
  console.log(assets[0].resource.location);
}
listAssets();
