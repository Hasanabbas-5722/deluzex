"use client";
import React from "react";
import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminOverview() {
  return (
    <div className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>Admin Overview</h2>
      <p className={styles.sectionSubtitle}>Welcome to the Administrator Dashboard.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <div style={{ background: 'var(--color-white)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Products</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Manage your catalog, add new products, or update pricing and stock.</p>
          <Link href="/admin/products" style={{ display: 'inline-block', background: '#C49A45', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 500 }}>
            Manage Products
          </Link>
        </div>

        <div style={{ background: 'var(--color-white)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Categories</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Organize your store by creating and managing product categories.</p>
          <Link href="/admin/categories" style={{ display: 'inline-block', background: '#C49A45', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 500 }}>
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
