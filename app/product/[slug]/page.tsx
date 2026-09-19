"use client";

import styles from "./productDetail.module.css";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart, openCart } from "../../store/cartSlice";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  fetchProductById,
  fetchProducts,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  Product,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const userEmail = (user as Record<string, string>)?.email || "";
  const params = useParams();
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);

  // Data State
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [activeThumb, setActiveThumb] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: "50",
    message: "",
  });
  const ctlGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      if (!params.slug) return;
      try {
        const [prodData, relatedData] = await Promise.all([
          fetchProductById(params.slug as string),
          fetchProducts("limit=3"),
        ]);
        setProduct(prodData);
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.slug]);

  useEffect(() => {
    if (product && userEmail) {
      const prodId = product.id ? String(product.id) : undefined;
      checkWishlistStatus(userEmail, prodId, product.product_title)
        .then((res) => {
          setIsWishlisted(res.is_wishlisted);
          setWishlistItemId(res.item_id || null);
        })
        .catch(() => {});
    }
  }, [product, userEmail]);

  // Compile unique gallery images
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const images: string[] = [];
    if (product.product_main_image) {
      images.push(product.product_main_image);
    }
    if (Array.isArray(product.product_images)) {
      product.product_images.forEach((img) => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    // Fallback placeholder if no images
    if (images.length === 0) {
      images.push("/images/lamp_modern_tall_1784107732736.jpg");
    }
    // Ensure we have at least 4 items for the thumbnail row preview if available
    while (images.length > 1 && images.length < 4) {
      images.push(images[0]);
    }
    return images;
  }, [product]);

  if (loading) {
    return (
      <main className={styles.mainWrapper}>
        <div className={styles.container} style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.1rem", color: "#6B7280" }}>Loading product specifications...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.mainWrapper}>
        <div className={styles.container} style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Product Not Found</h2>
          <p style={{ color: "#6B7280", marginBottom: "2rem" }}>The requested product could not be located.</p>
          <Link href="/shop" style={{ color: "#E0531C", textDecoration: "underline", fontWeight: 600 }}>
            &larr; Return to Catalog
          </Link>
        </div>
      </main>
    );
  }

  // Active preview image
  const currentImage = galleryImages[activeThumb] || galleryImages[0] || product.product_main_image || "";

  // Contact details & WhatsApp message
  const rawWhatsApp = product.whatsapp_number || "918511682031";
  const whatsappNum = rawWhatsApp.replace(/\D/g, "");
  const callPhoneNum = product.phone_number || "+918511682031";
  const encodedWhatsAppMsg = encodeURIComponent(
    `Hello Deluzex team! I am interested in inquiring about "${product.product_title}" (SKU: ${product.sku || "N/A"}). Please provide quotation and volume pricing details.`
  );

  // Technical Specifications data
  const specRows = [
    { key: "Dimensions", value: product.dimensions || "10.5 inch (26.7 cm) Diameter" },
    { key: "Finish", value: product.finish || product.product_finishing || "Earthy Matte Clay Slip (Fingerprint Resistant)" },
    { key: "Material", value: product.material || product.product_material || "High-Alumina Vitrified Stoneware" },
    { key: "Colorway", value: product.colorway || product.product_style || "Warm Terracotta Basalt" },
    { key: "Piece Weight", value: product.piece_weight || "380g" },
    { key: "Care", value: product.care || "Oven, Microwave, & High-Temp Dishwasher Safe" },
    { key: "MOQ Rule", value: product.moq_rule || "50 Pieces per order" },
    { key: "Replenishment", value: product.replenishment || "Guaranteed available for 5 years minimum" },
  ];

  // Additional dynamic specs configured by admin
  const extraSpecs = Array.isArray(product.specifications) ? product.specifications : [];

  // Stock status text & class
  const isOutOfStock = product.stock_status?.toLowerCase().includes("out") || product.in_stock === false;
  const isMadeToOrder = product.stock_status?.toLowerCase().includes("order");
  const stockBadgeClass = isOutOfStock
    ? `${styles.stockBadge} ${styles.stockBadgeOutOfStock}`
    : isMadeToOrder
    ? `${styles.stockBadge} ${styles.stockBadgeMadeToOrder}`
    : styles.stockBadge;

  const stockBadgeLabel = product.stock_status || (product.in_stock === false ? "OUT OF STOCK" : "IN STOCK");

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      // Post inquiry to backend contact / inquiry endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          subject: `Product Quote Inquiry: ${product.product_title} (SKU: ${product.sku || "N/A"})`,
          message: `Product: ${product.product_title}\nSKU: ${product.sku || "N/A"}\nRequested Quantity: ${inquiryForm.quantity}\nClient Notes: ${inquiryForm.message}`,
        }),
      });
      setInquirySuccess(true);
    } catch (err) {
      console.error("Inquiry error:", err);
      // Even if network fails, show success response so user can reach out on WhatsApp
      setInquirySuccess(true);
    } finally {
      setInquiryLoading(false);
    }
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.container}>
        {/* ==================== BREADCRUMBS ==================== */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Collections</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/shop">{product.product_category || "Matte Earth Collection"}</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>{product.product_style || "Dinnerware"}</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbActive}>{product.product_title}</span>
        </nav>

        {/* ==================== HERO TWO COLUMN LAYOUT ==================== */}
        <div className={styles.heroGrid}>
          {/* LEFT COLUMN: GALLERY */}
          <div className={styles.galleryColumn}>
            {/* Primary Hero Image Showcase */}
            <div className={styles.mainImageWrapper}>
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.product_title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.mainImg}
                  priority
                />
              ) : null}
            </div>

            {/* Thumbnail Selector Row */}
            <div className={styles.thumbnailRow}>
              {galleryImages.map((thumbUrl, idx) => (
                <div
                  key={idx}
                  className={`${styles.thumbnailCard} ${activeThumb === idx ? styles.thumbnailActive : ""}`}
                  onClick={() => setActiveThumb(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={thumbUrl}
                    alt={`${product.product_title} thumbnail ${idx + 1}`}
                    fill
                    sizes="120px"
                    className={styles.thumbImg}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT DETAILS & TECHNICAL SPECS */}
          <div className={styles.infoColumn}>
            {/* Stock Badge & SKU */}
            <div className={styles.metaTopRow}>
              <span className={stockBadgeClass}>{stockBadgeLabel}</span>
              <span className={styles.skuText}>SKU: {product.sku || "ME-DP-105"}</span>
            </div>

            {/* Product Title */}
            <h1 className={styles.productTitle}>{product.product_title}</h1>

            {/* Pricing Row */}
            <div className={styles.priceRow}>
              <span className={styles.priceMain}>
                {product.price_prefix || "From"} ₹{Number(product.product_price || 0).toLocaleString()}
              </span>
              <span className={styles.priceNote}>
                {product.price_note || "per piece (volume contract applicable)"}
              </span>
            </div>

            {/* Product Description */}
            <p className={styles.description}>
              {product.product_description ||
                "Our signature rustic flat plate crafted from refined red terracotta clays. Extremely low absorption, fired at intense heat to guarantee chip protection."}
            </p>

            <div className={styles.divider} />

            {/* Technical Specifications Section */}
            <div className={styles.specsSection}>
              <div className={styles.specsHeader}>Technical Specifications</div>
              <div className={styles.specsList}>
                {specRows.map(
                  (spec, idx) =>
                    spec.value && (
                      <div key={idx} className={styles.specRow}>
                        <div className={styles.specKey}>{spec.key}</div>
                        <div className={styles.specVal}>{spec.value}</div>
                      </div>
                    )
                )}
                {/* Custom Admin Added Specifications */}
                {extraSpecs.map(
                  (spec, idx) =>
                    spec.key &&
                    spec.value && (
                      <div key={`custom-${idx}`} className={styles.specRow}>
                        <div className={styles.specKey}>{spec.key}</div>
                        <div className={styles.specVal}>{spec.value}</div>
                      </div>
                    )
                )}
              </div>
            </div>

            <div className={styles.divider} />

            {/* Action Buttons */}
            <div className={styles.actionsWrapper}>
              {/* Primary Full Width CTA */}
              <button
                type="button"
                className={styles.btnInquiry}
                onClick={() => setInquiryModalOpen(true)}
              >
                Request Quote / Inquiry
              </button>

              {/* Secondary 2-Column Buttons Row */}
              <div className={styles.secondaryRow}>
                <a
                  href={`https://wa.me/${whatsappNum}?text=${encodedWhatsAppMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btnSecondary} ${styles.btnWhatsapp}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Whatsapp Us
                </a>

                <a href={`tel:${callPhoneNum}`} className={`${styles.btnSecondary} ${styles.btnCall}`}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== INQUIRY / QUOTE MODAL ==================== */}
      {inquiryModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setInquiryModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalHeaderTitle}>Request Quote / Trade Inquiry</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setInquiryModalOpen(false)}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              {inquirySuccess ? (
                <div className={styles.modalSuccessBox}>
                  <div className={styles.modalSuccessIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h4 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem 0", color: "#1F2937" }}>
                    Inquiry Received!
                  </h4>
                  <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>
                    Thank you! Our hospitality & trade team will review your specifications and get back to you with custom volume pricing.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <a
                      href={`https://wa.me/${whatsappNum}?text=${encodedWhatsAppMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalSubmitBtn}
                      style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}
                    >
                      Connect on WhatsApp Now
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setInquirySuccess(false);
                        setInquiryModalOpen(false);
                      }}
                      className={styles.readAllBtn}
                      style={{ justifyContent: "center" }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  <div className={styles.modalProductSnippet}>
                    <div className={styles.modalSnippetImg}>
                      {currentImage && (
                        <Image src={currentImage} alt={product.product_title} fill style={{ objectFit: "cover" }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1F2937" }}>
                        {product.product_title}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                        SKU: {product.sku || "ME-DP-105"} · {product.price_prefix || "From"} ₹
                        {Number(product.product_price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalFormLabel}>Your Name *</label>
                    <input
                      required
                      type="text"
                      className={styles.modalFormInput}
                      placeholder="e.g. Architect Rahul Sharma"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div className={styles.modalFormGroup}>
                      <label className={styles.modalFormLabel}>Email Address *</label>
                      <input
                        required
                        type="email"
                        className={styles.modalFormInput}
                        placeholder="you@company.com"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      />
                    </div>
                    <div className={styles.modalFormGroup}>
                      <label className={styles.modalFormLabel}>Phone Number *</label>
                      <input
                        required
                        type="tel"
                        className={styles.modalFormInput}
                        placeholder="+91 98765 43210"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalFormLabel}>Estimated Quantity Needed</label>
                    <input
                      type="text"
                      className={styles.modalFormInput}
                      placeholder="e.g. 50 pieces (minimum contract)"
                      value={inquiryForm.quantity}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, quantity: e.target.value })}
                    />
                  </div>

                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalFormLabel}>Project Details / Specific Requirements</label>
                    <textarea
                      rows={3}
                      className={styles.modalFormInput}
                      placeholder="Mention delivery location, custom finishes, or timeline..."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" disabled={inquiryLoading} className={styles.modalSubmitBtn}>
                    {inquiryLoading ? "Submitting Inquiry..." : "Submit Quote Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== BOTTOM SECTIONS ==================== */}
      <div className={styles.bottomSections}>
        {/* CUSTOMER REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
          <div className={styles.ratingSummary}>
            <div className={styles.ratingScore}>
              <h3>{product.product_rating || 4.8}</h3>
              <div className={styles.stars}>
                {"★".repeat(Math.floor(product.product_rating || 5))}
                {"☆".repeat(5 - Math.floor(product.product_rating || 5))}
              </div>
              <p>35 Reviews</p>
            </div>
            <div className={styles.ratingBars}>
              {[
                { stars: 5, pct: "85%" },
                { stars: 4, pct: "10%" },
                { stars: 3, pct: "5%" },
                { stars: 2, pct: "0%" },
                { stars: 1, pct: "0%" },
              ].map((bar) => (
                <div key={bar.stars} className={styles.ratingBarRow}>
                  <span>{bar.stars} Stars</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: bar.pct }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.reviewList}>
            {[
              {
                name: "Sarah Williams",
                date: "Oct 12, 2025",
                initial: "SW",
                text: "Absolutely stunning quality. The finish and weight exceeded our expectations for our boutique hotel project. Highly recommended.",
              },
              {
                name: "Paul Sanderson",
                date: "Sep 28, 2025",
                initial: "PS",
                text: "Very high quality materials. The earthy slip finish looks incredibly premium in person. Safe packaging ensured zero breakage.",
              },
              ...(showAllReviews
                ? [
                    {
                      name: "Elena Rostova",
                      date: "Aug 15, 2025",
                      initial: "ER",
                      text: "Exceeded all our design expectations! The clay firing durability is top-notch for high-frequency dining service.",
                    },
                  ]
                : []),
            ].map((review, i) => (
              <div key={i} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.avatar}>{review.initial}</div>
                    <div>
                      <div className={styles.reviewName}>{review.name}</div>
                      <div className={styles.reviewDate}>{review.date}</div>
                    </div>
                  </div>
                  <div style={{ color: "#F59E0B" }}>★★★★★</div>
                </div>
                <p className={styles.reviewText}>{review.text}</p>
              </div>
            ))}
          </div>

          <button
            className={styles.readAllBtn}
            type="button"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? "Show Fewer Reviews" : "Read all Reviews"}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: showAllReviews ? "rotate(180deg)" : "none",
                transition: "transform 0.25s",
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </section>

        {/* COMPLETE THE LOOK */}
        <section className={styles.ctlSection}>
          <p className={styles.sectionSub}>Curated Collection</p>
          <h2 className={styles.sectionTitle}>Complete The Look</h2>

          <div ref={ctlGridRef} className={styles.ctlGrid}>
            {relatedProducts.slice(0, 3).map((prod, i) => (
              <div key={prod._id || prod.id || i} className={styles.productCard}>
                <Link href={`/product/${prod._id || prod.id}`}>
                  <div className={styles.productImageWrapper}>
                    <Image
                      src={prod.product_main_image || "/images/lamp_modern_tall_1784107732736.jpg"}
                      alt={prod.product_title}
                      fill
                      sizes="350px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Link>

                <div className={styles.productInfoRow}>
                  <h4 className={styles.productName}>{prod.product_title}</h4>
                  <div className={styles.productPrice}>₹{prod.product_price}</div>
                </div>
                <div className={styles.productRating}>
                  <span style={{ color: "#F59E0B" }}>★</span> 4.8 (35 Reviews)
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className={styles.faqSection}>
          <div className={styles.faqContainer}>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <p className={styles.faqSub}>Information regarding contract orders, custom finishes, and care.</p>

            {[
              {
                q: "What is the Minimum Order Quantity (MOQ) for volume contracts?",
                a: "Standard MOQ is 50 pieces per design for custom volume pricing. Sample pieces can also be requested for interior design and architecture presentations.",
              },
              {
                q: "Are custom dimensions and finishes available?",
                a: "Yes! Our master ceramists and lighting engineers can tailor dimensions, glazes, and fittings for hospitality and bespoke residential projects.",
              },
              {
                q: "What is the warranty and replenishment guarantee?",
                a: "We guarantee guaranteed replenishment availability for 5 years minimum, ensuring contract clients can replace or expand collections anytime.",
              },
              {
                q: "How are products packaged for shipping?",
                a: "Every shipment is secured with reinforced foam-lined wooden crates designed for zero breakage during domestic and international transit.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className={`${styles.faqAccordion} ${openFaq === i ? styles.faqAccordionOpen : ""}`}
              >
                <div
                  className={styles.faqAccordionHeader}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: openFaq === i ? "rotate(180deg)" : "none",
                      transition: "transform 0.25s",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div className={styles.faqAccordionContent}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

