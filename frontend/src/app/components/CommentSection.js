'use client';

import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${postId}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.post('/comments', { post_id: postId, content });
      setContent('');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <h3 className="mb-4 text-xl font-black tracking-tight text-slate-800">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:brightness-105"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-slate-500">Log in to leave a comment.</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading comments...</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-sm font-bold text-slate-800">{c.username}</span>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{c.content}</p>
                </div>
                {user && user.id === c.user_id && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}