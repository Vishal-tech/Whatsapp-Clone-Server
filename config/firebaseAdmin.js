import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.firebase_service_account_key);

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebaseApp;
