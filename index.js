const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Firebase setup
const firebaseConfig = JSON.parse(process.env.FIREBASE_KEY);

// Fix private key format
firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const db = admin.firestore();

// Route: Home
app.get('/', (req, res) => {
  res.send('✅ Omnidim Webhook Server is Running');
});

// Route: Webhook Receiver
app.post('/webhook/omnidim', async (req, res) => {
  console.log('📩 Webhook received:', req.body);

  try {
    const data = req.body;

    if (!data || typeof data !== 'object') {
      console.warn("⚠️ Invalid webhook payload received");
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const docRef = db.collection('omnidim_responses').doc();
    await docRef.set({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Data saved to Firestore');
    res.status(200).json({ message: 'Saved to Firestore' });
  } catch (err) {
    console.error('❌ Firestore error:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
