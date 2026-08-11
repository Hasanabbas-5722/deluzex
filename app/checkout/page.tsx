"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import {
  fetchPaymentMethods,
  createPaymentOrder,
  verifyPayment,
  createCodOrder,
  PaymentMethod,
  OrderPayload,
} from "../services/api";
import styles from "./checkout.module.css";

const PAYMENT_ICONS: Record<string, string> = {
  google_pay: "GPay",
  phonepe: "Pe",
  paytm: "Paytm",
  bhim: "BHIM",
  amazon_pay: "Amazon",
  upi: "UPI",
  card: "Card",
  netbanking: "Bank",
  wallet: "Wallet",
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems, cartTotal } = useSelector((state: RootState) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  const subtotal = cartTotal;
  const gst = subtotal * 0.18;
  const delivery = subtotal > 0 ? 99 : 0;
  const grandTotal = subtotal + gst + delivery;

  useEffect(() => {
    if (paymentMethod === "upi" && paymentMethods.length === 0) {
      setLoadingMethods(true);
      fetchPaymentMethods()
        .then(setPaymentMethods)
        .catch(() => alert("Failed to load payment methods. Please try again."))
        .finally(() => setLoadingMethods(false));
    }
  }, [paymentMethod, paymentMethods.length]);

  const buildOrderPayload = (): OrderPayload => ({
    email,
    phone,
    shipping_address: {
      first_name: firstName,
      last_name: lastName,
      street,
      city,
      state,
      pin_code: pinCode,
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

  const isFormValid = () =>
    email && phone && firstName && lastName && street && city && state && pinCode;

  const handleRazorpayPayment = async (method: PaymentMethod) => {
    if (!isFormValid()) {
      alert("Please fill in all contact and shipping details before paying.");
      return;
    }

    setIsProcessing(true);
    setSelectedMethodId(method.id);

    try {
      const orderPayload = buildOrderPayload();
      const orderData = await createPaymentOrder({
        ...orderPayload,
        payment_method: method.razorpay_method as "upi" | "card" | "netbanking" | "wallet",
        razorpay_method: method.razorpay_method,
      });

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Deluzex Lighting",
        description: `Payment via ${method.name}`,
        order_id: orderData.razorpay_order_id,
        // method: method.razorpay_method,

        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment({
              order_id: orderData.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(clearCart());
            router.push(`/checkout/success?orderId=${orderData.order_id}`);
          } catch {
            alert("Payment verification failed. Please contact support.");
            setIsProcessing(false);
            setSelectedMethodId(null);
          }
        },
        prefill: {
          name: `${firstName} ${lastName}`.trim(),
          email,
          contact: phone,
        },
        theme: { color: "#2B2B2B" },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setSelectedMethodId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
        setIsProcessing(false);
        setSelectedMethodId(null);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      alert(error instanceof Error ? error.message : "Failed to initialize payment.");
      setIsProcessing(false);
      setSelectedMethodId(null);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "upi") {
      alert("Please select a payment method below to proceed.");
      return;
    }

    if (!isFormValid()) return;

    setIsProcessing(true);

    try {
      const result = await createCodOrder(buildOrderPayload());
      dispatch(clearCart());
      router.push(`/checkout/success?orderId=${result.order_id}`);
    } catch (error) {
      console.error("Order Error:", error);
      alert(error instanceof Error ? error.message : "Failed to place order.");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>Your Cart is Empty</h1>
          <p>Please add some items to your cart before proceeding to checkout.</p>
          <a href="/shop" className={styles.btnReturn}>Return to Shop</a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <h1 className={styles.title}>Checkout</h1>

      <form onSubmit={handlePlaceOrder} className={styles.checkoutGrid}>
        <div className={styles.leftCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                required
                className={styles.input}
                placeholder="Enter your email"
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
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="First Name"
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
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Street Address</label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="House number and street name"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>State</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>PIN Code</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="PIN Code"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentOption} ${paymentMethod === "cod" ? styles.paymentOptionActive : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className={`${styles.paymentOption} ${paymentMethod === "upi" ? styles.paymentOptionActive : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Online Payment (UPI / Card / Net Banking)</span>
              </label>
            </div>

            {/* {paymentMethod === "upi" && (
              <div className={styles.razorpayMethods}>
                <p className={styles.razorpayMethodsTitle}>Choose a payment method</p>
                {loadingMethods ? (
                  <p className={styles.razorpayMethodsLoading}>Loading payment options...</p>
                ) : (
                  <div className={styles.razorpayMethodsGrid}>
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        className={`${styles.razorpayMethodCard} ${
                          selectedMethodId === method.id ? styles.razorpayMethodCardActive : ""
                        }`}
                        disabled={isProcessing}
                        onClick={() => handleRazorpayPayment(method)}
                      >
                        <span className={styles.razorpayMethodIcon}>
                          {PAYMENT_ICONS[method.icon] || method.name.charAt(0)}
                        </span>
                        <span className={styles.razorpayMethodName}>{method.name}</span>
                        <span className={styles.razorpayMethodDesc}>{method.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )} */}
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <span className={styles.itemBadge}>{item.quantity}</span>
                    <Image src={item.image} alt={item.title} fill style={{ objectFit: "contain" }} />
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
                <span>₹{delivery.toFixed(2)}</span>
              </div>
              <div className={styles.grandTotalRow}>
                <span>Grand Total</span>
                <span className={styles.grandTotalPrice}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {paymentMethod === "cod" ? (
              <button type="submit" className={styles.btnPlaceOrder} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            ) : (
              <p className={styles.upiHint}>
                Select a payment method above to pay ₹{grandTotal.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}
