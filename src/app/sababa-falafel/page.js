'use client';
import { useState, useEffect } from 'react';
import styles from './restaurantPage.module.css';
import Link from 'next/link';
import MenuVistaAdvancedTracking from '../analytics/advancedTracking';

export default function SababaFalafelPage() {
  const [activeTab, setActiveTab] = useState('Lunch');
  const [selectedItem, setSelectedItem] = useState(null);
  
  useEffect(() => {
    // Initialize analytics with restaurant ID
    console.log('Initializing analytics once');
    MenuVistaAdvancedTracking.init('sababa-falafel');
    
    // Clean up on component unmount
    return () => {
      if (MenuVistaAdvancedTracking.currentViewItem) {
        MenuVistaAdvancedTracking.trackItemViewEnd(MenuVistaAdvancedTracking.currentViewItem);
      }
    };
  }, []);

  // Function to handle menu item click
  const handleItemClick = (item) => {
    setSelectedItem(item);
    // Track item click in analytics
    MenuVistaAdvancedTracking.trackItemClick(item.id, activeTab);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedItem(null);
  };

  // Menu Item Modal Component
  const MenuItemModal = ({ item, onClose }) => {
    if (!item) return null;
    
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <div className={styles.modalImageContainer}>
            <img src={item.image} alt={item.name} className={styles.modalImage} />
          </div>
          <div className={styles.modalDetails}>
            <h2 className={styles.modalTitle}>{item.name}</h2>
            <p className={styles.modalDescription}>{item.description}</p>
            <p className={styles.modalPrice}>{item.price}</p>
          </div>
        </div>
      </div>
    );
  };

  // Create menu items data objects for each tab
  const lunchItems = [
    {
      id: 'falafel-bowl',
      name: 'Falafel Bowl',
      description: 'Fresh falafel with hummus, tahini, and pita',
      price: '$12',
      image: '/falafel-bowl.jpg'
    },
    {
      id: 'chicken-bowl',
      name: 'Chicken Bowl',
      description: 'Marinated chicken with rice and salad',
      price: '$14',
      image: '/chicken-bowl.jpg'
    },
    {
      id: 'falafel-on-jerusalem-bread',
      name: 'Falafel on Jerusalem Bread',
      description: 'Crispy falafel in fresh bread with tahini and vegetables',
      price: '$14',
      image: '/falafel-on-jerusalem-bread.jpg'
    },
    {
      id: 'falafel-with-fried-veggies',
      name: 'Falafel With Fried Veggies',
      description: 'Golden falafel in pita with fried vegetables and tahini sauce',
      price: '$15',
      image: '/falafel-with-fried-veggies.jpg'
    },
    {
      id: 'fire-bowl',
      name: 'Fire Bowl',
      description: 'Spicy beef over yellow rice with fresh vegetables and tahini',
      price: '$17',
      image: '/fire-bowl.jpg'
    },
    {
      id: 'ribeye-bowl',
      name: 'Ribeye Bowl',
      description: 'Tender ribeye strips over yellow rice with fresh vegetables and tahini',
      price: '$16',
      image: '/ribeye-bowl.jpg'
    },
    {
      id: 'ribeye-pita',
      name: 'Ribeye Pita',
      description: 'Juicy ribeye in soft pita with fresh vegetables and tahini sauce',
      price: '$15',
      image: '/ribeye-pita.jpg'
    }
  ];

  const appetizerItems = [
    {
      id: 'hummus',
      name: 'Hummus',
      description: 'Creamy chickpea dip with olive oil and pita',
      price: '$16',
      image: '/hummus.jpg'
    },
    {
      id: 'fettah-with-ribeye',
      name: 'Fettah With Ribeye',
      description: 'Creamy hummus topped with tender ribeye and toasted pine nuts',
      price: '$18',
      image: '/fettah-with-ribeye.jpg'
    },
    {
      id: 'fettah',
      name: 'Fettah',
      description: 'Traditional hummus topped with pine nuts and fresh herbs',
      price: '$16',
      image: '/fettah.jpg'
    },
    {
      id: 'french-fries',
      name: 'French Fries',
      description: 'Crispy golden fries served with ketchup and garlic sauce',
      price: '$6',
      image: '/french-fries.jpg'
    },
    {
      id: 'fried-veggies-8oz',
      name: 'Fried Veggies 8oz',
      description: 'Crispy cauliflower with fried potatoes and roasted eggplant',
      price: '$9',
      image: '/fried-veggies-8oz.jpg'
    },
    {
      id: 'half-hummus-half-foul',
      name: 'Half Hummus Half Foul',
      description: 'A split plate of hummus and fava bean dip',
      price: '$10',
      image: '/half-hummus-half-foul.jpg'
    },
    {
      id: '6-piece-falafel',
      name: '6 Piece Falafel',
      description: 'Six freshly fried falafel balls with tahini sauce',
      price: '$8',
      image: '/6-piece-falafel.jpg'
    },
    {
      id: 'pita-chips',
      name: 'Pita Chips',
      description: 'Crispy pita chips seasoned with herbs',
      price: '$5',
      image: '/pita-chips.jpg'
    }
  ];

  const dinnerItems = [
    {
      id: 'family-pack',
      name: 'Family Pack',
      description: 'Assorted dishes perfect for sharing with family',
      price: '$32',
      image: '/family-pack.jpg'
    },
    {
      id: 'premium-family-pack',
      name: 'Premium Family Pack',
      description: 'Seasonal vegetables lightly fried in olive oil',
      price: '$38',
      image: '/premium-family-pack.jpg'
    },
    {
      id: 'dinner-falafel-bowl',
      name: 'Falafel Bowl',
      description: 'Fresh falafel with hummus, tahini, and pita',
      price: '$12',
      image: '/falafel-bowl.jpg'
    },
    {
      id: 'dinner-ribeye-bowl',
      name: 'Ribeye Bowl',
      description: 'Tender ribeye strips over yellow rice with fresh vegetables and tahini',
      price: '$16',
      image: '/ribeye-bowl.jpg'
    }
  ];

  const drinksItems = [
    {
      id: 'hibiscus-lemonade',
      name: 'Hibiscus Lemonade',
      description: 'Refreshing hibiscus-infused lemonade',
      price: '$4',
      image: '/hibiscus-lemonade.jpg'
    },
    {
      id: 'baklava',
      name: 'Baklava',
      description: 'Sweet pastry with layers of nuts and honey',
      price: '$6',
      image: '/baklava.jpg'
    },
    {
      id: 'peach-crumble',
      name: 'Peach Crumble',
      description: 'Sweet peach dessert with a golden buttery crumble topping',
      price: '$8',
      image: '/peach-crumble.jpg'
    },
    {
      id: 'rice-pudding',
      name: 'Rice Pudding',
      description: 'Creamy rice pudding with cinnamon and a hint of vanilla',
      price: '$7',
      image: '/rice-pudding.jpg'
    }
  ];

  // Get the current items based on active tab
  const getCurrentItems = () => {
    switch(activeTab) {
      case 'Lunch':
        return lunchItems;
      case 'Appetizers':
        return appetizerItems;
      case 'Dinner':
        return dinnerItems;
      case 'Drinks':
        return drinksItems;
      default:
        return [];
    }
  };

  return (
    <div className={styles.container}>
      {/* Fixed Buttons */}
      <div className={styles.fixedButtonsContainer}>
        <a 
          href="https://www.sababafalafelshop.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.fixedOrderButton}
        >
          Order Now
        </a>
        <button 
          className={styles.fixedCallButton}
          onClick={() => window.open('tel:+1-714-242-8977')}
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
          className={`${styles.tabButton} ${activeTab === 'Appetizers' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Appetizers')}
        >
          Appetizers & Sides
        </button>
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
          Drinks & Desserts
        </button>
      </div>
      
      {/* Menu content */}
      <div className={styles.menuContent}>
        <h2 className={styles.menuHeading}>
          {activeTab === 'Drinks' ? 'Drinks & Desserts' : 
           activeTab === 'Appetizers' ? 'Appetizers & Sides' : 
           activeTab} Menu
        </h2>
        
        {/* Menu Grid - using the data objects */}
        <div className={styles.menuGrid}>
          {getCurrentItems().map(item => (
            <div 
              className={styles.menuCard} 
              key={item.id}
              data-item-id={item.id}
              data-category={activeTab}
              onClick={() => handleItemClick(item)}
            >
              <div className={styles.menuImageContainer}>
                <img src={item.image} alt={item.name} className={styles.menuCardImage} />
              </div>
              <div className={styles.menuCardContent}>
                <h3 className={styles.menuCardName}>{item.name}</h3>
                <p className={styles.menuCardDescription}>{item.description}</p>
                <p className={styles.menuCardPrice}>{item.price}</p>
              </div>
            </div>
          ))}
        </div>
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

      <div className="mt-4 mb-8">
        <Link 
          href={`/dashboard?restaurant=sababa-falafel`} 
          className={styles.dashboardLink || "text-blue-600 hover:underline"}
        >
          View Analytics Dashboard
        </Link>
      </div>
      
      <Link href="/" className={styles.backLink}>← Back to all restaurants</Link>
      
      {/* Menu Item Modal */}
      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={closeModal} />
      )}
    </div>
  );
}