'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '../../lib/api';
import CommentSection from '../../components/CommentSection';

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/posts/${slug}`)
      .then((res) => setPost(res.data.post))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="mt-10 text-center text-sm text-slate-500">Loading...</p>;
  if (!post) return <p className="mt-10 text-center text-sm text-slate-500">Post not found.</p>;

  return (
    <article className="mx-auto max-w-3xl rounded-[30px] border border-slate-200 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,41,36,0.06)] sm:p-8">
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="mb-6 h-64 w-full rounded-2xl object-cover shadow-md"
        />
      )}

      {post.category && (
        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">
          {post.category}
        </span>
      )}

      <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-5xl">{post.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="font-medium text-slate-700">{post.author}</span>
        {post.category && <span>•</span>}
        {post.category && <span>{post.category}</span>}
        <span>•</span>
        <span>{post.views} views</span>
      </div>

      <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-[1.05rem] leading-8 text-slate-700">
        {post.content}
      </div>

      {post.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <CommentSection postId={post.id} />
    </article>
  );
}