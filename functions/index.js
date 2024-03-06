import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { checkProject } from "./cd_hw_check.js";

initializeApp();

const db = getFirestore();

export const addmessage = onRequest(async (req, res) => {
  const collection = db.collection("continuous_deployment_checks");

  const students = await collection.get();
  students.forEach(async (student) => {
    const uni = student.id;
    const data = await checkProject(uni);

    // https://stackoverflow.com/a/55734557
    student.ref.set(data);

    logger.log(student.id, "=>", student.data());
  });

  res.json({ result: "Kicked off checks" });
});

// https://cloud.google.com/appengine/docs/flexible/scheduling-jobs-with-cron-yaml#formatting_the_schedule
// exports.scheduled = onSchedule("every 1 minutes", async (event) => {
//   await getFirestore().collection("messages").add({ text: "written" });

//   logger.log("User cleanup finished");
// });
