import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let app;
if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const hasRealPrivateKey = privateKey && 
                              privateKey !== "YOUR_PRIVATE_KEY_HERE" && 
                              privateKey.includes("PRIVATE KEY");

    if (hasRealPrivateKey) {
      // Option 1: Explicit credentials (service account key in .env)
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Option 2: Application Default Credentials (ADC)
      // Works with: gcloud auth application-default login
      // Or when deployed to GCP (Cloud Run, Cloud Functions, etc.)
      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
} else {
  app = getApps()[0];
}

export const adminAuth = app ? getAuth(app) : null;
