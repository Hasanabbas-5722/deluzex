import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerCol}>
          <h4>Available On</h4>
          <div className={styles.logos}>
            <div className={styles.logoItem}>amazon</div>
            <div className={styles.logoItem} style={{color:'#FFE500', fontWeight:'900', WebkitTextStroke:'1px #000'}}>Flipkart</div>
          </div>
          
          <div className={styles.socialIcons}>
            <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
            <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
          </div>
          <p className={styles.copyright}>© 2026 deluzex. All rights reserved.</p>
        </div>
        
        <div className={styles.footerColRight}>
          <h4>Get Notified With Us</h4>
          <div className={styles.newsletter}>
            <input type="email" placeholder="Please Enter Your Email" />
            <button className={styles.btnCartRoundSmall}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h5>Explore</h5>
              <Link href="#">Chandeliers</Link>
              <Link href="#">Pendant Lights</Link>
              <Link href="#">Wall Lights</Link>
              <Link href="#">Table Lamps</Link>
              <Link href="#">New Arrivals</Link>
              <Link href="#">Best Sellers</Link>
            </div>
            <div className={styles.linkGroup}>
              <h5>Company</h5>
              <Link href="#">About Us</Link>
              <Link href="#">Our Projects</Link>
              <Link href="#">Contact</Link>
              <Link href="#">Shipping & Delivery</Link>
              <Link href="#">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
