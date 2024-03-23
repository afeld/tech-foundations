import fs from "node:fs";
import { readdir } from "node:fs/promises";
import { parse } from "csv-parse";
import { DateTime } from "luxon";
import { createCSVWriter } from "./helpers.js";

const OUTPUT_FILE = "results.csv";

const files = await readdir("./");
files.sort();

const getResultDate = (file) => {
  const matches = file.match(/^cd_results_(\d{4})-(\d{2})-(\d{2})\.csv$/);
  if (!matches) {
    return null;
  }

  return DateTime.fromObject({
    year: matches[1],
    month: matches[2],
    day: matches[3],
  });
};

const students = {};

for (const file of files) {
  console.log("Processing file:", file);

  const resultDate = getResultDate(file);
  if (!resultDate) {
    // not a result file
    continue;
  }

  const parser = fs.createReadStream(file).pipe(parse({ columns: true }));
  for await (const row of parser) {
    // initialize
    students[row.uni] = students[row.uni] || {};

    const checks = Object.keys(row).filter((key) => key !== "uni");
    console.log(checks);

    for (const check of checks) {
      const existingDate = students[row.uni][check];
      if (!existingDate) {
        // not previously completed

        if (row[check] === "Y") {
          // completed on this day
          students[row.uni][check] = resultDate.toISODate();
        } else {
          // still not completed
          students[row.uni][check] = null;
        }
      }
    }
  }
}

console.log(students);

const csvWriter = createCSVWriter(OUTPUT_FILE, [
  "uni",
  "app_engine",
  "app_engine_200",
  "build_trigger",
  "build",
  "build_success",
]);

for (const [uni, checks] of Object.entries(students)) {
  csvWriter.write({
    uni,
    app_engine: checks.app_engine,
    app_engine_200: checks.app_engine_200,
    build_trigger: checks.build_trigger,
    build: checks.build,
    build_success: checks.build_success,
  });
}
