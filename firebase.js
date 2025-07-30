const admin = require("firebase-admin");

const firebaseConfig = JSON.parse(process.env.FIREBASE_KEY);

// Fix the private key by replacing escaped newlines
firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const db = admin.firestore();
module.exports = db;

