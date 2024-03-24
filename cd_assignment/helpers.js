import fs from "node:fs";
import { stringify } from "csv-stringify";

export const createCSVWriter = (filename, columns) => {
  const stringifier = stringify({
    header: true,
    columns: columns,
    cast: {
      boolean: (value) => (value ? "Y" : "N"),
    },
  });
  const writableStream = fs.createWriteStream(filename);
  stringifier.pipe(writableStream);

  return stringifier;
};
