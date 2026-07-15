"use client";

import styles from "./shop.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Shop() {
  const { openCart } = useCart();

  const products = [
    { id: 1, name: "AURORA CHANDELIER", price: "£800", image: "/images/lamp_modern_tall_1784107732736.jpg", stock: 8 },
    { id: 2, name: "VERA CHANDELIER", price: "£1,200", image: "/images/lamp_classic_1784107722127.jpg", stock: 3 },
    { id: 3, name: "LUMINA PENDANT", price: "£450", image: "/images/lamp_black_gold_1784107745696.jpg", stock: 15 },
    { id: 4, name: "CRYSTAL CASCADE", price: "£2,500", image: "/images/category_chandelier_1784107756268.jpg", stock: 2 },
    { id: 5, name: "MODERNIST WALL SCONCE", price: "£220", image: "/images/lamp_modern_tall_1784107732736.jpg", stock: 24 },
    { id: 6, name: "ELEGANCE TABLE LAMP", price: "£350", image: "/images/lamp_classic_1784107722127.jpg", stock: 12 },
  ];

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/hero_bg_1784107713316.jpg" alt="Shop Hero Background" fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>EXPLORE OUR COLLECTION</p>
          <h1 className={styles.heroTitle}>The Shop</h1>
        </div>
      </section>

      <section className={styles.shopSection}>
        {/* SIDEBAR FILTERS */}
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3>Categories</h3>
            <label><input type="checkbox" /> All Lighting</label>
            <label><input type="checkbox" /> Chandeliers</label>
            <label><input type="checkbox" /> Pendants</label>
            <label><input type="checkbox" /> Wall Lights</label>
            <label><input type="checkbox" /> Table Lamps</label>
          </div>
          <div className={styles.filterGroup}>
            <h3>Price Range</h3>
            <label><input type="checkbox" /> £0 - £500</label>
            <label><input type="checkbox" /> £500 - £1,000</label>
            <label><input type="checkbox" /> £1,000 - £2,500</label>
            <label><input type="checkbox" /> £2,500+</label>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCardFull}>
              <Link href={`/product/${product.id}`}>
                <div className={styles.productImgWrapper}>
                  <Image src={product.image} alt={product.name} fill style={{ objectFit: 'contain' }} />
                </div>
              </Link>
              <button className={styles.btnCartRound} onClick={openCart}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </button>
              
              <div className={styles.productInfoFull}>
                <div className={styles.piLeft}>
                  <h4>{product.name}</h4>
                  <div className={styles.stockInfo}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    <span>In Stock ({product.stock} items)</span>
                  </div>
                </div>
                <div className={styles.piRight}>
                  <div className={styles.stars}>★★★★★ <span>(14)</span></div>
                  <div className={styles.price}>{product.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
