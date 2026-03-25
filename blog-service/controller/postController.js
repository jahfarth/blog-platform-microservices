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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const user = getUser(req);
    const { title, content, category, tags, image } = req.body;
    const authorId = user ? user.id || user._id : (req.body.authorId || 'anonymous');
    const post = new Post({ title, content, category, tags, image, authorId });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.incrementView = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json({ views: post.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reactPost = async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = user.id || user._id;
    const { emoji } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Remove any existing reaction by this user
    const existingIndex = post.reactions.findIndex(
      r => r.userId && r.userId.toString() === userId.toString()
    );

    if (existingIndex !== -1) {
      const existingEmoji = post.reactions[existingIndex].emoji;
      if (existingEmoji === emoji) {
        // Same emoji - toggle off (remove reaction)
        post.reactions.splice(existingIndex, 1);
      } else {
        // Different emoji - replace
        post.reactions[existingIndex].emoji = emoji;
      }
    } else {
      // No existing reaction - add new
      post.reactions.push({ userId, emoji });
    }

    await post.save();
    res.json({ reactions: post.reactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post.comments || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({
      authorId: user.id || user._id,
      authorName: user.name || user.username || 'User',
      content,
      createdAt: new Date()
    });
    await post.save();
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    comment.replies.push({
      authorId: user.id || user._id,
      authorName: user.name || user.username || 'User',
      content,
      createdAt: new Date()
    });
    await post.save();
    res.status(201).json(comment.replies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
