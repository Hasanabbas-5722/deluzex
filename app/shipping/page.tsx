import React from "react";
import Link from "next/link";
import styles from "../contact/contact.module.css";

export const metadata = {
  title: "Shipping & Delivery — DeLuzex Lighting",
  description: "Learn about DeLuzex luxury lighting delivery policies, pan-India timelines, and white-glove installation services.",
};

export default function ShippingPage() {
  return (
    <main className={styles.main}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> <span>&gt;</span> <span>Shipping &amp; Delivery</span>
      </div>

      <section style={{ maxWidth: "900px", margin: "40px auto 80px", padding: "0 24px" }}>
        <p className={styles.signatureText} style={{ textAlign: "center" }}>Delivery &amp; Logistics</p>
        <h1 className={styles.title} style={{ textAlign: "center", marginBottom: "32px" }}>Shipping &amp; Delivery</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", color: "#444", lineHeight: "1.8", fontSize: "15px" }}>
          <div style={{ background: "#F5EFE6", padding: "28px 32px", borderRadius: "12px", border: "1px solid #E8D8C0" }}>
            <h3 style={{ fontFamily: "var(--font-libre), serif", fontSize: "22px", color: "#2B2B2B", margin: "0 0 12px" }}>
              Pan-India Safe Transit Guarantee
            </h3>
            <p style={{ margin: 0 }}>
              Every De Luzex luminaire is packaged in custom-engineered impact-resistant crating and temperature-shielded foam to ensure flawless delivery to your doorstep anywhere across India.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "20px", color: "#2B2B2B", marginBottom: "8px", fontWeight: 600 }}>1. Delivery Timelines</h3>
            <p>
              Standard residential and architectural orders are processed within 24 to 48 hours. Transit times vary depending on the destination:
            </p>
            <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
              <li><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 3 to 5 business days.</li>
              <li><strong>Tier 2 &amp; Tier 3 Cities:</strong> 5 to 7 business days.</li>
              <li><strong>Bespoke / Custom Architectural Chandelier Commissions:</strong> 2 to 4 weeks production followed by priority express transit.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: "20px", color: "#2B2B2B", marginBottom: "8px", fontWeight: 600 }}>2. Shipping Charges</h3>
            <p>
              We offer complimentary insured shipping on orders above ₹5,000. For orders below this threshold, a flat delivery fee of ₹99 is applied at checkout.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "20px", color: "#2B2B2B", marginBottom: "8px", fontWeight: 600 }}>3. White-Glove Installation &amp; Handling</h3>
            <p>
              For our flagship chandeliers and statement suspended fixtures, DeLuzex provides certified installation technicians in select metro areas upon request. Contact our concierge team via our <Link href="/contact" style={{ color: "#C89B60", textDecoration: "underline" }}>Contact Page</Link> to schedule an appointment.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "20px", color: "#2B2B2B", marginBottom: "8px", fontWeight: 600 }}>4. Order Tracking &amp; Transit Damage</h3>
            <p>
              Once dispatched, you will receive real-time tracking details via SMS and email. In the rare event of transit damage, inspect your parcel upon arrival and contact us within 48 hours for an immediate complimentary replacement.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
