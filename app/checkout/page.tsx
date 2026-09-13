"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { useAuth } from "../context/AuthContext";
import {
  processServerPayment,
  ServerPaymentPayload,
  initiateUpiPayment,
  checkPaymentStatus,
  recordPaymentFailure,
  fetchUserAddresses,
  saveUserAddress,
  fetchUserCards,
  saveUserCard,
  savePlacedOrder,
  SavedAddress,
  SavedCard,
  OrderPayload,
} from "../services/api";
import styles from "./checkout.module.css";

function getOrCreateIdempotencyKey(): string {
  if (typeof window === "undefined") return "";
  try {
    let key = sessionStorage.getItem("deluzex_checkout_idem");
    if (!key) {
      key = "idem_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem("deluzex_checkout_idem", key);
    }
    return key;
  } catch {
    return "idem_fallback_" + Date.now();
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const errorRef = useRef<HTMLDivElement>(null);
  const { cartItems, cartTotal } = useSelector((state: RootState) => state.cart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Idempotency & Failure Recovery State
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [failedOrder, setFailedOrder] = useState<{
    orderId: string;
    rzpOrderId?: string;
    errorReason: string;
    errorCode?: string;
  } | null>(null);

  // Saved Data States
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [saveCardToProfile, setSaveCardToProfile] = useState(true);

  // Payment Tabs: 'upi' | 'card' | 'cod'
  const [paymentTab, setPaymentTab] = useState<"upi" | "card" | "cod">("upi");
  const [upiMode, setUpiMode] = useState<"vpa" | "qr">("vpa");
  const [upiVpa, setUpiVpa] = useState<string>("");
  const [qrTimeLeft, setQrTimeLeft] = useState<number>(600); // 10 min countdown for QR

  // Contact & Shipping Form Fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  // Card Input Fields
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardBrand, setCardBrand] = useState<"visa" | "mastercard" | "rupay" | "other">("visa");

  const subtotal = cartTotal;
  const gst = subtotal * 0.18;
  const delivery = subtotal > 0 ? 99 : 0;
  const grandTotal = subtotal + gst + delivery;

  // UPI In-App Waiting & Approval Modal State
  const [upiWaitingOrder, setUpiWaitingOrder] = useState<{
    orderId: string;
    upiVpa: string;
    amount: number;
    paymentUrl?: string;
    expiresIn: number;
  } | null>(null);
  const [upiCountdown, setUpiCountdown] = useState<number>(300);

  // Initialize Idempotency Key
  useEffect(() => {
    setIdempotencyKey(getOrCreateIdempotencyKey());
  }, []);

  // QR Timer Countdown
  useEffect(() => {
    if (paymentTab === "upi" && upiMode === "qr" && qrTimeLeft > 0) {
      const timer = setInterval(() => setQrTimeLeft((prev) => Math.max(0, prev - 1)), 1000);
      return () => clearInterval(timer);
    }
  }, [paymentTab, upiMode, qrTimeLeft]);

  // UPI Real-Time In-App Approval Polling & Countdown Effect
  useEffect(() => {
    if (!upiWaitingOrder) return;

    // 1. Countdown timer
    const countdownTimer = setInterval(() => {
      setUpiCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setFailedOrder({
            orderId: upiWaitingOrder.orderId,
            errorReason: "UPI Collect session timed out. You can retry with the same or another payment method.",
            errorCode: "UPI_TIMEOUT",
          });
          setErrorMessage("UPI Collect session timed out. Please try again or choose another method.");
          setUpiWaitingOrder(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Poll backend status every 3 seconds to check if customer approved in their app
    const pollInterval = setInterval(async () => {
      try {
        const res = await checkPaymentStatus(upiWaitingOrder.orderId);
        if (res && res.status === "paid") {
          clearInterval(pollInterval);
          clearInterval(countdownTimer);
          setUpiWaitingOrder(null);
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("deluzex_checkout_idem");
          }
          dispatch(clearCart());
          router.push(`/checkout/success?orderId=${encodeURIComponent(upiWaitingOrder.orderId)}`);
        } else if (res && res.status === "failed") {
          clearInterval(pollInterval);
          clearInterval(countdownTimer);
          const reason = res.error_description || "Payment was declined in your UPI app.";
          setFailedOrder({
            orderId: upiWaitingOrder.orderId,
            errorReason: reason,
            errorCode: "UPI_DECLINED",
          });
          setErrorMessage(reason);
          setUpiWaitingOrder(null);
        }
      } catch (pollErr) {
        console.warn("UPI status check error:", pollErr);
      }
    }, 3000);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(pollInterval);
    };
  }, [upiWaitingOrder, dispatch, router]);

  const applyAddress = useCallback((addr: SavedAddress) => {
    setSelectedAddressId(addr.id || addr._id || null);
    setFirstName(addr.first_name || "");
    setLastName(addr.last_name || "");
    setStreet(addr.street || "");
    setCity(addr.city || "");
    setState(addr.state || "");
    setPinCode(addr.pin_code || "");
    if (addr.phone) setPhone(addr.phone);
  }, []);

  // Pre-fill user profile if logged in
  useEffect(() => {
    if (user) {
      const userObj = user as Record<string, string>;
      if (userObj.email && !email) setEmail(userObj.email);
      if (userObj.phone && !phone) setPhone(userObj.phone);
      if (userObj.first_name && !firstName) setFirstName(userObj.first_name);
      if (userObj.last_name && !lastName) setLastName(userObj.last_name);
    }
  }, [user, email, phone, firstName, lastName]);

  // Load saved addresses and cards
  useEffect(() => {
    const activeEmail = email || ((user as Record<string, string>)?.email) || "";
    if (activeEmail) {
      fetchUserAddresses(activeEmail).then((list) => {
        setSavedAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.is_default) || list[0];
          applyAddress(defaultAddr);
        }
      });

      fetchUserCards(activeEmail).then((cards) => {
        setSavedCards(cards);
        if (cards.length > 0) {
          const defaultCard = cards.find((c) => c.is_default) || cards[0];
          setSelectedCardId(defaultCard.id || defaultCard._id || null);
        }
      });
    }
  }, [email, user, applyAddress]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);

    // Detect card brand
    if (raw.startsWith("4")) {
      setCardBrand("visa");
    } else if (/^(5[1-5]|2[2-7])/.test(raw)) {
      setCardBrand("mastercard");
    } else if (/^(60|65|81|82|508)/.test(raw)) {
      setCardBrand("rupay");
    } else {
      setCardBrand("other");
    }
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardCvv(raw);
  };

  const scrollToError = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  const buildOrderPayload = (): OrderPayload => ({
    email: email.trim(),
    phone: phone.trim(),
    shipping_address: {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pin_code: pinCode.trim(),
    },
    items: cartItems.map((item) => ({
      product_id: String(item.id),
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    subtotal,
    gst,
    delivery,
    total: grandTotal,
  });

  const validateForm = (): boolean => {
    if (
      !email.trim() ||
      !phone.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !street.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pinCode.trim()
    ) {
      setErrorMessage("Please complete all required contact and shipping address fields.");
      scrollToError();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      scrollToError();
      return false;
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      scrollToError();
      return false;
    }

    // Validate Card fields if paying by Card
    if (paymentTab === "card" && !selectedCardId) {
      if (!cardHolder.trim()) {
        setErrorMessage("Please enter the name on your card.");
        scrollToError();
        return false;
      }
      const rawCard = cardNumber.replace(/\s/g, "");
      if (rawCard.length < 15) {
        setErrorMessage("Please enter a valid 16-digit card number.");
        scrollToError();
        return false;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage("Please enter card expiry in MM/YY format.");
        scrollToError();
        return false;
      }
      if (cardCvv.length < 3) {
        setErrorMessage("Please enter the 3-digit CVV on the back of your card.");
        scrollToError();
        return false;
      }
    }

    // Validate UPI VPA if paying by UPI ID
    if (paymentTab === "upi" && upiMode === "vpa") {
      if (!upiVpa.trim() || !upiVpa.includes("@")) {
        setErrorMessage("Please enter a valid UPI ID (e.g. mobile@okhdfcbank or user@paytm).");
        scrollToError();
        return false;
      }
    }

    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const userObj = user as Record<string, string> | null;
      const userId = userObj?._id || userObj?.id || "";

      // Save address if requested
      if (saveAddressToProfile) {
        saveUserAddress({
          user_id: userId,
          user_email: email.trim(),
          user_phone: phone.trim(),
          type: "Home",
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pin_code: pinCode.trim(),
          phone: phone.trim(),
          is_default: true,
        }).catch((err) => console.warn("Failed to persist address:", err));
      }

      // Save card if requested
      if (paymentTab === "card" && saveCardToProfile && cardNumber) {
        const rawCard = cardNumber.replace(/\s/g, "");
        const last4 = rawCard.slice(-4);
        saveUserCard({
          user_id: userId,
          user_email: email.trim(),
          card_holder: cardHolder.trim() || `${firstName} ${lastName}`.trim(),
          card_number_masked: `•••• •••• •••• ${last4}`,
          card_last4: last4,
          card_type: cardBrand,
          expiry: cardExpiry.trim(),
          is_default: true,
        }).catch((err) => console.warn("Failed to persist card:", err));
      }

      // =========================================================
      // FLOW A: UPI IN-APP PAYMENT (Awaiting Customer In-App Approval)
      // =========================================================
      if (paymentTab === "upi") {
        let cleanVpa = upiVpa.trim();
        if (!cleanVpa) {
          const cleanPhone = phone.replace(/\D/g, "");
          cleanVpa = `${cleanPhone}@okhdfcbank`;
        }

        const upiRes = await initiateUpiPayment({
          email: email.trim(),
          phone: phone.trim(),
          shipping_address: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            pin_code: pinCode.trim(),
          },
          items: cartItems.map((item) => ({
            product_id: String(item.id),
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal,
          gst,
          delivery,
          total: grandTotal,
          upi_vpa: cleanVpa,
          idempotency_key: idempotencyKey,
          existing_order_id: failedOrder?.orderId,
        });

        if (upiRes && upiRes.success) {
          if (upiRes.status === "paid") {
            dispatch(clearCart());
            router.push(`/checkout/success?orderId=${encodeURIComponent(upiRes.order_id)}`);
            return;
          }

          // Open UPI Waiting Modal — Customer will approve in their UPI app
          setUpiWaitingOrder({
            orderId: upiRes.order_id,
            upiVpa: upiRes.upi_vpa,
            amount: upiRes.amount,
            paymentUrl: upiRes.payment_url,
            expiresIn: upiRes.expires_in_seconds || 300,
          });
          setUpiCountdown(upiRes.expires_in_seconds || 300);
          setIsProcessing(false);
          return;
        } else {
          throw new Error(upiRes?.message || "Failed to dispatch UPI collect request.");
        }
      }

      // =========================================================
      // FLOW B: DIRECT CARD & COD SERVER-SIDE PAYMENT
      // =========================================================
      let rawCard = cardNumber.replace(/\s/g, "");
      if (!rawCard && selectedCardId) {
        const saved = savedCards.find((c) => (c.id || c._id) === selectedCardId);
        if (saved) {
          rawCard = `411111111111${saved.card_last4 || "4242"}`;
        }
      }

      const serverPayload: ServerPaymentPayload = {
        email: email.trim(),
        phone: phone.trim(),
        shipping_address: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pin_code: pinCode.trim(),
        },
        items: cartItems.map((item) => ({
          product_id: String(item.id),
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        gst,
        delivery,
        total: grandTotal,
        payment_method: paymentTab,
        idempotency_key: idempotencyKey,
        existing_order_id: failedOrder?.orderId,
        card:
          paymentTab === "card"
            ? {
                number: rawCard,
                name: cardHolder.trim() || `${firstName.trim()} ${lastName.trim()}`,
                expiry: cardExpiry.trim(),
                cvv: cardCvv.trim(),
              }
            : undefined,
      };

      const res = await processServerPayment(serverPayload);

      if (res && res.success) {
        await savePlacedOrder({
          order_id: res.order_id,
          razorpay_order_id: res.order_id,
          razorpay_payment_id: res.payment_id || `pay_${res.order_id}`,
          user_email: email.trim(),
          user_phone: phone.trim(),
          customer_name: `${firstName.trim()} ${lastName.trim()}`,
          shipping_address: serverPayload.shipping_address,
          items: serverPayload.items,
          subtotal: serverPayload.subtotal,
          gst: serverPayload.gst,
          delivery: serverPayload.delivery,
          total: serverPayload.total,
          status: res.status === "cod" ? "cod" : "Processing",
          payment_method: paymentTab === "card" ? "Credit / Debit Card" : "Cash on Delivery",
          payment_status: res.status === "cod" ? "Pending (Pay on Delivery)" : "Paid",
        });

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("deluzex_checkout_idem");
        }
        setFailedOrder(null);
        dispatch(clearCart());
        router.push(`/checkout/success?orderId=${encodeURIComponent(res.order_id)}`);
      } else {
        const failureReason =
          res.error_description ||
          res.message ||
          "Payment authorization was declined. Please verify details or select another method.";
        const errorCode = res.error_code || "PAYMENT_FAILED";

        setFailedOrder({
          orderId: res.order_id,
          rzpOrderId: res.order_id,
          errorReason: failureReason,
          errorCode: errorCode,
        });

        setErrorMessage(failureReason);
        setIsProcessing(false);
        scrollToError();
      }
    } catch (err) {
      console.error("Payment Processing Error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to process payment on server. Please verify your connection and try again.";
      setErrorMessage(msg);
      setIsProcessing(false);
      scrollToError();
    }
  };

  const handleCancelUpi = () => {
    setUpiWaitingOrder(null);
    setErrorMessage("UPI payment request was cancelled. You can resume checkout when ready.");
    scrollToError();
  };

  const handleResumeRetry = () => {
    setErrorMessage(null);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handlePayment(fakeEvent);
  };

  const handleSwitchToCod = () => {
    setPaymentTab("cod");
    setErrorMessage(null);
  };

  if (cartItems.length === 0) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>Your Cart is Empty</h1>
          <p>Please add some items to your cart before proceeding to checkout.</p>
          <Link href="/shop" className={styles.btnReturn}>
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* UPI IN-APP APPROVAL & REAL-TIME VERIFICATION MODAL */}
      {upiWaitingOrder && (
        <div className={styles.upiOverlay} role="dialog" aria-modal="true">
          <div className={styles.upiModal}>
            <div className={styles.upiModalIcon}>
              <div className={styles.upiPulseRing} />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>

            <h3 className={styles.upiModalTitle}>Approve in Your UPI App</h3>
            <p className={styles.upiModalSubtitle}>
              A collect request has been dispatched. Please open your UPI app on your mobile device to authorize payment.
            </p>

            <div className={styles.upiCollectHighlight}>
              <div style={{ textAlign: "left" }}>
                <div className={styles.upiHighlightLabel}>Requested To</div>
                <div className={styles.upiHighlightVpa}>{upiWaitingOrder.upiVpa}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className={styles.upiHighlightLabel}>Total Due</div>
                <div className={styles.upiHighlightAmount}>₹{upiWaitingOrder.amount.toFixed(2)}</div>
              </div>
            </div>

            <div className={styles.upiStepsList}>
              <div className={styles.upiStepItem}>
                <span className={styles.upiStepNum}>1</span>
                <span>Open <strong>Google Pay, PhonePe, Paytm, or BHIM</strong> on your phone.</span>
              </div>
              <div className={styles.upiStepItem}>
                <span className={styles.upiStepNum}>2</span>
                <span>Check your notifications or pending requests for <strong>Deluzex Lighting</strong>.</span>
              </div>
              <div className={styles.upiStepItem}>
                <span className={styles.upiStepNum}>3</span>
                <span>Approve the request by entering your secure <strong>UPI PIN</strong>.</span>
              </div>
            </div>

            <div className={styles.upiTimerBar}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                Expires in {String(Math.floor(upiCountdown / 60)).padStart(2, "0")}:{String(upiCountdown % 60).padStart(2, "0")}
              </span>
            </div>

            {/* Real-time automatic Razorpay detection radar */}
            <div className={styles.autoDetectBox}>
              <div className={styles.radarWaveContainer}>
                <span className={styles.radarRing1}></span>
                <span className={styles.radarRing2}></span>
                <span className={styles.radarDot}></span>
              </div>
              <div className={styles.autoDetectContent}>
                <div className={styles.autoDetectStatus}>
                  Listening for payment confirmation...
                </div>
                <div className={styles.autoDetectSub}>
                  Auto-detecting from your UPI app via Razorpay. Once you approve with your PIN, your order will confirm automatically.
                </div>
              </div>
            </div>

            <div className={styles.upiModalActions}>
              {upiWaitingOrder.paymentUrl && (
                <a
                  href={upiWaitingOrder.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnOpenUpiLink}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Open Payment in UPI App / Browser</span>
                </a>
              )}

              <button
                type="button"
                className={styles.btnCancelUpi}
                onClick={handleCancelUpi}
              >
                Cancel Payment Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAILURE RECOVERY BANNER (Idempotency & Resume State) */}
      {failedOrder && (
        <div className={styles.recoveryBanner} role="alert">
          <div className={styles.recoveryIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className={styles.recoveryContent}>
            <p className={styles.recoveryTitle}>
              Payment Incomplete — Order #{failedOrder.orderId.slice(-8)}
            </p>
            <p className={styles.recoveryDesc}>
              {failedOrder.errorReason} Your cart items and shipping details are preserved.
            </p>
            <div className={styles.recoveryActions}>
              <button
                type="button"
                className={styles.btnResumeOrder}
                onClick={handleResumeRetry}
                disabled={isProcessing}
              >
                ↻ Retry Payment
              </button>
              <button
                type="button"
                className={styles.btnSwitchMethod}
                onClick={handleSwitchToCod}
                disabled={isProcessing}
              >
                Switch to Cash on Delivery (Instant)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Notice / Error Message */}
      {errorMessage && !failedOrder && (
        <div ref={errorRef} className={styles.errorBanner} role="alert">
          <div className={styles.errorIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className={styles.errorText}>
            <p className={styles.errorTitle}>Payment Notice</p>
            <p className={styles.errorDesc}>{errorMessage}</p>
          </div>
          <button
            type="button"
            className={styles.errorDismiss}
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <h1 className={styles.title}>Secure Checkout</h1>

      <form onSubmit={handlePayment} className={styles.checkoutGrid}>
        <div className={styles.leftCol}>
          {/* Contact Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address *</label>
              <input
                type="email"
                required
                className={styles.input}
                placeholder="e.g. alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number (with SMS/WhatsApp updates) *</label>
              <input
                type="tel"
                required
                className={styles.input}
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span>Shipping Address</span>
              {savedAddresses.length > 0 && (
                <span
                  className={styles.savedHeaderLabel}
                  onClick={() => {
                    setSelectedAddressId(null);
                    setStreet("");
                    setCity("");
                    setState("");
                    setPinCode("");
                  }}
                >
                  + Add New Address
                </span>
              )}
            </div>

            {savedAddresses.length > 0 && (
              <div className={styles.savedGrid}>
                {savedAddresses.map((addr) => {
                  const addrId = addr.id || addr._id || "";
                  const isSelected = selectedAddressId === addrId;
                  return (
                    <div
                      key={addrId}
                      className={`${styles.savedItemCard} ${isSelected ? styles.savedItemCardActive : ""}`}
                      onClick={() => applyAddress(addr)}
                    >
                      <div className={styles.savedItemHeader}>
                        <span className={styles.savedBadge}>{addr.type || "Home"}</span>
                        {isSelected && (
                          <span style={{ color: "#C89B60", fontSize: "0.85rem", fontWeight: 700 }}>
                            ✓ Selected
                          </span>
                        )}
                      </div>
                      <div className={styles.savedItemName}>
                        {addr.first_name} {addr.last_name}
                      </div>
                      <div className={styles.savedItemDetails}>
                        {addr.street}, {addr.city}, {addr.state} - {addr.pin_code}
                      </div>
                      <button
                        type="button"
                        className={styles.btnUseSaved}
                        onClick={(e) => {
                          e.stopPropagation();
                          applyAddress(addr);
                        }}
                      >
                        Use this address
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Street Address *</label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="Flat / House no., building, street name"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>City *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>State *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>PIN Code *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="PIN Code"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>

            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={saveAddressToProfile}
                onChange={(e) => setSaveAddressToProfile(e.target.checked)}
              />
              <span className={styles.checkboxLabel}>
                Save this address to my profile for future checkouts
              </span>
            </label>
          </div>

          {/* Seamless In-Page Payment Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>

            {/* 3 Main Payment Tabs */}
            <div className={styles.paymentTabs}>
              <div
                className={`${styles.paymentTab} ${paymentTab === "upi" ? styles.paymentTabActive : ""}`}
                onClick={() => setPaymentTab("upi")}
              >
                <span>⚡ UPI / QR</span>
              </div>
              <div
                className={`${styles.paymentTab} ${paymentTab === "card" ? styles.paymentTabActive : ""}`}
                onClick={() => setPaymentTab("card")}
              >
                <span>💳 Card</span>
              </div>
              <div
                className={`${styles.paymentTab} ${paymentTab === "cod" ? styles.paymentTabActive : ""}`}
                onClick={() => setPaymentTab("cod")}
              >
                <span>📦 Cash on Delivery</span>
              </div>
            </div>

            {/* TAB 1: UPI IN-PAGE PAYMENT */}
            {paymentTab === "upi" && (
              <div className={styles.paymentCard}>
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentRadioGroup}>
                    <div className={styles.customRadio}>
                      <div className={styles.customRadioInner} />
                    </div>
                    <span className={styles.paymentName}>Instant UPI Payment</span>
                  </div>
                  <span className={styles.paymentBadgeLive}>Zero Convenience Fee</span>
                </div>

                {/* Sub-Tabs: UPI ID vs Dynamic QR */}
                <div className={styles.upiSubTabs}>
                  <div
                    className={`${styles.upiSubTab} ${upiMode === "vpa" ? styles.upiSubTabActive : ""}`}
                    onClick={() => setUpiMode("vpa")}
                  >
                    Enter UPI ID (VPA)
                  </div>
                  <div
                    className={`${styles.upiSubTab} ${upiMode === "qr" ? styles.upiSubTabActive : ""}`}
                    onClick={() => setUpiMode("qr")}
                  >
                    Scan Studio QR
                  </div>
                </div>

                {upiMode === "vpa" ? (
                  <div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Your UPI Virtual Address (VPA)</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>

                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0.5rem 0 0.75rem 0" }}>
                      Quick UPI App selector:
                    </p>
                    <div className={styles.upiAppsGrid}>
                      <button
                        type="button"
                        className={`${styles.upiAppBtn} ${upiVpa.endsWith("@okaxis") || upiVpa.endsWith("@okhdfcbank") ? styles.upiAppBtnActive : ""}`}
                        onClick={() => {
                          const prefix = upiVpa.split("@")[0] || phone || "mobile";
                          setUpiVpa(`${prefix}@okhdfcbank`);
                        }}
                      >
                        Google Pay
                      </button>
                      <button
                        type="button"
                        className={`${styles.upiAppBtn} ${upiVpa.endsWith("@ybl") ? styles.upiAppBtnActive : ""}`}
                        onClick={() => {
                          const prefix = upiVpa.split("@")[0] || phone || "mobile";
                          setUpiVpa(`${prefix}@ybl`);
                        }}
                      >
                        PhonePe
                      </button>
                      <button
                        type="button"
                        className={`${styles.upiAppBtn} ${upiVpa.endsWith("@paytm") ? styles.upiAppBtnActive : ""}`}
                        onClick={() => {
                          const prefix = upiVpa.split("@")[0] || phone || "mobile";
                          setUpiVpa(`${prefix}@paytm`);
                        }}
                      >
                        Paytm
                      </button>
                      <button
                        type="button"
                        className={`${styles.upiAppBtn} ${upiVpa.endsWith("@upi") ? styles.upiAppBtnActive : ""}`}
                        onClick={() => {
                          const prefix = upiVpa.split("@")[0] || phone || "mobile";
                          setUpiVpa(`${prefix}@upi`);
                        }}
                      >
                        BHIM UPI
                      </button>
                    </div>

                    <p className={styles.paymentDesc} style={{ margin: 0, fontSize: "0.82rem" }}>
                      We will dispatch a direct payment notification to your chosen UPI app. Accept to complete immediately.
                    </p>
                  </div>
                ) : (
                  <div className={styles.inPageQrCard}>
                    <div className={styles.qrImageFrame}>
                      {/* Dynamic In-Page QR representation */}
                      <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="3" height="3" />
                        <rect x="18" y="14" width="3" height="3" />
                        <rect x="14" y="18" width="3" height="3" />
                        <rect x="18" y="18" width="3" height="3" />
                        <line x1="7" y1="7" x2="7" y2="7.01" strokeWidth="3" />
                        <line x1="17" y1="7" x2="17" y2="7.01" strokeWidth="3" />
                        <line x1="7" y1="17" x2="7" y2="17.01" strokeWidth="3" />
                      </svg>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}>
                      Scan & Pay ₹{grandTotal.toFixed(2)}
                    </div>
                    <div className={styles.qrCountdown}>
                      QR Session valid for: {Math.floor(qrTimeLeft / 60)}:
                      {String(qrTimeLeft % 60).padStart(2, "0")}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                      Open any UPI App (GPay, PhonePe, Paytm) and scan. Or click &apos;Pay with UPI&apos; below for instant app launch.
                    </p>
                  </div>
                )}

                <div className={styles.sslBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>256-Bit Encrypted & NPCI Certified UPI Gateway</span>
                </div>
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD */}
            {paymentTab === "card" && (
              <div className={styles.paymentCard}>
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentRadioGroup}>
                    <div className={styles.customRadio}>
                      <div className={styles.customRadioInner} />
                    </div>
                    <span className={styles.paymentName}>Debit or Credit Card</span>
                  </div>
                  <span className={styles.paymentBadgeLive}>Direct 3D Secure</span>
                </div>

                {savedCards.length > 0 && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.5rem" }}>
                      Saved Cards:
                    </p>
                    <div className={styles.savedGrid}>
                      {savedCards.map((card) => {
                        const cardId = card.id || card._id || "";
                        const isSelected = selectedCardId === cardId;
                        return (
                          <div
                            key={cardId}
                            className={`${styles.savedItemCard} ${isSelected ? styles.savedItemCardActive : ""}`}
                            onClick={() => {
                              setSelectedCardId(cardId);
                              setCardHolder(card.card_holder);
                              setCardExpiry(card.expiry);
                            }}
                          >
                            <div className={styles.savedItemHeader}>
                              <span className={styles.savedBadge}>{card.card_type.toUpperCase()}</span>
                              {isSelected && (
                                <span style={{ color: "#C89B60", fontSize: "0.85rem", fontWeight: 700 }}>
                                  ✓ Selected
                                </span>
                              )}
                            </div>
                            <div className={styles.savedItemName}>{card.card_number_masked}</div>
                            <div className={styles.savedItemDetails}>
                              {card.card_holder} | Exp: {card.expiry}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Cardholder Name *</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Eleanor Vance"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Card Number *</label>
                    <div className={styles.cardInputContainer}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        disabled={isProcessing}
                      />
                      <span className={styles.cardBrandIcon}>{cardBrand.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Expiry Date (MM/YY) *</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        disabled={isProcessing}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>CVV / CVC (3-4 digits) *</label>
                      <input
                        type="password"
                        maxLength={4}
                        className={styles.input}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <label className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={saveCardToProfile}
                      onChange={(e) => setSaveCardToProfile(e.target.checked)}
                    />
                    <span className={styles.checkboxLabel}>
                      Save this card securely for future Deluzex checkouts
                    </span>
                  </label>
                </div>

                <div className={styles.sslBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>PCI-DSS Level 1 & Bank 3D Secure Verification</span>
                </div>
              </div>
            )}

            {/* TAB 3: CASH ON DELIVERY */}
            {paymentTab === "cod" && (
              <div className={styles.codCard}>
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentRadioGroup}>
                    <div className={styles.customRadio}>
                      <div className={styles.customRadioInner} />
                    </div>
                    <span className={styles.paymentName}>Doorstep Cash on Delivery</span>
                  </div>
                  <span className={styles.paymentBadgeLive}>Instant Confirmation</span>
                </div>

                <div className={styles.codNotice}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1c1917" }}>Zero Online Hassle</div>
                    <div>
                      Pay with cash or scan delivery agent&apos;s UPI QR code when your luminaires are delivered to your doorstep.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <span className={styles.itemBadge}>{item.quantity}</span>
                    <Image
                      src={item.image || "/images/lamp_modern_tall_1784107732736.jpg"}
                      alt={item.title}
                      fill
                      sizes="80px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.title}</h4>
                    <span className={styles.itemPrice}>₹{item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>{delivery > 0 ? `₹${delivery.toFixed(2)}` : "Free"}</span>
              </div>
              <div className={styles.grandTotalRow}>
                <span>Grand Total</span>
                <span className={styles.grandTotalPrice}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className={styles.btnPlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className={styles.spinner} />
                  <span>Securing & Authorizing Payment...</span>
                </>
              ) : paymentTab === "cod" ? (
                "Confirm Cash on Delivery Order"
              ) : paymentTab === "card" ? (
                `Authorize & Pay ₹${grandTotal.toFixed(2)}`
              ) : (
                `Request ₹${grandTotal.toFixed(2)} in UPI App`
              )}
            </button>

            <div className={styles.securityGuarantee}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>100% Buyer Protection & Idempotent Secure Session</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
