"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    router.push("/dashboard/notifications");
  };

  return (
    <main className={styles.main}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className={styles.subtitle}>
            {isLogin
              ? "Sign in to access your dashboard, orders, and exclusive offers."
              : "Register to explore our exclusive luxury lighting collections."}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>
          )}
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input type="email" placeholder="john@example.com" required />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className={styles.btnPrimary}>
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className={styles.switchMode}>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className={styles.switchBtn}>
              {isLogin ? "Register now" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
