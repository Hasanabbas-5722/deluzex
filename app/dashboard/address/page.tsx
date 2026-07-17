"use client";
import React, { useState } from "react";
import styles from "./address.module.css";

const addresses = [
  { type: "Home", isDefault: true, name: "Soni Patel", address: "18, Sapphire Residency,\nBodakdev,Ahmedabad, Gujarat 380054,\nIndia", phone: "+91 9982791722" },
  { type: "work", isDefault: false, name: "Soni Patel", address: "18, Sapphire Residency,\nBodakdev,Ahmedabad, Gujarat 380054,\nIndia", phone: "+91 9982791722" },
  { type: "work", isDefault: false, name: "Soni Patel", address: "18, Sapphire Residency,\nBodakdev,Ahmedabad, Gujarat 380054,\nIndia", phone: "+91 9982791722" },
  { type: "work", isDefault: false, name: "Soni Patel", address: "18, Sapphire Residency,\nBodakdev,Ahmedabad, Gujarat 380054,\nIndia", phone: "+91 9982791722" },
];

export default function AddressPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Address</h1>
        <p className={styles.subtitle}>Manage your saved address for a fast checkout experince.</p>
      </div>

      {/* Address Grid */}
      <div className={styles.addressGrid}>
        {addresses.map((addr, i) => (
          <div
            key={i}
            className={`${styles.addressCard} ${selected === i ? styles.addressCardActive : ""}`}
            onClick={() => setSelected(i)}
          >
            <div className={styles.topRow}>
              {addr.isDefault ? (
                <span className={styles.defaultBadge}>Default</span>
              ) : <span />}
              <div className={`${styles.radioBtn} ${selected === i ? styles.radioBtnActive : ""}`}>
                {selected === i && <div className={styles.radioDot}></div>}
              </div>
            </div>

            <div className={styles.addressTypeRow}>
              <svg className={styles.addressTypeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className={styles.addressType}>{addr.type}</span>
            </div>

            <div className={styles.personName}>{addr.name}</div>
            <div className={styles.addressText}>{addr.address}</div>
            <div className={styles.phoneText}>{addr.phone}</div>

            <div className={styles.cardActions}>
              <button className={styles.btnEdit} onClick={(e) => e.stopPropagation()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <div className={styles.actionDivider}></div>
              <button className={styles.btnDelete} onClick={(e) => e.stopPropagation()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className={styles.footerBanner}>
        <div className={styles.footerIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <div className={styles.footerText}>
          <h4>Default address will be selected automatically</h4>
          <p>You can change default address at any time</p>
        </div>
      </div>
    </div>
  );
}
