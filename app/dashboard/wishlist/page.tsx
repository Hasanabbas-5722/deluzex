"use client";
import React, { useState } from "react";
import styles from "./wishlist.module.css";

const initialItems = [
  { id: 1, name: "Aurora Crstal Candeller", price: "$1200" },
  { id: 2, name: "Aurora Crstal Candeller", price: "$1200" },
  { id: 3, name: "Aurora Crstal Candeller", price: "$1200" },
  { id: 4, name: "Aurora Crstal Candeller", price: "$1200" },
  { id: 5, name: "Aurora Crstal Candeller", price: "$1200" },
];

// Placeholder pendant lamp image using a gradient background
function LampPlaceholder() {
  return (
    <div style={{
      width: "100%",
      aspectRatio: "1",
      background: "linear-gradient(135deg, #c5b49a 0%, #8a7560 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <svg width="64" height="80" viewBox="0 0 64 80" fill="none">
        {/* Chain */}
        <line x1="32" y1="0" x2="32" y2="18" stroke="#d4c5a9" strokeWidth="2" />
        {/* Lamp shade */}
        <ellipse cx="32" cy="20" rx="12" ry="4" fill="#b8a282" />
        <path d="M20 20 Q16 50 10 70 Q32 76 54 70 Q48 50 44 20 Z" fill="#c4a97a" />
        {/* Bottom ring */}
        <ellipse cx="32" cy="70" rx="22" ry="5" fill="#b8a282" />
        {/* Light glow */}
        <ellipse cx="32" cy="55" rx="12" ry="8" fill="rgba(255,240,200,0.3)" />
      </svg>
    </div>
  );
}

export default function WishlistPage() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Wishlist</h1>
        <p className={styles.subtitle}>Your Favourite lighting pieces,saved for you.</p>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search Wishlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.btnMoveAll}>Move All To Cart</button>
      </div>

      {/* Product Grid */}
      <div className={styles.productGrid}>
        {filtered.map((item) => (
          <div key={item.id} className={styles.productCard}>
            <div className={styles.imgWrapper}>
              <LampPlaceholder />
              <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.productName}>{item.name}</div>
              <div className={styles.productPrice}>{item.price}</div>
              <button className={styles.btnAddToCart}>Add To Cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className={styles.footerBanner}>
        <div className={styles.footerLeft}>
          <div className={styles.footerIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className={styles.footerText}>
            <h4>Dont see something you like?</h4>
            <p>Explore <a href="/shop" style={{ color: "var(--color-primary)" }}>our latest collection</a> and find the perfect lighting for your space.</p>
          </div>
        </div>
        <button className={styles.btnExplore}>Explore Our Collection</button>
      </div>
    </div>
  );
}
