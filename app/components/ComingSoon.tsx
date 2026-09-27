import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ComingSoon.module.css";

interface ComingSoonProps {
  is404?: boolean;
}

export default function ComingSoon({ is404 = false }: ComingSoonProps) {
  // Exact 4 connected social media links with full black (#000000) monochrome vector icons
  const socialIcons = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/deluzex",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" aria-hidden="true">
          <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/deluzexlighting",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/deluzex_lighting",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5"/>
          <circle cx="12" cy="12" r="4.2"/>
          <circle cx="17.5" cy="6.5" r="1" fill="#000000" stroke="none"/>
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@deluzex",
      svg: (
        <svg width="22" height="20" viewBox="0 0 24 24" fill="#000000" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.pageWrapper} data-coming-soon="true">
      {/* Background Layers */}
      <div className={`${styles.bgLayer} ${styles.bgDesktop}`} aria-hidden="true" />
      <div className={`${styles.bgLayer} ${styles.bgMobile}`} aria-hidden="true" />
      <div className={styles.mobileOverlay} aria-hidden="true" />

      {/* Top Left Black Pill Logo Badge */}
      <Link href="/" className={styles.logoBadge} aria-label="Deluzex Lighting Home">
        <Image
          src="/images/logos/De Luzex_white_logo.svg"
          alt="de luzex"
          width={148}
          height={34}
          priority
          className={styles.logoImg}
        />
      </Link>

      {/* Desktop Top Right Social Icons */}
      <nav className={styles.socialDesktop} aria-label="Social Media Links">
        {socialIcons.map((icon) => (
          <a
            key={icon.name}
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label={icon.name}
          >
            {icon.svg}
          </a>
        ))}
      </nav>

      {/* Main Hero Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentBlock}>
          {/* Cursive Subtitle */}
          <p className={styles.scriptSubtitle}>
            something beautiful is on the way
          </p>

          {/* Heading */}
          <h1 className={styles.mainTitle}>
            We’re Coming Soon
          </h1>

          {/* Descriptions */}
          <div className={styles.descriptionWrapper}>
            <p className={styles.descText}>
              Find Beautiful Lights For Your Home, Office, Hotel, And Other Spaces. Explore Chandeliers, Wall Lights, Ceiling Lights, Lamps, And More.
            </p>
            <p className={styles.descText}>
              And For Architects &amp; Lighting Designers Something Special Is Coming Your Way Too. Stay Tuned...
            </p>
          </div>

          {/* Feature Badges Row */}
          <div className={styles.featuresRow}>
            {/* 1. Modern Designs (nest_eco_leaf) */}
            <div className={styles.featureItem}>
              <div className={styles.iconCircle} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 -960 960 960" fill="#5F4013" aria-hidden="true">
                  <path d="M480-160q-56 0-105.5-17.5T284-227l-56 55q-11 11-28 11t-28-11q-11-11-11-28t11-28l55-55q-32-41-49.5-91T160-480q0-134 93-227t227-93h320v320q0 134-93 227t-227 93Zm0-80q100 0 170-70t70-170v-240H480q-100 0-170 70t-70 170q0 39 12 74.5t33 64.5l207-207q11-11 28-11t28 11q12 12 12 28.5T548-491L341-284q29 21 64.5 32.5T480-240Zm0-240Z" />
                </svg>
              </div>
              <span className={styles.featureLabel}>Modern Designs</span>
            </div>

            <div className={styles.dividerLine} aria-hidden="true" />

            {/* 2. Premium Quality (diamond) */}
            <div className={styles.featureItem}>
              <div className={styles.iconCircle} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 -960 960 960" fill="#5F4013" aria-hidden="true">
                  <path d="M480-120 80-600l120-240h560l120 240-400 480Zm-95-520h190l-60-120h-70l-60 120Zm55 347v-267H218l222 267Zm80 0 222-267H520v267Zm144-347h106l-60-120H604l60 120Zm-474 0h106l60-120H250l-60 120Z" />
                </svg>
              </div>
              <span className={styles.featureLabel}>Premium Quality</span>
            </div>

            <div className={styles.dividerLine} aria-hidden="true" />

            {/* 3. For Everspace (approval_delegation) */}
            <div className={styles.featureItem}>
              <div className={styles.iconCircle} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 -960 960 960" fill="#5F4013" aria-hidden="true">
                  <path d="M517-518 347-688l57-56 113 113 227-226 56 56-283 283ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" />
                </svg>
              </div>
              <span className={styles.featureLabel}>For Everspace</span>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile & Tablet Bottom Social Icons */}
      <nav
        className={styles.socialMobile}
        aria-label="Mobile Social Media Links"
        data-coming-soon-social="true"
      >
        {socialIcons.map((icon) => (
          <a
            key={icon.name}
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label={icon.name}
          >
            {icon.svg}
          </a>
        ))}
      </nav>
    </div>
  );
}
