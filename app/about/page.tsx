import styles from "./about.module.css";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/project_lobby_1784107778993.jpg" alt="Hero Background" fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Crafting Light For<br/>Extraordinary Interiors</h1>
          <p className={styles.heroDesc}>
            We Create Timeless Lighting Pieces That Blend Artistry, Craftsmanship, And<br/>Innovation To Elevate Every Space.
          </p>
          <button className={styles.btnOutlineHero}>Play Video <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>
        </div>
      </section>

      {/* PASSION SECTION */}
      <section className={styles.passionSection}>
        <div className={styles.passionContent}>
          <div className={styles.passionText}>
            <p className={styles.sectionSub}>OUR STORY</p>
            <h2 className={styles.sectionTitle}>A Passion For Light.<br/>A Commitment To Excellence.</h2>
            <p className={styles.passionDesc}>
              De Luzex Was Born Out Of A Shared Passion For Transformative Design. We Believe That Light Is More Than Just A Functional Element; It Is A Medium For Artistic Expression.
              <br/><br/>
              Every Chandelier, Wall Light, And Pendant We Create Is Handcrafted With Precision By Master Artisans Who Share Our Vision For Bringing Elegance And Brilliance Into Every Space.
            </p>
            
            <div className={styles.passionIcons}>
              <div className={styles.iconItem}>
                <div className={styles.iconCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <span>Bespoke Design</span>
              </div>
              <div className={styles.iconItem}>
                <div className={styles.iconCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <span>Unrivaled Excellence</span>
              </div>
              <div className={styles.iconItem}>
                <div className={styles.iconCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>
                <span>Luxury Finishes</span>
              </div>
            </div>
          </div>
          <div className={styles.passionImage}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Passion for Light" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className={styles.statsBanner}>
        <div className={styles.statBox}>
          <h3>10+</h3>
          <p>Years Of Excellence</p>
        </div>
        <div className={styles.statBox}>
          <h3>98%</h3>
          <p>Client Satisfaction</p>
        </div>
        <div className={styles.statBox}>
          <h3>500+</h3>
          <p>Lighting Installations</p>
        </div>
        <div className={styles.statBox}>
          <h3>50K</h3>
          <p>Happy Customers</p>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className={styles.chooseSection}>
        <div className={styles.chooseGrid}>
          <div className={styles.chooseImage}>
            <Image src="/images/about_chandelier_1784107790569.jpg" alt="Why Choose Us" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.chooseText}>
            <p className={styles.sectionSub}>WHY CHOOSE US</p>
            <h2 className={styles.sectionTitle}>Why client Choose Us</h2>
            <p className={styles.chooseDesc}>
              Our belief is in a shared passion for transformative design. We see light as a medium for artistic expression, not just a functional element.
            </p>
            
            <div className={styles.accordion}>
              <div className={styles.accordionItem}>
                <h4>Timeless Design Excellence</h4>
                <p>We blend traditional craftsmanship with contemporary aesthetics to create fixtures that remain elegant for years to come.</p>
              </div>
              <div className={styles.accordionItem}>
                <h4>Expert Artisanal Craftsmanship</h4>
                <p>Every piece is meticulously handcrafted by skilled artisans, ensuring unparalleled attention to detail and unmatched quality.</p>
              </div>
              <div className={styles.accordionItem}>
                <h4>Premium Materials</h4>
                <p>We source only the finest materials—from high-grade crystals to premium metals—to guarantee durability and a luxurious finish.</p>
              </div>
              <div className={styles.accordionItem}>
                <h4>Bespoke Lighting Solutions</h4>
                <p>From grand hotel lobbies to intimate dining rooms, we offer personalized designs tailored to perfectly complement your unique space.</p>
              </div>
            </div>
            
            <button className={styles.btnPrimaryRounded}>Book A Consultation</button>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className={styles.projectsSection}>
        <h2 className={styles.sectionTitleCenter}>Our Featured Projects.</h2>
        <div className={styles.projectGrid}>
          <div className={styles.projectCard}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Luxury Villa Residence" fill style={{ objectFit: 'cover' }} />
            <div className={styles.projectLabelBox}>
              <div>
                <span className={styles.plbTitle}>Luxury Villa Residence</span>
                <span className={styles.plbSub}>View Details &gt;</span>
              </div>
              <button className={styles.iconBtnRoundWhite}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </div>
          </div>
          <div className={styles.projectCard}>
            <Image src="/images/project_lobby_1784107778993.jpg" alt="Luxury Villa Residence" fill style={{ objectFit: 'cover' }} />
            <div className={styles.projectLabelBox}>
              <div>
                <span className={styles.plbTitle}>Luxury Villa Residence</span>
                <span className={styles.plbSub}>View Details &gt;</span>
              </div>
              <button className={styles.iconBtnRoundWhite}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </div>
          </div>
        </div>
        <div className={styles.centerBtn}>
          <button className={styles.btnPrimaryRounded}>Explore All Projects</button>
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
