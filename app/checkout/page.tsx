"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { useAuth } from "../context/AuthContext";
import {
  createPaymentOrder,
  verifyPayment,
  recordPaymentFailure,
  fetchUserAddresses,
  saveUserAddress,
  fetchUserCards,
  saveUserCard,
  SavedAddress,
  SavedCard,
  OrderPayload,
} from "../services/api";
import {
  RazorpayInstance,
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayFailureResponse,
} from "../types/razorpay";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const errorRef = useRef<HTMLDivElement>(null);
  const { cartItems, cartTotal } = useSelector((state: RootState) => state.cart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Saved Data States
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [saveCardToProfile, setSaveCardToProfile] = useState(true);

  // Payment Tab: 'upi' | 'card'
  const [paymentTab, setPaymentTab] = useState<"upi" | "card">("upi");

  // Contact & Shipping Form Fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  // Card Input Fields (when paying by Card)
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardBrand, setCardBrand] = useState<"visa" | "mastercard" | "rupay" | "other">("visa");

  const subtotal = cartTotal;
  const gst = subtotal * 0.18;
  const delivery = subtotal > 0 ? 99 : 0;
  const grandTotal = subtotal + gst + delivery;

  const applyAddress = React.useCallback((addr: SavedAddress) => {
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

  // Load saved addresses and cards for the user/email
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

  const scrollToError = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const forceDismissRazorpayModal = (rzpInstance?: RazorpayInstance) => {
    try {
      if (rzpInstance && typeof rzpInstance.close === "function") {
        rzpInstance.close();
      }
    } catch (e) {
      console.warn("Could not call rzpInstance.close():", e);
    }

    setTimeout(() => {
      try {
        const modalElements = document.querySelectorAll(
          "iframe.razorpay-checkout-frame, .razorpay-backdrop, .razorpay-container, [id^='razorpay']"
        );
        modalElements.forEach((el) => {
          if (el.tagName !== "SCRIPT") {
            el.remove();
          }
        });
        document.body.style.overflow = "";
        document.body.style.position = "";
      } catch (err) {
        console.warn("Cleanup Razorpay elements warning:", err);
      }
    }, 50);
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

    // If card payment is chosen and entering a new card, validate card details
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
    }

    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    if (typeof window === "undefined" || !window.Razorpay) {
      setErrorMessage("Payment gateway is initializing. Please wait a few seconds and try again.");
      scrollToError();
      return;
    }

    setIsProcessing(true);

    try {
      const userObj = user as Record<string, string> | null;
      const userId = userObj?._id || userObj?.id || "";

      // Save address to database and user profile if requested
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

      // Save card to database and user profile if requested and new card entered
      if (paymentTab === "card" && saveCardToProfile && cardNumber) {
        const rawCard = cardNumber.replace(/\s/g, "");
        const last4 = rawCard.slice(-4);
        const masked = `•••• •••• •••• ${last4}`;
        saveUserCard({
          user_id: userId,
          user_email: email.trim(),
          card_holder: cardHolder.trim() || `${firstName} ${lastName}`.trim(),
          card_number_masked: masked,
          card_last4: last4,
          card_type: cardBrand,
          expiry: cardExpiry.trim(),
          is_default: true,
        }).catch((err) => console.warn("Failed to persist card:", err));
      }

      const orderPayload = buildOrderPayload();

      // Step 1: Create Razorpay order on backend
      const orderData = await createPaymentOrder({
        ...orderPayload,
        payment_method: paymentTab === "card" ? "card" : "upi",
        razorpay_method: paymentTab === "card" ? "card" : "upi",
      });

      if (!orderData || !orderData.razorpay_order_id || !orderData.key_id) {
        throw new Error("Unable to initialize payment with the gateway. Please try again.");
      }

      let rzp: RazorpayInstance | null = null;

      // Step 2: Configure Razorpay Checkout options with auto-retry disabled
      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Deluzex Lighting",
        description: `Order #${orderData.order_id}`,
        order_id: orderData.razorpay_order_id,
        retry: {
          enabled: false,
        },
        prefill: {
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: {
          color: "#C89B60",
        },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // Step 3: Verify payment signature and store final payment info in DB
            const verifyRes = await verifyPayment({
              order_id: orderData.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes && verifyRes.success !== false) {
              dispatch(clearCart());
              router.push(`/checkout/success?orderId=${encodeURIComponent(orderData.order_id)}`);
            } else {
              throw new Error(verifyRes?.message || "Payment verification failed on server.");
            }
          } catch (verifyError) {
            console.error("Payment Verification Error:", verifyError);
            const msg =
              verifyError instanceof Error
                ? verifyError.message
                : "Payment verification failed. If your payment was deducted, please contact support with Order ID: " +
                  orderData.order_id;

            // Record failure in DB with status failed (not pending)
            await recordPaymentFailure({
              order_id: orderData.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              status: "failed",
              error_code: "VERIFICATION_FAILED",
              error_description: msg,
            });

            if (rzp) forceDismissRazorpayModal(rzp);
            setErrorMessage(msg);
            setIsProcessing(false);
            scrollToError();
          }
        },
        modal: {
          ondismiss: async () => {
            if (rzp) forceDismissRazorpayModal(rzp);
            setIsProcessing(false);
            const cancelMsg = "Payment was cancelled or closed. You can retry when you are ready.";
            setErrorMessage(cancelMsg);
            scrollToError();

            // Record status 'failed' in database for cancelled attempt
            await recordPaymentFailure({
              order_id: orderData.order_id,
              razorpay_order_id: orderData.razorpay_order_id,
              status: "failed",
              error_code: "PAYMENT_CANCELLED",
              error_description: "Payment modal was dismissed by customer.",
            });
          },
        },
      };

      rzp = new window.Razorpay(options);

      // Step 4: Handle Payment Failure event from Razorpay
      rzp.on("payment.failed", async (response: RazorpayFailureResponse) => {
        console.error("Razorpay Payment Failed:", response);

        // 1. Immediately close Razorpay modal
        if (rzp) forceDismissRazorpayModal(rzp);

        // 2. Extract exact error details
        const errorObj = response?.error;
        const exactReason =
          errorObj?.description ||
          errorObj?.reason ||
          "Payment was declined by your bank or card provider. Please try again.";
        const errorCode = errorObj?.code || "PAYMENT_FAILED";
        const errorReason = errorObj?.reason || "";
        const errorSource = errorObj?.source || "";
        const errorStep = errorObj?.step || "";
        const paymentId = errorObj?.metadata?.payment_id || "";
        const rzpOrderId = errorObj?.metadata?.order_id || orderData.razorpay_order_id;

        // 3. Store exact error and status 'failed' in database
        await recordPaymentFailure({
          order_id: orderData.order_id,
          razorpay_order_id: rzpOrderId,
          razorpay_payment_id: paymentId,
          status: "failed",
          error_code: errorCode,
          error_description: exactReason,
          error_source: errorSource,
          error_step: errorStep,
          error_reason: errorReason,
        });

        // 4. Show exact error message at top of checkout screen
        setErrorMessage(exactReason);
        setIsProcessing(false);

        // 5. Scroll to top so user sees the error immediately
        scrollToError();
      });

      rzp.open();
    } catch (err) {
      console.error("Payment Initialization Error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to initialize payment. Please check your internet connection and try again.";
      setErrorMessage(msg);
      setIsProcessing(false);
      scrollToError();
    }
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Top Error Message Banner */}
      {errorMessage && (
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
            aria-label="Dismiss error message"
          >
            ×
          </button>
        </div>
      )}

      <h1 className={styles.title}>Checkout</h1>

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
              <label className={styles.label}>Phone Number (with WhatsApp/SMS updates) *</label>
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

          {/* Shipping Address & Saved Addresses */}
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

            {/* Saved Address Cards */}
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
                        {isSelected && <span style={{ color: "#C89B60", fontSize: "0.85rem", fontWeight: 700 }}>✓ Selected</span>}
                      </div>
                      <div className={styles.savedItemName}>{addr.first_name} {addr.last_name}</div>
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
              <span className={styles.checkboxLabel}>Save this address to my profile for future checkouts</span>
            </label>
          </div>

          {/* Payment Method Section (UPI & Cards) */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>

            {/* Payment Method Switcher Tabs */}
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
                <span>💳 Credit / Debit Card</span>
              </div>
            </div>

            {paymentTab === "upi" ? (
              <div className={styles.paymentCard}>
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentRadioGroup}>
                    <div className={styles.customRadio}>
                      <div className={styles.customRadioInner} />
                    </div>
                    <span className={styles.paymentName}>UPI Instant Payment</span>
                  </div>
                  <span className={styles.paymentBadgeLive}>Instant & Zero Fee</span>
                </div>
                <p className={styles.paymentDesc}>
                  Pay directly via any UPI App (Google Pay, PhonePe, Paytm, BHIM) or scan dynamic QR powered by Razorpay.
                </p>

                <div className={styles.paymentBadgeList}>
                  <span className={styles.paymentBadgeItem}>Google Pay</span>
                  <span className={styles.paymentBadgeItem}>PhonePe</span>
                  <span className={styles.paymentBadgeItem}>Paytm</span>
                  <span className={styles.paymentBadgeItem}>BHIM UPI</span>
                </div>

                <div className={styles.sslBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>256-bit End-to-End SSL Encrypted Checkout</span>
                </div>
              </div>
            ) : (
              <div className={styles.paymentCard}>
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentRadioGroup}>
                    <div className={styles.customRadio}>
                      <div className={styles.customRadioInner} />
                    </div>
                    <span className={styles.paymentName}>Debit or Credit Card</span>
                  </div>
                  <span className={styles.paymentBadgeLive}>All Cards Supported</span>
                </div>

                {/* Saved Cards List */}
                {savedCards.length > 0 && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.5rem" }}>
                      Saved Cards in Your Profile:
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
                              {isSelected && <span style={{ color: "#C89B60", fontSize: "0.85rem", fontWeight: 700 }}>✓ Selected</span>}
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

                {/* Card Input Form */}
                <div style={{ marginTop: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Cardholder Name *</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Alex Morgan"
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
                  </div>

                  <label className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={saveCardToProfile}
                      onChange={(e) => setSaveCardToProfile(e.target.checked)}
                    />
                    <span className={styles.checkboxLabel}>Save this card securely to my profile for future checkouts</span>
                  </label>
                </div>

                <div className={styles.sslBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>PCI-DSS Compliant & 256-bit Encrypted</span>
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
                  <span>Processing Payment...</span>
                </>
              ) : (
                `Pay ₹${grandTotal.toFixed(2)} with ${paymentTab === "card" ? "Card" : "UPI"}`
              )}
            </button>

            <div className={styles.securityGuarantee}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C89B60" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>100% Buyer Protection & Deluzex Warranty</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
