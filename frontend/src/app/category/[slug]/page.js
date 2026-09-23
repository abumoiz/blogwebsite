'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '../../lib/api';
import PostCard from '../../components/PostCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend has no direct "posts by category slug" endpoint yet,
    // so for now we fetch all posts and filter client-side by category name match.
    api
      .get('/posts')
      .then((res) => {
        const filtered = res.data.posts.filter(
          (p) => p.category && p.category.toLowerCase().replace(/\s+/g, '-') === slug
        );
        setPosts(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 rounded-[30px] border border-emerald-100 bg-gradient-to-r from-[#f8f3ed] via-[#fefaf5] to-[#ecfaf6] p-6 shadow-[0_20px_50px_rgba(15,118,110,0.06)]">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">Category</p>
        <h1 className="text-3xl font-black capitalize tracking-tight text-slate-800 sm:text-4xl">
          {slug.replace(/-/g, ' ')}
        </h1>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-12 text-center text-sm text-slate-500 shadow-sm">
          Loading...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-12 text-center text-sm text-slate-500">
          No posts in this category yet.
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