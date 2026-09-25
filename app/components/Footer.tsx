"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";
import { subscribeNewsletter, fetchSiteContent } from "../services/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState<any>(null);

  React.useEffect(() => {
    fetchSiteContent("site_settings").then(setSettings).catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await subscribeNewsletter(cleanEmail);
      if (res.success) {
        setStatus("success");
        setMessage(res.message);
        setEmail("");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(res.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Top border golden line */}
      <div className={styles.footerTopBorder}></div>

      <div className={styles.footerInner}>
        {/* Left column */}
        <div className={styles.footerLeft}>
          <p className={styles.footerLeftLabel}>Available On</p>
          <div className={styles.footerLogos}>
            {/* Amazon logo */}
            <a
              href={settings?.available_on?.amazon || "https://www.amazon.in"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLogoItem}
              aria-label="Shop Deluzex on Amazon"
              title="Shop Deluzex on Amazon"
            >
              <Image
                src="/images/logos/amazon.svg"
                alt="Amazon"
                width={48}
                height={48}
                className={styles.footerLogoImg}
              />
            </a>

            {/* Flipkart logo */}
            <a
              href={settings?.available_on?.flipkart || "https://www.flipkart.com"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLogoItem}
              aria-label="Shop Deluzex on Flipkart"
              title="Shop Deluzex on Flipkart"
            >
              <Image
                src="/images/logos/flipkart.svg"
                alt="Flipkart"
                width={48}
                height={48}
                className={styles.footerLogoImg}
              />
            </a>
          </div>

          <p className={styles.footerDesc}>Luxury lighting solutions, thoughtfully crafted<br />for modern interiors.</p>


          {/* Social icons */}
          <div className={styles.socialIcons}>
            <a
              href={
                settings?.social_links?.whatsapp
                  ? (settings.social_links.whatsapp.startsWith("http")
                      ? settings.social_links.whatsapp
                      : `https://wa.me/${settings.social_links.whatsapp.replace(/\D/g, "")}`)
                  : (settings?.available_on?.whatsapp
                      ? (settings.available_on.whatsapp.startsWith("http")
                          ? settings.available_on.whatsapp
                          : `https://wa.me/${settings.available_on.whatsapp.replace(/\D/g, "")}`)
                      : "https://wa.me/918511682031")
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="WhatsApp"
            >
              <Image src="/images/logos/whatsapp_icon.svg" alt="WhatsApp" width={20} height={20} />
            </a>
            <a href={settings?.social_links?.linkedin || "https://linkedin.com/"} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
              <Image src="/images/logos/linkdln_icon.svg" alt="LinkedIn" width={20} height={20} />
            </a>
            <a href={settings?.social_links?.twitter || "https://twitter.com/"} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
              <Image src="/images/logos/twitter_icon.svg" alt="Twitter" width={20} height={20} />
            </a>
            <a href={settings?.social_links?.facebook || "https://facebook.com/"} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <Image src="/images/logos/facebook_icon.svg" alt="Facebook" width={20} height={20} />
            </a>
            <a href={settings?.social_links?.instagram || "https://instagram.com/"} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <Image src="/images/logos/instagram_icon.svg" alt="Instagram" width={20} height={20} />
            </a>
            <a href={settings?.social_links?.youtube || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube" title="YouTube">
              <Image src="/images/logos/Youtube_Icon.svg" alt="YouTube" width={20} height={20} />
            </a>
            <a href={settings?.social_links?.pinterest || "https://pinterest.com"} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Pinterest" title="Pinterest">
              <Image src="/images/logos/Pintrest_Icon.svg" alt="Pinterest" width={20} height={20} />
            </a>
          </div>

          <hr className={styles.footerDivider} />
          <p className={styles.copyright}>{settings?.footer_copyright || "© 2026 DeLuzex. All rights reserved."}</p>
        </div>

        {/* Right column */}
        <div className={styles.footerRight}>
          {/* Newsletter */}
          <div className={styles.newsletterBlock}>
            <h4 className={styles.newsletterTitle}>Be Updated With Us</h4>
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <div
                className={`${styles.newsletterInput} ${
                  status === "error" ? styles.inputError : ""
                } ${status === "success" ? styles.inputSuccess : ""}`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  required
                />
                <button
                  type="submit"
                  className={styles.newsletterBtn}
                  disabled={status === "loading"}
                  aria-label="Subscribe to newsletter"
                >
                  {status === "loading" ? (
                    <span className={styles.spinner} />
                  ) : status === "success" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
              {message && (
                <p className={status === "success" ? styles.newsletterSuccess : styles.newsletterError}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Footer links */}
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h5 className={styles.linkGroupTitle}>Explore</h5>
              <Link href="/shop?category=Chandeliers">Chandeliers</Link>
              <Link href="/shop?category=Pendant%20Lights">Pendant Lights</Link>
              <Link href="/shop?category=Wall%20Lights">Wall Lights</Link>
              <Link href="/shop?category=Table%20Lamps">Table Lamps</Link>
              <Link href="/shop?sort=newest">New Arrivals</Link>
              <Link href="/shop?sort=popular">Best Sellers</Link>
            </div>
            <div className={styles.linkGroup}>
              <h5 className={styles.linkGroupTitle}>Company</h5>
              <Link href="/about">About Us</Link>
              <Link href="/projects">Our Projects</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/shipping">Shipping &amp; Delivery</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

