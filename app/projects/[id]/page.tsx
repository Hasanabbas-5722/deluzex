"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProjectById, Project } from "../../services/api";
import styles from "./projectDetail.module.css";

const FALLBACK_PROJECT_IMAGES = [
  "/images/project_lounge_1784107767735.jpg",
  "/images/category_chandelier_1784107756268.jpg",
  "/images/about_chandelier_1784107790569.jpg",
  "/images/project_lobby_1784107778993.jpg",
  "/images/hero_bg_1784107713316.jpg",
];

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProjectById(id);
        setProject(data);
      } catch (err) {
        console.error("Failed to load project details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main className={styles.main}>
        <div style={{ padding: "160px 24px 100px", textAlign: "center", color: "#666" }}>
          <p style={{ fontSize: "1.1rem" }}>Loading architectural showcase...</p>
        </div>
      </main>
    );
  }

  const currentProject = project || {
    title: "Luxury Villa Residence.",
    category: "HOMES & VILLAS",
    subtitle: "Residential | 2024",
    description:
      "Custom Lighting Design Crafted To Enhance Elegance, Comfort, And A Natural Warmth Throughout The Residence.",
    location: "London, UK",
    year: "2024",
    scope: "Architectural Lighting Design",
    installations_count: "18 Bespoke Fixtures",
    image_url: "/images/project_lounge_1784107767735.jpg",
    gallery_images: FALLBACK_PROJECT_IMAGES,
  };

  // Compile unique gallery images
  const rawGallery = [
    ...(currentProject.gallery_images || []),
    ...(currentProject.image_url ? [currentProject.image_url] : []),
  ];
  const uniqueGallery = Array.from(new Set(rawGallery.filter(Boolean)));
  const displayGallery = uniqueGallery.length > 0 ? uniqueGallery : FALLBACK_PROJECT_IMAGES;

  const bgImage = currentProject.image_url || displayGallery[0] || "/images/project_lounge_1784107767735.jpg";

  return (
    <main className={styles.main}>
      {/* ===================== HERO SECTION ===================== */}
      <section className={styles.hero}>
        {/* Full-bleed Background */}
        <div className={styles.heroBg}>
          <Image
            src={bgImage}
            alt={currentProject.title}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.heroOverlay} />

        {/* Back Link */}
        <Link href="/projects" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>All Projects</span>
        </Link>

        {/* Floating Glassmorphism Hero Card (Figma Design) */}
        <div className={styles.heroCard}>
          <p className={styles.cardCategory}>
            {currentProject.category ? currentProject.category.toUpperCase() : "HOMES & VILLAS"}
          </p>

          <h1 className={styles.cardTitle}>{currentProject.title}</h1>

          <div className={styles.cardDivider} />

          <p className={styles.cardSubtitle}>
            {currentProject.subtitle || `${currentProject.category || "Residential"} | ${currentProject.year || currentProject.location || "2024"}`}
          </p>

          <p className={styles.cardDescription}>
            {currentProject.description ||
              "Custom Lighting Design Crafted To Enhance Elegance, Comfort, And A Natural Warmth Throughout The Residence."}
          </p>

          {/* 3-column Metadata Bar */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Year</span>
              <span className={styles.metaValue}>{currentProject.year || currentProject.location || "2024"}</span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Project Type</span>
              <span className={styles.metaValue}>{currentProject.category || "Residential"}</span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Scope</span>
              <span className={styles.metaValue}>
                {currentProject.scope || currentProject.installations_count || "Architectural Lighting Design"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== GALLERY SECTION ===================== */}
      {/* 2-column grid in Laptop view, 1-column stacked in Mobile view */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryHeader}>
          <p className={styles.galleryTagline}>Architectural Showcase</p>
          <h2 className={styles.galleryTitle}>Spatial Lighting Details</h2>
        </div>

        <div className={styles.galleryGrid}>
          {displayGallery.map((imgSrc, idx) => (
            <div
              key={idx}
              className={styles.galleryCard}
              onClick={() => setActiveLightboxImg(imgSrc)}
            >
              <Image
                src={imgSrc}
                alt={`${currentProject.title} detail ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.galleryImg}
              />
              <div className={styles.galleryOverlay}>
                <span className={styles.zoomIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== INQUIRY CTA ===================== */}
      <section className={styles.inquirySection}>
        <div className={styles.inquiryInner}>
          <h2 className={styles.inquiryTitle}>Bespoke Illumination for Your Space</h2>
          <p className={styles.inquiryDesc}>
            Collaborate with our design studio to create custom handcrafted chandeliers, architectural
            fixtures, and ambient living systems for your upcoming residence or venue.
          </p>
          <Link href="/contact" className={styles.inquiryBtn}>
            <span>Inquire About A Project</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeLightboxImg && (
        <div className={styles.lightboxModal} onClick={() => setActiveLightboxImg(null)}>
          <button
            className={styles.lightboxClose}
            onClick={() => setActiveLightboxImg(null)}
            aria-label="Close image preview"
          >
            ✕
          </button>
          <div className={styles.lightboxImgWrapper} onClick={(e) => e.stopPropagation()}>
            <Image
              src={activeLightboxImg}
              alt="Expanded view"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
