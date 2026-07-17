"use client";
import React from "react";
import styles from "./notifications.module.css";

export default function Notifications() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>Stay updated with your orders, offers and important updates.</p>
        </div>
        <button className={styles.btnAdd}>Add New Card</button>
      </div>

      <div className={styles.listHeader}>
        <h2>Notifications (4)</h2>
        <button className={styles.btnClear}>Clear All</button>
      </div>

      <div className={styles.notificationList}>
        {/* Notification Item 1 */}
        <div className={styles.notifItem}>
          <div className={styles.notifIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div className={styles.notifContent}>
            <h3>Your Order Has Been Delivered</h3>
            <p>Your Aurora Crystal Chandelier has been delivered successfully.</p>
            <div className={styles.notifActions}>
              <button className={styles.btnSecondary}>View Order</button>
              <button className={styles.btnDismiss}>Dismiss</button>
            </div>
          </div>
        </div>

        {/* Notification Item 2 */}
        <div className={styles.notifItem}>
          <div className={styles.notifIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className={styles.notifContent}>
            <div className={styles.notifTitleRow}>
              <h3>Your Order Is On The Way</h3>
              <span className={styles.tagMeeting}>Meeting</span>
            </div>
            <p>Order #DLX1021 has been shipped and is expected to arrive on .</p>
            <div className={styles.notifMeta}>
              <span className={styles.textWarning}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Track Order | 2 hours ago
              </span>
              <span className={styles.date}>08 Jul 2026.</span>
            </div>
          </div>
        </div>

        {/* Notification Item 3 */}
        <div className={styles.notifItem}>
          <div className={styles.notifIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </div>
          <div className={styles.notifContent}>
            <h3>Exclusive Offer For You</h3>
            <p>Enjoy 15% OFF on selected chandeliers. Use code LUZEX15.</p>
            <div className={styles.notifActions}>
              <button className={styles.btnSecondary}>Shop Now</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.settingsBanner}>
        <div className={styles.settingsIconWrapper}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>
        <div className={styles.settingsContent}>
          <h3>Manage how you receive notifications</h3>
          <p>Choose your preferences for email, SMS and push notifications.</p>
        </div>
        <button className={styles.btnSecondaryOutline}>Settings</button>
      </div>
    </div>
  );
}
