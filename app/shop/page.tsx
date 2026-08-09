"use client";

import styles from "./shop.module.css";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateQuantity, removeFromCart } from "../store/cartSlice";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import { fetchCategories, fetchProducts, Category, Product } from "../services/api";

export default function Shop() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error("Failed to load shop data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/hero_bg_1784107713316.jpg" alt="Shop Hero Background" fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Timeless<br/>Illumination</h1>
          <p className={styles.heroSub}>Luxury Lighting Designed For Modern Interiors.</p>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionSub}>Lighting for every interior</p>
          <h2 className={styles.sectionTitle}>Discover Our Categories</h2>
        </div>
        <div className={styles.categoriesGrid}>
          {categories.map((cat, i) => (
            <div key={cat._id || cat.id || cat.category_id || i} className={styles.categoryCard}>
              <Image src={cat.image_url || "/images/category_chandelier_1784107756268.jpg"} alt={cat.name} fill style={{ objectFit: 'cover' }} />
              <div className={styles.categoryOverlay}>
                <h3 className={styles.categoryTitle}>{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FILTER BAR */}
      <section className={styles.filterBar}>
        <div className={styles.filterPills}>
          <button className={styles.pill}>All</button>
          {categories.map((cat, i) => (
            <button key={cat._id || cat.id || cat.category_id || i} className={styles.pill}>
              {cat.name}
            </button>
          ))}
        </div>
        <div className={styles.sortBy}>
          <span>SORT BY :</span>
          <select className={styles.sortSelect}>
            <option>FEATURED</option>
            <option>PRICE: LOW TO HIGH</option>
            <option>PRICE: HIGH TO LOW</option>
            <option>NEWEST ARRIVALS</option>
          </select>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className={styles.productsSection}>
        <div className={styles.productGrid}>
          {loading ? (
            <p>Loading products...</p>
          ) : currentProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            currentProducts.map((product, i) => {
              const cartItem = cartItems.find(item => String(item.id) === String(product._id));
              
              return (
                <div key={product._id || i} className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <Link href={`/product/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                      <Image src={product.product_main_image || "/images/lamp_modern_tall_1784107732736.jpg"} alt={product.product_title} fill style={{ objectFit: 'cover' }} />
                    </Link>
                    
                    {cartItem ? (
                      <div className={styles.cartQuantityControl}>
                        <button onClick={(e) => {
                          e.preventDefault();
                          if (cartItem.quantity === 1) {
                            dispatch(removeFromCart(product._id));
                          } else {
                            dispatch(updateQuantity({ id: product._id, change: -1 }));
                          }
                        }}>-</button>
                        <span>{cartItem.quantity}</span>
                        <button onClick={(e) => {
                          e.preventDefault();
                          dispatch(updateQuantity({ id: product._id, change: 1 }));
                        }}>+</button>
                      </div>
                    ) : (
                      <button 
                        className={styles.addToCartBtn} 
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(addToCart(product));
                        }}
                        aria-label="Add to cart"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                          <path d="M0 0h24v24H0V0z" fill="none"/>
                          <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59L3.62 17H19v-2H7l1.1-2z"/>
                        </svg>   
                      </button>
                    )}
                  </div>
                
                <div className={styles.productInfo}>
                  <div className={styles.productInfoRow}>
                    <h4 className={styles.productName}>{product.product_title}</h4>
                    <div className={styles.productPrice}>${product.product_price}</div>
                  </div>
                  <div className={styles.productRating}>
                    <svg className={styles.starIcon} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    {product.product_rating || 3} ({35} Reviews)
                  </div>
                </div>
              </div>
            );
            }))}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className={styles.pagination}>
            <div 
              className={styles.pageNav} 
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous
            </div>
            
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              return (
                <div 
                  key={pageNum}
                  className={`${styles.pageItem} ${currentPage === pageNum ? styles.pageActive : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </div>
              );
            })}
            
            <div 
              className={styles.pageNav} 
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, pointerEvents: currentPage === totalPages ? 'none' : 'auto' }}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
