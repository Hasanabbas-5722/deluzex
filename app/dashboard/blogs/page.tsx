"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./dashboardBlogs.module.css";

export default function DashboardBlogs() {
  const blogs = Array(4).fill({
    title: "How Choose The Perfect Chandelier For Your Home",
    time: "5 min read",
    category: "Buying Guide",
    author: "De Luzex Team",
    status: "Published",
    date: "Jun 12 2024",
    image: "/images/category_chandelier_1784107756268.jpg",
  });

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
          <input type="text" placeholder="Search Blogs" />
        </div>
        
        <div className={styles.tabs}>
          <button className={styles.tabActive}>All (24)</button>
          <button className={styles.tab}>Published</button>
          <button className={styles.tab}>Drafts</button>
          <button className={styles.tab}>Featured</button>
        </div>

        <Link href="/dashboard/blogs/new" className={styles.btnNewBlog}>
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
          <button className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Status
          </button>
          <button className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit
          </button>
          <button className={styles.actionBtnDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Delete
          </button>
        </div>

        <div className={styles.viewToggle}>
          <button className={styles.viewBtnActive}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
          <button className={styles.viewBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </button>
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
              <th>Published</th>
              <th align="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, idx) => (
              <tr key={idx}>
                <td>
                  <input type="checkbox" className={styles.checkbox} />
                </td>
                <td>
                  <div className={styles.thumbnail}>
                    <Image src={blog.image} alt={blog.title} fill style={{ objectFit: "cover", borderRadius: "8px" }} />
                  </div>
                </td>
                <td>
                  <div className={styles.blogTitleCell}>
                    <h4>{blog.title}</h4>
                    <p>{blog.time}</p>
                  </div>
                </td>
                <td>
                  <span className={styles.categoryBadge}>{blog.category}</span>
                </td>
                <td>
                  <strong>{blog.author}</strong>
                </td>
                <td>
                  <span className={styles.statusBadge}>{blog.status}</span>
                </td>
                <td>
                  <strong>{blog.date}</strong>
                </td>
                <td align="right">
                  <div className={styles.rowActions}>
                    <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
