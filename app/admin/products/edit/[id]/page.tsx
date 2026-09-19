"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../../../admin/admin.module.css";
import { fetchProductById, updateProduct, fetchCategories, Category, ProductSpecification } from "../../../../services/api";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentMainImage, setCurrentMainImage] = useState("");
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    product_title: "",
    product_description: "",
    product_price: "",
    product_category: "",
    product_material: "",
    product_voltage: "",
    product_style: "",
    product_finishing: "",
    sku: "",
    stock_status: "IN STOCK",
    price_prefix: "From",
    price_note: "per piece (volume contract applicable)",
    dimensions: "",
    finish: "",
    material: "",
    colorway: "",
    piece_weight: "",
    care: "",
    moq_rule: "50 Pieces per order",
    replenishment: "Guaranteed available for 5 years minimum",
    whatsapp_number: "",
    phone_number: "",
  });

  const [customSpecs, setCustomSpecs] = useState<ProductSpecification[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<(File | null)[]>([null, null, null, null]);
  const [isNewArrival, setIsNewArrival] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);

    async function loadProduct() {
      if (!params.id) return;
      try {
        const data = await fetchProductById(params.id as string);
        if (data) {
          const rawProductImages = data?.product_images as unknown;
          let parsedGallery: string[] = ["", "", "", ""];

          if (Array.isArray(rawProductImages)) {
            parsedGallery = [...rawProductImages, "", "", "", ""].slice(0, 4);
          } else if (typeof rawProductImages === "string" && (rawProductImages as string).trim()) {
            const splitImages = (rawProductImages as string)
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);

            parsedGallery = [...splitImages, "", "", "", ""].slice(0, 4);
          }

          setCurrentMainImage(data.product_main_image || "");
          setCurrentGallery(parsedGallery);
          setIsNewArrival(Boolean(data.is_new_arrival));

          setFormData({
            product_title: data.product_title || "",
            product_description: data.product_description || "",
            product_price: data.product_price?.toString() || "",
            product_category: data.product_category || "",
            product_material: data.product_material || data.material || "",
            product_voltage: data.product_voltage || "",
            product_style: data.product_style || data.colorway || "",
            product_finishing: data.product_finishing || data.finish || "",
            sku: data.sku || "ME-DP-105",
            stock_status: data.stock_status || "IN STOCK",
            price_prefix: data.price_prefix || "From",
            price_note: data.price_note || "per piece (volume contract applicable)",
            dimensions: data.dimensions || "10.5 inch (26.7 cm) Diameter",
            finish: data.finish || data.product_finishing || "Earthy Matte Clay Slip (Fingerprint Resistant)",
            material: data.material || data.product_material || "High-Alumina Vitrified Stoneware",
            colorway: data.colorway || data.product_style || "Warm Terracotta Basalt",
            piece_weight: data.piece_weight || "380g",
            care: data.care || "Oven, Microwave, & High-Temp Dishwasher Safe",
            moq_rule: data.moq_rule || "50 Pieces per order",
            replenishment: data.replenishment || "Guaranteed available for 5 years minimum",
            whatsapp_number: data.whatsapp_number || "",
            phone_number: data.phone_number || "",
          });

          if (Array.isArray(data.specifications)) {
            setCustomSpecs(data.specifications);
          }
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

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

  const handleAddCustomSpec = () => {
    setCustomSpecs([...customSpecs, { key: "", value: "" }]);
  };

  const handleRemoveCustomSpec = (index: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== index));
  };

  const handleCustomSpecChange = (index: number, field: "key" | "value", value: string) => {
    const updated = [...customSpecs];
    updated[index][field] = value;
    setCustomSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          payload.append(key, String(value));
        }
      });
      payload.append("is_new_arrival", String(isNewArrival));
      
      const validSpecs = customSpecs.filter(s => s.key.trim() && s.value.trim());
      payload.append("specifications", JSON.stringify(validSpecs));

      // Existing images to keep
      const retainedGallery = currentGallery.filter(url => Boolean(url));
      payload.append("existing_images", JSON.stringify(retainedGallery));

      if (mainImage) {
        payload.append("product_main_image", mainImage);
      }
      
      galleryImages.forEach(file => {
        if (file) payload.append("product_images", file);
      });

      await updateProduct(params.id as string, payload);
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
    border: '1px solid rgba(0,0,0,0.12)', marginTop: '0.4rem', 
    fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' as const,
  };

  const sectionHeaderStyle = {
    fontSize: '1rem', fontWeight: 600, color: 'var(--admin-primary)',
    marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
  };

  return (
    <div className={styles.sectionContainer} style={{ width: '100%', maxWidth: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/products" style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1rem' }}>
          &larr; Back to Products
        </Link>
        <h2 className={styles.sectionTitle}>Edit Product Specifications</h2>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Edit product details, technical specifications, and imagery to immediately update the live product page.
        </p>
      </div>

      <div style={{ background: 'var(--color-white)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        {loading ? (
          <p>Loading product details...</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* BASIC INFO */}
            <div style={{ gridColumn: '1 / -1' }}>
              <h3 style={sectionHeaderStyle}>Basic Information</h3>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Product Title *</label>
              <input required type="text" name="product_title" value={formData.product_title} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>SKU (Stock Keeping Unit) *</label>
              <input required type="text" name="sku" value={formData.sku} onChange={handleChange} style={inputStyle} placeholder="e.g. ME-DP-105" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Stock Status *</label>
              <select name="stock_status" value={formData.stock_status} onChange={handleChange} style={inputStyle}>
                <option value="IN STOCK">IN STOCK (Green Badge)</option>
                <option value="MADE TO ORDER">MADE TO ORDER (Amber Badge)</option>
                <option value="OUT OF STOCK">OUT OF STOCK (Red Badge)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Price (₹) *</label>
              <input required type="number" step="0.01" name="product_price" value={formData.product_price} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Category *</label>
              <select required name="product_category" value={formData.product_category} onChange={handleChange} style={inputStyle}>
                <option value="" disabled>Select a category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Price Prefix</label>
              <input type="text" name="price_prefix" value={formData.price_prefix} onChange={handleChange} style={inputStyle} placeholder="e.g. From" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Price Note / Subtitle</label>
              <input type="text" name="price_note" value={formData.price_note} onChange={handleChange} style={inputStyle} placeholder="e.g. per piece (volume contract applicable)" />
            </div>

            {/* TECHNICAL SPECIFICATIONS */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={sectionHeaderStyle}>Technical Specifications</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--admin-text-muted)', marginBottom: '1.25rem' }}>
                These specifications are displayed in the product detail page technical specifications list.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Dimensions</label>
              <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} style={inputStyle} placeholder="e.g. 10.5 inch (26.7 cm) Diameter" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Finish</label>
              <input type="text" name="finish" value={formData.finish} onChange={handleChange} style={inputStyle} placeholder="e.g. Earthy Matte Clay Slip (Fingerprint Resistant)" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Material</label>
              <input type="text" name="material" value={formData.material} onChange={handleChange} style={inputStyle} placeholder="e.g. High-Alumina Vitrified Stoneware" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Colorway</label>
              <input type="text" name="colorway" value={formData.colorway} onChange={handleChange} style={inputStyle} placeholder="e.g. Warm Terracotta Basalt" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Piece Weight</label>
              <input type="text" name="piece_weight" value={formData.piece_weight} onChange={handleChange} style={inputStyle} placeholder="e.g. 380g" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Care</label>
              <input type="text" name="care" value={formData.care} onChange={handleChange} style={inputStyle} placeholder="e.g. Oven, Microwave, & High-Temp Dishwasher Safe" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>MOQ Rule</label>
              <input type="text" name="moq_rule" value={formData.moq_rule} onChange={handleChange} style={inputStyle} placeholder="e.g. 50 Pieces per order" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Replenishment</label>
              <input type="text" name="replenishment" value={formData.replenishment} onChange={handleChange} style={inputStyle} placeholder="e.g. Guaranteed available for 5 years minimum" />
            </div>

            {/* CUSTOM SPECIFICATIONS BUILDER */}
            <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>+ Additional Custom Specifications</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>Add any other custom key-value rows to the Technical Specifications table.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomSpec}
                  style={{ background: '#0F172A', color: '#fff', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  + Add Spec Row
                </button>
              </div>

              {customSpecs.map((spec, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', marginBottom: '0.65rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Specification Name"
                    value={spec.key}
                    onChange={(e) => handleCustomSpecChange(idx, "key", e.target.value)}
                    style={{ ...inputStyle, marginTop: 0 }}
                  />
                  <input
                    type="text"
                    placeholder="Specification Value"
                    value={spec.value}
                    onChange={(e) => handleCustomSpecChange(idx, "value", e.target.value)}
                    style={{ ...inputStyle, marginTop: 0 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomSpec(idx)}
                    style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', padding: '0.65rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* CONTACT & OVERRIDES */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem' }}>
              <h3 style={sectionHeaderStyle}>Dedicated Contact Overrides (Optional)</h3>
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Dedicated WhatsApp Number</label>
              <input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} style={inputStyle} placeholder="Leave empty for site default (918511682031)" />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Dedicated Phone Number</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} style={inputStyle} placeholder="Leave empty for site default (+91 85116 82031)" />
            </div>

            {/* IMAGES */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={sectionHeaderStyle}>Product Images</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)', display: 'block', marginBottom: '0.5rem' }}>Main Image (Upload new to change)</label>
                {currentMainImage && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Image src={currentMainImage} alt="Current main" width={70} height={70} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleMainImageChange} style={inputStyle} />
              </div>
              
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)', display: 'block', marginBottom: '0.5rem' }}>Gallery Thumbnails</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[0, 1, 2, 3].map(index => (
                  <div key={index} style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    {currentGallery[index] ? (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <Image src={currentGallery[index]} alt={`Current gallery ${index}`} width={55} height={55} style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '6px' }} />
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Thumbnail {index + 1} (Empty)</div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleGalleryImageChange(e, index)} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            {/* NEW ARRIVAL TOGGLE */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem' }}>
              <div style={{
                background: isNewArrival ? '#FFFBEB' : '#f8fafc',
                border: isNewArrival ? '1px solid #F59E0B' : '1px solid var(--admin-border)',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: isNewArrival ? '#92400E' : 'var(--admin-primary)', fontSize: '0.95rem' }}>
                    <span>★ Feature in Homepage New Arrivals Carousel</span>
                    {isNewArrival && (
                      <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                        Active
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.825rem', color: 'var(--admin-text-muted)' }}>
                    When enabled, this product will immediately show up in the New Arrivals carousel on the homepage.
                  </p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer', flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: isNewArrival ? '#C49A45' : '#cbd5e1',
                    borderRadius: '34px',
                    transition: '0.2s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      height: '20px',
                      width: '20px',
                      left: isNewArrival ? '24px' : '4px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </span>
                </label>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>Description *</label>
              <textarea required name="product_description" value={formData.product_description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px' }} />
            </div>

            {/* SUBMIT BUTTON */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <button type="submit" disabled={saving} style={{ width: '100%', background: '#E0531C', color: '#fff', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(224, 83, 28, 0.25)' }}>
                {saving ? "Updating Product..." : "Update Product Specifications"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

