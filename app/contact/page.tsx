"use client";

import styles from "./contact.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { submitContactForm, fetchSiteContent } from "../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Luxury Residential Villa",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSiteContent("site_settings").then(setSettings).catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const fullMessage = formData.projectType
      ? `[Project Scope: ${formData.projectType}]\n\n${formData.message}`
      : formData.message;

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: fullMessage,
      });
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "Luxury Residential Villa",
        message: "",
      });
    } catch (error: unknown) {
      setStatus("error");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage("Something went wrong. Please try again or contact us directly.");
      }
    }
  };

  const phoneNum = settings?.phone || "+91 85116 82031";
  const emailAddr = settings?.email || "info@deluzexlighting.com";
  const addressText = settings?.address || "Chhapi, Gujarat, India";

  return (
    <main className={styles.main}>
      {/* HEADER & EDITORIAL HERO */}
      <section className={styles.headerSection}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>Studio Concierge & Inquiries</span>
        </nav>
        <p className={styles.cursiveTagline}>Private Consultations & Inquiries</p>
        <h1 className={styles.heroTitle}>Let&apos;s Illuminate Your Vision</h1>
        <p className={styles.heroSubtitle}>
          Whether you are designing a bespoke private residence, engineering an architectural
          hospitality project, or curating custom luminaires, our studio designers and engineers
          are ready to bring your vision to life.
        </p>
      </section>

      {/* 2-COLUMN MAIN CONTENT GRID */}
      <section className={styles.contentGrid}>
        {/* LEFT COLUMN: PILLARS & CONCIERGE CHANNELS */}
        <div className={styles.leftCol}>
          {/* Architectural Service Pillars */}
          <div className={styles.pillarContainer}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <h3 className={styles.pillarTitle}>Residential & Villa Architecture</h3>
                <p className={styles.pillarDesc}>
                  Tailored luminaire proportions, customized drop cables, and coordinated finishes for luxury estates.
                </p>
              </div>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <h3 className={styles.pillarTitle}>Hospitality & Commercial Installations</h3>
                <p className={styles.pillarDesc}>
                  High-output ambient fixtures, photometric planning, and volume procurement for hotels & retail.
                </p>
              </div>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h3 className={styles.pillarTitle}>Custom Engineering & Finishes</h3>
                <p className={styles.pillarDesc}>
                  Brass hand-patinas, architectural smoked glass, and tailored CCT dimming specifications.
                </p>
              </div>
            </div>
          </div>

          {/* Concierge Channels Card */}
          <div className={styles.conciergeCard}>
            <div className={styles.conciergeHeader}>
              <h2 className={styles.conciergeTitle}>Direct Studio Access</h2>
              <div className={styles.statusIndicator}>
                <span className={styles.liveDot} />
                <span>Consultants Online</span>
              </div>
            </div>

            <div className={styles.infoList}>
              <a
                href={`tel:${phoneNum.replace(/\s+/g, "")}`}
                className={styles.infoItem}
                title="Call Deluzex Concierge"
              >
                <div className={styles.infoIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className={styles.infoLabel}>Telephone Concierge</div>
                  <div className={styles.infoValue}>{phoneNum}</div>
                </div>
              </a>

              <a
                href={`mailto:${emailAddr}`}
                className={styles.infoItem}
                title="Email Deluzex Studio"
              >
                <div className={styles.infoIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className={styles.infoLabel}>Private Client Email</div>
                  <div className={styles.infoValue}>{emailAddr}</div>
                </div>
              </a>

              <div className={styles.infoItem}>
                <div className={styles.infoIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className={styles.infoLabel}>Atelier & Showroom</div>
                  <div className={styles.infoValue}>{addressText}</div>
                </div>
              </div>
            </div>

            {/* 24h Response Guarantee */}
            <div className={styles.trustBadge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Our design specialists review architectural blueprints and respond within 24 hours.</span>
            </div>

            {/* Social Presence */}
            <div className={styles.socialSection}>
              <span className={styles.socialLabel}>Connect Directly:</span>
              <div className={styles.socialIcons}>
                <a
                  href={`https://wa.me/${phoneNum.replace(/\D/g, "") || "918511682031"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Chat on WhatsApp"
                  title="Instant WhatsApp Consultation"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>

                <a
                  href={settings?.social_links?.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Visit LinkedIn"
                  title="Deluzex on LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z" />
                  </svg>
                </a>

                <a
                  href={settings?.social_links?.twitter || "https://twitter.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Visit Twitter"
                  title="Deluzex on Twitter / X"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>

                <a
                  href={settings?.social_links?.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Visit Facebook"
                  title="Deluzex on Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LUXURY INQUIRY FORM CARD */}
        <div className={styles.rightCol}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Initiate an Inquiry</h2>
            <p className={styles.formSubtitle}>
              Share your project scope, room blueprints, or custom luminaire requests.
            </p>
          </div>

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Full Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Eleanor Vance"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Email Address <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. eleanor@studio.com"
                  className={styles.formInput}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Telephone / WhatsApp</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 or International prefix"
                  className={styles.formInput}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Project Scope</label>
                <select
                  name="projectType"
                  className={styles.formSelect}
                  value={formData.projectType}
                  onChange={handleChange}
                >
                  <option value="Luxury Residential Villa">Luxury Residential Villa</option>
                  <option value="Hospitality / Hotel / Dining">Hospitality / Hotel / Dining</option>
                  <option value="Commercial & Workspace">Commercial & Workspace</option>
                  <option value="Custom Luminaire Engineering">Custom Luminaire Engineering</option>
                  <option value="Architect & Trade Partnership">Architect & Trade Partnership</option>
                  <option value="General Studio Inquiry">General Studio Inquiry</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Project Details & Requirements <span className={styles.required}>*</span>
              </label>
              <textarea
                name="message"
                placeholder="Describe your design concept, desired illumination mood, ceiling heights, or preferred fixture styles..."
                className={styles.formTextarea}
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {status === "error" && (
              <div className={styles.alertError}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {status === "success" && (
              <div className={styles.alertSuccess}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Thank you. Your inquiry has been forwarded to our senior design team. We will respond within 24 hours.</span>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === "loading"}
            >
              <span>{status === "loading" ? "Dispatching Inquiry..." : "Submit Inquiry"}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
