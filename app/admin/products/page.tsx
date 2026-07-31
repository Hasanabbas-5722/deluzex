"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import { fetchProducts, deleteProduct, Product } from "../../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function executeDelete() {
    if (!itemToDelete) return;
    try {
      await deleteProduct(itemToDelete);
      setItemToDelete(null);
      loadProducts();
    } catch (error) {
      alert("Failed to delete product. " + error);
    }
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.sectionTitle}>Products Management</h2>
          <p className={styles.sectionSubtitle}>Manage your entire product catalog.</p>
        </div>
        <Link href="/admin/products/create" className={styles.primaryButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Product
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>No products found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {prod.product_main_image && <img src={prod.product_main_image} alt={prod.product_title} className={styles.tableImage} />}
                        {/* <span style={{ fontWeight: 600 }}>{prod.product_title}</span> */}
                      </div>
                    </td>
                    <td>{prod.product_title}</td>
                    <td>₹{Number(prod.product_price).toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link href={`/admin/products/edit/${prod._id}`} className={styles.actionLink}>Edit</Link>
                        <button onClick={() => setItemToDelete(prod._id)} className={styles.actionDelete}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {itemToDelete !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIconWrapper} style={{ color: '#EF4444', background: '#FEF2F2' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setItemToDelete(null)}>Cancel</button>
              <button className={styles.btnConfirmLogout} onClick={executeDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
