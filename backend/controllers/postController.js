const pool = require('../config/db');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category_id, cover_image_url, status, tags } = req.body;
    const user_id = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    // Generate a URL-friendly slug from the title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check slug uniqueness, append a number if it already exists
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const [existing] = await pool.query('SELECT id FROM posts WHERE slug = ?', [finalSlug]);
      if (existing.length === 0) break;
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const published_at = status === 'published' ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO posts (user_id, category_id, title, slug, content, excerpt, cover_image_url, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, category_id || null, title, finalSlug, content, excerpt || null, cover_image_url || null, status || 'draft', published_at]
    );

    const postId = result.insertId;

    // Handle tags if provided (array of tag names, e.g. ["mysql", "nodejs"])
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

        // Insert tag if it doesn't exist yet
        await pool.query(
          'INSERT INTO tags (name, slug) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id',
          [tagName, tagSlug]
        );

        const [tagRows] = await pool.query('SELECT id FROM tags WHERE slug = ?', [tagSlug]);
        const tagId = tagRows[0].id;

        await pool.query('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]);
      }
    }

    res.status(201).json({ success: true, message: 'Post created', postId, slug: finalSlug });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all published posts (with author + category info)
const getAllPosts = async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image_url, p.views, p.published_at,
             u.username AS author, c.name AS category
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
      ORDER BY p.published_at DESC
    `);
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single post by slug (also increments view count)
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [posts] = await pool.query(`
      SELECT p.*, u.username AS author, c.name AS category
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `, [slug]);

    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const post = posts[0];

    // Get tags for this post
    const [tags] = await pool.query(`
      SELECT t.name FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `, [post.id]);
    post.tags = tags.map(t => t.name);

    // Increment view count
    await pool.query('UPDATE posts SET views = views + 1 WHERE id = ?', [post.id]);

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a post (only by its author)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category_id, cover_image_url, status } = req.body;

    const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const post = posts[0];

    // Only the author (or an admin) can edit
    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    const published_at = status === 'published' && post.status !== 'published' ? new Date() : post.published_at;

    await pool.query(
      `UPDATE posts SET title = ?, content = ?, excerpt = ?, category_id = ?, cover_image_url = ?, status = ?, published_at = ?
       WHERE id = ?`,
      [
        title || post.title,
        content || post.content,
        excerpt !== undefined ? excerpt : post.excerpt,
        category_id !== undefined ? category_id : post.category_id,
        cover_image_url !== undefined ? cover_image_url : post.cover_image_url,
        status || post.status,
        published_at,
        id
      ]
    );

    res.json({ success: true, message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a post (only by its author or admin)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const post = posts[0];

    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createPost, getAllPosts, getPostBySlug, updatePost, deletePost };