import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();

export const addmessage = onRequest(async (req, res) => {
  const uni = "alf2215";
  const data = {
    app_engine: null,
    app_engine_200: new Date(),
    repo: null,
    build_trigger: null,
    build: null,
    build_success: null,
  };

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
