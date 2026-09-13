"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { addToCart, openCart } from "../store/cartSlice";
import styles from "./UserLoginModal.module.css";

export default function UserLoginModal() {
  const dispatch = useDispatch();
  const {
    showLoginModal,
    closeLoginModal,
    loginModalMessage,
    pendingCartProduct,
    clearPendingCartProduct,
    login,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!showLoginModal) {
    return null;
  }

  const handleClose = () => {
    if (isLoading) return;
    setErrorMsg("");
    setSuccessMsg("");
    closeLoginModal();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Authenticate in context
        login(data.access_token, data.data);

        // Add pending product if exists
        if (pendingCartProduct) {
          dispatch(addToCart(pendingCartProduct));
          dispatch(openCart());
          clearPendingCartProduct();
          setSuccessMsg(`Welcome! ${pendingCartProduct.product_title || pendingCartProduct.name || "Item"} added to your cart.`);
        } else {
          setSuccessMsg("Logged in successfully!");
        }

        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setErrorMsg(data.detail || "Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      setErrorMsg("All fields are required to create an account.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          accept_terms: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // After register, log user in
        const loginRes = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.success) {
          login(loginData.access_token, loginData.data);
          if (pendingCartProduct) {
            dispatch(addToCart(pendingCartProduct));
            dispatch(openCart());
            clearPendingCartProduct();
            setSuccessMsg(`Account created! ${pendingCartProduct.product_title || pendingCartProduct.name || "Item"} added to your cart.`);
          } else {
            setSuccessMsg("Account created and logged in successfully!");
          }
          setTimeout(() => {
            handleClose();
          }, 1200);
        } else {
          setActiveTab("login");
          setSuccessMsg("Account created! Please enter your password to sign in.");
        }
      } else {
        setErrorMsg(data.detail || "Registration failed. Please check your details.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close dialog">
          ✕
        </button>

        <div className={styles.header}>
          <span className={styles.brandBadge}>deluzex</span>
          <h2 className={styles.title}>
            {activeTab === "login" ? "Sign In to Continue" : "Create an Account"}
          </h2>
          <p className={styles.subtitle}>{loginModalMessage}</p>
        </div>

        {pendingCartProduct && (
          <div className={styles.productPreview}>
            <div
              style={{
                position: "relative",
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={
                  pendingCartProduct.product_main_image ||
                  pendingCartProduct.image_url ||
                  "/images/lamp_modern_tall_1784107732736.jpg"
                }
                alt={pendingCartProduct.product_title || pendingCartProduct.name || "Product"}
                fill
                sizes="44px"
                style={{ objectFit: "contain" }}
                className={styles.productThumb}
              />
            </div>
            <div className={styles.productPreviewInfo}>
              <div className={styles.productPreviewTitle}>
                {pendingCartProduct.product_title || pendingCartProduct.name || "Selected Item"}
              </div>
              <div className={styles.productPreviewSub}>
                ₹{Number(pendingCartProduct.product_price || pendingCartProduct.price || 0).toFixed(2)}
                {pendingCartProduct.quantity && pendingCartProduct.quantity > 1 ? ` × ${pendingCartProduct.quantity}` : ""}
                {" — Will be added after sign in"}
              </div>
            </div>
          </div>
        )}

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "login" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("login");
              setErrorMsg("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "register" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("register");
              setErrorMsg("");
            }}
          >
            New Customer
          </button>
        </div>

        {activeTab === "login" ? (
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}
            {successMsg && <div className={styles.successBanner}>{successMsg}</div>}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? "Signing in..." : "Sign In & Add to Cart"}
            </button>

            <div className={styles.footerLink}>
              Looking for full login?{" "}
              <Link href="/login" onClick={handleClose}>
                Go to login page
              </Link>
            </div>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleRegisterSubmit}>
            {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}
            {successMsg && <div className={styles.successBanner}>{successMsg}</div>}

            <div className={styles.nameRow}>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label className={styles.label}>First Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? "Creating Account..." : "Register & Add to Cart"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
