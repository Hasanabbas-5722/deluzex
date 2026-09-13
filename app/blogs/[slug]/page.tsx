"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./blogDetail.module.css";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogBySlugOrId, fetchBlogs, Blog } from "../../services/api";

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const [blogData, allBlogs] = await Promise.all([
          fetchBlogBySlugOrId(slug),
          fetchBlogs(),
        ]);
        setBlog(blogData);
        // Filter out the current blog and pick 3 related ones
        const others = allBlogs.filter(
          (b) =>
            (b.slug && b.slug !== slug) &&
            (b.id !== slug && b._id !== slug)
        );
        setRelatedBlogs(others.slice(0, 3));
      } catch (err) {
        console.error("Failed to load blog detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  function formatDate(isoOrStr?: string) {
    if (!isoOrStr) return "June 02, 2024";
    try {
      const d = new Date(isoOrStr);
      if (isNaN(d.getTime())) return isoOrStr;
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return "June 02, 2024";
    }
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <div style={{ textAlign: "center", padding: "10rem 2rem", color: "#666" }}>
          Loading luxury editorial article...
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className={styles.main}>
        <div style={{ textAlign: "center", padding: "10rem 2rem", color: "#666" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Article Not Found</h2>
          <p style={{ marginBottom: "2rem" }}>
            The requested blog article may have been moved or removed.
          </p>
          <Link href="/blogs" className={styles.btnPrimaryRounded} style={{ textDecoration: "none" }}>
            Back to All Blogs
          </Link>
        </div>
      </main>
    );
  }

  // Split content by double linebreaks into paragraphs
  const paragraphs = blog.content
    ? blog.content.split(/\n\n+/).filter((p) => p.trim().length > 0)
    : [];

  const coverImg = blog.image || "/images/hero_bg_1784107713316.jpg";

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src={coverImg}
            alt={blog.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>{blog.category || "DESIGN INSPIRATION"}</p>
          <h1 className={styles.heroTitle}>{blog.title}</h1>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className={styles.articleSection}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}></div>
          <div>
            <h5 className={styles.authorName}>{blog.author || "De Luzex"}</h5>
            <p className={styles.authorDate}>
              {formatDate(blog.created_at)} • {blog.read_time || "5 min read"}
            </p>
          </div>
        </div>

        {blog.excerpt && (
          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              fontStyle: "italic",
              color: "var(--color-primary, #C49A45)",
              marginBottom: "2.5rem",
              borderLeft: "3px solid var(--color-primary, #C49A45)",
              paddingLeft: "1.25rem",
              maxWidth: "700px",
            }}
          >
            {blog.excerpt}
          </p>
        )}

        <article className={styles.articleBody}>
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <div key={i} style={{ marginBottom: "1.5rem" }}>
                <p style={{ lineHeight: 1.8, fontSize: "1.05rem" }}>{p}</p>
                {i === 1 && coverImg && (
                  <div className={styles.articleImage} style={{ margin: "2.5rem 0" }}>
                    <Image
                      src={coverImg}
                      alt={blog.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ lineHeight: 1.8 }}>{blog.content}</p>
          )}
        </article>

        {/* SHARE SECTION */}
        <div className={styles.shareSection}>
          <span className={styles.shareText}>SHARE THIS ARTICLE</span>
          <div className={styles.shareIcons}>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-5h2V9.5C11 8.12 11.75 7 13.5 7h1.5v2h-1c-.55 0-.75.26-.75.75V11h2.2l-.3 2h-1.9v5z" />
              </svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.16-3.38c-1.05 0-1.62.59-1.9 1.07v-.92h-2.67v8.53h2.78v-4.24c0-.23.02-.45.09-.61.18-.46.6-.93 1.3-.93.92 0 1.28.7 1.28 1.73v4.07h2.78M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.53H5.5v8.53h2.77z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* READ MORE SECTION */}
      {relatedBlogs.length > 0 && (
        <section className={styles.readMoreSection}>
          <h2 className={styles.readMoreTitle}>Read more</h2>
          <div className={styles.blogGrid}>
            {relatedBlogs.map((rel) => {
              const relSlug = rel.slug || rel.id || rel._id;
              const relImg = rel.image || "/images/category_chandelier_1784107756268.jpg";

              return (
                <Link
                  href={`/blogs/${relSlug}`}
                  key={rel.id || rel._id || rel.slug}
                  className={styles.blogCard}
                >
                  <div className={styles.blogImageSmall}>
                    <Image
                      src={relImg}
                      alt={rel.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.blogContentSmall}>
                    <p className={styles.blogCategory}>{rel.category || "Design & Inspiration"}</p>
                    <h3 className={styles.blogTitleSmall}>{rel.title}</h3>
                    <div className={styles.blogFooter}>
                      <span>
                        {formatDate(rel.created_at)} • {rel.read_time || "5 min read"}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Custom Lighting For
            <br />
            Every Project
          </h2>
          <p>
            We Create Custom Chandeliers And Unique Fixtures That Perfectly
            <br />
            Match The Style Of Your Space.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.btnPrimaryRounded} style={{ textDecoration: "none" }}>
              Book A Consultation
            </Link>
            <Link href="/projects" className={styles.btnOutlineRounded} style={{ textDecoration: "none" }}>
              View Our Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
