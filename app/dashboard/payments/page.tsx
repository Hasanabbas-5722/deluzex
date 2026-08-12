"use client";

import React, { useEffect, useState } from "react";
import styles from "./payments.module.css";
import { useAuth } from "../../context/AuthContext";
import {
  fetchUserCards,
  saveUserCard,
  deleteUserCard,
  SavedCard,
} from "../../services/api";

const initialSampleCards: SavedCard[] = [
  {
    card_type: "visa",
    card_holder: "MIKE JOHN",
    card_number_masked: "5871  6650  8710  2334",
    card_last4: "2334",
    expiry: "12/27",
    is_default: true,
    user_email: "mike.john@example.com",
  },
  {
    card_type: "mastercard",
    card_holder: "MIKE JOHN",
    card_number_masked: "4012  8888  8888  3322",
    card_last4: "3322",
    expiry: "12/27",
    is_default: false,
    user_email: "mike.john@example.com",
  },
];

const CARD_GRADIENTS: Record<string, string> = {
  visa: "linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)",
  mastercard: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
  rupay: "linear-gradient(135deg, #0d3b66 0%, #0077b6 100%)",
  other: "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)",
};

function VisaLogo() {
  return (
    <span
      style={{
        fontFamily: "serif",
        fontStyle: "italic",
        fontWeight: 900,
        fontSize: "1.4rem",
        color: "#fff",
        letterSpacing: "-1px",
      }}
    >
      VISA
    </span>
  );
}

function MastercardLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#eb001b", opacity: 0.95 }} />
      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f79e1b", marginLeft: "-12px", opacity: 0.95 }} />
    </div>
  );
}

function ChipIcon() {
  return (
    <svg width="42" height="32" viewBox="0 0 42 32" fill="none">
      <rect x="1" y="1" width="40" height="30" rx="5" fill="#f0d080" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <rect x="14" y="1" width="1.5" height="30" fill="rgba(0,0,0,0.1)" />
      <rect x="26.5" y="1" width="1.5" height="30" fill="rgba(0,0,0,0.1)" />
      <rect x="1" y="10" width="40" height="1.5" fill="rgba(0,0,0,0.1)" />
      <rect x="1" y="20" width="40" height="1.5" fill="rgba(0,0,0,0.1)" />
      <rect x="14" y="10" width="14" height="12" rx="1" fill="rgba(0,0,0,0.06)" />
    </svg>
  );
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const userEmail = (user as Record<string, string>)?.email || "";
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);

  // Add Card Modal State
  const [showModal, setShowModal] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "rupay" | "other">("visa");

  const loadCards = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUserCards(userEmail);
      if (data && data.length > 0) {
        setCards(data);
      } else {
        setCards(initialSampleCards);
      }
    } catch {
      setCards(initialSampleCards);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);

    if (raw.startsWith("4")) {
      setCardType("visa");
    } else if (/^(5[1-5]|2[2-7])/.test(raw)) {
      setCardType("mastercard");
    } else if (/^(60|65|81|82|508)/.test(raw)) {
      setCardType("rupay");
    } else {
      setCardType("other");
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawCard = cardNumber.replace(/\s/g, "");
    if (!cardHolder || rawCard.length < 15 || cardExpiry.length < 5) {
      alert("Please fill in valid card details.");
      return;
    }

    const last4 = rawCard.slice(-4);
    const masked = `•••• •••• •••• ${last4}`;

    const newCard: SavedCard = {
      user_email: userEmail || "customer@deluzex.com",
      card_holder: cardHolder.toUpperCase(),
      card_number_masked: masked,
      card_last4: last4,
      card_type: cardType,
      expiry: cardExpiry,
      is_default: cards.length === 0,
    };

    await saveUserCard(newCard);
    setShowModal(false);
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    loadCards();
  };

  const handleDeleteCard = async (card: SavedCard, e: React.MouseEvent) => {
    e.stopPropagation();
    const cardId = card.id || card._id;
    if (cardId) {
      await deleteUserCard(cardId, userEmail);
    }
    setCards((prev) => prev.filter((c) => (c.id || c._id) !== cardId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Payment Methods</h1>
          <p className={styles.subtitle}>Manage your saved cards for a fast, one-click checkout experience.</p>
        </div>
        <button className={styles.btnAdd} onClick={() => setShowModal(true)}>
          + Add New Card
        </button>
      </div>

      {/* Add Card Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Save Payment Card</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveCard} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ALEX MORGAN"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Card Number *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "6px" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#1a6cbc",
                      background: "#f0f0f0",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {cardType.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Expiry Date (MM/YY) *
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>

              <div style={{ fontSize: "0.78rem", color: "#666", lineHeight: 1.4 }}>
                🔒 Card details are tokenized and saved securely in compliance with PCI-DSS standards.
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    background: "#f5f5f5",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    border: "none",
                    borderRadius: "6px",
                    background: "#C89B60",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Grid */}
      {loading ? (
        <p style={{ color: "#777", padding: "2rem 0" }}>Loading saved cards...</p>
      ) : (
        <div className={styles.cardGrid}>
          {cards.map((card, i) => {
            const isSelected = selected === i;
            const gradient = CARD_GRADIENTS[card.card_type] || CARD_GRADIENTS.other;
            return (
              <div
                key={card.id || card._id || i}
                className={`${styles.cardUiWrapper} ${isSelected ? styles.cardUiSelected : ""}`}
                onClick={() => setSelected(i)}
              >
                {/* Selection indicator */}
                <div className={styles.cardSelectRow}>
                  <span className={styles.cardSelectLabel}>
                    {card.is_default || isSelected
                      ? `✓ Saved Card •••• ${card.card_last4}`
                      : `${card.card_type.toUpperCase()} •••• ${card.card_last4}`}
                  </span>
                  <div className={`${styles.radioBtn} ${isSelected ? styles.radioBtnActive : ""}`}>
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                </div>

                {/* Physical card */}
                <div className={styles.physicalCard} style={{ background: gradient }}>
                  <div className={styles.cardCircle1} />
                  <div className={styles.cardCircle2} />

                  <div className={styles.cardTopRow}>
                    <ChipIcon />
                    <div className={styles.cardNetwork}>
                      {card.card_type === "visa" ? (
                        <VisaLogo />
                      ) : card.card_type === "mastercard" ? (
                        <MastercardLogo />
                      ) : (
                        <span style={{ fontWeight: 800, color: "white", fontSize: "1.1rem" }}>
                          {card.card_type.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.cardNumber}>{card.card_number_masked}</div>

                  <div className={styles.cardBottomRow}>
                    <div>
                      <div className={styles.cardFieldLabel}>Card Holder</div>
                      <div className={styles.cardFieldValue}>{card.card_holder}</div>
                    </div>
                    <div>
                      <div className={styles.cardFieldLabel}>Expires</div>
                      <div className={styles.cardFieldValue}>{card.expiry}</div>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.cardActionBtnDelete}
                      onClick={(e) => handleDeleteCard(card, e)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Payment Method card */}
      <div className={styles.addPaymentCard} onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        <div className={styles.addPaymentIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <div className={styles.addPaymentText}>
          <div className={styles.addPaymentName}>Add New Payment Method</div>
          <div className={styles.addPaymentSub}>Save debit/credit cards for quick checkout.</div>
        </div>
        <div className={styles.paymentLogos}>
          <div className={styles.paymentLogo}>
            <span style={{ color: "#1a6cbc", fontWeight: 800, fontSize: "0.9rem" }}>
              Ru<span style={{ color: "#f59e0b" }}>Pay</span>
            </span>
          </div>
          <div className={styles.paymentLogo}>
            <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#555" }}>VISA</span>
          </div>
        </div>
      </div>

      {/* Secure Banner */}
      <div className={styles.secureBanner}>
        <div className={styles.secureIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className={styles.secureText}>
          <div className={styles.secureName}>100% Secure & PCI-DSS Compliant</div>
          <div className={styles.secureSub}>Your card details are tokenized and securely stored with user attribution.</div>
        </div>
      </div>
    </div>
  );
}
