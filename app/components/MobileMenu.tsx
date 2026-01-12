"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Prevent rendering on server
  if (!mounted) {
    return (
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none focus:ring-2 focus:ring-stone-300 rounded"
        aria-label="Toggle menu"
      >
        <span className="block h-0.5 w-6 bg-stone-900" />
        <span className="block h-0.5 w-6 bg-stone-900" />
        <span className="block h-0.5 w-6 bg-stone-900" />
      </button>
    );
  }

  const menuContent = (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[99998] md:hidden"
          onClick={closeMenu}
          style={{ isolation: "isolate" }}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-white shadow-2xl z-[99999] md:hidden transform transition-transform duration-300 ease-in-out will-change-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ isolation: "isolate" }}
      >
        <div className="flex flex-col h-full">
          {/* Close button in menu */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white">
            <span className="text-sm font-medium tracking-[0.18em] uppercase text-stone-700">
              MENU
            </span>
            <button
              onClick={closeMenu}
              className="p-2 focus:outline-none focus:ring-2 focus:ring-stone-300 rounded"
              aria-label="Close menu"
            >
              <div className="relative w-5 h-5">
                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-900 rotate-45" />
                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-900 -rotate-45" />
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8 overflow-y-auto bg-white">
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-base font-medium tracking-[0.18em] uppercase text-stone-700 hover:text-stone-900 transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer info in mobile menu */}
          <div className="px-6 py-6 border-t border-stone-200 space-y-3 text-xs text-stone-600 bg-white">
            <p className="tracking-[0.24em] uppercase text-stone-500 mb-2">
              Contact
            </p>
            <p>info@aandfdesign.com</p>
            <p>+91-98765-43210</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none focus:ring-2 focus:ring-stone-300 rounded relative z-50"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`block h-0.5 w-6 bg-stone-900 transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-stone-900 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-stone-900 transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Render menu in portal to ensure it's above everything */}
      {createPortal(menuContent, document.body)}
    </>
  );
}
