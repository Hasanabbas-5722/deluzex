"use client";
import React, { useState } from "react";
import styles from "./payments.module.css";

const cards = [
  {
    type: "visa",
    label: "Visa",
    holder: "MIKE JOHN",
    number: "5871  6650  8710  2334",
    expiry: "12/27",
    gradient: "linear-gradient(135deg, #3a49d6 0%, #5b6cf0 100%)",
    chipColor: "#f0d080",
  },
  {
    type: "mastercard",
    label: "Mastercard",
    holder: "MIKE JOHN",
    number: "4012  8888  8888  3322",
    expiry: "12/27",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
    chipColor: "#d0c060",
  },
  {
    type: "mastercard",
    label: "Mastercard",
    holder: "MIKE JOHN",
    number: "5500  0055  5555  3322",
    expiry: "12/27",
    gradient: "linear-gradient(135deg, #6a3093 0%, #a044ff 100%)",
    chipColor: "#e8d080",
  },
  {
    type: "visa",
    label: "Visa",
    holder: "MIKE JOHN",
    number: "4111  1111  1111  3322",
    expiry: "12/27",
    gradient: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    chipColor: "#f0d080",
  },
];

function VisaLogo() {
  return (
    <span style={{
      fontFamily: "serif",
      fontStyle: "italic",
      fontWeight: 900,
      fontSize: "1.4rem",
      color: "#fff",
      letterSpacing: "-1px",
    }}>
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

function ChipIcon({ color }: { color: string }) {
  return (
    <svg width="42" height="32" viewBox="0 0 42 32" fill="none">
      <rect x="1" y="1" width="40" height="30" rx="5" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <rect x="14" y="1" width="1.5" height="30" fill="rgba(0,0,0,0.1)" />
      <rect x="26.5" y="1" width="1.5" height="30" fill="rgba(0,0,0,0.1)" />
      <rect x="1" y="10" width="40" height="1.5" fill="rgba(0,0,0,0.1)" />
      <rect x="1" y="20" width="40" height="1.5" fill="rgba(0,0,0,0.1)" />
      <rect x="14" y="10" width="14" height="12" rx="1" fill="rgba(0,0,0,0.06)" />
    </svg>
  );
}

function CreditCardUI({ card, isSelected, onClick }: {
  card: typeof cards[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`${styles.cardUiWrapper} ${isSelected ? styles.cardUiSelected : ""}`}
      onClick={onClick}
    >
      {/* Selection indicator */}
      <div className={styles.cardSelectRow}>
        <span className={styles.cardSelectLabel}>
          {isSelected ? "✓ Default Card" : card.label + " •••• " + card.number.slice(-4)}
        </span>
        <div className={`${styles.radioBtn} ${isSelected ? styles.radioBtnActive : ""}`}>
          {isSelected && <div className={styles.radioDot} />}
        </div>
      </div>

      {/* Physical card */}
      <div className={styles.physicalCard} style={{ background: card.gradient }}>
        {/* Decorative circles */}
        <div className={styles.cardCircle1} />
        <div className={styles.cardCircle2} />

        {/* Top row: chip + network */}
        <div className={styles.cardTopRow}>
          <ChipIcon color={card.chipColor} />
          <div className={styles.cardNetwork}>
            {card.type === "visa" ? <VisaLogo /> : <MastercardLogo />}
          </div>
        </div>

        {/* Card number */}
        <div className={styles.cardNumber}>{card.number}</div>

        {/* Bottom row */}
        <div className={styles.cardBottomRow}>
          <div>
            <div className={styles.cardFieldLabel}>Card Holder</div>
            <div className={styles.cardFieldValue}>{card.holder}</div>
          </div>
          <div>
            <div className={styles.cardFieldLabel}>Expires</div>
            <div className={styles.cardFieldValue}>{card.expiry}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles.cardActions}>
          <button className={styles.cardActionBtn} onClick={(e) => e.stopPropagation()}>Edit</button>
          <button className={styles.cardActionBtnDelete} onClick={(e) => e.stopPropagation()}>Remove</button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Payment Methods</h1>
          <p className={styles.subtitle}>Manage your saved cards for a fast checkout experience.</p>
        </div>
        <button className={styles.btnAdd}>+ Add New Card</button>
      </div>

      {/* Card Grid */}
      <div className={styles.cardGrid}>
        {cards.map((card, i) => (
          <CreditCardUI
            key={i}
            card={card}
            isSelected={selected === i}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>

      {/* Add New Payment Method */}
      <div className={styles.addPaymentCard}>
        <div className={styles.addPaymentIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <div className={styles.addPaymentText}>
          <div className={styles.addPaymentName}>Add New Payment Method</div>
          <div className={styles.addPaymentSub}>Add debit/credit card, UPI or other payment options.</div>
        </div>
        <div className={styles.paymentLogos}>
          <div className={styles.paymentLogo}>
            <span style={{ color: "#1a6cbc", fontWeight: 800, fontSize: "0.9rem" }}>Ru<span style={{ color: "#f59e0b" }}>Pay</span>
              <span style={{ color: "#e53935", marginLeft: "2px" }}>⟩</span>
            </span>
          </div>
          <div className={styles.paymentLogo} style={{ letterSpacing: "-0.5px" }}>
            <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#555" }}>UPI</span>
            <span style={{ fontSize: "0.6rem", color: "#888", marginLeft: "2px" }}>◆</span>
          </div>
          <div className={styles.paymentLogo}>
            <div style={{ display: "flex" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#eb001b", opacity: 0.9 }} />
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#f79e1b", marginLeft: "-8px", opacity: 0.9 }} />
            </div>
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
          <div className={styles.secureName}>100% Secure Payments</div>
          <div className={styles.secureSub}>Your payment information is encrypted and safe with us.</div>
        </div>
        <button className={styles.btnLearnMore}>Learn more</button>
      </div>
    </div>
  );
}
