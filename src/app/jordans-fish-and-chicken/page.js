'use client';
import { useState, useEffect } from 'react';
import styles from './restaurantPage.module.css';
import Link from 'next/link';
import MenuVistaAdvancedTracking from '../analytics/advancedTracking';

export default function JordansFishAndChickenPage() {
  const [activeTab, setActiveTab] = useState('Chicken & Fish');
  const [selectedItem, setSelectedItem] = useState(null);
  
  useEffect(() => {
    // Initialize analytics with restaurant ID
    console.log('Initializing analytics once');
    MenuVistaAdvancedTracking.init('jordans-fish-and-chicken');
    
    // Handle scroll-based opacity for fixed buttons
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const buttonsContainer = document.querySelector(`.${styles.fixedButtonsContainer}`);
      if (buttonsContainer) {
        // Start reducing opacity after 100px scroll, minimum opacity 0.6
        const opacity = Math.max(0.6, 1 - (scrollY / 800));
        buttonsContainer.style.opacity = opacity;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
  const chickenFishItems = [
    {
      id: 'chicken-fish-combo',
      name: 'Chicken & Fish Combo',
      description: 'Includes fries and can of pop. Choose from various wing and tender combinations with catfish, perch, whiting, tilapia, or shrimp',
      price: '$14.99',
      image: '/jordans2.jpg'
    },
    {
      id: 'fish-wings-family-special',
      name: 'Fish & Wings Family Special',
      description: '10 Wings + 5 Fish for $37.99, 20 Wings + 10 Fish for $49.99, 30 Wings + 20 Fish for $78.99, or 50 Wings + 30 Fish for $119.99',
      price: 'From $37.99',
      image: '/jordans3.jpg'
    },
    {
      id: 'kids-meal',
      name: 'Kids Meal',
      description: 'Includes fries and can of pop. Choice of 3 wings, 2 tenders, single cheeseburger, or pizza puff',
      price: '$7.99',
      image: '/jordans4.jpg'
    },
    {
      id: 'lunch-special',
      name: 'Lunch Special',
      description: 'Monday-Friday 10:30am-2:30pm. Various combinations of wings, tenders, and fish with sides',
      price: '$10.99',
      image: '/jordans5.jpg'
    }
  ];

  const wingsItems = [
    {
      id: '4-wings',
      name: '4 Wings',
      description: 'Includes fries. Fresh chicken wings cooked to perfection',
      price: '$8.99',
      image: '/jordans6.jpeg'
    },
    {
      id: '6-wings',
      name: '6 Wings',
      description: 'Includes fries. Fresh chicken wings cooked to perfection',
      price: '$9.99',
      image: '/jordans7.jpg'
    },
    {
      id: '8-wings',
      name: '8 Wings',
      description: 'Includes fries. Fresh chicken wings cooked to perfection',
      price: '$10.99',
      image: '/jordans10.jpeg'
    },
    {
      id: '10-wings',
      name: '10 Wings',
      description: 'Includes fries. Fresh chicken wings cooked to perfection',
      price: '$12.99',
      image: '/jordans11.jpg'
    },
    {
      id: '15-wings',
      name: '15 Wings',
      description: 'Includes fries. Fresh chicken wings cooked to perfection',
      price: '$19.99',
      image: '/jordans12.jpg'
    },
    {
      id: '20-wings',
      name: '20 Wings',
      description: 'Includes fries. Fresh chicken wings cooked to perfection',
      price: '$22.99',
      image: '/jordans13.jpg'
    }
  ];

  const tendersItems = [
    {
      id: '4-tenders',
      name: '4 Tenders',
      description: 'Includes fries. Crispy chicken tenders made fresh',
      price: '$9.99',
      image: '/jordans14.jpg'
    },
    {
      id: '6-tenders',
      name: '6 Tenders',
      description: 'Includes fries. Crispy chicken tenders made fresh',
      price: '$11.99',
      image: '/jordans16.jpg'
    },
    {
      id: '8-tenders',
      name: '8 Tenders',
      description: 'Includes fries. Crispy chicken tenders made fresh',
      price: '$14.99',
      image: '/jordans19.jpg'
    },
    {
      id: '10-tenders',
      name: '10 Tenders',
      description: 'Includes fries. Crispy chicken tenders made fresh',
      price: '$18.99',
      image: '/jordans20.jpg'
    },
    {
      id: '15-tenders',
      name: '15 Tenders',
      description: 'Includes fries. Crispy chicken tenders made fresh',
      price: '$29.99',
      image: '/jordans21.jpg'
    },
    {
      id: '20-tenders',
      name: '20 Tenders',
      description: 'Includes fries. Crispy chicken tenders made fresh',
      price: '$37.99',
      image: '/jordans22.jpg'
    }
  ];

  const fishShrimpItems = [
    {
      id: 'catfish-fillet',
      name: 'Catfish Fillet',
      description: 'Includes fries. Fresh catfish fillet fried to golden perfection',
      price: 'Small $11.99 / Large $13.99',
      image: '/jordans23.jpg'
    },
    {
      id: 'tilapia',
      name: 'Tilapia',
      description: 'Includes fries. Fresh tilapia fillet seasoned and fried',
      price: 'Small $11.99 / Large $13.99',
      image: '/jordans24.jpg'
    },
    {
      id: 'perch',
      name: 'Perch',
      description: 'Includes fries. Fresh perch fillet lightly breaded and fried',
      price: 'Small $11.99 / Large $13.99',
      image: '/jordans25.jpg'
    },
    {
      id: 'whiting',
      name: 'Whiting',
      description: 'Includes fries. Fresh whiting fillet seasoned and fried',
      price: 'Small $11.99 / Large $13.99',
      image: '/jordans2.jpg'
    },
    {
      id: 'jumbo-shrimp',
      name: 'Jumbo Shrimp',
      description: 'Includes fries. Large shrimp breaded and fried to perfection',
      price: '5pc $9.99 / 10pc $17.99 / 15pc $28.99 / 20pc $53.99 / 50pc $69.99',
      image: '/jordans-shrimp.jpg'
    },
    {
      id: 'fish-dinner',
      name: 'Fish Dinner',
      description: 'Includes fries. Choose from catfish, tilapia, perch, or whiting',
      price: 'Small $11.99 / Large $13.99',
      image: '/jordans3.jpg'
    }
  ];

  const sidesDessertsItems = [
    {
      id: 'french-fries',
      name: 'French Fries',
      description: 'Crispy golden fries seasoned to perfection',
      price: 'Small $5.19 / Large $9.99',
      image: '/jordans4.jpg'
    },
    {
      id: 'okra',
      name: 'Okra',
      description: 'Fresh okra lightly breaded and fried',
      price: 'Small $5.19 / Large $9.99',
      image: '/jordans5.jpg'
    },
    {
      id: 'mushrooms',
      name: 'Mushrooms',
      description: 'Fresh mushrooms breaded and fried',
      price: 'Small $5.19 / Large $9.99',
      image: '/jordans6.jpeg'
    },
    {
      id: 'mac-cheese',
      name: 'Mac & Cheese',
      description: 'Creamy macaroni and cheese',
      price: 'Small $5.19 / Large $9.99',
      image: '/jordans7.jpg'
    },
    {
      id: 'cookies',
      name: 'Cookies',
      description: 'Fresh baked cookies',
      price: '$2.99',
      image: '/jordans10.jpeg'
    },
    {
      id: 'cheesecake',
      name: 'Cheesecake',
      description: 'Rich and creamy cheesecake',
      price: '$4.49',
      image: '/jordans11.jpg'
    }
  ];

  // Get the current items based on active tab
  const getCurrentItems = () => {
    switch(activeTab) {
      case 'Chicken & Fish':
        return chickenFishItems;
      case 'Wings':
        return wingsItems;
      case 'Tenders':
        return tendersItems;
      case 'Fish & Shrimp':
        return fishShrimpItems;
      case 'Sides & Desserts':
        return sidesDessertsItems;
      default:
        return [];
    }
  };

  return (
    <div className={styles.container}>
      {/* Fixed Buttons */}
      <div className={styles.fixedButtonsContainer}>
        <a 
          href="tel:+1-317-375-7550" 
          className={styles.fixedOrderButton}
        >
          Order Now
        </a>
        <button 
          className={styles.fixedCallButton}
          onClick={() => window.open('tel:+1-317-375-7550')}
        >
          Call
        </button>
      </div>

      {/* Hero image */}
      <div className={styles.heroImage}>
        <img 
          src="/jordans-fish-and-chicken.jpg"
          alt="Jordan's Fish and Chicken Restaurant" 
          className={styles.coverImage}
        />
      </div>
      
      {/* Restaurant name */}
      <h1 className={styles.restaurantName}>Jordan's Fish and Chicken</h1>
      
      {/* Tags */}
      <div className={styles.tagContainer}>
        <span className={styles.tag}>American</span>
        <span className={styles.tag}>Fish & Chicken</span>
        <span className={styles.tag}>Family-Friendly</span>
      </div>
      
      {/* Menu tabs */}
      <div className={styles.menuTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Chicken & Fish' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Chicken & Fish')}
        >
          Chicken & Fish
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Wings' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Wings')}
        >
          Wings
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Tenders' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Tenders')}
        >
          Tenders
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Fish & Shrimp' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Fish & Shrimp')}
        >
          Fish & Shrimp
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Sides & Desserts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Sides & Desserts')}
        >
          Sides & Desserts
        </button>
      </div>
      
      {/* Menu content */}
      <div className={styles.menuContent}>
        <h2 className={styles.menuHeading}>
          {activeTab} Menu
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
          <a href="#" className={styles.socialIcon}>i</a>
        </div>
        <div className={styles.hours}>
          Sun-Thu 10:30am-12:00am • Fri-Sat 10:30pm-1:00am
        </div>
      </div>

      <div className="mt-4 mb-8">
        <Link 
          href={`/dashboard?restaurant=jordans-fish-and-chicken`} 
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