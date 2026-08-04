import styles from "./blogDetail.module.css";
import Image from "next/image";
import Link from "next/link";

export default function BlogDetail() {
  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/hero_bg_1784107713316.jpg" alt="Hero Background" fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>DESIGN INSPIRATION</p>
          <h1 className={styles.heroTitle}>Top Tips for Chandelier<br/>Placement in Any Size Home</h1>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className={styles.articleSection}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}></div>
          <div>
            <h5 className={styles.authorName}>De Luzex</h5>
            <p className={styles.authorDate}>June 02, 2024 • 5 min read</p>
          </div>
        </div>

        <article className={styles.articleBody}>
          <h3 className={styles.contentSubtitle}>1. Size Matters</h3>
          <p>
            One of the biggest mistakes people make when choosing a chandelier is selecting the wrong size. A chandelier that is too small will look lost in a large room, while one that is too large can overwhelm the space and make it feel cramped.
          </p>
          <p>
            To find the right size, add the dimensions of the room together in feet and convert that number to inches. For example, if your room is 12x14 feet, the diameter of your chandelier should be around 26 inches (12 + 14 = 26). This is a general rule of thumb, but it&apos;s a good starting point.
          </p>

          <div className={styles.articleImage}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Chandelier in Lounge" fill style={{ objectFit: 'cover' }} />
          </div>

          <p>
            In dining rooms, the chandelier should be about 12 inches narrower than the dining table and should hang approximately 30 to 36 inches above the table surface. This ensures that it provides adequate lighting without obstructing the view across the table or feeling too imposing.
          </p>

          <h3 className={styles.contentSubtitle}>2. Consider The Room</h3>
          <p>
            The style and size of the room will also dictate the type of chandelier you choose. A grand, multi-tiered crystal chandelier might be perfect for a formal dining room with high ceilings, but it could look out of place in a cozy, rustic kitchen.
          </p>
          
          <div className={styles.articleImage}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Chandelier in Lounge" fill style={{ objectFit: 'cover' }} />
          </div>

          <p>
            For living rooms, consider the ceiling height. If you have standard 8-foot ceilings, look for a chandelier that isn&apos;t too tall or one that can be flush-mounted. If you have vaulted ceilings, a large, dramatic fixture can draw the eye upward and emphasize the height of the room.
          </p>

          <h3 className={styles.contentSubtitle}>3. Layer Your Lighting</h3>
          <p>
            A chandelier should rarely be the only source of light in a room. To create a well-lit and inviting space, you need to layer your lighting. This means combining ambient lighting (like your chandelier) with task lighting (like reading lamps or under-cabinet lights) and accent lighting (like wall sconces or picture lights).
          </p>
          
          <div className={styles.articleImage}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Chandelier in Lounge" fill style={{ objectFit: 'cover' }} />
          </div>
          
          <p>
            In a dining room, you might pair a central chandelier with wall sconces for a soft, flattering glow. In a bedroom, a chandelier can provide overall illumination, while bedside lamps offer focused light for reading. By layering your lighting, you create a more flexible and dynamic environment.
          </p>
        </article>

        <div className={styles.shareSection}>
          <span className={styles.shareText}>SHARE THIS ARTICLE</span>
          <div className={styles.shareIcons}>
            <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-5h2V9.5C11 8.12 11.75 7 13.5 7h1.5v2h-1c-.55 0-.75.26-.75.75V11h2.2l-.3 2h-1.9v5z"/></svg></a>
            <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg></a>
            <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.16-3.38c-1.05 0-1.62.59-1.9 1.07v-.92h-2.67v8.53h2.78v-4.24c0-.23.02-.45.09-.61.18-.46.6-.93 1.3-.93.92 0 1.28.7 1.28 1.73v4.07h2.78M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.53H5.5v8.53h2.77z"/></svg></a>
            <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></a>
          </div>
        </div>
      </section>

      {/* READ MORE SECTION */}
      <section className={styles.readMoreSection}>
        <h2 className={styles.readMoreTitle}>Read more</h2>
        <div className={styles.blogGrid}>
          {/* Related Blog 1 */}
          <Link href="/blogs/1" className={styles.blogCard}>
            <div className={styles.blogImageSmall}>
              <Image src="/images/category_chandelier_1784107756268.jpg" alt="Blog Image" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.blogContentSmall}>
              <p className={styles.blogCategory}>Design & Inspiration</p>
              <h3 className={styles.blogTitleSmall}>How To Choose The Perfect Chandelier For Your Home</h3>
              <div className={styles.blogFooter}>
                <span>June 02, 2024 • 5 min read</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </Link>
          {/* Related Blog 2 */}
          <Link href="/blogs/2" className={styles.blogCard}>
            <div className={styles.blogImageSmall}>
              <Image src="/images/about_chandelier_1784107790569.jpg" alt="Blog Image" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.blogContentSmall}>
              <p className={styles.blogCategory}>Design & Inspiration</p>
              <h3 className={styles.blogTitleSmall}>How To Choose The Perfect Chandelier For Your Home</h3>
              <div className={styles.blogFooter}>
                <span>June 02, 2024 • 5 min read</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </Link>
          {/* Related Blog 3 */}
          <Link href="/blogs/3" className={styles.blogCard}>
            <div className={styles.blogImageSmall}>
              <Image src="/images/category_chandelier_1784107756268.jpg" alt="Blog Image" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.blogContentSmall}>
              <p className={styles.blogCategory}>Design & Inspiration</p>
              <h3 className={styles.blogTitleSmall}>How To Choose The Perfect Chandelier For Your Home</h3>
              <div className={styles.blogFooter}>
                <span>June 02, 2024 • 5 min read</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Custom Lighting For<br/>Every Project</h2>
          <p>We Create Custom Chandeliers And Unique Fixtures That Perfectly<br/>Match The Style Of Your Space.</p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnPrimaryRounded}>Book A Consultation</button>
            <button className={styles.btnOutlineRounded}>View Our Projects</button>
          </div>
        </div>
      </section>
    </main>
  );
}
