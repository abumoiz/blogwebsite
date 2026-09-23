export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-[#f8f3ed]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-6 text-center text-sm text-slate-600 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} MyBlog. Built with Next.js + Express.
      </div>
    </footer>
  );
}