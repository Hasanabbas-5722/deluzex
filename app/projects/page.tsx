import styles from "./projects.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Projects() {
  const projects = [
    { id: 1, title: "Luxury Villa Residence", location: "London, UK", image: "/images/project_lounge_1784107767735.jpg" },
    { id: 2, title: "The Grand Hotel Lobby", location: "Paris, France", image: "/images/project_lobby_1784107778993.jpg" },
    { id: 3, title: "Modern Penthouse", location: "New York, USA", image: "/images/hero_bg_1784107713316.jpg" },
    { id: 4, title: "Boutique Restaurant", location: "Milan, Italy", image: "/images/lamp_classic_1784107722127.jpg" },
  ];

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/project_lobby_1784107778993.jpg" alt="Projects Hero" fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>OUR WORK</p>
          <h1 className={styles.heroTitle}>Featured Projects</h1>
          <p className={styles.heroDesc}>
            Discover how De Luzex lighting transforms spaces across the globe, from intimate residences to grand commercial venues.
          </p>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className={styles.filterSection}>
        <div className={styles.filters}>
          <button className={`${styles.filterBtn} ${styles.activeFilter}`}>All Projects</button>
          <button className={styles.filterBtn}>Residential</button>
          <button className={styles.filterBtn}>Commercial</button>
          <button className={styles.filterBtn}>Hospitality</button>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className={styles.projectsSection}>
        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />
              <div className={styles.projectLabelBox}>
                <div>
                  <span className={styles.plbTitle}>{project.title}</span>
                  <span className={styles.plbSub}>{project.location} • View Details &gt;</span>
                </div>
                <button className={styles.iconBtnRoundWhite}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.centerBtn}>
          <button className={styles.btnPrimaryRounded}>Load More</button>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Start Your Project</h2>
          <p>Let our experts help you select the perfect lighting for your next design endeavor.</p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnPrimaryRounded}>Book A Consultation</button>
            <Link href="/contact" className={styles.btnOutlineRounded}>Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
