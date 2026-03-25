require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Mock notification storage
const notifications = [];

app.post('/api/notifications/notify', (req, res) => {
  const { to, subject, message, type } = req.body;
  const notification = {
    id: Date.now(),
    to, subject, message,
    type: type || 'email',
    createdAt: new Date().toISOString()
  };
  notifications.push(notification);
  console.log(`[Notification] To: ${to} | Subject: ${subject} | Message: ${message}`);
  res.json({ success: true, message: 'Notification sent (mocked)', notification });
});

app.post('/api/notifications/new-post', (req, res) => {
  const { authorName, postTitle, postId } = req.body;
  const notification = {
    id: Date.now(),
    type: 'new-post',
    authorName, postTitle, postId,
    createdAt: new Date().toISOString()
  };
  notifications.push(notification);
  console.log(`[New Post Notification] Author: ${authorName} posted: "${postTitle}"`);
  res.json({ success: true, message: 'New post notification sent (mocked)', notification });
});

app.get('/api/notifications', (req, res) => {
  res.json(notifications.slice(-20).reverse());
});

app.get('/health', (req, res) => res.json({ status: 'notification-service running', port: PORT }));

app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
