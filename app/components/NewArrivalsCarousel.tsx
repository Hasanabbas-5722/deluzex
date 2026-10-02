"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import AddToCartButton from "./AddToCartButton";
import { Product, fetchProducts } from "../services/api";

const DEFAULT_PRODUCTS: Product[] = [
  {
    _id: "arrival_1",
    id: "arrival_1",
    product_title: "AURORA CHANDELIER",
    product_price: "300",
    product_description: "Suspended minimalist natural oak linear fixture with warm LED glow.",
    product_category: "Pendant Lights",
    product_rating: 4.8,
    product_main_image: "/images/category_chandelier_1784107756268.jpg",
  },
  {
    _id: "arrival_2",
    id: "arrival_2",
    product_title: "AURORA CHANDELIER",
    product_price: "300",
    product_description: "Grand tiered crystal chandelier with radiant hand-cut optical facets.",
    product_category: "Chandeliers",
    product_rating: 4.8,
    product_main_image: "/images/about_chandelier_1784107790569.jpg",
  },
  {
    _id: "arrival_3",
    id: "arrival_3",
    product_title: "AURORA CHANDELIER",
    product_price: "300",
    product_description: "Articulating satin brass task lamp with matte black metal shade.",
    product_category: "Table Lamps",
    product_rating: 4.8,
    product_main_image: "/images/lamp_black_gold_1784107745696.jpg",
  },
  {
    _id: "arrival_4",
    id: "arrival_4",
    product_title: "AURORA CHANDELIER",
    product_price: "300",
    product_description: "Vertical diffused cylinder column lamp set on a weighted base.",
    product_category: "Floor Lamps",
    product_rating: 4.8,
    product_main_image: "/images/lamp_modern_tall_1784107732736.jpg",
  },
  {
    _id: "arrival_5",
    id: "arrival_5",
    product_title: "AURORA CHANDELIER",
    product_price: "300",
    product_description: "Recessed architectural spot with anti-glare baffle.",
    product_category: "COB",
    product_rating: 4.8,
    product_main_image: "/images/project_lobby_1784107778993.jpg",
  },
  {
    _id: "arrival_6",
    id: "arrival_6",
    product_title: "AURORA CHANDELIER",
    product_price: "300",
    product_description: "Cast antique brass pedestal lamp with pleated silk shade.",
    product_category: "Table Lamps",
    product_rating: 4.8,
    product_main_image: "/images/lamp_classic_1784107722127.jpg",
  },
];

interface NewArrivalsCarouselProps {
  products?: Product[];
}

const formatPrice = (price?: string | number) => {
  if (!price && price !== 0) return "₹300";
  const str = String(price).trim();
  if (str.startsWith("$") || str.startsWith("₹")) return str;
  const num = Number(str.replace(/[^\d.-]/g, ""));
  if (!isNaN(num) && num > 0) {
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return `₹${str}`;
};

export default function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
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
      .catch(() => { });
  }, [products]);

  // Keep up to 6 products to display the 3x2 grid as shown in design
  const displayList = (activeProducts && activeProducts.length > 0 ? activeProducts : DEFAULT_PRODUCTS).slice(0, 6);

  return (
    <div className={styles.newArrivalsGrid}>
      {displayList.map((product, idx) => {
        const pId = String(product._id || product.id || idx);
        const title = product.product_title || product.name || "AURORA CHANDELIER";
        const price = formatPrice(product.product_price);
        const rating = product.product_rating || "4.8";

        return (
          <div
            key={`${pId}-${idx}`}
            className={styles.newArrivalCard}
          >
            <div className={styles.newArrivalImgBox}>
              <Link
                href={`/product/${pId}`}
                className={styles.newArrivalImgLink}
                title={title}
              >
                <Image
                  src={
                    product.product_main_image ||
                    "/images/lamp_modern_tall_1784107732736.jpg"
                  }
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </Link>
              <AddToCartButton product={product} variant="plus" />
            </div>

            <div className={styles.newArrivalInfo}>
              <div className={styles.newArrivalTopRow}>
                <Link
                  href={`/product/${pId}`}
                  style={{ textDecoration: "none", color: "inherit", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}
                >
                  <h4 className={styles.newArrivalName} title={title}>
                    {title}
                  </h4>
                </Link>
                <span className={styles.newArrivalPrice}>{price}</span>
              </div>
              <div className={styles.newArrivalRating}>
                <span className={styles.newArrivalStar}>★</span>
                <span className={styles.newArrivalRatingText}>
                  {rating} ( 300 Reviews )
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
