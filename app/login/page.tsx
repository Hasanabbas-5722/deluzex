"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { useAuth } from "../context/AuthContext";

type ToastProps = {
  type: "success" | "error";
  message: string;
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [acceptTermsError, setAcceptTermsError] = useState("");
  
  const [toast, setToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const validatePassword = (val: string) => {
    if (val.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(val)) return "Password must contain an uppercase letter.";
    if (!/[a-z]/.test(val)) return "Password must contain a lowercase letter.";
    if (!/[0-9]/.test(val)) return "Password must contain a number.";
    if (!/[^A-Za-z0-9]/.test(val)) return "Password must contain a special symbol.";
    return null;
  };

  const handleBlurEmail = () => {
    if (!email.trim()) {
      setEmailError("Email Address is required.");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleBlurPassword = () => {
    if (!password.trim()) {
      setPasswordError("Password is required.");
    } else {
      const pswError = validatePassword(password);
      if (pswError) setPasswordError(pswError);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    setAcceptTermsError("");

    if (!isLogin) {
      if (!firstName.trim()) {
        setFirstNameError("First Name is required.");
        isValid = false;
      }
      if (!lastName.trim()) {
        setLastNameError("Last Name is required.");
        isValid = false;
      }
      if (!phone.trim()) {
        setPhoneError("Phone Number is required.");
        isValid = false;
      }
      if (!acceptTerms) {
        setAcceptTermsError("You must accept the terms and conditions.");
        isValid = false;
      }
    }

    if (!email.trim()) {
      setEmailError("Email Address is required.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      const pswError = validatePassword(password);
      if (pswError) {
        setPasswordError(pswError);
        isValid = false;
      }
    }

    if (!isValid) {
      setToast({ type: "error", message: "Please fix the validation errors." });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch("https://deluzexlighting.com/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setToast({ type: "success", message: "Successfully logged in!" });
          localStorage.setItem("authToken", data?.access_token);
          login(data.access_token, data.data);
          console.log("Login successful:", data);
          setTimeout(() => {
            router.push("/");
          }, 1500);
          console.log("Set timeout completed");
        } else {
          console.error("Login failed:", data);
          setToast({ type: "error", message: data.detail || "Login failed." });
        }
      } else {
        const response = await fetch("https://deluzexlighting.com/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            phone,
            accept_terms: acceptTerms
          }),
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setToast({ type: "success", message: "Registration successful! You can now log in." });
          setTimeout(() => {
            setIsLogin(true);
            setPassword("");
            setToast(null);
          }, 2000);
        } else {
          setToast({ type: "error", message: data.message || "Registration failed." });
        }
      }
    } catch {
      setToast({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    setAcceptTermsError("");
    setToast(null);
  };

  return (
    <main className={styles.main}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === "success" ? styles.toastSuccess : styles.toastError}`}>
          {toast.type === "success" ? (
            <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className={styles.subtitle}>
            {isLogin
              ? "Sign in to access your dashboard, orders, and exclusive offers."
              : "Register to explore our exclusive luxury lighting collections."}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input 
                    type="text" 
                    placeholder="John" 
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (firstNameError) setFirstNameError("");
                    }}
                    onBlur={() => {
                      if (!firstName.trim()) setFirstNameError("First Name is required.");
                    }}
                    className={firstNameError ? styles.inputError : ""}
                  />
                  {firstNameError && <span className={styles.errorText}>{firstNameError}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe" 
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (lastNameError) setLastNameError("");
                    }}
                    onBlur={() => {
                      if (!lastName.trim()) setLastNameError("Last Name is required.");
                    }}
                    className={lastNameError ? styles.inputError : ""}
                  />
                  {lastNameError && <span className={styles.errorText}>{lastNameError}</span>}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+1234567890" 
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  onBlur={() => {
                    if (!phone.trim()) setPhoneError("Phone Number is required.");
                  }}
                  className={phoneError ? styles.inputError : ""}
                />
                {phoneError && <span className={styles.errorText}>{phoneError}</span>}
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={handleBlurEmail}
              className={emailError ? styles.inputError : ""}
            />
            {emailError && <span className={styles.errorText}>{emailError}</span>}
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              onBlur={handleBlurPassword}
              className={passwordError ? styles.inputError : ""}
            />
            {passwordError && <span className={styles.errorText}>{passwordError}</span>}
          </div>

          {!isLogin && (
            <div className={styles.checkboxGroup}>
              <input 
                type="checkbox" 
                id="terms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (acceptTermsError) setAcceptTermsError("");
                }}
              />
              <div>
                <label htmlFor="terms">I accept the terms and conditions</label>
                {acceptTermsError && <div className={styles.errorText}>{acceptTermsError}</div>}
              </div>
            </div>
          )}

          <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
            {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
          </button>
        </form>

        <div className={styles.switchMode}>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={handleSwitchMode} className={styles.switchBtn}>
              {isLogin ? "Register now" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
