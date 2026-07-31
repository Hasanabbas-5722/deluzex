"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../../admin/admin.module.css";
import { createProduct, fetchCategories, Category } from "../../../services/api";

export default function CreateProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    product_title: "",
    product_description: "",
    product_price: "",
    product_category: "",
    product_material: "",
    product_voltage: "",
    product_style: "",
    product_finishing: ""
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<(File | null)[]>([null, null, null, null]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const newGallery = [...galleryImages];
      newGallery[index] = e.target.files[0];
      setGalleryImages(newGallery);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!mainImage) {
        alert("Please select a main image");
        setLoading(false);
        return;
      }
      if (galleryImages.some(img => img === null)) {
        alert("Please select all 4 gallery images");
        setLoading(false);
        return;
      }
      
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      
      payload.append("product_main_image", mainImage);
      galleryImages.forEach(file => {
        if (file) payload.append("product_images", file);
      });

      await createProduct(payload);
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
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
        <Link href="/admin/products" style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1rem' }}>
          &larr; Back to Products
        </Link>
        <h2 className={styles.sectionTitle}>Add New Product</h2>
      </div>

      <div style={{ background: 'var(--color-white)', borderRadius: '12px', padding: '2rem', maxWidth: '800px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Product Title *</label>
            <input required type="text" name="product_title" value={formData.product_title} onChange={handleChange} style={inputStyle} placeholder="e.g. Aurora Chandelier" />
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Price ($) *</label>
            <input required type="number" step="0.01" name="product_price" value={formData.product_price} onChange={handleChange} style={inputStyle} placeholder="e.g. 800" />
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Category *</label>
            <select required name="product_category" value={formData.product_category} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select a category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Material *</label>
            <input required type="text" name="product_material" value={formData.product_material} onChange={handleChange} style={inputStyle} placeholder="e.g. Stainless Steel & Crystal" />
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Voltage *</label>
            <input required type="text" name="product_voltage" value={formData.product_voltage} onChange={handleChange} style={inputStyle} placeholder="e.g. 110V - 240V" />
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Style *</label>
            <input required type="text" name="product_style" value={formData.product_style} onChange={handleChange} style={inputStyle} placeholder="e.g. Modern Luxury" />
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Finishing *</label>
            <input required type="text" name="product_finishing" value={formData.product_finishing} onChange={handleChange} style={inputStyle} placeholder="e.g. Brushed Gold" />
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Product Images</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)', display: 'block', marginBottom: '0.5rem' }}>Main Image *</label>
              <input required type="file" accept="image/*" onChange={handleMainImageChange} style={inputStyle} />
            </div>
            
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)', display: 'block', marginBottom: '0.5rem' }}>Gallery Images (4 required) *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input required type="file" accept="image/*" onChange={(e) => handleGalleryImageChange(e, 0)} style={inputStyle} />
              <input required type="file" accept="image/*" onChange={(e) => handleGalleryImageChange(e, 1)} style={inputStyle} />
              <input required type="file" accept="image/*" onChange={(e) => handleGalleryImageChange(e, 2)} style={inputStyle} />
              <input required type="file" accept="image/*" onChange={(e) => handleGalleryImageChange(e, 3)} style={inputStyle} />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Description *</label>
            <textarea required name="product_description" value={formData.product_description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px' }} placeholder="Product details..." />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#C49A45', color: '#fff', padding: '1rem', borderRadius: '30px', fontSize: '0.95rem', fontWeight: 500, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
