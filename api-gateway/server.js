require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const USER_SERVICE = process.env.USER_SERVICE || "http://localhost:3001";
const BLOG_SERVICE = process.env.BLOG_SERVICE || "http://localhost:3002";
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE || "http://localhost:3003";

// Proxy to user-service
app.use("/api/v1/auth", async (req, res) => {
  try {
    const url = `${USER_SERVICE}/auth${req.url === "/" ? "" : req.url}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: { "Content-Type": "application/json" },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Gateway error" });
  }
});

// Proxy to blog-service
app.use("/api/v1/posts", async (req, res) => {
  try {
    const url = `${BLOG_SERVICE}/posts${req.url === "/" ? "" : req.url}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization || "",
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Gateway error" });
  }
});

// Proxy to notification-service
app.post("/api/v1/notify", async (req, res) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE}/notify`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Gateway error" });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
