import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "MyBlog",
  description: "A full stack blog built with Next.js and Express",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-800 antialiased">
        <AuthProvider>
          <div className="min-h-screen bg-transparent">
            <Navbar />
            <main className="mx-auto min-h-[calc(100vh-180px)] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}