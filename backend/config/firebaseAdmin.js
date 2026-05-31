// backend/config/firebaseAdmin.js
import admin from "firebase-admin";
import { createRequire } from "module";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env variable:", error);
  }
}

if (!serviceAccount) {
  const require = createRequire(import.meta.url);
  try {
    serviceAccount = require("../firebase-service-account.json");
  } catch (error) {
    console.error("Local firebase-service-account.json not found:", error.message);
  }
}

if (serviceAccount) {
  // Format private key newlines if set via environment variable
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
  if (serviceAccount.privateKey) {
    serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.error("Firebase Admin SDK could not be initialized: No credentials provided.");
}

export default admin;
