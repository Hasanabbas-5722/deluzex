"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems, cartTotal } = useSelector((state: RootState) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculations
  const subtotal = cartTotal;
  const gst = subtotal * 0.18;
  const delivery = subtotal > 0 ? 99 : 0;
  const grandTotal = subtotal + gst + delivery;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate network request
    setTimeout(() => {
      dispatch(clearCart());
      router.push("/checkout/success");
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>Your Cart is Empty</h1>
          <p>Please add some items to your cart before proceeding to checkout.</p>
          <a href="/shop" className={styles.btnReturn}>Return to Shop</a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className={styles.checkoutGrid}>
        {/* LEFT COLUMN: Forms */}
        <div className={styles.leftCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" required className={styles.input} placeholder="Enter your email" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input type="tel" required className={styles.input} placeholder="Enter your phone number" />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name</label>
                <input type="text" required className={styles.input} placeholder="First Name" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name</label>
                <input type="text" required className={styles.input} placeholder="Last Name" />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Street Address</label>
              <input type="text" required className={styles.input} placeholder="House number and street name" />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>City</label>
                <input type="text" required className={styles.input} placeholder="City" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>State</label>
                <input type="text" required className={styles.input} placeholder="State" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>PIN Code</label>
                <input type="text" required className={styles.input} placeholder="PIN Code" />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentOptionActive : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                <span>Cash on Delivery</span>
              </label>
              <label className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.paymentOptionActive : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                <span>Credit / Debit Card</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.cartItems}>
              {cartItems.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <span className={styles.itemBadge}>{item.quantity}</span>
                    <Image src={item.image} alt={item.title} fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.title}</h4>
                    <span className={styles.itemPrice}>₹{item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>₹{delivery.toFixed(2)}</span>
              </div>
              <div className={styles.grandTotalRow}>
                <span>Grand Total</span>
                <span className={styles.grandTotalPrice}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className={styles.btnPlaceOrder} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
