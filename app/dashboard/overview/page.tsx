"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { fetchUserOrders, fetchUserAddresses, fetchUserCards, UserOrder, SavedAddress, SavedCard } from "../../services/api";
import styles from "./overview.module.css";

const quickActions = [
  { label: "My Profile", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", href: "/dashboard/profile" },
  { label: "Track Orders", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", href: "/dashboard/orders" },
  { label: "Manage Addresses", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", href: "/dashboard/address" },
  { label: "Payment Methods", icon: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22", href: "/dashboard/payments" },
  { label: "Contact Support", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", href: "/dashboard/support" },
];

function StatusBadge({ status }: { status: string }) {
  const s = (status || "Processing").toLowerCase();
  const cls =
    s === "delivered" ? styles.statusDelivered :
    s === "processing" ? styles.statusProcessing :
    styles.statusShipped;
  return <span className={`${styles.statusBadge} ${cls}`}>{status || "Processing"}</span>;
}

export default function OverviewPage() {
  const { user } = useAuth();
  const userEmail = (user as Record<string, string>)?.email || "";

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [cards, setCards] = useState<SavedCard[]>([]);

  useEffect(() => {
    fetchUserOrders(userEmail).then((res) => setOrders(res || []));
    fetchUserAddresses(userEmail).then((res) => setAddresses(res || []));
    fetchUserCards(userEmail).then((res) => setCards(res || []));
  }, [userEmail]);

  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];
  const defaultCard = cards.find((c) => c.is_default) || cards[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Overview</h1>
        <p className={styles.subtitle}>Manage your orders, addresses, and account credentials.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: "Orders", value: orders.length, icon: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0", href: "/dashboard/orders" },
          { label: "Wishlist Items", value: 12, icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", href: "/dashboard/wishlist", iconBg: "#fff0f0", iconColor: "#ef4444" },
          { label: "Saved Addresses", value: addresses.length || 2, icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", href: "/dashboard/address", iconBg: "#fdf5ea", iconColor: "var(--color-primary)" },
          { label: "Payment Methods", value: cards.length || 2, icon: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22", href: "/dashboard/payments" },
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
                <div className={styles.cardSubtitle}>Latest updates on your purchases</div>
              </div>
              <Link href="/dashboard/orders" className={styles.btnSmall}>
                View All Orders
              </Link>
            </div>
            <div className={styles.orderList}>
              {orders.slice(0, 3).map((order, i) => {
                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                return (
                  <div key={order.order_id || order.id || i} className={styles.orderItem}>
                    <div className={styles.orderImg} style={{ background: "#111", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      {firstItem?.image ? (
                        <Image src={firstItem.image} alt={firstItem.title} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="1.5">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      )}
                    </div>
                    <div className={styles.orderInfo}>
                      <div className={styles.orderName}>{firstItem?.title || "Luxury Light"}</div>
                      <div className={styles.orderSub}>Order #{order.order_id || order.id}</div>
                    </div>
                    <div className={styles.orderMeta}>
                      <StatusBadge status={order.status} />
                      <span className={styles.orderDate}>{order.date || "Recent"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Collections */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Recommended Lighting</div>
              <Link href="/shop" className={styles.btnSmall}>
                Explore Shop
              </Link>
            </div>
            <div className={styles.recentViewGrid}>
              {[
                { title: "Vera Crystal Chandelier", price: "₹1,94,900", img: "/images/category_chandeliers_1784107850024.png" },
                { title: "Luxe Minimalist Sconce", price: "₹34,900", img: "/images/category_wall_lights_1784107870198.png" },
                { title: "Italian Marble Lamp", price: "₹48,500", img: "/images/category_table_lamps_1784107890251.png" },
              ].map((prod, i) => (
                <div key={i} className={styles.productCard}>
                  <div style={{ background: "#f0ebe3", aspectRatio: "1", position: "relative", overflow: "hidden", borderRadius: "8px" }}>
                    <Image src={prod.img} alt={prod.title} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{prod.title}</div>
                    <div className={styles.productPrice}>{prod.price}</div>
                    <div className={styles.productStars}>
                      <span style={{ color: "#f59e0b" }}>★</span> 4.9 ( 120+ Reviews )
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
                <div className={styles.cardTitle}>Default Payment Method</div>
                <div className={styles.cardSubtitle}>Saved card for quick checkout</div>
              </div>
              <Link href="/dashboard/payments" className={styles.btnSmallOutline}>
                Manage
              </Link>
            </div>
            <div className={styles.creditCard}>
              <div className={styles.cardTypeRow}>
                <span className={styles.cardTypeLabel}>
                  {defaultCard ? defaultCard.card_type.toUpperCase() : "Credit Card"}
                </span>
                <div className={styles.mastercardIcons}>
                  <div className={styles.mcCircle1}></div>
                  <div className={styles.mcCircle2}></div>
                </div>
              </div>
              <div className={styles.cardNumber}>
                {defaultCard?.card_number_masked || "•••• •••• •••• 2334"}
              </div>
              <div className={styles.cardFooter}>
                <div>
                  <div className={styles.cardFieldLabel}>Name</div>
                  <div className={styles.cardFieldValue}>{defaultCard?.card_holder || "SONI PATEL"}</div>
                </div>
                <div>
                  <div className={styles.cardFieldLabel}>Valid Till</div>
                  <div className={styles.cardFieldValue}>{defaultCard?.expiry || "12/28"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Default Address */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Default Address</div>
                <div className={styles.cardSubtitle}>Primary delivery destination</div>
              </div>
              <Link href="/dashboard/address" className={styles.btnSmallOutline}>
                Edit
              </Link>
            </div>
            <div className={styles.addressBlock}>
              <svg className={styles.addressIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div className={styles.addressName}>{defaultAddress?.type || "Home"}</div>
                <div className={styles.addressText}>
                  {defaultAddress
                    ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.pin_code}`
                    : "402, Titanium City Centre, Prahlad Nagar, Ahmedabad, Gujarat 380015"}
                </div>
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
