'use client';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image 
            src="/MenuVistaLogo.svg"
            alt="MenuVista Logo"
            width={40}
            height={40}
            className={styles.logoIcon}
          />
          <h1>MenuVista</h1>
        </div>
        <p>Discover Menus Visually</p>
      </header>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Find your restaurant"
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>Search</button>
      </div>

      <div className={styles.restaurantGrid}>
        <Link href="/sababa-falafel" className={styles.restaurantCard}>
          <img
            src="/sababa-falafel.jpg"
            alt="Sababa Falafel"
            className={styles.restaurantImage}
          />
          <h3>Sababa Falafel</h3>
        </Link>

        <Link href="/aleppo-kitchen" className={styles.restaurantCard}>
          <img
            src="/aleppo-kitchen.jpg"
            alt="Aleppo Kitchen"
            className={styles.restaurantImage}
          />
          <h3>Aleppo Kitchen</h3>
        </Link>
      </div>
    </div>
  );
}