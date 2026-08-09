"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    router.push("/");
  };

  const menuItems = [
    {
      group: "Admin Control",
      items: [
        { name: "Overview", path: "/admin", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
        { name: "Products", path: "/admin/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
        { name: "Categories", path: "/admin/categories", icon: "M4 6h16M4 12h16M4 18h16" },
        { name: "Inquiries", path: "/admin/inquiries", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }
      ]
    }
  ];

  return (
    <div className={styles.adminRoot}>
      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarCollapsed}`}>
          <div className={styles.sidebarInner}>
            <div className={styles.menuGroup}>
              <h4 className={styles.groupTitle} style={{ color: '#C49A45', fontWeight: 'bold' }}>ADMINISTRATOR</h4>
            </div>

            {menuItems.map((group, idx) => (
              <div key={idx} className={styles.menuGroup}>
                <h4 className={styles.groupTitle}>{group.group}</h4>
                <ul className={styles.menuList}>
                  {group.items.map((item, i) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    return (
                      <li key={i}>
                        <Link
                          href={item.path}
                          className={`${styles.menuLink} ${isActive ? styles.activeLink : ""}`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d={item.icon} />
                          </svg>
                          <span className={styles.menuLinkText}>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className={styles.menuGroup}>
              <button className={styles.logoutBtn} onClick={() => setShowLogoutModal(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
                </svg>
                <span className={styles.menuLinkText}>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        <main className={styles.mainContent}>
          {children}
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2 M8 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                <circle cx="20" cy="12" r="3" />
                <line x1="20" y1="9" x2="20" y2="15" />
                <line x1="17" y1="12" x2="23" y2="12" />
              </svg>
            </div>
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className={styles.btnConfirmLogout} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
