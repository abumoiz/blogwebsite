'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-[#f8f3ed]/85 backdrop-blur-md shadow-[0_8px_30px_rgba(28,58,52,0.08)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-amber-500 text-lg font-bold text-white shadow-lg shadow-teal-900/10">
            M
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-800">MyBlog</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Journal
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {loading ? null : user ? (
            <>
              <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 sm:inline-flex">
                Hi, {user.username}
              </span>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-700 transition hover:text-emerald-700">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:brightness-105"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}