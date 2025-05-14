'use client';
import { useState } from 'react';
import styles from './restaurantPage.module.css';
import Link from 'next/link';

export default function AleppoKitchenPage() {
  const [activeTab, setActiveTab] = useState('Lunch');
  
  return (
    <div className={styles.container}>
      {/* Fixed Buttons */}
      <div className={styles.fixedButtonsContainer}>
        <a 
          href="https://aleppo-kitchen.com" 
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
          src="/aleppo-kitchen.jpg"
          alt="Aleppo Kitchen Restaurant" 
          className={styles.coverImage}
        />
      </div>
      
      {/* Restaurant name */}
      <h1 className={styles.restaurantName}>Aleppo Kitchen</h1>
      
      {/* Tags */}
      <div className={styles.tagContainer}>
        <span className={styles.tag}>Syrian</span>
        <span className={styles.tag}>Mediterranean</span>
        <span className={styles.tag}>Authentic</span>
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
        <p>🍽️ Chef's special this week: Traditional Syrian Feast for Two - $45</p>
      </div>
      
      {/* Menu content */}
      <div className={styles.menuContent}>
        <h2 className={styles.menuHeading}>{activeTab} Menu</h2>
        
        {activeTab === 'Lunch' && (
          <div className={styles.menuGrid}>
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/muhammara.jpg" alt="Muhammara" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Muhammara</h3>
                <p className={styles.menuCardDescription}>Red pepper and walnut dip with pomegranate molasses</p>
                <p className={styles.menuCardPrice}>$8</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/kibbeh.jpg" alt="Kibbeh" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Kibbeh</h3>
                <p className={styles.menuCardDescription}>Bulgur shells stuffed with spiced meat and pine nuts</p>
                <p className={styles.menuCardPrice}>$12</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/mandi-rice.jpg" alt="Mandi Rice with Lamb" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Mandi Rice with Lamb</h3>
                <p className={styles.menuCardDescription}>Aromatic rice with tender lamb and spices</p>
                <p className={styles.menuCardPrice}>$16</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/fattoush.jpg" alt="Fattoush Salad" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Fattoush Salad</h3>
                <p className={styles.menuCardDescription}>Fresh vegetables with sumac and toasted pita bread</p>
                <p className={styles.menuCardPrice}>$10</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Dinner' && (
          <div className={styles.menuGrid}>
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/kebab-platter.jpg" alt="Mixed Kebab Platter" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Mixed Kebab Platter</h3>
                <p className={styles.menuCardDescription}>Assortment of grilled meats with rice and grilled vegetables</p>
                <p className={styles.menuCardPrice}>$24</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/mansaf.jpg" alt="Mansaf" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Mansaf</h3>
                <p className={styles.menuCardDescription}>Traditional lamb with rice and yogurt sauce</p>
                <p className={styles.menuCardPrice}>$22</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/stuffed-eggplant.jpg" alt="Stuffed Eggplant" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Stuffed Eggplant</h3>
                <p className={styles.menuCardDescription}>Roasted eggplant stuffed with spiced rice and vegetables</p>
                <p className={styles.menuCardPrice}>$18</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/freekeh-soup.jpg" alt="Freekeh Soup" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Freekeh Soup</h3>
                <p className={styles.menuCardDescription}>Smoky green wheat soup with chicken and aromatic spices</p>
                <p className={styles.menuCardPrice}>$12</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Drinks' && (
          <div className={styles.menuGrid}>
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/tamarind-juice.jpg" alt="Tamarind Juice" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Tamarind Juice</h3>
                <p className={styles.menuCardDescription}>Sweet and tangy traditional tamarind drink</p>
                <p className={styles.menuCardPrice}>$4</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/jallab.jpg" alt="Jallab" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Jallab</h3>
                <p className={styles.menuCardDescription}>Date, grape molasses and rose water drink with pine nuts</p>
                <p className={styles.menuCardPrice}>$5</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/arabic-coffee.jpg" alt="Arabic Coffee" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Arabic Coffee</h3>
                <p className={styles.menuCardDescription}>Cardamom infused coffee served in small cups</p>
                <p className={styles.menuCardPrice}>$3</p>
              </div>
            </div>
            
            <div className={styles.menuCard}>
              <div className={styles.menuImageContainer}>
                <img src="/rosewater-lemonade.jpg" alt="Rosewater Lemonade" className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>Rosewater Lemonade</h3>
                <p className={styles.menuCardDescription}>Fresh lemonade with a hint of rosewater</p>
                <p className={styles.menuCardPrice}>$4</p>
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
        <div className={styles.hours}>Open 11:00 AM - 11:00 PM</div>
      </div>
      
      <Link href="/" className={styles.backLink}>← Back to all restaurants</Link>
    </div>
  );
}