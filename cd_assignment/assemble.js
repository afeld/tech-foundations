import fs from "node:fs";
import { readdir } from "node:fs/promises";
import { parse } from "csv-parse";
import { DateTime } from "luxon";
import { createCSVWriter } from "./helpers.js";

const COLUMNS = [
  "uni",
  "app_engine",
  "app_engine_200",
  "build_trigger",
  "build",
  "build_success",
];

const OUTPUT_FILE = "results.csv";

const checks = COLUMNS.filter((key) => key !== "uni");
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

const gatherResults = async () => {
  const students = {};

  const alreadyCompleted = (uni, check) => {
    return !!students[uni][check];
  };

  for (const file of files) {
    const resultDate = getResultDate(file);
    if (!resultDate) {
      // not a result file
      continue;
    }
    console.log("Processing file:", file);

    const parser = fs.createReadStream(file).pipe(parse({ columns: true }));
    for await (const row of parser) {
      const uni = row.uni;
      // initialize
      students[uni] = students[uni] || {};

      for (const check of checks) {
        if (alreadyCompleted(uni, check)) {
          continue;
        }

        if (row[check] === "Y") {
          // completed on this day
          students[uni][check] = resultDate.toISODate();
        } else {
          // still not completed
          students[uni][check] = null;
        }
      }
    }
  }

  return students;
};

const saveResults = (students) => {
  const csvWriter = createCSVWriter(OUTPUT_FILE, COLUMNS);

  const unis = Object.keys(students);
  unis.sort();

  for (const uni of unis) {
    const checks = students[uni];
    csvWriter.write({
      uni,
      app_engine: checks.app_engine,
      app_engine_200: checks.app_engine_200,
      build_trigger: checks.build_trigger,
      build: checks.build,
      build_success: checks.build_success,
    });
  }
};

const students = await gatherResults();
saveResults(students);
