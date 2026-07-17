"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./newBlog.module.css";

export default function NewBlog() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Create New Blog</h1>
          <p className={styles.subtitle}>Write and publish inspiring articles about lighting and interior design</p>
        </div>
      </div>

      <div className={styles.breadcrumb}>
        Dashboard &gt; <Link href="/dashboard/blogs">Blogs</Link> &gt; <span>Add new blogs</span>
      </div>

      {/* Cover Image */}
      <div className={styles.section}>
        <div className={styles.uploadArea}>
          <div className={styles.uploadBox}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p>Drag & Drop an image here</p>
            <span className={styles.uploadMeta}>PNG, SVG up to 2 MB</span>
            <button className={styles.btnChoose}>Choose Image</button>
          </div>
          <div className={styles.imagePreview}>
            <Image src="/images/hero_bg_1784107713316.jpg" alt="Preview" fill style={{ objectFit: "cover", borderRadius: "8px" }} />
          </div>
        </div>
      </div>

      {/* Blog Information */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Blog Information</h2>
        <div className={styles.formRow2}>
          <div className={styles.formGroup}>
            <label>Blog Title</label>
            <input type="text" placeholder="Enter your name" />
          </div>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select>
              <option>Design Inspiration</option>
              <option>Buying Guide</option>
              <option>Lighting Tips</option>
            </select>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Short Description</label>
          <textarea placeholder="I enjoy decorating spaces with elegant lighting and modern interior designs." rows={3}></textarea>
        </div>
      </div>

      {/* Blog Content */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Blog Content</h2>
        <div className={styles.editor}>
          <div className={styles.editorToolbar}>
            <button>Paragraph <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
            <div className={styles.divider}></div>
            <button><strong>B</strong></button>
            <button><em>I</em></button>
            <button><u>U</u></button>
            <div className={styles.divider}></div>
            <button><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button>
            <div className={styles.divider}></div>
            <button><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg></button>
            <div className={styles.divider}></div>
            <button><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></button>
            <button><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
            <button>“</button>
            <div style={{flex: 1}}></div>
            <button><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"></path><path d="M21 17v-6h-6"></path><path d="M21 3l-8 8"></path><path d="M3 21l8-8"></path></svg></button>
          </div>
          <div className={styles.editorContent}>
            <textarea placeholder="Start Writing your blog content here .." rows={6}></textarea>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>SEO Settings ( Optional )</h2>
        <div className={styles.formRow3}>
          <div className={styles.formGroup}>
            <label>Meta Title</label>
            <input type="text" placeholder="Enter Meta Title" />
          </div>
          <div className={styles.formGroup}>
            <label>Meta Description</label>
            <input type="text" placeholder="Enter Meta Description" />
          </div>
          <div className={styles.formGroup}>
            <label>Keywords</label>
            <input type="text" placeholder="Enter keyword seperate by commas" />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Tags</h2>
        <div className={styles.tagsContainer}>
          <span className={styles.tag}>Chandelier</span>
          <span className={styles.tag}>Chandelier</span>
          <span className={styles.tag}>Chandelier</span>
          <span className={styles.tag}>Chandelier</span>
          <span className={styles.tag}>Chandelier</span>
          <button className={styles.btnAddTag}>+ Add Tag</button>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnDraft}>Save Draft</button>
        <button className={styles.btnPublish}>Publish Blog</button>
      </div>
    </div>
  );
}
