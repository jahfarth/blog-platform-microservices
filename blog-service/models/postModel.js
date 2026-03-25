const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  authorId: String,
  authorName: String,
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  authorId: String,
  authorName: String,
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema]
});

const reactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  emoji: { type: String, required: true }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String },
  category: { type: String, default: 'General' },
  tags: [String],
  image: String,
  views: { type: Number, default: 0 },
  reactions: [reactionSchema],
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
