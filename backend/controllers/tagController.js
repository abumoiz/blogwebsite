const pool = require('../config/db');

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const [tags] = await pool.query('SELECT * FROM tags ORDER BY name ASC');
    res.json({ success: true, tags });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all posts under a specific tag (by slug)
const getPostsByTag = async (req, res) => {
  try {
    const { slug } = req.params;

    const [tagRows] = await pool.query('SELECT * FROM tags WHERE slug = ?', [slug]);
    if (tagRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }
    const tag = tagRows[0];

    const [posts] = await pool.query(`
      SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image_url, p.published_at, u.username AS author
      FROM posts p
      JOIN post_tags pt ON p.id = pt.post_id
      JOIN users u ON p.user_id = u.id
      WHERE pt.tag_id = ? AND p.status = 'published'
      ORDER BY p.published_at DESC
    `, [tag.id]);

    res.json({ success: true, tag: tag.name, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a tag manually (admin only) — usually tags get created automatically via posts, but useful for cleanup/setup
const createTag = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can create tags directly' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await pool.query(
      'INSERT INTO tags (name, slug) VALUES (?, ?)',
      [name, slug]
    );

    res.status(201).json({ success: true, message: 'Tag created', tagId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Tag already exists' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a tag (admin only)
const deleteTag = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can delete tags' });
    }

    const { id } = req.params;
    const [existing] = await pool.query('SELECT id FROM tags WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }

    await pool.query('DELETE FROM tags WHERE id = ?', [id]);
    res.json({ success: true, message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllTags, getPostsByTag, createTag, deleteTag };