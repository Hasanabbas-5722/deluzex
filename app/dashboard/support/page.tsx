"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./support.module.css";

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const topics = [
    { title: "Track My Order", desc: "Check the latest status of your order.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { title: "Wishlist & Cart", desc: "Get help with your saved items and cart.", icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" },
    { title: "Payments & Refunds", desc: "Learn about payment methods and refund process.", icon: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22" },
    { title: "Shipping & Delivery", desc: "Delivery timelines and shipping information.", icon: "M5 9l2-2h10l2 2 M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9 M9 22V12h6v10" },
    { title: "Return & Replacement", desc: "Return eligibility and replacement policy.", icon: "M21 2v6h-6 M3 12a9 9 0 0 1 15-6.7L21 8 M3 22v-6h6 M21 12a9 9 0 0 1-15 6.7L3 16" },
    { title: "Contact Support", desc: "Talk to our customer support team.", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }
  ];

  const faqs = [
    { q: "What is the lead time for custom orders?", a: "ListingOptimization.ai is an AI-powered platform that automates the entire process of analyzing, planning, and generating Amazon listing creatives. It replaces the slow, expensive manual workflow of hiring designers and photographers with instant, data-driven creative generation." },
    { q: "What is the lead time for custom orders?", a: "Typically, custom orders take 4-6 weeks to manufacture and deliver depending on the complexity of the piece." },
    { q: "What is the lead time for custom orders?", a: "All our products come with a standard 1-year warranty covering manufacturing defects." },
    { q: "What is the lead time for custom orders?", a: "Yes, we ship internationally. Shipping costs are calculated at checkout based on your location." },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Support & Help</h1>
        <p className={styles.subtitle}>Need assistance? We are here to help with your orders, products, and account.</p>
      </div>

      <div className={styles.topicsGrid}>
        {topics.map((topic, i) => (
          <div key={i} className={styles.topicCard}>
            <div className={styles.topicIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={topic.icon}></path>
              </svg>
            </div>
            <h3>{topic.title}</h3>
            <p>{topic.desc}</p>
            <div className={styles.arrowIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.faqSection}>
        <h2 className={styles.faqTitle}>Frequently asked questions</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ""}`}>
              <button className={styles.faqHeader} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className={styles.faqToggleIcon}>{openFaq === i ? "—" : "+"}</span>
                {faq.q}
              </button>
              {openFaq === i && (
                <div className={styles.faqBody}>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contactBanner}>
        <div className={styles.bannerImage}>
          <Image src="/images/hero_bg_1784107713316.jpg" alt="Support" fill style={{ objectFit: "cover" }} />
        </div>
        <div className={styles.bannerContent}>
          <h3>Still Need Help</h3>
          <p>Our team is happy to assist you with any questions or concerns you may have.</p>
          <button className={styles.btnContact}>Contact Us</button>
        </div>
      </div>
    </div>
  );
}
