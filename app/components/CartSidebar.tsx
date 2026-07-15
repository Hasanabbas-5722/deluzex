"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import styles from "./CartSidebar.module.css";

export default function CartSidebar() {
  const { isCartOpen, closeCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={closeCart}></div>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2>1 ITEM IN CART</h2>
          <button className={styles.closeBtn} onClick={closeCart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className={styles.cartItems}>
          {/* Item 1 */}
          <div className={styles.cartItem}>
            <div className={styles.itemImageWrapper}>
              <Image src="/images/lamp_classic_1784107722127.jpg" alt="Vera Chandelier" fill style={{ objectFit: 'contain' }} />
            </div>
            <div className={styles.itemDetails}>
              <h4>Vera (Round, Gold, White)<br/>Ceramic Chandelier</h4>
              <p className={styles.price}>₹2,320.00</p>
              <div className={styles.itemActions}>
                <div className={styles.quantity}>
                  <button>-</button>
                  <span>1</span>
                  <button>+</button>
                </div>
                <div className={styles.iconButtons}>
                  <button className={styles.iconBtnSmall}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                  <button className={styles.iconBtnSmall}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </div>
            </div>
          </div>
          {/* Item 2 */}
          <div className={styles.cartItem}>
            <div className={styles.itemImageWrapper}>
              <Image src="/images/lamp_classic_1784107722127.jpg" alt="Vera Chandelier" fill style={{ objectFit: 'contain' }} />
            </div>
            <div className={styles.itemDetails}>
              <h4>Vera (Round, Gold, White)<br/>Ceramic Chandelier</h4>
              <p className={styles.price}>₹2,320.00</p>
              <div className={styles.itemActions}>
                <div className={styles.quantity}>
                  <button>-</button>
                  <span>1</span>
                  <button>+</button>
                </div>
                <div className={styles.iconButtons}>
                  <button className={styles.iconBtnSmall}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                  <button className={styles.iconBtnSmall}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.subtotalRow}>
            <div>
              <h3>Subtotal</h3>
              <p>Taxes included</p>
            </div>
            <div className={styles.totalPrice}>₹2,320.00</div>
          </div>
          <button className={styles.btnCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </>
  );
}
