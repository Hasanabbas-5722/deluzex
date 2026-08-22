"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { openCart } from "../store/cartSlice";
import { useSidebar } from "../context/SidebarContext";
import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const isHome = pathname === "/";

  // Listen to scroll only on home page
  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // On home: transparent → scrolled solid. On other pages: always solid.
  const headerClass = isHome
    ? scrolled
      ? styles.headerSolid
      : styles.headerTransparent
    : styles.headerSolid;

  const isAuthPage =
    pathname?.includes("/login") ||
    pathname?.includes("/signup") ||
    pathname?.includes("/signin");
  if (isAuthPage) return null;

  return (
    <header className={`${styles.header} ${headerClass}`}>

      <div className={styles.logoRow}>
        {/* Hamburger — visible on mobile/tablet */}
        <button
          className={styles.hamburgerBtn}
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        <div className={styles.logo}>
          <Link href="/">deluzex</Link>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link href="/">Lighting</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      <div className={styles.headerIcons}>
        <Link href="/dashboard/profile" className={styles.userIcon} aria-label="My Profile">
          <Image src="/images/avatar_woman_1784107804209.jpg" alt="User" width={24} height={24} className={styles.userAvatar} />
        </Link>
        <button className={styles.iconBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <div className={styles.cartIconWrapper}>
          <button className={styles.iconBtn} onClick={() => dispatch(openCart())}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
          <span className={styles.cartBadge}>{cartItems.length != 0 ? cartItems.length : "0"}</span>
        </div>
      </div>
    </header>
  );
}
