const Post = require("../models/postModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey123";

const getUser = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try { return jwt.verify(auth.split(" ")[1], JWT_SECRET); }
  catch { return null; }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createPost = async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const { title, content } = req.body;
    const post = await Post.create({ title, content, author: user.name, authorId: user.id });
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deletePost = async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
