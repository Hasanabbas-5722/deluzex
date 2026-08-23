"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { fetchUserProfile, updateUserPassword, updateUserProfile } from "../../services/api";
import styles from "./profile.module.css";

function getInitialUserValue(key: string, defaultValue: string, userObj?: Record<string, string> | null): string {
  if (userObj && userObj[key]) return userObj[key];
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u[key]) return u[key];
      }
    } catch {
      // ignore
    }
  }
  return defaultValue;
}

export default function ProfilePage() {
  const { user, login } = useAuth();
  const userRecord = user as Record<string, string> | null;

  const [firstName, setFirstName] = useState(() =>
    getInitialUserValue("first_name", userRecord?.name?.split(" ")[0] || "Soni", userRecord)
  );
  const [lastName, setLastName] = useState(() =>
    getInitialUserValue("last_name", userRecord?.name?.split(" ").slice(1).join(" ") || "Patel", userRecord)
  );
  const [email, setEmail] = useState(() =>
    getInitialUserValue("email", "soni.patel@deluzex.com", userRecord)
  );
  const [phone, setPhone] = useState(() =>
    getInitialUserValue("phone", "+91 9982791722", userRecord)
  );
  const [city, setCity] = useState(() =>
    getInitialUserValue("city", "Ahmedabad", userRecord)
  );
  const [country, setCountry] = useState(() =>
    getInitialUserValue("country", "India", userRecord)
  );

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let isMounted = true;

    fetchUserProfile()
      .then((profile) => {
        if (!isMounted) return;
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        setCity(profile.city || "");
        setCountry(profile.country || "");
        localStorage.setItem("user", JSON.stringify(profile));
      })
      .catch((error: Error) => {
        if (isMounted && error.message !== "Could not validate credentials") {
          showToast(error.message);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingProfile(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const updatedUser = await updateUserProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        country: country.trim(),
      });
      const token = localStorage.getItem("authToken") || "";
      login(token, updatedUser);
      showToast("Profile details updated successfully!");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      alert("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateUserPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password changed successfully!");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        <p className={styles.subtitle}>
          Manage your personal details, credentials, and quick account settings.
        </p>
      </div>

      {/* Hero Profile Card */}
      <div className={styles.profileHero}>
        <div className={styles.heroLeft}>
          <div className={styles.avatarWrapper}>
            <Image
              src="/images/avatar_woman_1784107804209.jpg"
              alt="Profile"
              fill
              className={styles.avatarImg}
            />
          </div>
          <div className={styles.heroInfo}>
            <h2>{firstName} {lastName}</h2>
            <div className={styles.heroEmail}>
              <span>{email}</span>
              <span>•</span>
              <span>{phone}</span>
            </div>
            <span className={styles.memberBadge}>★ Deluzex Premium Client</span>
          </div>
        </div>

        {/* <Link
          href="/dashboard/overview"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.25rem",
            background: "#FAFAF8",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#2B2B2B",
          }}
        >
          <span>View Account Overview</span>
          <span>→</span>
        </Link> */}
      </div>

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Left Column: Personal Info & Security */}
        <div>
          {/* Personal Information */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Personal Information</span>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    required
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    className={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Country</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className={styles.btnSave} disabled={isLoadingProfile || isSavingProfile}>
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Security & Password */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Security & Password</span>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className={styles.input}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>New Password</label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    className={styles.input}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className={styles.btnSave} disabled={isUpdatingPassword}>
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Quick Navigation to other Dashboard pages */}
        <div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Quick Navigation</span>
            </div>

            <div className={styles.quickNavList}>
              <Link href="/dashboard/orders" className={styles.quickNavItem}>
                <div className={styles.quickNavLeft}>
                  <div className={styles.quickNavIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9c-1.1 0-2 .9-2 2v2h10V4c0-1.1-.9-2-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.quickNavTitle}>My Orders</div>
                    <div className={styles.quickNavSubtitle}>Track orders & view receipts</div>
                  </div>
                </div>
                <span>→</span>
              </Link>

              <Link href="/dashboard/address" className={styles.quickNavItem}>
                <div className={styles.quickNavLeft}>
                  <div className={styles.quickNavIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.quickNavTitle}>Delivery Addresses</div>
                    <div className={styles.quickNavSubtitle}>Manage shipping destinations</div>
                  </div>
                </div>
                <span>→</span>
              </Link>

              <Link href="/dashboard/payments" className={styles.quickNavItem}>
                <div className={styles.quickNavLeft}>
                  <div className={styles.quickNavIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.quickNavTitle}>Payment Methods</div>
                    <div className={styles.quickNavSubtitle}>Saved cards & UPI details</div>
                  </div>
                </div>
                <span>→</span>
              </Link>

              <Link href="/dashboard/wishlist" className={styles.quickNavItem}>
                <div className={styles.quickNavLeft}>
                  <div className={styles.quickNavIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.quickNavTitle}>Wishlist</div>
                    <div className={styles.quickNavSubtitle}>Saved lighting designs</div>
                  </div>
                </div>
                <span>→</span>
              </Link>

              <Link href="/dashboard/overview" className={styles.quickNavItem}>
                <div className={styles.quickNavLeft}>
                  <div className={styles.quickNavIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.quickNavTitle}>Account Overview</div>
                    <div className={styles.quickNavSubtitle}>Analytics & activity summary</div>
                  </div>
                </div>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div className={styles.toast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
