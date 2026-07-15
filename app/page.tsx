import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/hero_bg_1784107713316.jpg" alt="Hero Background" fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className={styles.heroOverlay}></div>
        
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>Exceptional Quality • Timeless</p>
          <h1 className={styles.heroTitle}>Where Lights<br/>becomes Design</h1>
          <p className={styles.heroDesc}>
            We believe in the power of light to transform spaces into<br/>beautiful and functional environments.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.btnPrimary}>Discover More</button>
            <div className={styles.playBtnWrapper}>
              <button className={styles.btnPlay}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <span>Play Video</span>
            </div>
          </div>
        </div>

        <div className={styles.heroProductWidget}>
          <div className={styles.hpwTop}>
            <Image src="/images/lamp_classic_1784107722127.jpg" alt="Small Chandelier" width={40} height={40} className={styles.hpwTopImg} />
            <div className={styles.hpwInfo}>
              <h3>Aurora Chandelier</h3>
              <p>£800</p>
            </div>
          </div>
          <div className={styles.hpwLamps}>
            <div className={styles.hpwLampCard}>
              <Image src="/images/lamp_classic_1784107722127.jpg" alt="Lamp" width={60} height={80} style={{objectFit:"contain"}} />
            </div>
            <div className={`${styles.hpwLampCard} ${styles.activeCard}`}>
              <Image src="/images/lamp_modern_tall_1784107732736.jpg" alt="Lamp" width={70} height={110} style={{objectFit:"contain"}} />
              <div className={styles.hpwLabel}>AURORA CHANDELIER</div>
            </div>
            <div className={styles.hpwLampCard}>
              <Image src="/images/lamp_black_gold_1784107745696.jpg" alt="Lamp" width={60} height={80} style={{objectFit:"contain"}} />
            </div>
          </div>
          <div className={styles.hpwArrows}>
            <button className={styles.arrowBtn}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
            <button className={styles.arrowBtn}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
          </div>
        </div>
      </section>

      {/* LARGE STATEMENT TEXT */}
      <section className={styles.statementSection}>
        <h2 className={styles.statementText}>
          <span className={styles.statementHighlight}>Discover lighting crafted with precision and elegance. Blending<br/>timeless design,</span> exceptional quality, and warm illumination to<br/>transform every space.
        </h2>
      </section>

      {/* CATEGORIES SECTION */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.signatureText}>Lighting for every moment</p>
          <h2 className={styles.sectionTitle}>Discover Our Categories</h2>
        </div>
        <div className={styles.categoryGrid}>
          <div className={styles.categoryCard}>
            <Image src="/images/category_chandelier_1784107756268.jpg" alt="Chandelier" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={`${styles.categoryCard} ${styles.activeCategory}`}>
            <Image src="/images/category_chandelier_1784107756268.jpg" alt="Chandelier" fill style={{ objectFit: 'cover' }} />
            <div className={styles.catOverlay}>
              <span>Chandeliers</span>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <Image src="/images/category_chandelier_1784107756268.jpg" alt="Chandelier" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.categoryCard}>
            <Image src="/images/category_chandelier_1784107756268.jpg" alt="Chandelier" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
        <div className={styles.centerBtn}>
          <button className={styles.btnPrimaryRounded}>Explore all Categories</button>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className={styles.projectsSection}>
        <h2 className={styles.sectionTitle}>Our Featured Projects.</h2>
        <div className={styles.projectGrid}>
          <div className={styles.projectCard}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Lounge Project" fill style={{ objectFit: 'cover' }} />
            <div className={styles.projectLabelBox}>
              <div>
                <span className={styles.plbTitle}>View Full Project Images</span>
                <span className={styles.plbSub}>100+ Installed</span>
              </div>
              <button className={styles.iconBtnRoundWhite}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </div>
          </div>
          <div className={styles.projectCard}>
            <Image src="/images/project_lobby_1784107778993.jpg" alt="Lobby Project" fill style={{ objectFit: 'cover' }} />
            <div className={styles.projectLabelBox}>
              <div>
                <span className={styles.plbTitle}>View Full Project Images</span>
                <span className={styles.plbSub}>100+ Installed</span>
              </div>
              <button className={styles.iconBtnRoundWhite}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </div>
          </div>
        </div>
        <div className={styles.centerBtn}>
          <button className={styles.btnPrimaryRounded}>View All Projects</button>
        </div>
      </section>

      {/* NEW ARRIVALS SECTION */}
      <section className={styles.arrivalsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>NEW ARRIVALS</h2>
          <p className={styles.sectionDesc}>Discover the finest lighting designs that add warmth and elegance<br/>to your minimal modern spaces.</p>
        </div>
        <div className={styles.arrivalsGrid}>
          {/* Card 1 */}
          <div className={styles.productCardFull}>
            <div className={styles.productImgWrapper}>
              <Image src="/images/lamp_modern_tall_1784107732736.jpg" alt="Lamp" fill style={{ objectFit: 'contain' }} />
              <button className={styles.btnCartRound}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></button>
            </div>
            <div className={styles.productInfoFull}>
              <div className={styles.piLeft}>
                <h4>AURORA CHANDELIER</h4>
                <div className={styles.stockInfo}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>In Stock (8 items)</span>
                </div>
              </div>
              <div className={styles.piRight}>
                <div className={styles.stars}>★★★★★ <span>(14)</span></div>
                <div className={styles.price}>£800</div>
              </div>
            </div>
          </div>
          {/* Card 2 - Active */}
          <div className={styles.productCardFull}>
            <div className={`${styles.productImgWrapper} ${styles.activeWrapper}`}>
              <Image src="/images/lamp_classic_1784107722127.jpg" alt="Lamp" fill style={{ objectFit: 'contain' }} />
              <button className={styles.btnCartRound}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></button>
            </div>
            <div className={styles.productInfoFull}>
              <div className={styles.piLeft}>
                <h4>AURORA CHANDELIER</h4>
                <div className={styles.stockInfo}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>In Stock (8 items)</span>
                </div>
              </div>
              <div className={styles.piRight}>
                <div className={styles.stars}>★★★★★ <span>(14)</span></div>
                <div className={styles.price}>£800</div>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className={styles.productCardFull}>
            <div className={styles.productImgWrapper}>
              <Image src="/images/lamp_black_gold_1784107745696.jpg" alt="Lamp" fill style={{ objectFit: 'contain' }} />
              <button className={styles.btnCartRound}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></button>
            </div>
            <div className={styles.productInfoFull}>
              <div className={styles.piLeft}>
                <h4>AURORA CHANDELIER</h4>
                <div className={styles.stockInfo}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>In Stock (8 items)</span>
                </div>
              </div>
              <div className={styles.piRight}>
                <div className={styles.stars}>★★★★★ <span>(14)</span></div>
                <div className={styles.price}>£800</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.carouselArrows}>
          <button className={styles.outlineArrow}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button className={styles.solidArrow}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <p className={styles.sectionSub}>ABOUT US</p>
            <h2 className={styles.sectionTitle}>Illuminate Every Space With<br/>Elegance</h2>
            <p className={styles.aboutDesc}>
              From Luxurious Chandeliers To Modern Wall Lights, Every Piece<br/>Is Crafted With Precision.
            </p>
            <button className={styles.btnOutline}>Discover More About Us <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div>
                <span>Premium Craftsmanship</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
                <span>Elegant Design</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div>
                <span>Unrivaled Brilliance</span>
              </div>
            </div>
          </div>
          <div className={styles.aboutImage}>
            <Image src="/images/about_chandelier_1784107790569.jpg" alt="About Chandelier" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
        
        <div className={styles.statsBanner}>
          <div className={styles.statBox}>
            <h3>10+</h3>
            <p>Years Of Excellence</p>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statBox}>
            <h3>98%</h3>
            <p>Client Satisfaction</p>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statBox}>
            <h3>500+</h3>
            <p>Lighting Installations</p>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statBox}>
            <h3>50K</h3>
            <p>Happy Customers</p>
          </div>
        </div>
      </section>

      {/* CUSTOMER STORIES */}
      <section className={styles.storiesSection}>
        <h2 className={styles.sectionTitle} style={{textAlign: 'center', marginBottom: '3rem'}}>CUSTOMER STORIES</h2>
        <div className={styles.storiesGrid}>
          <div className={styles.storyCard}>
            <div className={styles.storyStars}>★★★★★</div>
            <p className={styles.storyText}>
              "The quality and craftsmanship are truly exceptional. This chandelier has completely transformed my living space!"
            </p>
            <div className={styles.storyAuthor}>
              <Image src="/images/avatar_woman_1784107804209.jpg" alt="Anna Clark" width={40} height={40} className={styles.avatar} />
              <div>
                <h5>Anna Clark</h5>
                <span>Interior Designer</span>
              </div>
            </div>
          </div>
          <div className={`${styles.storyCard} ${styles.activeStory}`}>
            <div className={styles.storyStars}>★★★★★</div>
            <p className={styles.storyText}>
              "The quality and craftsmanship are truly exceptional. This chandelier has completely transformed my living space!"
            </p>
            <div className={styles.storyAuthor}>
              <Image src="/images/avatar_woman_1784107804209.jpg" alt="Anna Clark" width={48} height={48} className={styles.avatar} />
              <div>
                <h5>Anna Clark</h5>
                <span>Interior Designer</span>
              </div>
            </div>
          </div>
          <div className={styles.storyCard}>
            <div className={styles.storyStars}>★★★★★</div>
            <p className={styles.storyText}>
              "The quality and craftsmanship are truly exceptional. This chandelier has completely transformed my living space!"
            </p>
            <div className={styles.storyAuthor}>
              <Image src="/images/avatar_woman_1784107804209.jpg" alt="Anna Clark" width={40} height={40} className={styles.avatar} />
              <div>
                <h5>Anna Clark</h5>
                <span>Interior Designer</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.carouselArrows} style={{marginTop: '3rem'}}>
          <button className={styles.flatArrow}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button className={styles.solidArrow}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Discover Timeless Lighting</h2>
          <p>Elevate your space with our curated collection of luxury lighting.</p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnPrimaryRounded}>Shop Now</button>
            <button className={styles.btnOutlineRounded}>Learn More</button>
          </div>
        </div>
      </section>

    </main>
  );
}
