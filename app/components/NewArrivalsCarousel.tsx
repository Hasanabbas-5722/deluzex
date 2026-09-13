"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import AddToCartButton from "./AddToCartButton";
import { Product, fetchProducts } from "../services/api";

const DEFAULT_PRODUCTS: Product[] = [
  {
    _id: "arrival_1",
    id: "arrival_1",
    product_title: "Linear Wood LED Pendant",
    product_price: "42500",
    product_description: "Suspended minimalist natural oak linear fixture with warm LED glow.",
    product_category: "Pendant Lights",
    product_rating: 4.9,
    product_main_image: "/images/category_chandelier_1784107756268.jpg",
  },
  {
    _id: "arrival_2",
    id: "arrival_2",
    product_title: "Vera Tiered Crystal Chandelier",
    product_price: "194900",
    product_description: "Grand tiered crystal chandelier with radiant hand-cut optical facets.",
    product_category: "Chandeliers",
    product_rating: 5.0,
    product_main_image: "/images/about_chandelier_1784107790569.jpg",
  },
  {
    _id: "arrival_3",
    id: "arrival_3",
    product_title: "Modern Brass Desk Lamp",
    product_price: "23100",
    product_description: "Articulating satin brass task lamp with matte black metal shade.",
    product_category: "Table Lamps",
    product_rating: 4.8,
    product_main_image: "/images/lamp_black_gold_1784107745696.jpg",
  },
  {
    _id: "arrival_4",
    id: "arrival_4",
    product_title: "Cylindrical Architectural Floor Lamp",
    product_price: "34900",
    product_description: "Vertical diffused cylinder column lamp set on a weighted base.",
    product_category: "Floor Lamps",
    product_rating: 4.9,
    product_main_image: "/images/lamp_modern_tall_1784107732736.jpg",
  },
  {
    _id: "arrival_5",
    id: "arrival_5",
    product_title: "Architectural Deep COB Downlight",
    product_price: "8500",
    product_description: "Recessed architectural spot with anti-glare baffle.",
    product_category: "COB",
    product_rating: 4.7,
    product_main_image: "/images/project_lobby_1784107778993.jpg",
  },
  {
    _id: "arrival_6",
    id: "arrival_6",
    product_title: "Vintage Pleated Silk Lamp",
    product_price: "19500",
    product_description: "Cast antique brass pedestal lamp with pleated silk shade.",
    product_category: "Table Lamps",
    product_rating: 4.9,
    product_main_image: "/images/lamp_classic_1784107722127.jpg",
  },
];

interface NewArrivalsCarouselProps {
  products?: Product[];
}

export default function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoscrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [activeProducts, setActiveProducts] = useState<Product[]>(
    products && products.length > 0 ? products : DEFAULT_PRODUCTS
  );

  useEffect(() => {
    if (products && products.length > 0) {
      setActiveProducts(products);
    }
    fetchProducts("is_new_arrival=true")
      .then((data) => {
        if (data && data.length > 0) {
          setActiveProducts(data);
        }
      })
      .catch(() => {});
  }, [products]);

  // Use active products or fallback so section is always populated
  const displayProducts =
    activeProducts && activeProducts.length > 0 ? activeProducts : DEFAULT_PRODUCTS;

  // Base list duplicated until at least 5 products to guarantee sufficient track length
  const baseProducts = useMemo(() => {
    let list = [...displayProducts];
    while (list.length < 5) {
      list = [...list, ...displayProducts];
    }
    return list;
  }, [displayProducts]);

  const baseCount = baseProducts.length;

  // 5 identical sets: [Set 0, Set 1, Set 2 (middle active), Set 3, Set 4]
  const items = useMemo(() => {
    return [
      ...baseProducts,
      ...baseProducts,
      ...baseProducts,
      ...baseProducts,
      ...baseProducts,
    ];
  }, [baseProducts]);

  // Measure carousel metrics accurately
  const getMetrics = useCallback(() => {
    if (!containerRef.current) return null;
    const container = containerRef.current;
    const cards = container.querySelectorAll<HTMLElement>(`.${styles.productCard}`);
    if (cards.length < baseCount * 5) return null;

    const card0 = cards[0];
    const cardBase = cards[baseCount];
    const oneSetWidth = cardBase.offsetLeft - card0.offsetLeft;
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 436;

    return { container, oneSetWidth, step };
  }, [baseCount]);

  // Keep scroll position centered in the middle set when free-scrolling or dragging
  const checkInfiniteBoundary = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return;
    const { container, oneSetWidth } = metrics;
    if (oneSetWidth <= 0) return;

    if (container.scrollLeft >= oneSetWidth * 3.5) {
      container.scrollLeft -= oneSetWidth;
    } else if (container.scrollLeft <= oneSetWidth * 1.5) {
      container.scrollLeft += oneSetWidth;
    }
  }, [getMetrics]);

  // Set initial scroll position to middle set (Set 2)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const setupInitialPosition = () => {
      const metrics = getMetrics();
      if (!metrics) return;
      const { container, oneSetWidth } = metrics;
      if (oneSetWidth > 0) {
        container.scrollLeft = oneSetWidth * 2;
      }
    };

    const rafId = requestAnimationFrame(setupInitialPosition);
    return () => cancelAnimationFrame(rafId);
  }, [getMetrics]);

  // Window resize handler to maintain position inside bounds
  useEffect(() => {
    const handleResize = () => {
      checkInfiniteBoundary();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkInfiniteBoundary]);

  // Continuous infinite scroll handler for Left / Right
  const handleScroll = useCallback(
    (direction: "left" | "right") => {
      const metrics = getMetrics();
      if (!metrics) return;
      const { container, oneSetWidth, step } = metrics;
      if (oneSetWidth <= 0) return;

      isProgrammaticScrollRef.current = true;
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 550);

      const minThreshold = oneSetWidth * 1.5;
      const maxThreshold = oneSetWidth * 3.5;

      if (direction === "right") {
        // Seamlessly teleport back by oneSetWidth if approaching right edge
        if (container.scrollLeft >= maxThreshold - step) {
          container.scrollLeft -= oneSetWidth;
        }
        container.scrollBy({ left: step, behavior: "smooth" });
      } else {
        // Seamlessly teleport forward by oneSetWidth if approaching left edge
        if (container.scrollLeft <= minThreshold + step) {
          container.scrollLeft += oneSetWidth;
        }
        container.scrollBy({ left: -step, behavior: "smooth" });
      }
    },
    [getMetrics]
  );

  const handleScrollRef = useRef(handleScroll);
  handleScrollRef.current = handleScroll;

  // Reset/Restart Autoscroll timer
  const resetAutoscrollTimer = useCallback(() => {
    if (autoscrollTimerRef.current) {
      clearInterval(autoscrollTimerRef.current);
    }
    autoscrollTimerRef.current = setInterval(() => {
      if (
        !isHovered &&
        !isDraggingRef.current &&
        typeof document !== "undefined" &&
        document.visibilityState === "visible"
      ) {
        handleScrollRef.current("right");
      }
    }, 3500);
  }, [isHovered]);

  // Handle autoscroll pause on hover or tab hidden
  useEffect(() => {
    if (isHovered) {
      if (autoscrollTimerRef.current) {
        clearInterval(autoscrollTimerRef.current);
      }
      return;
    }

    resetAutoscrollTimer();

    return () => {
      if (autoscrollTimerRef.current) {
        clearInterval(autoscrollTimerRef.current);
      }
    };
  }, [isHovered, resetAutoscrollTimer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoscrollTimerRef.current) {
          clearInterval(autoscrollTimerRef.current);
        }
      } else if (!isHovered) {
        resetAutoscrollTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isHovered, resetAutoscrollTimer]);

  const handleContainerScroll = () => {
    if (isProgrammaticScrollRef.current || isDraggingRef.current) return;
    checkInfiniteBoundary();
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftStartRef.current = containerRef.current.scrollLeft;
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
    checkInfiniteBoundary();
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 150);
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsHovered(true);
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    scrollLeftStartRef.current = containerRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    checkInfiniteBoundary();
    setTimeout(() => {
      hasDraggedRef.current = false;
      setIsHovered(false);
    }, 2000);
  };

  return (
    <>
      <div
        ref={containerRef}
        className={styles.newArrivalsMarquee}
        onScroll={handleContainerScroll}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUp();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        <div className={styles.marqueeTrack}>
          {items.map((product, idx) => {
            const pId = String(product._id || product.id || idx);

            return (
              <div key={`${pId}-${idx}`} className={styles.productCard}>
                <div className={styles.productCardImg}>
                  <Link
                    href={`/product/${pId}`}
                    onClick={(e) => {
                      if (hasDraggedRef.current) e.preventDefault();
                    }}
                    style={{ display: "block", width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
                  >
                    <Image
                      src={
                        product.product_main_image ||
                        "/images/lamp_modern_tall_1784107732736.jpg"
                      }
                      alt={product.product_title || "Product"}
                      fill
                      draggable={false}
                      sizes="(max-width: 768px) 240px, 400px"
                      style={{ objectFit: "cover", pointerEvents: "none" }}
                    />
                  </Link>
                  <AddToCartButton product={product} />
                </div>

                <div className={styles.productCardInfo}>
                  <div className={styles.productCardLeft}>
                    <Link
                      href={`/product/${pId}`}
                      onClick={(e) => {
                        if (hasDraggedRef.current) e.preventDefault();
                      }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h4 className={styles.productCardName}>
                        {product.product_title || "Product Name"}
                      </h4>
                    </Link>
                    <div className={styles.productCardRating}>
                      <span className={styles.productStar}>★</span>
                      <span className={styles.productRatingText}>
                        {product.product_rating || "4.8"} ( 300 Reviews )
                      </span>
                    </div>
                  </div>
                  <div className={styles.productCardRight}>
                    <span className={styles.productCardPrice}>
                      ₹{product.product_price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION ARROW BUTTONS */}
      <div
        className={styles.arrowGroup}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          className={styles.arrowOutline}
          onClick={() => {
            handleScroll("left");
            resetAutoscrollTimer();
          }}
          aria-label="Previous products"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.arrowSolid}
          onClick={() => {
            handleScroll("right");
            resetAutoscrollTimer();
          }}
          aria-label="Next products"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </>
  );
}
