import { readdir } from "node:fs/promises";

const files = await readdir("./");

const getResultDate = (file) => {
  const matches = file.match(/^cd_results_(\d{4})-(\d{2})-(\d{2})\.csv$/);
  if (!matches) {
    return null;
  }

  return new Date(matches[1], matches[2] - 1, matches[3]);
};

for (const file of files) {
  console.log("Processing file:", file);
  const resultDate = getResultDate(file);
  if (!resultDate) {
    continue;
  }
  console.log(resultDate);
}
