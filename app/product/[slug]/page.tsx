"use client";

import styles from "./productDetail.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { openCart } = useCart();

  return (
    <main className={styles.main}>
      <div className={styles.breadcrumb}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <Link href="/">Home</Link> <span>&gt;</span> <Link href="/shop">Shop</Link> <span>&gt;</span> <span>Aurora Chandelier</span>
      </div>

      <section className={styles.productSection}>
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            <Image src="/images/lamp_modern_tall_1784107732736.jpg" alt="Aurora Chandelier" fill style={{ objectFit: 'contain' }} />
          </div>
          <div className={styles.thumbnailList}>
            <div className={`${styles.thumbnail} ${styles.activeThumbnail}`}>
              <Image src="/images/lamp_modern_tall_1784107732736.jpg" alt="Thumbnail 1" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.thumbnail}>
              <Image src="/images/lamp_classic_1784107722127.jpg" alt="Thumbnail 2" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.thumbnail}>
              <Image src="/images/category_chandelier_1784107756268.jpg" alt="Thumbnail 3" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        <div className={styles.productInfo}>
          <p className={styles.categoryLabel}>CHANDELIERS</p>
          <h1 className={styles.productTitle}>Aurora Chandelier</h1>
          <div className={styles.stars}>★★★★★ <span>(14 Reviews)</span></div>
          <p className={styles.price}>£800.00</p>
          
          <div className={styles.stockInfo}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
            <span>In Stock — Ships in 1-2 business days</span>
          </div>

          <p className={styles.description}>
            The Aurora Chandelier brings timeless elegance to any modern living space. Crafted with meticulous attention to detail, its cylindrical gold and glass elements cast a warm, inviting glow that transforms the ambiance of a room.
          </p>

          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <h4>Finish</h4>
              <div className={styles.colorOptions}>
                <button className={`${styles.colorBtn} ${styles.activeColor}`} style={{backgroundColor: '#D4AF37'}}></button>
                <button className={styles.colorBtn} style={{backgroundColor: '#1A1A1A'}}></button>
                <button className={styles.colorBtn} style={{backgroundColor: '#C0C0C0'}}></button>
              </div>
            </div>
          </div>

          <div className={styles.addToCartSection}>
            <div className={styles.quantitySelector}>
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>
            <button className={styles.btnPrimary} onClick={openCart}>Add To Cart</button>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect><path d="M7 8v-2a5 5 0 0 1 10 0v2"></path></svg>
              <span>Secure Payment</span>
            </div>
            <div className={styles.featureItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <span>Free Worldwide Shipping</span>
            </div>
            <div className={styles.featureItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              <span>5 Year Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className={styles.relatedSection}>
        <h2 className={styles.sectionTitle}>You May Also Like</h2>
        <div className={styles.productGrid}>
          <div className={styles.productCardFull}>
            <div className={styles.productImgWrapper}>
              <Image src="/images/lamp_classic_1784107722127.jpg" alt="Vera Chandelier" fill style={{ objectFit: 'contain' }} />
              <button className={styles.btnCartRound} onClick={openCart}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </button>
            </div>
            <div className={styles.productInfoFull}>
              <div className={styles.piLeft}>
                <h4>VERA CHANDELIER</h4>
                <div className={styles.stockInfoSmall}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>In Stock</span>
                </div>
              </div>
              <div className={styles.piRight}>
                <div className={styles.price}>£1,200</div>
              </div>
            </div>
          </div>
          <div className={styles.productCardFull}>
            <div className={styles.productImgWrapper}>
              <Image src="/images/lamp_black_gold_1784107745696.jpg" alt="Lumina Pendant" fill style={{ objectFit: 'contain' }} />
              <button className={styles.btnCartRound} onClick={openCart}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </button>
            </div>
            <div className={styles.productInfoFull}>
              <div className={styles.piLeft}>
                <h4>LUMINA PENDANT</h4>
                <div className={styles.stockInfoSmall}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>In Stock</span>
                </div>
              </div>
              <div className={styles.piRight}>
                <div className={styles.price}>£450</div>
              </div>
            </div>
          </div>
          <div className={styles.productCardFull}>
            <div className={styles.productImgWrapper}>
              <Image src="/images/category_chandelier_1784107756268.jpg" alt="Crystal Cascade" fill style={{ objectFit: 'contain' }} />
              <button className={styles.btnCartRound} onClick={openCart}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </button>
            </div>
            <div className={styles.productInfoFull}>
              <div className={styles.piLeft}>
                <h4>CRYSTAL CASCADE</h4>
                <div className={styles.stockInfoSmall}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>In Stock</span>
                </div>
              </div>
              <div className={styles.piRight}>
                <div className={styles.price}>£2,500</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
