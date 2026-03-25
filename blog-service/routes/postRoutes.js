const express = require('express');
const router = express.Router();
const ctrl = require('../controller/postController');

router.get('/', ctrl.getAllPosts);
router.get('/:id', ctrl.getPostById);
router.post('/', ctrl.createPost);
router.put('/:id', ctrl.updatePost);
router.delete('/:id', ctrl.deletePost);
router.post('/:id/view', ctrl.incrementView);
router.post('/:id/react', ctrl.reactPost);
router.get('/:id/comments', ctrl.getComments);
router.post('/:id/comments', ctrl.addComment);
router.post('/:id/comments/:commentId/reply', ctrl.addReply);

module.exports = router;
