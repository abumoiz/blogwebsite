const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostBySlug, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;