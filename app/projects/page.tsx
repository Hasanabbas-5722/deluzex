"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./projects.module.css";
import Image from "next/image";
import Link from "next/link";
import { fetchProjects, Project } from "../services/api";

const CATEGORIES = [
  "All Projects",
  "Residential",
  "Commercial",
  "Hospitality",
  "Public Spaces",
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(6);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleLimit(6);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (activeCategory === "All Projects") return true;
      return project.category === activeCategory;
    });
  }, [projects, activeCategory]);

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/project_lobby_1784107778993.jpg"
            alt="Projects Hero"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>OUR WORK</p>
          <h1 className={styles.heroTitle}>Featured Projects</h1>
          <p className={styles.heroDesc}>
            Discover how De Luzex lighting transforms spaces across the globe, from intimate residences to grand commercial venues.
          </p>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className={styles.filterSection}>
        <div className={styles.filters}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`${styles.filterBtn} ${isActive ? styles.activeFilter : ""}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* EXPANDED PROJECT SPOTLIGHT (WHEN SELECTED) */}
      {selectedProject && (
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto 3rem",
            padding: "2rem",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-primary, #C49A45)",
                }}
              >
                {selectedProject.category} • {selectedProject.location || "Global"}
              </span>
              <h2 style={{ fontSize: "1.8rem", margin: "0.4rem 0 0", fontFamily: "var(--font-libre), serif" }}>
                {selectedProject.title}
              </h2>
              {selectedProject.subtitle && (
                <p style={{ color: "#666", fontSize: "0.95rem", margin: "0.25rem 0 0" }}>
                  {selectedProject.subtitle}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "320px",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Image
                src={selectedProject.image_url || "/images/project_lounge_1784107767735.jpg"}
                alt={selectedProject.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                Architectural Overview
              </h4>
              <p style={{ color: "#444", lineHeight: 1.8, fontSize: "0.95rem" }}>
                {selectedProject.description ||
                  "A bespoke architectural lighting commission integrating tailored fixtures to elevate the spatial experience and reflect luxury design principles."}
              </p>
              <div style={{ marginTop: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                {selectedProject.installations_count && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "#f8fafc",
                      padding: "0.6rem 1.2rem",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--color-primary, #C49A45)",
                    }}
                  >
                    <span>✨ {selectedProject.installations_count}</span>
                  </div>
                )}
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 1.25rem",
                    background: "var(--color-primary, #C49A45)",
                    color: "#ffffff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Inquire About This Commission →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS GRID */}
      <section className={styles.projectsSection}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#666" }}>
            Loading architectural portfolio...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#666" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              No projects found in category &quot;{activeCategory}&quot;.
            </p>
            <button
              onClick={() => handleCategoryChange("All Projects")}
              className={styles.btnPrimaryRounded}
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className={styles.projectGrid}>
            {filteredProjects.slice(0, visibleLimit).map((project) => {
              const coverImg =
                project.image_url || "/images/project_lounge_1784107767735.jpg";

              return (
                <div
                  key={project.id || project._id}
                  className={styles.projectCard}
                  onClick={() => setSelectedProject(project)}
                >
                  <Image
                    src={coverImg}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className={styles.projectLabelBox}>
                    <div>
                      <span className={styles.plbTitle}>{project.title}</span>
                      <span className={styles.plbSub}>
                        {project.location || "Global"} •{" "}
                        {project.installations_count || "View Details >"}
                      </span>
                    </div>
                    <span
                      className={styles.iconBtnRoundWhite}
                      aria-label="View Project Details"
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
                </div>
              );
            })}
          </div>
        )}

        {filteredProjects.length > visibleLimit && (
          <div className={styles.centerBtn}>
            <button
              className={styles.btnPrimaryRounded}
              type="button"
              onClick={() => setVisibleLimit((prev) => prev + 6)}
            >
              Load More ({filteredProjects.length - visibleLimit} Remaining)
            </button>
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Start Your Project</h2>
          <p>
            Let our experts help you select the perfect lighting for your next design endeavor.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              href="/contact"
              className={styles.btnPrimaryRounded}
              style={{ textDecoration: "none" }}
            >
              Book A Consultation
            </Link>
            <Link
              href="/contact"
              className={styles.btnOutlineRounded}
              style={{ textDecoration: "none" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
