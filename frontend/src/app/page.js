'use client';

import { useState, useEffect } from 'react';
import api from './lib/api';
import PostCard from './components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/posts')
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-8 overflow-hidden rounded-[30px] border border-emerald-100 bg-gradient-to-r from-[#f5efe6] via-[#fefaf5] to-[#eaf7f3] p-6 shadow-[0_20px_50px_rgba(36,82,71,0.08)] sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
              Fresh reads
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-5xl">
              Latest stories from the community
            </h1>
          </div>
          <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100">
            {posts.length} posts published
          </div>
        </div>
      </section>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-slate-800">Latest Posts</h2>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-12 text-center text-sm text-slate-500 shadow-sm">
          Loading...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-12 text-center text-sm text-slate-500">
          No posts yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}