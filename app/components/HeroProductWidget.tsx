"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../page.module.css";

type HeroLamp = {
  image: string;
  name: string;
  count: number;
  alt: string;
};

const lamps: HeroLamp[] = [
  {
    image: "/images/lamp_modern_tall_1784107732736.jpg",
    name: "Cylindrical Floor Lamp",
    count: 231,
    alt: "Modern gold cylinder floor lamp",
  },
  {
    image: "/images/lamp_black_gold_1784107745696.jpg",
    name: "Modern Black Desk Lamp",
    count: 231,
    alt: "Modern brass desk lamp with black lampshade",
  },
  {
    image: "/images/lamp_classic_1784107722127.jpg",
    name: "Vintage Pleated Lamp",
    count: 231,
    alt: "Vintage gold lamp with pleated shade",
  },
];

export default function HeroProductWidget() {
  const [carouselPosition, setCarouselPosition] = useState(lamps.length * 2 + 1);
  const [isResetting, setIsResetting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const carouselLamps = Array.from({ length: lamps.length * 5 }, (_, index) => lamps[index % lamps.length]);
  const activeIndex = carouselPosition % lamps.length;
  const activeLamp = lamps[activeIndex];

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setCarouselPosition((currentPosition) => currentPosition + 1);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    if (carouselPosition === lamps.length * 4) {
      const resetTimer = window.setTimeout(() => {
        setIsResetting(true);
        setCarouselPosition(lamps.length * 2);
        window.requestAnimationFrame(() => setIsResetting(false));
      }, 650);

      return () => window.clearTimeout(resetTimer);
    }
  }, [carouselPosition]);

  const selectLamp = (index: number) => {
    setCarouselPosition(lamps.length * 2 + index);
  };

  return (
    <div
      className={styles.heroRight}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className={styles.heroInfoCard} aria-live="polite">
        <div className={styles.heroInfoCardImg}>
          <Image
            src={activeLamp.image}
            alt={activeLamp.alt}
            fill
            sizes="112px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.heroInfoCardText}>
          <span className={styles.heroInfoCardNum}>
            /{String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className={styles.heroInfoCardName}>{activeLamp.name}</span>
          <span className={styles.heroInfoCardCount}>{activeLamp.count}</span>
        </div>
      </div>

      <div className={styles.heroLamps} aria-label="Featured lighting products">
        <div
          className={styles.heroLampsTrack}
          style={{
            transform: `translateX(calc(50% - var(--hero-card-half) - ${carouselPosition} * var(--hero-carousel-step)))`,
            transition: isResetting ? "none" : undefined,
          }}
        >
        {carouselLamps.map((lamp, position) => (
          <button
            key={`${lamp.image}-${position}`}
            type="button"
            className={`${styles.heroLampCard} ${position === carouselPosition ? styles.heroLampCardActive : ""}`}
            onClick={() => selectLamp(position % lamps.length)}
            aria-label={`Show ${lamp.name}`}
            aria-pressed={position === carouselPosition}
          >
            <Image
              src={lamp.image}
              alt={lamp.alt}
              fill
              sizes="(max-width: 768px) 160px, 240px"
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
        </div>
      </div>

      <div className={styles.heroDots} aria-label="Select featured lighting product">
        {lamps.map((lamp, index) => (
          <button
            key={lamp.image}
            type="button"
            className={`${styles.heroDot} ${index === activeIndex ? styles.heroDotActive : ""}`}
            onClick={() => selectLamp(index)}
            aria-label={`Select ${lamp.name}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
