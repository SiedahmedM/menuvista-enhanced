'use client';
import { useState } from 'react';
import styles from './restaurantPage.module.css';
import Link from 'next/link';

export default function SababaFalafelPage() {
  const [activeTab, setActiveTab] = useState('Lunch');
  
  return (
    <div className={styles.container}>
      {/* Fixed Buttons */}
      <div className={styles.fixedButtonsContainer}>
        <a 
          href="https://restaurant-website.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.fixedOrderButton}
        >
          Order Now
        </a>
        <button 
          className={styles.fixedCallButton}
          onClick={() => window.open('tel:+1-555-123-4567')}
        >
          Call
        </button>
      </div>

      {/* Hero image */}
      <div className={styles.heroImage}>
        <img 
          src="/sababa-falafel.jpg"
          alt="Sababa Falafel Restaurant" 
          className={styles.coverImage}
        />
      </div>
      {/* Restaurant name */}
      <h1 className={styles.restaurantName}>Sababa Falafel</h1>
      
      {/* Tags */}
      <div className={styles.tagContainer}>
        <span className={styles.tag}>Middle Eastern</span>
        <span className={styles.tag}>Vegetarian</span>
        <span className={styles.tag}>Family-Friendly</span>
      </div>
      
      {/* Menu tabs */}
      <div className={styles.menuTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Lunch' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Lunch')}
        >
          Lunch
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Dinner' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Dinner')}
        >
          Dinner
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Drinks' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Drinks')}
        >
          Drinks
        </button>
      </div>
      
      {/* Special Banner */}
      <div className={styles.specialBanner}>
        <p>🍲 Weekly Special: Family Platter with 2 Sides - $30</p>
      </div>
      
      {/* Menu content */}
      <div className={styles.menuContent}>
        <h2 className={styles.menuHeading}>{activeTab} Menu</h2>
        
        {activeTab === 'Lunch' && (
          <div className={styles.menuGrid}>
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/falafel-bowl.jpg" alt="Falafel Bowl" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Falafel Bowl</h3>
                <p className={styles.menuCardDescription}>Fresh falafel with hummus, tahini, and pita</p>
                <p className={styles.menuCardPrice}>$12</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/hummus.jpg" alt="Hummus" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Hummus</h3>
                <p className={styles.menuCardDescription}>Creamy chickpea dip with olive oil and pita</p>
                <p className={styles.menuCardPrice}>$16</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/chicken-bowl.jpg" alt="Chicken Bowl" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Chicken Bowl</h3>
                <p className={styles.menuCardDescription}>Marinated chicken with rice and salad</p>
                <p className={styles.menuCardPrice}>$14</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/half-hummus-half-foul.jpg" alt="Half Hummus Half Foul" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Half Hummus Half Foul</h3>
                <p className={styles.menuCardDescription}>A split plate of hummus and fava bean dip</p>
                <p className={styles.menuCardPrice}>$10</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Dinner' && (
          <div className={styles.menuGrid}>
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/6-piece-falafel.jpg" alt="6 Piece Falafel" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>6 Piece Falafel</h3>
                <p className={styles.menuCardDescription}>Six freshly fried falafel balls with tahini sauce</p>
                <p className={styles.menuCardPrice}>$8</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/family-pack.jpg" alt="Family Pack" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Family Pack</h3>
                <p className={styles.menuCardDescription}>Assorted dishes perfect for sharing with family</p>
                <p className={styles.menuCardPrice}>$32</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/premium-family-pack.jpg" alt="Premium Family Pack" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Premium Family Pack</h3>
                <p className={styles.menuCardDescription}>Seasonal vegetables lightly fried in olive oil</p>
                <p className={styles.menuCardPrice}>$9</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/pita-chips.jpg" alt="Pita Chips" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Pita Chips</h3>
                <p className={styles.menuCardDescription}>Crispy pita chips seasoned with herbs</p>
                <p className={styles.menuCardPrice}>$5</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Drinks' && (
          <div className={styles.menuGrid}>
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/hibiscus-lemonade.jpg" alt="Hibiscus Lemonade" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Hibiscus Lemonade</h3>
                <p className={styles.menuCardDescription}>Refreshing hibiscus-infused lemonade</p>
                <p className={styles.menuCardPrice}>$4</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/baklava.jpg" alt="Baklava" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Baklava</h3>
                <p className={styles.menuCardDescription}>Sweet pastry with layers of nuts and honey</p>
                <p className={styles.menuCardPrice}>$6</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.socialIcons}>
          <a href="#" className={styles.socialIcon}>f</a>
          <a href="#" className={styles.socialIcon}>t</a>
          <a href="#" className={styles.socialIcon}>i</a>
        </div>
        <div className={styles.hours}>Open 11:00 AM - 10:00 PM</div>
      </div>
      
      <Link href="/" className={styles.backLink}>← Back to all restaurants</Link>
    </div>
  );
}