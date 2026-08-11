"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "../checkout.module.css";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main
      className={styles.container}
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C89B60"
            strokeWidth="1.5"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1 className={styles.title} style={{ marginBottom: "1rem" }}>
          Order Placed Successfully!
        </h1>
        <p
          style={{
            color: "#555",
            fontSize: "1.1rem",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          Thank you for your purchase. Your premium lighting products are being
          prepared for dispatch.
        </p>

        {orderId && (
          <div
            style={{
              background: "#FAFAF8",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid rgba(0,0,0,0.05)",
              marginBottom: "3rem",
            }}
          >
            <p style={{ margin: 0, fontWeight: 500 }}>
              Order Reference:{" "}
              <strong style={{ color: "#C89B60" }}>{orderId}</strong>
            </p>
          </div>
        )}

        <Link
          href="/shop"
          className={styles.btnPlaceOrder}
          style={{
            display: "inline-block",
            width: "auto",
            padding: "1rem 3rem",
            textDecoration: "none",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
