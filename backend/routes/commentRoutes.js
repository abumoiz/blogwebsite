const express = require('express');
const router = express.Router();
const { addComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addComment);
router.get('/:post_id', getCommentsByPost);
router.delete('/:id', protect, deleteComment);

module.exports = router;