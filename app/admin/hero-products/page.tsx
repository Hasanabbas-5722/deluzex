"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Upload,
  AlertCircle,
  ImageIcon,
  X,
} from "lucide-react";
import {
  fetchHeroProducts,
  createHeroProduct,
  updateHeroProduct,
  deleteHeroProduct,
  HeroProduct,
} from "../../services/api";

export default function AdminHeroProducts() {
  const [heroProducts, setHeroProducts] = useState<HeroProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<HeroProduct | null>(null);
  const [itemToDelete, setItemToDelete] = useState<HeroProduct | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    alt: "",
    image: "",
  });
  const [imageTab, setImageTab] = useState("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadHeroProducts();
  }, []);

  async function loadHeroProducts() {
    setLoading(true);
    try {
      const data = await fetchHeroProducts();
      setHeroProducts(data);
    } catch (err) {
      console.error("Failed to load hero products:", err);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setErrorMsg("");
    setFormData({ name: "", price: "", alt: "", image: "" });
    setSelectedFile(null);
    setPreviewUrl("");
    setImageTab("file");
    setShowAddModal(true);
  }

  function openEditModal(prod: HeroProduct) {
    setErrorMsg("");
    setFormData({
      name: prod.name || "",
      price: prod.price !== undefined ? String(prod.price) : "",
      alt: prod.alt || "",
      image: prod.image || "",
    });
    setSelectedFile(null);
    setPreviewUrl(prod.image || "");
    setImageTab(prod.image?.startsWith("http") || prod.image?.startsWith("/images") ? "url" : "file");
    setEditingProduct(prod);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function handleImageUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, image: val }));
    if (!selectedFile) {
      setPreviewUrl(val);
    }
  }

  function clearImage() {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.alt.trim()) {
      setErrorMsg("Lamp name, price, and alt text are required.");
      return;
    }
    if (!formData.image.trim() && !selectedFile) {
      setErrorMsg("Please provide an image file or image URL.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const body = new FormData();
      body.append("name", formData.name.trim());
      body.append("price", String(Number(formData.price)));
      body.append("alt", formData.alt.trim());
      if (selectedFile) {
        body.append("image_file", selectedFile);
      } else if (formData.image.trim()) {
        body.append("image", formData.image.trim());
      }

      await createHeroProduct(body);
      setShowAddModal(false);
      loadHeroProducts();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create hero product");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    const prodId = editingProduct._id || editingProduct.id;
    if (!prodId) {
      setErrorMsg("Product identifier is missing.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const body = new FormData();
      if (formData.name.trim()) body.append("name", formData.name.trim());
      if (formData.price) body.append("price", String(Number(formData.price)));
      if (formData.alt.trim()) body.append("alt", formData.alt.trim());
      if (selectedFile) {
        body.append("image_file", selectedFile);
      } else if (formData.image.trim()) {
        body.append("image", formData.image.trim());
      }

      await updateHeroProduct(prodId, body);
      setEditingProduct(null);
      loadHeroProducts();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update hero product");
    } finally {
      setSubmitting(false);
    }
  }

  async function executeDelete() {
    if (!itemToDelete) return;
    const prodId = itemToDelete._id || itemToDelete.id;
    if (!prodId) return;

    setSubmitting(true);
    try {
      await deleteHeroProduct(prodId);
      setItemToDelete(null);
      loadHeroProducts();
    } catch (err: any) {
      alert("Failed to delete hero product: " + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.sectionContainer}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.sectionTitle} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Sparkles size={28} color="#C49A45" />
            Hero Products
          </h2>
          <p className={styles.sectionSubtitle}>
            Manage hero section showcase lamps and featured items displayed on the homepage slider.
          </p>
        </div>
        <button onClick={openAddModal} className={styles.primaryButton}>
          <Plus size={18} />
          Add Hero Product
        </button>
      </div>

      {/* Main Table Card */}
      <div className={styles.card}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--admin-border)", background: "#f8fafc" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--admin-primary)", margin: 0 }}>
            Showcase Lamps Catalog
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", margin: "0.25rem 0 0" }}>
            {heroProducts.length} lamp{heroProducts.length !== 1 ? "s" : ""} active in the homepage carousel
          </p>
        </div>

        {loading ? (
          <p style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
            Loading hero lamps...
          </p>
        ) : heroProducts.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--admin-text-muted)", marginBottom: "1rem" }}>No hero products found.</p>
            <button onClick={openAddModal} className={styles.primaryButton}>
              <Plus size={18} /> Add Your First Lamp
            </button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Preview</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Alt Description</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {heroProducts.map((prod, idx) => {
                  const id = prod._id || prod.id || String(idx);
                  return (
                    <tr key={id}>
                      <td>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            minWidth: 48,
                            minHeight: 48,
                            borderRadius: 10,
                            overflow: "hidden",
                            background: "#f1f5f9",
                            border: "1px solid var(--admin-border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {prod.image ? (
                            <Image
                              src={prod.image}
                              alt={prod.alt || prod.name}
                              width={48}
                              height={48}
                              style={{ width: 48, height: 48, objectFit: "cover", display: "block" }}
                            />
                          ) : (
                            <ImageIcon size={20} color="#94a3b8" />
                          )}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--admin-primary)" }}>{prod.name}</td>
                      <td style={{ fontWeight: 600, color: "var(--admin-primary)" }}>${Number(prod.price).toFixed(2)}</td>
                      <td style={{ color: "var(--admin-text-muted)", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.85rem" }}>
                        {prod.alt}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", alignItems: "center" }}>
                          <button
                            onClick={() => openEditModal(prod)}
                            className={styles.actionLink}
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", border: "none", cursor: "pointer" }}
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => setItemToDelete(prod)}
                            className={styles.actionDelete}
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => !submitting && setShowAddModal(false)}>
          <div className={`${styles.modal} ${styles.modalLarge}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setShowAddModal(false)}>
              ✕
            </button>
            <div className={styles.modalIconWrapper} style={{ background: "rgba(196, 154, 69, 0.12)", color: "#C49A45" }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>Add Hero Product</h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>Create a new featured lamp to showcase on the homepage hero slider.</p>

            {errorMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.9rem", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", fontSize: "0.85rem", marginBottom: "1rem" }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Lamp Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cylindrical Floor Lamp"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.gridCols2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="231"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Alt Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern gold cylinder floor lamp"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <label className={styles.formLabel} style={{ margin: 0 }}>Product Image *</label>
                  <div className={styles.tabSwitch}>
                    <button
                      type="button"
                      onClick={() => setImageTab("file")}
                      className={`${styles.tabSwitchBtn} ${imageTab === "file" ? styles.tabSwitchBtnActive : ""}`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {imageTab === "file" ? (
                  <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ffffff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                      <Upload size={16} />
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--admin-primary)" }}>
                      {selectedFile ? selectedFile.name : "Click to choose an image file"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>PNG, JPG, WebP up to 5MB</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. /images/lamp_modern_tall_1784107732736.jpg"
                    value={formData.image}
                    onChange={handleImageUrlChange}
                    className={styles.formInput}
                  />
                )}

                {previewUrl && (
                  <div className={styles.previewCard}>
                    <div style={{ width: 52, height: 52, minWidth: 52, minHeight: 52, borderRadius: 8, overflow: "hidden", border: "1px solid var(--admin-border)", background: "#ffffff" }}>
                      <Image src={previewUrl} alt="Preview" width={52} height={52} style={{ width: 52, height: 52, objectFit: "cover", display: "block" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--admin-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedFile ? selectedFile.name : formData.image || "Selected Image"}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#10b981" }}>Live preview active</p>
                    </div>
                    <button type="button" onClick={clearImage} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "0.25rem" }}>
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.modalActions}>
                <button type="button" disabled={submitting} onClick={() => setShowAddModal(false)} className={styles.btnCancel}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={styles.primaryButton} style={{ padding: "0.65rem 1.35rem", borderRadius: "8px" }}>
                  {submitting ? "Saving..." : "Create Hero Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className={styles.modalOverlay} onClick={() => !submitting && setEditingProduct(null)}>
          <div className={`${styles.modal} ${styles.modalLarge}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setEditingProduct(null)}>
              ✕
            </button>
            <div className={styles.modalIconWrapper} style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
              <Pencil size={26} />
            </div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>Edit Hero Product</h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>Update hero lamp attributes or replace showcase image.</p>

            {errorMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.9rem", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", fontSize: "0.85rem", marginBottom: "1rem" }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Lamp Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.gridCols2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Alt Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <label className={styles.formLabel} style={{ margin: 0 }}>Replace Image</label>
                 
                </div>
                  <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ffffff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                      <Upload size={16} />
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--admin-primary)" }}>
                      {selectedFile ? selectedFile.name : "Click to select a new image file"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Leaves current image unchanged if omitted</span>
                  </div>
                

                {previewUrl && (
                  <div className={styles.previewCard}>
                    <div style={{ width: 52, height: 52, minWidth: 52, minHeight: 52, borderRadius: 8, overflow: "hidden", border: "1px solid var(--admin-border)", background: "#ffffff" }}>
                      <Image src={previewUrl} alt="Preview" width={52} height={52} style={{ width: 52, height: 52, objectFit: "cover", display: "block" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--admin-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedFile ? selectedFile.name : formData.image || "Current Image"}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#10b981" }}>Preview of showcase lamp</p>
                    </div>
                    <button type="button" onClick={clearImage} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "0.25rem" }}>
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.modalActions}>
                <button type="button" disabled={submitting} onClick={() => setEditingProduct(null)} className={styles.btnCancel}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={styles.primaryButton} style={{ padding: "0.65rem 1.35rem", borderRadius: "8px" }}>
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete !== null && (
        <div className={styles.modalOverlay} onClick={() => !submitting && setItemToDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIconWrapper} style={{ color: "#EF4444", background: "#FEF2F2" }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>Delete Hero Product</h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
              Are you sure you want to remove <strong>{itemToDelete.name}</strong> from the homepage slider? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button disabled={submitting} className={styles.btnCancel} onClick={() => setItemToDelete(null)}>
                Cancel
              </button>
              <button disabled={submitting} className={styles.btnConfirmLogout} onClick={executeDelete}>
                {submitting ? "Deleting..." : "Delete Lamp"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
