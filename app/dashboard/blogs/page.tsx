"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./dashboardBlogs.module.css";
import { fetchBlogs, Blog } from "../../services/api";

export default function DashboardBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Published" | "Drafts" | "Featured">("All");

  useEffect(() => {
    fetchBlogs()
      .then((data) => setBlogs(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      if (activeTab === "Published" && blog.status === "Draft") return false;
      if (activeTab === "Drafts" && blog.status !== "Draft") return false;
      if (activeTab === "Featured" && !blog.is_featured) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = blog.title?.toLowerCase().includes(q);
        const matchesCategory = blog.category?.toLowerCase().includes(q);
        const matchesAuthor = blog.author?.toLowerCase().includes(q);
        return matchesTitle || matchesCategory || matchesAuthor;
      }
      return true;
    });
  }, [blogs, activeTab, search]);

  const handleDelete = (idOrSlug: string | number) => {
    setBlogs((prev) => prev.filter((b) => String(b.id || b._id || b.slug) !== String(idOrSlug)));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Blogs</h1>
          <p className={styles.subtitle}>Manage articles, insights, and content publishing.</p>
        </div>
      </div>

      <div className={styles.breadcrumb}>
        Dashboard &gt; <span>Blogs</span>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search Blogs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className={styles.tabs}>
          <button
            type="button"
            className={activeTab === "All" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("All")}
          >
            All ({blogs.length})
          </button>
          <button
            type="button"
            className={activeTab === "Published" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("Published")}
          >
            Published
          </button>
          <button
            type="button"
            className={activeTab === "Drafts" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("Drafts")}
          >
            Drafts
          </button>
          <button
            type="button"
            className={activeTab === "Featured" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("Featured")}
          >
            Featured
          </button>
        </div>

        <Link href="/admin/blogs" className={styles.btnNewBlog}>
          New Blog
          <span className={styles.plusIcon}>+</span>
        </Link>
      </div>

      <div className={styles.tableControls}>
        <div className={styles.selectAll}>
          <input type="checkbox" id="selectAll" className={styles.checkbox} checked readOnly />
          <label htmlFor="selectAll">Select All</label>
        </div>

        <div className={styles.bulkActions}>
          <button type="button" className={styles.actionBtn} onClick={() => setActiveTab(activeTab === "Published" ? "Drafts" : "Published")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Toggle Status
          </button>
          <Link href="/admin/blogs" className={styles.actionBtn} style={{ textDecoration: "none" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit in Admin
          </Link>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>Thumbnail</th>
              <th>Blog Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th align="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>Loading articles...</td>
              </tr>
            ) : filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>No articles found.</td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => {
                const bId = blog.id || blog._id || blog.slug || "";
                return (
                  <tr key={bId}>
                    <td>
                      <input type="checkbox" className={styles.checkbox} />
                    </td>
                    <td>
                      <div className={styles.thumbnail}>
                        <Image
                          src={blog.image || "/images/category_chandelier_1784107756268.jpg"}
                          alt={blog.title}
                          fill
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.blogTitleCell}>
                        <h4>{blog.title}</h4>
                        <p>{blog.read_time || "5 min read"}</p>
                      </div>
                    </td>
                    <td>
                      <span className={styles.categoryBadge}>{blog.category || "Design"}</span>
                    </td>
                    <td>
                      <strong>{blog.author || "De Luzex"}</strong>
                    </td>
                    <td>
                      <span className={styles.statusBadge}>{blog.status || "Published"}</span>
                    </td>
                    <td align="right">
                      <div className={styles.rowActions}>
                        <Link href="/admin/blogs" title="Edit Article" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <button type="button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                        </Link>
                        <button type="button" onClick={() => handleDelete(bId)} title="Delete Article">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                        <Link href={`/blogs/${blog.slug || bId}`} title="View Live Article" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <button type="button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
