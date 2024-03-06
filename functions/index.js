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

  const now = Timestamp.now();
  const students = await collection.get();
  students.forEach(async (student) => {
    const uni = student.id;
    const existing = student.data();
    const current = await checkProject(uni);

    const updates = {};

    // go through each check and if it's not already been detected, update the timestamp
    for (const [key, value] of Object.entries(current)) {
      if (existing[key]) {
        // already detected
        continue;
      } else if (value === true) {
        // initial detection
        updates[key] = now;
      }
      // else not detected
    }

    logger.log(updates);

    if (Object.keys(updates).length === 0) {
      // nothing to update
      return;
    }
    // https://stackoverflow.com/a/55734557
    student.ref.update(updates);
  });

  res.json({ result: "Kicked off checks" });
});

// https://cloud.google.com/appengine/docs/flexible/scheduling-jobs-with-cron-yaml#formatting_the_schedule
// exports.scheduled = onSchedule("every 1 minutes", async (event) => {
//   await getFirestore().collection("messages").add({ text: "written" });

//   logger.log("User cleanup finished");
// });
