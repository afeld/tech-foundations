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
  const uni = "alf2215";
  const data = await checkProject(uni);

  const writeResult = await db
    .collection("continuous_deployment_checks")
    .doc(uni)
    .set(data);
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// https://cloud.google.com/appengine/docs/flexible/scheduling-jobs-with-cron-yaml#formatting_the_schedule
// exports.scheduled = onSchedule("every 1 minutes", async (event) => {
//   await getFirestore().collection("messages").add({ text: "written" });

//   logger.log("User cleanup finished");
// });
