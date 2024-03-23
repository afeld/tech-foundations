import { readdir } from "node:fs/promises";
import path from "path";

const files = await readdir("./");
const csvFiles = files.filter((file) => path.extname(file) === ".csv");

for (const file of csvFiles) {
  console.log("Processing file:", file);
}
