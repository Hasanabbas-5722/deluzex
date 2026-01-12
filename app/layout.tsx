import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Logo from "./components/Logo";
import MobileMenu from "./components/MobileMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "de luzex — Contemporary Architecture & Interior Design",
  description:
    "de luzex is a multidisciplinary architecture and interior design practice creating contemporary mosques, hospitality spaces, institutes, offices, and residences.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 text-stone-900`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Site Header */}
          <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
              <Logo />

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-[0.18em] uppercase">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <MobileMenu />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
              {children}
            </div>
          </main>

          {/* Site Footer */}
          <footer className="border-t border-stone-200 bg-stone-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8 md:grid-cols-3 text-sm">
              <div className="space-y-2">
                <p className="text-xs tracking-[0.24em] uppercase text-stone-500">
                  Studio
                </p>
                <p className="text-stone-700">
                  a/1, Jamman Nagar Society,
                  <br />
                  b/h. El Dorado Hotel, Opp. Crossword, Mithakali,
                  <br />
                  Ahmedabad, India
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.24em] uppercase text-stone-500">
                  Contact
                </p>
                <p className="text-stone-700">
                  <span className="block">info@aandfdesign.com</span>
                  <span className="block mt-1">+91-98765-43210</span>
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs tracking-[0.24em] uppercase text-stone-500">
                  Follow
                </p>
                <div className="flex gap-4 text-stone-700">
                  <button className="text-xs uppercase tracking-[0.26em]">
                    LinkedIn
                  </button>
                  <button className="text-xs uppercase tracking-[0.26em]">
                    Facebook
                  </button>
                  <button className="text-xs uppercase tracking-[0.26em]">
                    Instagram
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  © {new Date().getFullYear()} de luzex. All rights
                  reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
