const express = require('express');
const router = express.Router();
const { getAllTags, getPostsByTag, createTag, deleteTag } = require('../controllers/tagController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllTags);
router.get('/:slug/posts', getPostsByTag);
router.post('/', protect, createTag);
router.delete('/:id', protect, deleteTag);

module.exports = router;