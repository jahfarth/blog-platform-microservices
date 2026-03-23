require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.post("/notify", (req, res) => {
  const { to, subject, message } = req.body;
  console.log(`[Notification] To: ${to} | Subject: ${subject} | Message: ${message}`);
  res.json({ success: true, message: "Notification sent (mocked)" });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
