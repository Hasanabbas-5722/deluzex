"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./comingsoon.module.css";
import { subscribeNewsletter, fetchSiteContent } from "./services/api";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSiteContent("site_settings")
      .then(setSettings)
      .catch(() => {});
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
        setMessage(res.message || "Thank you! We'll notify you as soon as we launch.");
        setEmail("");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 6000);
      } else {
        setStatus("error");
        setMessage(res.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const whatsappUrl = settings?.social_links?.whatsapp
    ? (settings.social_links.whatsapp.startsWith("http")
        ? settings.social_links.whatsapp
        : `https://wa.me/${settings.social_links.whatsapp.replace(/\D/g, "")}`)
    : (settings?.available_on?.whatsapp
        ? (settings.available_on.whatsapp.startsWith("http")
            ? settings.available_on.whatsapp
            : `https://wa.me/${settings.available_on.whatsapp.replace(/\D/g, "")}`)
        : "https://wa.me/918511682031");

  const linkedinUrl = settings?.social_links?.linkedin || "https://linkedin.com/";
  const twitterUrl = settings?.social_links?.twitter || "https://twitter.com/";
  const facebookUrl = settings?.social_links?.facebook || "https://facebook.com/";
  const instagramUrl = settings?.social_links?.instagram || "https://instagram.com/";

  return (
    <div className={styles.comingSoonWrapper}>
      {/* Background Image across full screen */}
      <Image
        src="/images/logos/comingsoon_background image.svg"
        alt="De Luzex Coming Soon Background"
        fill
        priority
        className={styles.bgImage}
        sizes="100vw"
      />

      {/* Foreground Overlay Content */}
      <div className={styles.overlayContent}>
        {/* Top Header Bar */}
        <header className={styles.headerBar}>
          <div className={styles.logoWrapper}>
            <Image
              src="/images/logos/de_luzex_black.svg"
              alt="de luzex"
              width={145}
              height={38}
              priority
              className={styles.logoImg}
            />
          </div>

          <div className={styles.socialIcons}>
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <Image
                src="/images/logos/whatsapp_icon.svg"
                alt="WhatsApp"
                width={18}
                height={18}
                className={styles.socialIconImg}
              />
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Image
                src="/images/logos/linkdln_icon.svg"
                alt="LinkedIn"
                width={18}
                height={18}
                className={styles.socialIconImg}
              />
            </a>

            {/* Classic Twitter Bird Icon */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Twitter"
              title="Twitter"
            >
              <Image
                src="/images/logos/twitter_icon.svg"
                alt="Twitter"
                width={19}
                height={16}
                className={styles.socialIconImg}
              />
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Facebook"
              title="Facebook"
            >
              <Image
                src="/images/logos/facebook_icon.svg"
                alt="Facebook"
                width={18}
                height={18}
                className={styles.socialIconImg}
              />
            </a>

            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
              title="Instagram"
            >
              <Image
                src="/images/logos/instagram_icon.svg"
                alt="Instagram"
                width={18}
                height={18}
                className={styles.socialIconImg}
              />
            </a>
          </div>
        </header>

        {/* Left Side Content Area */}
        <div className={styles.mainContainer}>
          <p className={styles.cursiveSubtitle}>something beautiful is on the way</p>
          <h1 className={styles.title}>
            We’re<br />Coming Soon
          </h1>
          <p className={styles.description}>
            A New Home For Modern Lighting, Crafted To Brighten Your Everyday Spaces.
          </p>

          {/* Email Subscription Form Pill */}
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubscribe} className={styles.emailForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={styles.emailInput}
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className={styles.submitBtn}
              >
                {status === "loading" ? "Submitting..." : "Notify Me"}
              </button>
            </form>
            {message && (
              <p className={status === "success" ? styles.formSuccessMsg : styles.formErrorMsg}>
                {message}
              </p>
            )}
          </div>

          {/* Feature Badges */}
          <div className={styles.featuresGrid}>
            {/* Feature 1: Modern Designs (Leaf Icon) */}
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 9a9 9 0 0 1-10 9Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <p className={styles.featureLabel}>Modern Designs</p>
            </div>

            {/* Feature 2: Premium Quality (Diamond Icon) */}
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="6 3 18 3 22 9 12 22 2 9 6 3"></polygon>
                </svg>
              </div>
              <p className={styles.featureLabel}>Premium Quality</p>
            </div>

            {/* Feature 3: For Everspace (Hand & Check Icon) */}
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p className={styles.featureLabel}>For Everspace</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
