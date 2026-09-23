'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      api
        .get('/posts')
        .then((res) => {
          setMyPosts(res.data.posts.filter((p) => p.author === user.username));
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    setMyPosts(myPosts.filter((p) => p.id !== id));
  };

  if (authLoading || loading) return <p className="mt-10 text-center text-sm text-slate-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-emerald-100 bg-gradient-to-r from-[#fefaf5] to-[#eefaf6] p-6 shadow-[0_20px_50px_rgba(15,118,110,0.08)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Dashboard</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Your Posts</h1>
        </div>
        <Link
          href="/dashboard/new-post"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:brightness-105"
        >
          + New Post
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-12 text-center text-sm text-slate-500">
          You haven't written any posts yet.
        </div>
      ) : (
        <div className="space-y-3">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/85 px-4 py-4 shadow-sm"
            >
              <span className="text-sm font-semibold text-slate-700">{post.title}</span>
              <button
                onClick={() => handleDelete(post.id)}
                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}