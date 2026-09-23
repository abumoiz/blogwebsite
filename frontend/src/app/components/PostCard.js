import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(15,41,36,0.06)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_50px_rgba(15,118,110,0.12)]"
    >
      {post.cover_image_url && (
        <div className="overflow-hidden rounded-xl">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-2 pt-4">
        {post.category && (
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
            {post.category}
          </span>
        )}

        <h2 className="mt-3 text-xl font-bold leading-snug text-slate-800">{post.title}</h2>

        {post.excerpt && <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">{post.author}</span>
          {post.published_at && <span>•</span>}
          {post.published_at && <span>{new Date(post.published_at).toLocaleDateString()}</span>}
        </div>
      </div>
    </Link>
  );
}