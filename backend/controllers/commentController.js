const pool = require('../config/db');

// Add a comment to a post (also supports replies via parent_id)
const addComment = async (req, res) => {
  try {
    const { post_id, content, parent_id } = req.body;
    const user_id = req.user.id;

    if (!post_id || !content) {
      return res.status(400).json({ success: false, message: 'post_id and content are required' });
    }

    // Make sure the post actually exists
    const [posts] = await pool.query('SELECT id FROM posts WHERE id = ?', [post_id]);
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // If replying, make sure the parent comment exists and belongs to the same post
    if (parent_id) {
      const [parent] = await pool.query('SELECT id FROM comments WHERE id = ? AND post_id = ?', [parent_id, post_id]);
      if (parent.length === 0) {
        return res.status(404).json({ success: false, message: 'Parent comment not found' });
      }
    }

    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)',
      [post_id, user_id, parent_id || null, content]
    );

    res.status(201).json({ success: true, message: 'Comment added', commentId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all comments for a post (flat list — frontend can nest them using parent_id)
const getCommentsByPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    const [comments] = await pool.query(`
      SELECT c.id, c.content, c.parent_id, c.created_at, u.id AS user_id, u.username, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [post_id]);

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a comment (only by its author or admin)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const [comments] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    if (comments.length === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const comment = comments[0];
    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { addComment, getCommentsByPost, deleteComment };