"use client";
import React from "react";
import Link from "next/link";
import styles from "./overview.module.css";

const recentOrders = [
  { name: "Vera Crystal Chandelier", order: "Order #DLX1024", status: "Delivered", date: "04 July, 2026" },
  { name: "Luxe Wall Light", order: "Order #DLX1024", status: "Processing", date: "04 July, 2026" },
  { name: "Marble table lamp", order: "Order #DLX1024", status: "Shipped", date: "04 July, 2026" },
];

const quickActions = [
  { label: "Edit Profile", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", href: "/dashboard/profile" },
  { label: "Track Order", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", href: "/dashboard/orders" },
  { label: "Manage address", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", href: "/dashboard/address" },
  { label: "Payment method", icon: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22", href: "/dashboard/payments" },
  { label: "Contact Support", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", href: "/dashboard/support" },
];

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Delivered" ? styles.statusDelivered :
    status === "Processing" ? styles.statusProcessing :
    styles.statusShipped;
  return <span className={`${styles.statusBadge} ${cls}`}>{status}</span>;
}

export default function OverviewPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Account</h1>
        <p className={styles.subtitle}>Manage your order addresses and account settings.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: "Orders", value: 5, icon: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0", href: "/dashboard/orders" },
          { label: "Wishlist Iteams", value: 12, icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", href: "/dashboard/wishlist", iconBg: "#fff0f0", iconColor: "#ef4444" },
          { label: "Addresses", value: 2, icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", href: "/dashboard/address", iconBg: "#fdf5ea", iconColor: "var(--color-primary)" },
          { label: "Payment method", value: 3, icon: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22", href: "/dashboard/payments" },
        ].map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIconRow}>
              <div className={styles.statIconWrapper} style={{ background: stat.iconBg || "#fdf5ea", color: stat.iconColor || "var(--color-primary)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={stat.icon} />
                </svg>
              </div>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <Link href={stat.href} className={styles.statLink}>
              View all →
            </Link>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Recent Orders */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Recent Orders</div>
                <div className={styles.cardSubtitle}>Latest updates across your agency</div>
              </div>
              <button className={styles.btnSmall}>View All Orders</button>
            </div>
            <div className={styles.orderList}>
              {recentOrders.map((order, i) => (
                <div key={i} className={styles.orderItem}>
                  <div className={styles.orderImg} style={{ background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className={styles.orderInfo}>
                    <div className={styles.orderName}>{order.name}</div>
                    <div className={styles.orderSub}>{order.order}</div>
                  </div>
                  <div className={styles.orderMeta}>
                    <StatusBadge status={order.status} />
                    <span className={styles.orderDate}>{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent View */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Recent View</div>
              <button className={styles.btnSmall}>View All</button>
            </div>
            <div className={styles.recentViewGrid}>
              {[1, 2, 3].map((_, i) => (
                <div key={i} className={styles.productCard}>
                  <div style={{ background: "#f0ebe3", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="1">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>Aurora Chandelier</div>
                    <div className={styles.productPrice}>$300</div>
                    <div className={styles.productStars}>
                      <span style={{ color: "#f59e0b" }}>★</span> 4.8 ( 300 Reviews )
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Payment Method */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Payment Method</div>
                <div className={styles.cardSubtitle}>Latest updates across your agency</div>
              </div>
              <button className={styles.btnSmallOutline}>Edit</button>
            </div>
            <div className={styles.creditCard}>
              <div className={styles.cardTypeRow}>
                <span className={styles.cardTypeLabel}>Credit Card</span>
                <div className={styles.mastercardIcons}>
                  <div className={styles.mcCircle1}></div>
                  <div className={styles.mcCircle2}></div>
                </div>
              </div>
              <div className={styles.cardNumber}>5871 – 6650 – 8710 – 2100</div>
              <div className={styles.cardFooter}>
                <div>
                  <div className={styles.cardFieldLabel}>Name</div>
                  <div className={styles.cardFieldValue}>MIKE JOHN</div>
                </div>
                <div>
                  <div className={styles.cardFieldLabel}>Valid Till</div>
                  <div className={styles.cardFieldValue}>05/34</div>
                </div>
              </div>
            </div>
          </div>

          {/* Default Address */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Default Address</div>
                <div className={styles.cardSubtitle}>Latest updates across your agency</div>
              </div>
              <button className={styles.btnSmallOutline}>Edit</button>
            </div>
            <div className={styles.addressBlock}>
              <svg className={styles.addressIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div className={styles.addressName}>Home</div>
                <div className={styles.addressText}>18, Sapphire Residency,<br />Bodakdev, Ahmedabad, Gujarat 380054,<br />India</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.card}>
            <div className={styles.cardTitle} style={{ marginBottom: "0.5rem" }}>Quick Actions</div>
            <div className={styles.quickActionList}>
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href} className={styles.quickActionItem}>
                  <svg className={styles.quickActionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={action.icon} />
                  </svg>
                  {action.label}
                  <svg className={styles.quickActionChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
