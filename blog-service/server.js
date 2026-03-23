require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");

connectDB();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Blog Service running on port ${PORT}`);
});
