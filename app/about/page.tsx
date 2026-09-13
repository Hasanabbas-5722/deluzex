import styles from "./about.module.css";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { fetchSiteContent } from "../services/api";

export default async function About() {
  const cmsAbout = await fetchSiteContent("about");

  const heroTitle = cmsAbout?.hero?.title || "Crafting Light For\nExtraordinary Interiors";
  const storyTitle = cmsAbout?.story?.title || "A Passion For Light.\nA Commitment To Excellence.";
  const ctaTitle = cmsAbout?.cta?.title || "Custom Lighting For\nEvery Project";

  const defaultFeatures = [
    { icon: "bespoke", title: "Bespoke Design" },
    { icon: "star", title: "Unrivaled Excellence" },
    { icon: "layers", title: "Luxury Finishes" },
  ];

  const features = cmsAbout?.story?.features || defaultFeatures;

  const defaultStats = [
    { number: "10+", label: "Years Of Excellence" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "500+", label: "Lighting Installations" },
    { number: "50K", label: "Happy Customers" },
  ];

  const stats = cmsAbout?.stats || defaultStats;

  const defaultPillars = [
    {
      title: "Timeless Design Excellence",
      description: "We blend traditional craftsmanship with contemporary aesthetics to create fixtures that remain elegant for years to come.",
    },
    {
      title: "Expert Artisanal Craftsmanship",
      description: "Every piece is meticulously handcrafted by skilled artisans, ensuring unparalleled attention to detail and unmatched quality.",
    },
    {
      title: "Premium Materials",
      description: "We source only the finest materials—from high-grade crystals to premium metals—to guarantee durability and a luxurious finish.",
    },
    {
      title: "Bespoke Lighting Solutions",
      description: "From grand hotel lobbies to intimate dining rooms, we offer personalized designs tailored to perfectly complement your unique space.",
    },
  ];

  const pillars = cmsAbout?.why_choose_us?.items || defaultPillars;

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src={cmsAbout?.hero?.bg_image || "/images/project_lobby_1784107778993.jpg"}
            alt="Hero Background"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {heroTitle.split("\n").map((line: string, i: number) => (
              <React.Fragment key={i}>
                {line}
                {i === 0 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className={styles.heroDesc}>
            {cmsAbout?.hero?.description || (
              <>
                We Create Timeless Lighting Pieces That Blend Artistry, Craftsmanship, And
                <br />
                Innovation To Elevate Every Space.
              </>
            )}
          </p>
          <Link href={cmsAbout?.hero?.btn_link || "/projects"} className={styles.btnOutlineHero}>
            {cmsAbout?.hero?.btn_text || "Explore Portfolio"}{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </Link>
        </div>
      </section>

      {/* PASSION SECTION */}
      <section className={styles.passionSection}>
        <div className={styles.passionContent}>
          <div className={styles.passionText}>
            <p className={styles.sectionSub}>{cmsAbout?.story?.subtitle || "OUR STORY"}</p>
            <h2 className={styles.sectionTitle}>
              {storyTitle.split("\n").map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p className={styles.passionDesc}>
              {cmsAbout?.story?.description || (
                <>
                  De Luzex Was Born Out Of A Shared Passion For Transformative Design. We Believe That Light Is More Than Just A Functional Element; It Is A Medium For Artistic Expression.
                  <br />
                  <br />
                  Every Chandelier, Wall Light, And Pendant We Create Is Handcrafted With Precision By Master Artisans Who Share Our Vision For Bringing Elegance And Brilliance Into Every Space.
                </>
              )}
            </p>

            <div className={styles.passionIcons}>
              {features.map((f: any, idx: number) => (
                <div key={idx} className={styles.iconItem}>
                  <div className={styles.iconCircle}>
                    {idx === 0 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    ) : idx === 1 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                    )}
                  </div>
                  <span>{f.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.passionImage}>
            <Image
              src={cmsAbout?.story?.image || "/images/project_lounge_1784107767735.jpg"}
              alt="Passion for Light"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className={styles.statsBanner}>
        {stats.map((st: any, idx: number) => (
          <div key={idx} className={styles.statBox}>
            <h3>{st.number}</h3>
            <p>{st.label}</p>
          </div>
        ))}
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className={styles.chooseSection}>
        <div className={styles.chooseGrid}>
          <div className={styles.chooseImage}>
            <Image
              src={cmsAbout?.why_choose_us?.image || "/images/about_chandelier_1784107790569.jpg"}
              alt="Why Choose Us"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.chooseText}>
            <p className={styles.sectionSub}>{cmsAbout?.why_choose_us?.subtitle || "WHY CHOOSE US"}</p>
            <h2 className={styles.sectionTitle}>{cmsAbout?.why_choose_us?.title || "Why client Choose Us"}</h2>
            <p className={styles.chooseDesc}>
              {cmsAbout?.why_choose_us?.description ||
                "Our belief is in a shared passion for transformative design. We see light as a medium for artistic expression, not just a functional element."}
            </p>

            <div className={styles.accordion}>
              {pillars.map((p: any, idx: number) => (
                <div key={idx} className={styles.accordionItem}>
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>

            <Link href={cmsAbout?.why_choose_us?.btn_link || "/contact"} className={styles.btnPrimaryRounded}>
              {cmsAbout?.why_choose_us?.btn_text || "Book A Consultation"}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className={styles.projectsSection}>
        <h2 className={styles.sectionTitleCenter}>Our Featured Projects.</h2>
        <div className={styles.projectGrid}>
          <Link href="/projects" className={styles.projectCard}>
            <Image
              src="/images/project_lounge_1784107767735.jpg"
              alt="Luxury Villa Residence"
              fill
              style={{ objectFit: "cover" }}
            />
            <div className={styles.projectLabelBox}>
              <div>
                <span className={styles.plbTitle}>Luxury Villa Residence</span>
                <span className={styles.plbSub}>View Details &gt;</span>
              </div>
              <span
                className={styles.iconBtnRoundWhite}
                aria-label="View Project"
              >
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
              </span>
            </div>
          </Link>
          <Link href="/projects" className={styles.projectCard}>
            <Image
              src="/images/project_lobby_1784107778993.jpg"
              alt="The Grand Hotel Lobby"
              fill
              style={{ objectFit: "cover" }}
            />
            <div className={styles.projectLabelBox}>
              <div>
                <span className={styles.plbTitle}>The Grand Hotel Lobby</span>
                <span className={styles.plbSub}>View Details &gt;</span>
              </div>
              <span
                className={styles.iconBtnRoundWhite}
                aria-label="View Project"
              >
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
              </span>
            </div>
          </Link>
        </div>
        <div className={styles.centerBtn}>
          <Link href="/projects" className={styles.btnPrimaryRounded}>
            Explore All Projects
          </Link>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            {ctaTitle.split("\n").map((line: string, i: number) => (
              <React.Fragment key={i}>
                {line}
                {i === 0 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p>
            {cmsAbout?.cta?.description ||
              "We Create Custom Chandeliers And Unique Fixtures That Perfectly Match The Style Of Your Space."}
          </p>
          <div className={styles.ctaButtons}>
            <Link href={cmsAbout?.cta?.btn_primary_link || "/contact"} className={styles.btnPrimaryRounded}>
              {cmsAbout?.cta?.btn_primary_text || "Book A Consultation"}
            </Link>
            <Link href={cmsAbout?.cta?.btn_secondary_link || "/projects"} className={styles.btnOutlineRounded}>
              {cmsAbout?.cta?.btn_secondary_text || "View Our Projects"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
