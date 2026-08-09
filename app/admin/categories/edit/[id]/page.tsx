"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../../admin.module.css";
import { fetchCategories, updateCategory, Category } from "../../../../services/api";

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: ""
  });

  useEffect(() => {
    async function loadCategory() {
      if (!params.id) return;
      try {
        // Since there is no fetchCategoryById, we can fetch all and find the one.
        // A real app would have fetchCategoryById
        const allCategories = await fetchCategories();
        const currentId = Array.isArray(params.id) ? params.id[0] : params.id;
        const data = allCategories.find((category: Category) => category.id.toString() === currentId);
        
        if (data) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            image_url: data.image_url || ""
          });
        } else {
          alert("Category not found");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load category");
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCategory(params.id as string, formData);
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("Failed to update category");
      setSaving(false);
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
        <h2 className={styles.sectionTitle}>Edit Category</h2>
      </div>

      <div style={{ background: 'var(--color-white)', borderRadius: '12px', padding: '2rem', maxWidth: '600px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        {loading ? (
          <p>Loading category details...</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Category Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Image URL</label>
              <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} />
            </div>
            <button type="submit" disabled={saving} style={{ background: '#C49A45', color: '#fff', padding: '1rem', borderRadius: '30px', fontSize: '0.95rem', fontWeight: 500, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: saving ? 0.7 : 1 }}>
              {saving ? "Updating..." : "Update Category"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
