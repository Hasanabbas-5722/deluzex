"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import Image from "next/image";

import { useCart } from "../context/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { openCart } = useCart();
  const isHome = pathname === "/";
  const isDark = pathname === "/blogs" || pathname === "/about" || pathname.startsWith("/product") || pathname.startsWith("/blogs/");
  // Based on the images: Home has light text on dark bg, Contact has dark text on light bg, Blogs has dark text on light bg. 
  // Wait, in Contact Us image, the header is dark text on beige bg.
  // In Blogs image, the header is dark text on beige bg (Wait, in Blogs image the header is ON the dark hero image? No, let's look at the image).
  // Image 3 (Blogs): The header is dark text on beige bg.
  // Actually, wait, let's just make a prop-based header or determine by route.
  
  const headerClass = isHome ? styles.headerTransparent : styles.headerSolid;

  return (
    <header className={`${styles.header} ${headerClass}`}>
      <div className={styles.logo}>
        <Link href="/">deluzex</Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Lighting</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <div className={styles.headerIcons}>
        <Image src="/images/avatar_woman_1784107804209.jpg" alt="User" width={24} height={24} className={styles.userAvatar} />
        <button className={styles.iconBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <div className={styles.cartIconWrapper}>
          <button className={styles.iconBtn} onClick={openCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>
          {isHome && <span className={styles.cartBadge}>02</span>}
        </div>
      </div>
    </header>
  );
}
