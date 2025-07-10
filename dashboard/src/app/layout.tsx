import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Dashboard",
  description: "Your mood and life analytics dashboard",
};

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/mood", label: "Mood" },
  { href: "/sleep", label: "Sleep" },
  { href: "/energy", label: "Energy" },
  { href: "/tags", label: "Tags" },
  { href: "/insights", label: "Insights" },
  { href: "/goals", label: "Goals" },
  { href: "/reflections", label: "Reflections" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-100`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-56 bg-gray-950 border-r border-gray-700 flex flex-col p-4 gap-2 shadow-sm">
            <div className="text-2xl font-bold mb-6 text-indigo-400">Sadboat</div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded px-3 py-2 text-gray-200 hover:bg-gray-800 hover:text-indigo-300 transition font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          {/* Main content */}
          <main className="flex-1 min-w-0 bg-gray-900">{children}</main>
        </div>
      </body>
    </html>
  );
}
