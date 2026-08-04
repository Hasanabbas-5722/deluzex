import Image from "next/image";
import styles from "./page.module.css";
import { fetchCategories, fetchProducts } from "./services/api";

export default async function Home() {
  const categories = await fetchCategories();
  const products = await fetchProducts("is_new_arrival=true"); // Assuming backend supports sorting

  return (
    <main className={styles.main}>

      {/* ===================== HERO SECTION ===================== */}
      {/* Figma: 1440x1024, cream background with bg image, cursive headline left, product widget right */}
      <section className={styles.hero}>
        {/* Background image */}
        <div className={styles.heroBg}>
          <Image src="/images/hero_bg_1784107713316.jpg" alt="" fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className={styles.heroOverlay}></div>

        {/* Left content */}
        <div className={styles.heroLeft}>
          <p className={styles.heroTagline}>Celebrate Every Moment with</p>
          <h1 className={styles.heroTitle}>Where Lights become Art</h1>
          <p className={styles.heroDesc}>
            Crafted With Exceptional Materials And Refined Details To Elevate<br />
            Modern Living Spaces.
          </p>
          <button className={styles.btnExplore}>Explore Collection</button>
        </div>

        {/* Right: Product Widget (dark card + lamp showcase) */}
        <div className={styles.heroRight}>
          {/* Dark top info card */}
          {/* <div className={styles.heroInfoCard}>
            <div className={styles.heroInfoCardImg}>
              <Image
                src="/images/lamp_classic_1784107722127.jpg"
                alt="Crystal Chandelier"
                width={112}
                height={94}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
            <div className={styles.heroInfoCardText}>
              <span className={styles.heroInfoCardNum}>/01</span>
              <span className={styles.heroInfoCardName}>Crystal Chandelier</span>
              <span className={styles.heroInfoCardCount}>231</span>
            </div>
          </div> */}

          {/* 3 Lamp thumbnails */}
          <div className={styles.heroLamps}>
            <div className={styles.heroLampCard}>
              <Image
                src="/images/lamp_classic_1784107722127.jpg"
                alt="Table Lamp"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={`${styles.heroLampCard} ${styles.heroLampCardActive}`}>
              <Image
                src="/images/lamp_modern_tall_1784107732736.jpg"
                alt="Crystal Chandelier"
                fill
                style={{ objectFit: "cover" }}
              />
              {/* <div className={styles.heroLampLabel}>Crystal Chandelier</div> */}
            </div>
            <div className={styles.heroLampCard}>
              <Image
                src="/images/lamp_black_gold_1784107745696.jpg"
                alt="Gold Lamp"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Dots indicator */}
          <div className={styles.heroDots}>
            <span className={`${styles.heroDot} ${styles.heroDotActive}`}></span>
            <span className={styles.heroDot}></span>
            <span className={styles.heroDot}></span>
          </div>
        </div>
      </section>

      {/* ===================== STATEMENT SECTION ===================== */}
      {/* Figma: 1440x392, large mixed-color text, centered */}
      <section className={styles.statementSection}>
        <p className={styles.statementText}>
          <span className={styles.statementGold}>Discover lighting crafted with precision and elegance, blending timeless design,</span>
          {" "}exceptional quality, and warm illumination to transform every space.
        </p>
      </section>

      {/* ===================== CATEGORIES SECTION ===================== */}
      {/* Figma: 1440x636, golden subtitle, 4 category cards, Explore button */}
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesHeader}>
          <p className={styles.categoriesTagline}>lighting for every interior</p>
          <h2 className={styles.categoriesTitle}>Discover Our Categories</h2>
        </div>
        <div className={styles.categoryGrid}>
          {categories.length > 0 ? (
            categories.slice(0, 4).map((cat, i: number) => (
              <div key={cat.id || i} className={`${styles.catCard} ${i === 1 ? styles.catCardActive : ''}`}>
                <Image src={cat.image_url || "/images/category_chandelier_1784107756268.jpg"} alt={cat.name || "Category"} fill style={{ objectFit: "cover" }} />
                {i === 1 && (
                  <div className={styles.catCardLabel}>
                    <span>{cat.name}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              {/* Fallback layout if no API data */}
              <div className={styles.catCard}>
                <Image src="/images/category_chandelier_1784107756268.jpg" alt="Category" fill style={{ objectFit: "cover" }} />
              </div>
              <div className={`${styles.catCard} ${styles.catCardActive}`}>
                <Image src="/images/category_chandelier_1784107756268.jpg" alt="Chandeliers" fill style={{ objectFit: "cover" }} />
                <div className={styles.catCardLabel}>
                  <span>Chandeliers</span>
                </div>
              </div>
              <div className={styles.catCard}>
                <Image src="/images/category_chandelier_1784107756268.jpg" alt="Category" fill style={{ objectFit: "cover" }} />
              </div>
              <div className={styles.catCard}>
                <Image src="/images/category_chandelier_1784107756268.jpg" alt="Category" fill style={{ objectFit: "cover" }} />
              </div>
            </>
          )}
        </div>
        <button className={styles.btnExploreCat}>Explore Categories</button>
      </section>

      {/* ===================== NEW ARRIVALS SECTION ===================== */}
      {/* Figma: 1440x1099, large spaced title, 3 product cards with + btn, nav arrows */}
      <section className={styles.newArrivalsSection}>
        <div className={styles.newArrivalsHeader}>
          <h2 className={styles.newArrivalsTitle}>NEW ARRIVALS</h2>
          <p className={styles.newArrivalsDesc}>
            Discover Our Newest Lighting Designs, Crafted With Premium Materials<br />
            And Timeless Elegance For Modern Interiors.
          </p>
        </div>
        <div className={styles.newArrivalsGrid}>
          {products.length > 0 ? (
            products.slice(0, 3).map((product, i: number) => {
              const isCenter = i === 1; // Assuming 3 items, the middle one is featured
              return (
                <div key={product._id || i} className={`${styles.productCard} ${isCenter ? styles.productCardFeatured : ''}`}>
                  <div className={`${styles.productCardImg} ${isCenter ? styles.productCardImgActive : ''}`}>
                    <Image src={product.product_main_image || "/images/lamp_modern_tall_1784107732736.jpg"} alt={product.product_title} fill style={{ objectFit: "cover" }} />
                    <button className={styles.productAddBtn}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                  <div className={styles.productCardInfo}>
                    <div className={styles.productCardLeft}>
                      <h4 className={styles.productCardName}>{product.product_title || "Product Name"}</h4>
                      <div className={styles.productCardRating}>
                        <span className={styles.productStar}>★</span>
                        <span className={styles.productRatingText}>{product.product_rating || "4.8"} ( 300 Reviews )</span>
                      </div>
                    </div>
                    <div className={styles.productCardRight}>
                      <span className={styles.productCardPrice}>₹{product.product_price}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>No products found.</p>
          )}
        </div>
        <div className={styles.arrowGroup}>
          <button className={styles.arrowOutline}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className={styles.arrowSolid}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      {/* ===================== FEATURED PROJECTS SECTION ===================== */}
      {/* Figma: 1440x885, "Our Featured Projects." title, 2 large project cards, Explore button */}
      <section className={styles.projectsSection}>
        <h2 className={styles.projectsTitle}>Our Featured Projects.</h2>
        <div className={styles.projectGrid}>
          <div className={styles.projectCard}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Luxury Villa Residence" fill style={{ objectFit: "cover", borderRadius: "20px" }} />
            <div className={styles.projectCardLabel}>
              <div className={styles.projectCardLabelText}>
                <span className={styles.projectCardLabelTitle}>Luxury Villa Residence</span>
                <span className={styles.projectCardLabelSub}>Ahmedabad</span>
              </div>
              <button className={styles.projectArrowBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className={styles.projectCard}>
            <Image src="/images/project_lobby_1784107778993.jpg" alt="Luxury Villa Residence" fill style={{ objectFit: "cover", borderRadius: "20px" }} />
            <div className={styles.projectCardLabel}>
              <div className={styles.projectCardLabelText}>
                <span className={styles.projectCardLabelTitle}>Luxury Villa Residence</span>
                <span className={styles.projectCardLabelSub}>Ahmedabad</span>
              </div>
              <button className={styles.projectArrowBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <button className={styles.btnExploreProjects}>Explore All Projects</button>
      </section>

      {/* ===================== ABOUT US SECTION ===================== */}
      {/* Figma: 1440x1076, left text + right image, stats row with images at bottom */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutInner}>
          <div className={styles.aboutLeft}>
            <p className={styles.aboutLabel}>ABOUT US</p>
            <h2 className={styles.aboutTitle}>Illuminate Every Space With<br />Elegance</h2>
            <div className={styles.aboutDivider}></div>
            <p className={styles.aboutDesc}>
              From Statement Chandeliers To Designer Wall Lights, Every Piece<br />
              Is Crafted To Inspire.
            </p>
            <button className={styles.btnDiscoverStory}>
              Discover Our Story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <div className={styles.aboutFeatures}>
              <div className={styles.aboutFeatureItem}>
                <div className={styles.aboutFeatureIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="6 3 18 3 22 9 12 22 2 9 6 3"></polygon>
                  </svg>
                </div>
                <span>Premium Craftmanship</span>
              </div>
              <div className={styles.aboutFeatureDivider}></div>
              <div className={styles.aboutFeatureItem}>
                <div className={styles.aboutFeatureIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <span>Bespoke Design</span>
              </div>
              <div className={styles.aboutFeatureDivider}></div>
              <div className={styles.aboutFeatureItem}>
                <div className={styles.aboutFeatureIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Handcrafted Excellence</span>
              </div>
            </div>
          </div>
          <div className={styles.aboutRight}>
            <Image
              src="/images/about_chandelier_1784107790569.jpg"
              alt="Chandelier"
              fill
              style={{ objectFit: "cover", borderRadius: "12px" }}
            />
          </div>
        </div>

        {/* Stats Row - 4 image cards with overlaid text */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Years of excellence" fill style={{ objectFit: "cover", borderRadius: "8px" }} />
            <div className={styles.statOverlay}>
              <span className={styles.statNum}>10+</span>
              <span className={styles.statLabel}>Years Of Excellence</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Image src="/images/about_chandelier_1784107790569.jpg" alt="Client satisfaction" fill style={{ objectFit: "cover", borderRadius: "8px" }} />
            <div className={styles.statOverlay}>
              <span className={styles.statNum}>98%</span>
              <span className={styles.statLabel}>Client Satisfaction</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Image src="/images/project_lobby_1784107778993.jpg" alt="Lighting installations" fill style={{ objectFit: "cover", borderRadius: "8px" }} />
            <div className={styles.statOverlay}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>Lighting Installations</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Happy customers" fill style={{ objectFit: "cover", borderRadius: "8px" }} />
            <div className={styles.statOverlay}>
              <span className={styles.statNum}>50K+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CUSTOMER STORIES SECTION ===================== */}
      {/* Figma: 1440x856, large Libre Caslon title, 3 testimonial cards, nav arrows */}
      <section className={styles.storiesSection}>
        <h2 className={styles.storiesTitle}>CUSTOMER STORIES</h2>
        <div className={styles.storiesGrid}>
          <div className={styles.storyCard}>
            <div className={styles.storyStars}>★★★★☆</div>
            <p className={styles.storyText}>
              The quality and craftsmanship are truly exceptional. The chandelier we chose became the highlight of our home.
            </p>
            <div className={styles.storyAuthor}>
              <Image src="/images/avatar_woman_1784107804209.jpg" alt="Anna Clark" width={56} height={56} className={styles.storyAvatar} />
              <div className={styles.storyAuthorInfo}>
                <h5>Anna Clark</h5>
                <span>Interior Designer</span>
              </div>
            </div>
          </div>
          <div className={`${styles.storyCard} ${styles.storyCardActive}`}>
            <div className={styles.storyStars}>★★★★☆</div>
            <p className={styles.storyText}>
              The quality and craftsmanship are truly exceptional. The chandelier we chose became the highlight of our home.
            </p>
            <div className={styles.storyAuthor}>
              <Image src="/images/avatar_woman_1784107804209.jpg" alt="Anna Clark" width={56} height={56} className={styles.storyAvatar} />
              <div className={styles.storyAuthorInfo}>
                <h5>Anna Clark</h5>
                <span>Interior Designer</span>
              </div>
            </div>
          </div>
          <div className={styles.storyCard}>
            <div className={styles.storyStars}>★★★★☆</div>
            <p className={styles.storyText}>
              The quality and craftsmanship are truly exceptional. The chandelier we chose became the highlight of our home.
            </p>
            <div className={styles.storyAuthor}>
              <Image src="/images/avatar_woman_1784107804209.jpg" alt="Anna Clark" width={56} height={56} className={styles.storyAvatar} />
              <div className={styles.storyAuthorInfo}>
                <h5>Anna Clark</h5>
                <span>Interior Designer</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.arrowGroup}>
          <button className={styles.arrowOutline}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className={styles.arrowSolid}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      {/* Figma: 1440x518, cream textured bg, big serif title, 2 buttons */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Discover Timeless Lighting</h2>
          <p className={styles.ctaDesc}>
            Elevate Your Interiors With Premium Lighting Collections Crafted To Bring Warmth,<br />
            Elegance, And Sophistication To Every Space.
          </p>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaBtnPrimary}>Shop Lighting</button>
            <button className={styles.ctaBtnOutline}>Learn more</button>
          </div>
        </div>
      </section>

    </main>
  );
}
