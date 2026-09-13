"use client";

import styles from "./shop.module.css";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateQuantity, removeFromCart } from "../store/cartSlice";
import { RootState } from "../store/store";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchCategories, fetchProducts, Category, Product } from "../services/api";
import { useAuth } from "../context/AuthContext";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "chandeliers", name: "Chandeliers", image_url: "/images/about_chandelier_1784107790569.jpg" },
  { id: "pendant-lights", name: "Pendant Lights", image_url: "/images/category_chandelier_1784107756268.jpg" },
  { id: "cob", name: "COB", image_url: "/images/project_lobby_1784107778993.jpg" },
  { id: "table-lamps", name: "Table Lamps", image_url: "/images/lamp_black_gold_1784107745696.jpg" },
  { id: "floor-lamps", name: "Floor Lamps", image_url: "/images/lamp_modern_tall_1784107732736.jpg" },
  { id: "wall-lights", name: "Wall Lights", image_url: "/images/lamp_classic_1784107722127.jpg" },
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    _id: "prod_pendant_1",
    id: "prod_pendant_1",
    product_title: "Linear Wood LED Pendant",
    product_price: "42500",
    product_description: "Minimalist natural oak LED linear suspension bar for dining islands and conference tables.",
    product_category: "Pendant Lights",
    product_rating: 4.9,
    product_main_image: "/images/category_chandelier_1784107756268.jpg",
  },
  {
    _id: "prod_pendant_2",
    id: "prod_pendant_2",
    product_title: "Smoked Glass Drop Pendant",
    product_price: "28900",
    product_description: "Handblown smoked glass globe with brushed brass hardware and warm filament glow.",
    product_category: "Pendant Lights",
    product_rating: 4.8,
    product_main_image: "/images/category_chandelier_1784107756268.jpg",
  },
  {
    _id: "prod_chandelier_1",
    id: "prod_chandelier_1",
    product_title: "Vera Tiered Crystal Chandelier",
    product_price: "194900",
    product_description: "Grand multi-tier faceted crystal fixture with hand-finished electroplated gold framework.",
    product_category: "Chandeliers",
    product_rating: 5.0,
    product_main_image: "/images/about_chandelier_1784107790569.jpg",
  },
  {
    _id: "prod_chandelier_2",
    id: "prod_chandelier_2",
    product_title: "Aurora Modern Radial Chandelier",
    product_price: "135000",
    product_description: "Contemporary radial brass arms extending into frosted optical glass diffusers.",
    product_category: "Chandeliers",
    product_rating: 4.9,
    product_main_image: "/images/about_chandelier_1784107790569.jpg",
  },
  {
    _id: "prod_cob_1",
    id: "prod_cob_1",
    product_title: "Architectural Deep COB Downlight",
    product_price: "8500",
    product_description: "Anti-glare recessed architectural spotlight with 24-degree narrow beam and high CRI 95+.",
    product_category: "COB",
    product_rating: 4.7,
    product_main_image: "/images/project_lobby_1784107778993.jpg",
  },
  {
    _id: "prod_cob_2",
    id: "prod_cob_2",
    product_title: "Surface-Mounted Cylindrical COB",
    product_price: "11200",
    product_description: "Matte black and champagne gold directional spot spotlight for gallery ceilings.",
    product_category: "COB",
    product_rating: 4.8,
    product_main_image: "/images/project_lobby_1784107778993.jpg",
  },
  {
    _id: "prod_table_1",
    id: "prod_table_1",
    product_title: "Modern Brass Desk Lamp",
    product_price: "23100",
    product_description: "Precision-turned brass articulating arm with matte black shade and touch dimmer.",
    product_category: "Table Lamps",
    product_rating: 4.8,
    product_main_image: "/images/lamp_black_gold_1784107745696.jpg",
  },
  {
    _id: "prod_table_2",
    id: "prod_table_2",
    product_title: "Vintage Pleated Silk Lamp",
    product_price: "19500",
    product_description: "Warm antique gold cast base paired with a pleated ivory silk shade.",
    product_category: "Table Lamps",
    product_rating: 4.9,
    product_main_image: "/images/lamp_classic_1784107722127.jpg",
  },
  {
    _id: "prod_floor_1",
    id: "prod_floor_1",
    product_title: "Cylindrical Architectural Floor Lamp",
    product_price: "34900",
    product_description: "Minimalist vertical column diffuser with warm white LED light and marble base.",
    product_category: "Floor Lamps",
    product_rating: 4.9,
    product_main_image: "/images/lamp_modern_tall_1784107732736.jpg",
  },
  {
    _id: "prod_wall_1",
    id: "prod_wall_1",
    product_title: "Luxe Minimalist Dual Sconce",
    product_price: "18500",
    product_description: "Up-and-down ambient wall wash fixture in brushed champagne bronze.",
    product_category: "Wall Lights",
    product_rating: 4.8,
    product_main_image: "/images/lamp_classic_1784107722127.jpg",
  },
];

function ShopContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { isAuthenticated, openLoginModal } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [sortBy, setSortBy] = useState<string>("FEATURED");
  const [loading, setLoading] = useState(true);

  // Sync category param from URL
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setCurrentPage(1);
  }, [categoryParam]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
        if (prods && prods.length > 0) {
          setProducts(prods);
        }
      } catch (error) {
        console.error("Failed to load shop data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory.toLowerCase() === "all") {
      return products;
    }

    const sel = selectedCategory.toLowerCase().trim();

    return products.filter((product) => {
      const prodCategory = String(product.product_category || "").toLowerCase().trim();
      if (prodCategory === sel) return true;

      const matchedCat = categories.find(
        (c) =>
          String(c._id || c.id || c.category_id || "").toLowerCase().trim() === sel ||
          c.name.toLowerCase().trim() === sel
      );

      if (matchedCat) {
        const catName = matchedCat.name.toLowerCase().trim();
        const catId = String(matchedCat._id || matchedCat.id || matchedCat.category_id || "").toLowerCase().trim();
        if (prodCategory === catName || prodCategory === catId) return true;
        if (prodCategory.includes(catName) || catName.includes(prodCategory)) return true;
        if (String(product.product_title || "").toLowerCase().includes(catName)) return true;
      }

      if (prodCategory.includes(sel) || sel.includes(prodCategory)) return true;
      if (String(product.product_title || "").toLowerCase().includes(sel)) return true;

      return false;
    });
  }, [products, selectedCategory, categories]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "PRICE: LOW TO HIGH") {
      return list.sort((a, b) => Number(a.product_price || 0) - Number(b.product_price || 0));
    }
    if (sortBy === "PRICE: HIGH TO LOW") {
      return list.sort((a, b) => Number(b.product_price || 0) - Number(a.product_price || 0));
    }
    if (sortBy === "NEWEST ARRIVALS") {
      return list.sort((a, b) => (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const handleSelectCategory = (catIdentifier: string | null) => {
    if (!catIdentifier || catIdentifier.toLowerCase() === "all" || selectedCategory === catIdentifier) {
      setSelectedCategory(null);
      router.push("/shop", { scroll: false });
    } else {
      setSelectedCategory(catIdentifier);
      router.push(`/shop?category=${encodeURIComponent(catIdentifier)}`, { scroll: false });
    }
    setCurrentPage(1);
  };

  // Find user-friendly display name of currently active category
  const activeCategoryDisplayName = useMemo(() => {
    if (!selectedCategory) return null;
    const matched = categories.find(
      (c) =>
        String(c._id || c.id || c.category_id || "").toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim() ||
        c.name.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
    );
    return matched ? matched.name : selectedCategory;
  }, [selectedCategory, categories]);

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/hero_bg_1784107713316.jpg"
            alt="Shop Hero Background"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Timeless<br />
            Illumination
          </h1>
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
          {categories.map((cat, i) => {
            const catId = cat._id || cat.id || cat.category_id || cat.name;
            const isSelected =
              selectedCategory !== null &&
              (selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                selectedCategory.toLowerCase() === String(catId).toLowerCase());

            return (
              <div
                key={catId || i}
                onClick={() => handleSelectCategory(cat.name)}
                className={`${styles.categoryCard} ${isSelected ? styles.categoryCardActive : ""}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelectCategory(cat.name);
                  }
                }}
                aria-label={`Filter by ${cat.name}`}
              >
                <Image
                  src={cat.image_url || "/images/category_chandelier_1784107756268.jpg"}
                  alt={cat.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.categoryOverlay}>
                  <h3 className={styles.categoryTitle}>{cat.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FILTER BAR */}
      <section className={styles.filterBar}>
        <div className={styles.filterPills}>
          <button
            type="button"
            className={`${styles.pill} ${!selectedCategory ? styles.pillActive : ""}`}
            onClick={() => handleSelectCategory(null)}
          >
            All
          </button>
          {categories.map((cat, i) => {
            const catId = cat._id || cat.id || cat.category_id || cat.name;
            const isSelected =
              selectedCategory !== null &&
              (selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                selectedCategory.toLowerCase() === String(catId).toLowerCase());

            return (
              <button
                key={catId || i}
                type="button"
                className={`${styles.pill} ${isSelected ? styles.pillActive : ""}`}
                onClick={() => handleSelectCategory(cat.name)}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className={styles.sortBy}>
          <span>SORT BY :</span>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>FEATURED</option>
            <option>PRICE: LOW TO HIGH</option>
            <option>PRICE: HIGH TO LOW</option>
            <option>NEWEST ARRIVALS</option>
          </select>
        </div>
      </section>

      {/* ACTIVE CATEGORY BANNER */}
      {selectedCategory && (
        <div className={styles.activeFilterNotice}>
          <div className={styles.activeFilterText}>
            <span>Showing products for category:</span>
            <strong>{activeCategoryDisplayName}</strong>
            <span>({filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"})</span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectCategory(null)}
            className={styles.clearFilterBtn}
            aria-label="Clear category filter"
          >
            Show All Products &times;
          </button>
        </div>
      )}

      {/* PRODUCT GRID */}
      <section className={styles.productsSection}>
        <div className={styles.productGrid}>
          {loading ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>Loading products...</p>
          ) : currentProducts.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 1rem" }}>
              <p style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--color-text)" }}>
                No products found in category <strong>&quot;{activeCategoryDisplayName}&quot;</strong>.
              </p>
              <button
                type="button"
                onClick={() => handleSelectCategory(null)}
                className={styles.clearFilterBtn}
                style={{ margin: "0 auto" }}
              >
                View All Products
              </button>
            </div>
          ) : (
            currentProducts.map((product, i) => {
              const pId = String(product._id || product.id || i);
              const cartItem = cartItems.find((item) => String(item.id) === pId);

              return (
                <div key={pId} className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <Link
                      href={`/product/${pId}`}
                      style={{ display: "block", width: "100%", height: "100%", position: "relative", overflow: "hidden", borderRadius: "10px" }}
                    >
                      <Image
                        src={
                          product.product_main_image ||
                          "/images/lamp_modern_tall_1784107732736.jpg"
                        }
                        alt={product.product_title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </Link>

                    {cartItem ? (
                      <div className={styles.cartQuantityControl}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (cartItem.quantity === 1) {
                              dispatch(removeFromCart(pId));
                            } else {
                              dispatch(updateQuantity({ id: pId, change: -1 }));
                            }
                          }}
                        >
                          -
                        </button>
                        <span>{cartItem.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isAuthenticated) {
                              openLoginModal(product, "Please log in to update your cart items.");
                              return;
                            }
                            dispatch(updateQuantity({ id: pId, change: 1 }));
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className={styles.addToCartBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isAuthenticated) {
                            openLoginModal(
                              product,
                              `Please log in to add ${product.product_title || "this lamp"} to your cart.`
                            );
                            return;
                          }
                          dispatch(addToCart(product));
                        }}
                        aria-label="Add to cart"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59L3.62 17H19v-2H7l1.1-2z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className={styles.productInfo}>
                    <div className={styles.productInfoRow}>
                      <h4 className={styles.productName}>{product.product_title}</h4>
                      <div className={styles.productPrice}>₹{product.product_price}</div>
                    </div>
                    <div className={styles.productRating}>
                      <svg
                        className={styles.starIcon}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      {product.product_rating || 4.8} ({35} Reviews)
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className={styles.pagination}>
            <div
              className={styles.pageNav}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{
                opacity: currentPage === 1 ? 0.5 : 1,
                pointerEvents: currentPage === 1 ? "none" : "auto",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous
            </div>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              return (
                <div
                  key={pageNum}
                  className={`${styles.pageItem} ${
                    currentPage === pageNum ? styles.pageActive : ""
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </div>
              );
            })}

            <div
              className={styles.pageNav}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{
                opacity: currentPage === totalPages ? 0.5 : 1,
                pointerEvents: currentPage === totalPages ? "none" : "auto",
              }}
            >
              Next
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Loading collection...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
