import styles from "./blogs.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Blogs() {
  const blogs = [
    { id: 1, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/category_chandelier_1784107756268.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read", isFeatured: true },
    { id: 2, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/about_chandelier_1784107790569.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read" },
    { id: 3, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/category_chandelier_1784107756268.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read" },
    { id: 4, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/category_chandelier_1784107756268.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read" },
    { id: 5, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/lamp_classic_1784107722127.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read" },
    { id: 6, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/project_lounge_1784107767735.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read" },
    { id: 7, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/category_chandelier_1784107756268.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read" },
    { id: 8, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/category_chandelier_1784107756268.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read" },
    { id: 9, title: "How To Choose The Perfect Chandelier For Your Home", image: "/images/category_chandelier_1784107756268.jpg", category: "Design & Inspiration", author: "De Luzex", date: "June 02, 2024", readTime: "5 min read" },
  ];

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/hero_bg_1784107713316.jpg" alt="Hero Background" fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>INSIGHTS & INSPIRATION</p>
          <h1 className={styles.heroTitle}>The Art Of Lighting</h1>
          <p className={styles.heroDesc}>
            Explore Design Trends, Lighting Inspiration, And Expert Insights For<br/>Creating Extraordinary Interiors.
          </p>
          <button className={styles.btnOutlineHero}>Read Article</button>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className={styles.filterSection}>
        <div className={styles.filters}>
          <button className={`${styles.filterBtn} ${styles.activeFilter}`}>All Blogs</button>
          <button className={styles.filterBtn}>Architectural Blogs</button>
          <button className={styles.filterBtn}>Products Blogs</button>
          <button className={styles.filterBtn}>Projects</button>
        </div>
        <div className={styles.searchAndAdd}>
          <div className={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search articles ..." />
          </div>
          <button className={styles.btnAddBlog}>+ Add Your Blog</button>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className={styles.blogGridSection}>
        <div className={styles.blogGrid}>
          {blogs.map((blog) => (
            <Link href={`/blogs/${blog.id}`} key={blog.id} className={styles.blogCard}>
              <div className={styles.blogImage}>
                <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover' }} />
                {blog.isFeatured && (
                  <div className={styles.authorBadge}>
                    <div className={styles.authorAvatar}></div>
                    <span>{blog.author}</span>
                  </div>
                )}
              </div>
              <div className={styles.blogContent}>
                <p className={styles.blogCategory}>{blog.category}</p>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
                <div className={styles.blogFooter}>
                  <span>{blog.date} • {blog.readTime}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.centerBtn}>
          <button className={styles.btnPrimaryRounded}>Show More</button>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Crafting Light For<br/>Extraordinary Interiors</h2>
          <p>We Create Timeless Lighting Pieces That Blend Artistry, Craftsmanship, And<br/>Innovation To Elevate Every Space.</p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnPrimaryRounded}>Book A Consultation</button>
            <button className={styles.btnOutlineRounded}>Shop</button>
          </div>
        </div>
      </section>
    </main>
  );
}
