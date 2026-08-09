"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import { fetchCategories, deleteCategory, Category } from "../../services/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function executeDelete() {
    if (!itemToDelete) return;
    try {
      await deleteCategory(itemToDelete);
      setItemToDelete(null);
      loadCategories();
    } catch (error) {
      alert("Failed to delete category. " + error);
    }
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.sectionTitle}>Categories Management</h2>
          <p className={styles.sectionSubtitle}>Organize your catalog with categories.</p>
        </div>
        <Link href="/admin/categories/create" className={styles.primaryButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Category
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading categories...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {cat.image_url && <img src={cat.image_url} alt={cat.name} className={styles.tableImage} />}
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link href={`/admin/categories/edit/${cat._id || cat.id || cat.category_id}`} className={styles.actionLink}>Edit</Link>
                        <button onClick={() => setItemToDelete(cat._id || cat.id || cat.category_id || null)} className={styles.actionDelete}>Delete</button>
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
            <h3>Delete Category</h3>
            <p>Are you sure you want to delete this category? This action cannot be undone.</p>
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
