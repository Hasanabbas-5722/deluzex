"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../admin.module.css";
import { createCategory } from "../../../services/api";

export default function CreateCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory(formData);
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("Failed to create category");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
    border: '1px solid rgba(0,0,0,0.1)', marginTop: '0.5rem', 
    fontSize: '0.9rem', fontFamily: 'inherit'
  };

  return (
    <div className={styles.sectionContainer}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/categories" style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1rem' }}>
          &larr; Back to Categories
        </Link>
        <h2 className={styles.sectionTitle}>Add New Category</h2>
      </div>

      <div style={{ background: 'var(--color-white)', borderRadius: '12px', padding: '2rem', maxWidth: '600px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Category Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="e.g. Floor Lamps" />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Image URL</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} style={inputStyle} placeholder="e.g. /images/category.jpg" />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} placeholder="Category details..." />
          </div>
          <button type="submit" disabled={loading} style={{ background: '#C49A45', color: '#fff', padding: '1rem', borderRadius: '30px', fontSize: '0.95rem', fontWeight: 500, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
