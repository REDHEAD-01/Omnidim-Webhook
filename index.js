const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./firebase');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Omnidim webhook endpoint
app.post('/webhook/omnidim', async (req, res) => {
  try {
    const data = req.body;

    // Save to Firestore
    const docRef = db.collection('omnidim_responses').doc(); // auto ID
    await docRef.set(data);

    res.status(200).json({ message: "Webhook received and saved!" });
  } catch (error) {
    console.error("Error saving webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
