"use client";
import React, { useState } from "react";
import styles from "./orders.module.css";

const tabs = [
  { label: "All", count: 12 },
  { label: "Processing", count: 2 },
  { label: "Shipped", count: 3 },
  { label: "Delivered", count: 6 },
  { label: "Cancelled", count: 1 },
];

const orders = [
  { id: "#DLX1024", name: "Crystal Chandelier", variant: "Gold • Large", date: "04 Jul 2026", amount: "₹1,94,900", status: "Delivered" },
  { id: "#DLX1024", name: "Crystal Chandelier", variant: "Gold • Large", date: "04 Jul 2026", amount: "₹1,94,900", status: "Delivered" },
  { id: "#DLX1024", name: "Crystal Chandelier", variant: "Gold • Large", date: "04 Jul 2026", amount: "₹1,94,900", status: "Delivered" },
  { id: "#DLX1024", name: "Crystal Chandelier", variant: "Gold • Large", date: "04 Jul 2026", amount: "₹1,94,900", status: "Delivered" },
  { id: "#DLX1024", name: "Crystal Chandelier", variant: "Gold • Large", date: "04 Jul 2026", amount: "₹1,94,900", status: "Delivered" },
  { id: "#DLX1024", name: "Crystal Chandelier", variant: "Gold • Large", date: "04 Jul 2026", amount: "₹1,94,900", status: "Delivered" },
  { id: "#DLX1024", name: "Crystal Chandelier", variant: "Gold • Large", date: "04 Jul 2026", amount: "₹1,94,900", status: "Delivered" },
];

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Delivered" ? styles.statusDelivered :
    status === "Processing" ? styles.statusProcessing :
    status === "Shipped" ? styles.statusShipped :
    styles.statusCancelled;
  return <span className={`${styles.statusBadge} ${cls}`}>{status}</span>;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.subtitle}>Track and manage your purchases.</p>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.tabs}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={activeTab === i ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(i)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <button className={styles.btnTrack}>Track Orders</button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i}>
                <td>
                  <div className={styles.productCell}>
                    <div className={styles.productImg}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div className={styles.productInfo}>
                      <h4>{order.name}</h4>
                      <p>{order.variant}</p>
                    </div>
                  </div>
                </td>
                <td className={styles.orderId}>{order.id}</td>
                <td className={styles.orderDate}>{order.date}</td>
                <td className={styles.amount}>{order.amount}</td>
                <td><StatusBadge status={order.status} /></td>
                <td>
                  <a href="#" className={styles.trackLink}>Track Order →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
