require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

const USER_SERVICE = process.env.USER_SERVICE || 'http://localhost:3001';
const BLOG_SERVICE = process.env.BLOG_SERVICE || 'http://localhost:3002';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE || 'http://localhost:3003';

app.use(cors());
app.use(express.json());

// Proxy routes
app.use('/api/users', createProxyMiddleware({ target: USER_SERVICE, changeOrigin: true }));
app.use('/api/posts', createProxyMiddleware({ target: BLOG_SERVICE, changeOrigin: true }));
app.use('/api/notifications', createProxyMiddleware({ target: NOTIFICATION_SERVICE, changeOrigin: true }));

app.get('/health', (req, res) => res.json({
  status: 'API Gateway running',
  port: PORT,
  services: { userService: USER_SERVICE, blogService: BLOG_SERVICE, notificationService: NOTIFICATION_SERVICE }
}));

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
