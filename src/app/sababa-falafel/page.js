'use client';
import { useState } from 'react';
import styles from './restaurantPage.module.css';
import Link from 'next/link';

export default function SababaFalafelPage() {
  const [activeTab, setActiveTab] = useState('Lunch');
  
  return (
    <div className={styles.container}>
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
      
      {/* Action buttons */}
      <div className={styles.actionButtons}>
        <button className={styles.primaryButton}>Order Now</button>
        <button className={styles.secondaryButton}>Reserve a Table</button>
        <button className={styles.secondaryButton}>Call</button>
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
                <img src="/falafel-bowl.avif" alt="Falafel Bowl" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Falafel Bowl</h3>
                <p className={styles.menuCardDescription}>Fresh falafel with hummus, tahini, and pita</p>
                <p className={styles.menuCardPrice}>$12</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/hummus.avif" alt="Hummus" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Hummus</h3>
                <p className={styles.menuCardDescription}>Creamy chickpea dip with olive oil and pita</p>
                <p className={styles.menuCardPrice}>$8</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/chicken-bowl.avif" alt="Chicken Bowl" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Chicken Bowl</h3>
                <p className={styles.menuCardDescription}>Marinated chicken with rice and salad</p>
                <p className={styles.menuCardPrice}>$14</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/half-hummus-half-foul.avif" alt="Half Hummus Half Foul" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Half Hummus Half Foul</h3>
                <p className={styles.menuCardDescription}>A split plate of hummus and fava bean dip</p>
                <p className={styles.menuCardPrice}>$10</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/falafel-on-jerusalem-bread.avif" alt="Falafel on Jerusalem Bread" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Falafel on Jerusalem Bread</h3>
                <p className={styles.menuCardDescription}>Falafel served on traditional Jerusalem bread</p>
                <p className={styles.menuCardPrice}>$11</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/falafel-with-fried-veggies.avif" alt="Falafel with Fried Veggies" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Falafel with Fried Veggies</h3>
                <p className={styles.menuCardDescription}>Falafel served with seasoned fried vegetables</p>
                <p className={styles.menuCardPrice}>$13</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Dinner' && (
          <div className={styles.menuGrid}>
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/6-piece-falafel.avif" alt="6 Piece Falafel" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>6 Piece Falafel</h3>
                <p className={styles.menuCardDescription}>Six freshly fried falafel balls with tahini sauce</p>
                <p className={styles.menuCardPrice}>$8</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/family-pack.avif" alt="Family Pack" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Family Pack</h3>
                <p className={styles.menuCardDescription}>Assorted dishes perfect for sharing with family</p>
                <p className={styles.menuCardPrice}>$32</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/fried-veggies-8oz.avif" alt="Fried Veggies 8oz" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Fried Veggies 8oz</h3>
                <p className={styles.menuCardDescription}>Seasonal vegetables lightly fried in olive oil</p>
                <p className={styles.menuCardPrice}>$9</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/pita-chips.avif" alt="Pita Chips" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Pita Chips</h3>
                <p className={styles.menuCardDescription}>Crispy pita chips seasoned with herbs</p>
                <p className={styles.menuCardPrice}>$5</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/seasoned-rice.avif" alt="Seasoned Rice" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Seasoned Rice</h3>
                <p className={styles.menuCardDescription}>Rice with Mediterranean spices and herbs</p>
                <p className={styles.menuCardPrice}>$7</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/white-rice.avif" alt="White Rice" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>White Rice</h3>
                <p className={styles.menuCardDescription}>Fluffy basmati rice with herbs</p>
                <p className={styles.menuCardPrice}>$5</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Drinks' && (
          <div className={styles.menuGrid}>
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/hibiscus-lemonade.avif" alt="Hibiscus Lemonade" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Hibiscus Lemonade</h3>
                <p className={styles.menuCardDescription}>Refreshing hibiscus-infused lemonade</p>
                <p className={styles.menuCardPrice}>$4</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/hibuscus-and-hibusuc-with-lemonade.avif" alt="Hibiscus and Hibiscus with Lemonade" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Hibiscus with Lemonade</h3>
                <p className={styles.menuCardDescription}>Hibiscus tea mixed with fresh lemonade</p>
                <p className={styles.menuCardPrice}>$5</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/baklava.avif" alt="Baklava" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Baklava</h3>
                <p className={styles.menuCardDescription}>Sweet pastry with layers of nuts and honey</p>
                <p className={styles.menuCardPrice}>$6</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/baklava-2.avif" alt="Baklava Variant" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Pistachio Baklava</h3>
                <p className={styles.menuCardDescription}>Baklava with layers of pistachio</p>
                <p className={styles.menuCardPrice}>$7</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/rice-pudding-2.avif" alt="Rice Pudding" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Rice Pudding</h3>
                <p className={styles.menuCardDescription}>Creamy rice pudding with cinnamon</p>
                <p className={styles.menuCardPrice}>$5</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/peach-crumble.avif" alt="Peach Crumble" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Peach Crumble</h3>
                <p className={styles.menuCardDescription}>Sweet peach dessert with crumble topping</p>
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