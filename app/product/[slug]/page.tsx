"use client";

import styles from "./productDetail.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductById, fetchProducts, Product } from "../../services/api";

export default function ProductDetail() {
  const { openCart } = useCart();
  const params = useParams();
  
  // Data State
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      if (!params.slug) return;
      try {
        const [prodData, relatedData] = await Promise.all([
          fetchProductById(params.slug as string),
          fetchProducts("limit=3") // Fetch some related products
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

  if (loading) {
    return <main className={styles.main}><p style={{padding: '2rem 6rem'}}>Loading product details...</p></main>;
  }

  if (!product) {
    return <main className={styles.main}><p style={{padding: '2rem 6rem'}}>Product not found.</p></main>;
  }

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroLeft}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span>/</span> <Link href="/shop">{product.product_category || "Chandeliers"}</Link> <span>/</span> <span>{product.product_title}</span>
          </div>

          
          <div className={styles.starsRow}>
            <div className={styles.stars}>{ "★".repeat(Math.floor(product.product_rating || 3))}{ "☆".repeat(5 - Math.floor(product.product_rating || 3)) }</div>
            <span className={styles.reviewCount}>{product.product_rating || 3.0} ({product.reviews_count || 35} Reviews)</span>
          </div>


          <h1 className={styles.productTitle}>{product.product_title || "Product Name"}</h1>
          <p className={styles.description}>
            {product?.product_description || "Crafted with precision, this stunning crystal chandelier brings timeless luxury to any living space. Its brilliant facets reflect light beautifully, creating a warm and inviting atmosphere. Ideal for modern and classic interiors alike."}
          </p>
          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Material</span>
              <span className={styles.specValue}>{product.product_material || "Stainless Steel & Crystal"}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Voltage</span>
              <span className={styles.specValue}>{product.product_voltage || "110V - 240V"}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Style</span>
              <span className={styles.specValue}>{product.product_style || "Modern Luxury"}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Finish</span>
              <span className={styles.specValue}>{product.product_finishing || "Brushed Gold / Matte Black"}</span>
            </div>
          </div>

          <div className={styles.priceRow}>
            <div className={styles.price}>${product.product_price}</div>
            <div className={styles.stockStatus}>In Stock</div>
          </div>

          <div className={styles.actionRow}>
            <div className={styles.qtySelector}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className={styles.btnPrimary} onClick={openCart}>Add To Bag</button>
            <button className={styles.btnOutline}>Add To Wishlist</button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.mainImageContainer}>
            <Image src={product.product_images[activeThumb]} alt={product.product_title} fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.thumbnailsCol}>
            {product.product_images.map((thumb, idx) => (
              <div 
                key={idx} 
                className={`${styles.thumbnail} ${activeThumb === idx ? styles.thumbnailActive : ''}`}
                onClick={() => setActiveThumb(idx)}
              >
                <Image src={thumb} alt={`Thumbnail ${idx}`} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCORDIONS SECTION */}
      {/* <section className={styles.accSection}>
        <div className={styles.accLeft}>
          <Image src="/images/lamp_modern_tall_1784107732736.jpg" alt="Detail Shot" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.accRight}>
          {[
            { id: 'dimensions', title: 'DIMENSIONS', content: 'Height: 45", Width: 24", Depth: 24". Adjustable chain up to 60". Weighs approximately 35 lbs.' },
            { id: 'package', title: 'PACKAGE SPECIFICATIONS', content: 'Arrives in a secure, foam-lined reinforced wooden crate. Includes all necessary mounting hardware and a set of white cotton gloves for smudge-free installation.' },
            { id: 'delivery', title: 'DELIVERY & CARE', content: 'Free standard shipping. Wipe clean with a soft, dry cloth. Avoid harsh chemicals as they may damage the protective finish.' },
          ].map((acc) => (
            <div key={acc.id} className={`${styles.accordion} ${openSpec === acc.id ? styles.accordionOpen : ''}`}>
              <div className={styles.accordionHeader} onClick={() => setOpenSpec(openSpec === acc.id ? null : acc.id)}>
                <span>{acc.title}</span>
                <svg className={styles.accordionIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className={styles.accordionContent}>
                {acc.content}
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* CUSTOMER REVIEWS */}
      <section className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
        <div className={styles.ratingSummary}>
          <div className={styles.ratingScore}>
            <h3>{product.product_rating || 4.8}</h3>
            <div className={styles.stars}>{ "★".repeat(Math.floor(product.product_rating || 3))}{ "☆".repeat(5 - Math.floor(product.product_rating || 3)) }</div>
            <p>{product.reviews_count || 35} Reviews</p>
          </div>
          <div className={styles.ratingBars}>
            {[
              { stars: 5, pct: '85%' },
              { stars: 4, pct: '10%' },
              { stars: 3, pct: '5%' },
              { stars: 2, pct: '0%' },
              { stars: 1, pct: '0%' }
            ].map(bar => (
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
            { name: "Sarah Williams", date: "Oct 12, 2025", initial: "SW", text: "Absolutely stunning chandelier. It totally transformed my dining room. The installation was straightforward, but definitely recommend two people because of the weight." },
            { name: "Paul Sanderson", date: "Sep 28, 2025", initial: "PS", text: "Very high quality materials. The brushed gold finish looks incredibly premium in person. The packaging was also top-notch, ensuring nothing was broken." }
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
                <div className={styles.stars}>★★★★★</div>
              </div>
              <p className={styles.reviewText}>{review.text}</p>
              <div className={styles.reviewPhotos}>
                <div className={styles.reviewPhoto}>
                  <Image src="/images/project_lounge_1784107767735.jpg" alt="Review 1" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.reviewPhoto}>
                  <Image src="/images/project_lobby_1784107778993.jpg" alt="Review 2" fill style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.readAllBtn}>
          Read all Reviews
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </section>

      {/* GALLERY */}
      <section className={styles.gallerySection}>
        <h2 className={styles.galleryTitle}>Gallery</h2>
        <div className={styles.galleryGrid}>
          <div className={styles.galleryImg}>
            <Image src="/images/project_lounge_1784107767735.jpg" alt="Gallery 1" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.galleryImg}>
            <Image src="/images/project_lobby_1784107778993.jpg" alt="Gallery 2" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={`${styles.galleryImg} ${styles.wide}`}>
            <Image src="/images/about_chandelier_1784107790569.jpg" alt="Gallery 3" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* COMPLETE THE LOOK */}
      <section className={styles.ctlSection}>
        <p className={styles.sectionSub}>Shop</p>
        <h2 className={styles.sectionTitle}>COMPLETE THE LOOK</h2>
        
        <div className={styles.ctlGrid}>
          {relatedProducts.slice(0,3).map((prod, i) => (
            <div key={prod.id || i} className={styles.productCard}>
              <Link href={`/product/${prod.id}`}>
                <div className={styles.productImageWrapper}>
                  <Image src={prod.image_url || "/images/lamp_modern_tall_1784107732736.jpg"} alt={prod.name} fill style={{ objectFit: 'contain' }} />
                  <button 
                    className={styles.addToCartBtn} 
                    onClick={(e) => {
                      e.preventDefault();
                      openCart();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </Link>
              
              <div className={styles.productInfoRow}>
                <h4 className={styles.productName}>{prod.name}</h4>
                <div className={styles.productPrice}>${prod.price}</div>
              </div>
              <div className={styles.productRating}>
                <svg className={styles.starIcon} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {prod.rating || "4.8"} ({prod.reviews_count || "750"} Reviews)
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Nav for Mobile */}
        <div className={styles.ctlNav}>
          <button className={styles.ctlNavBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className={styles.ctlNavBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.faqContainer}>
          <h2 className={styles.faqTitle}>Frequently asked questions</h2>
          <p className={styles.faqSub}>Find the perfect lighting for your space with our curated collection.</p>
          
          {[
            { q: 'Can you customize a lighting piece for me?', a: 'Yes! We offer bespoke customization for finishes and sizes on most of our chandeliers to ensure a perfect fit for your space.' },
            { q: 'How do I clean and maintain my chandelier?', a: 'Simply wipe the crystal and metal surfaces with a dry microfiber cloth. Avoid spraying glass cleaners directly onto the fixture.' },
            { q: 'Can I use smart bulbs with your lighting?', a: 'Absolutely. All our fixtures use standard E12 or E26 sockets, which are fully compatible with smart LED bulbs like Philips Hue.' },
            { q: 'Do your products come with a warranty?', a: 'Yes, we stand by our quality. Every fixture comes with a 5-year comprehensive warranty covering structural defects.' },
            { q: 'Do you offer installation services?', a: 'We partner with certified local electricians in major metropolitan areas. Contact our concierge team post-purchase for recommendations.' },
          ].map((faq, i) => (
            <div key={i} className={`${styles.faqAccordion} ${openFaq === i ? styles.faqAccordionOpen : ''}`}>
              <div className={styles.faqAccordionHeader} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <svg className={styles.accordionIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  {openFaq !== i && <line x1="5" y1="12" x2="19" y2="12"></line>}
                </svg>
              </div>
              <div className={styles.faqAccordionContent}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
