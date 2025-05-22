'use client';
import { useState, useEffect } from 'react';
import styles from './restaurantPage.module.css';
import Link from 'next/link';
import MenuVistaAdvancedTracking from '../analytics/advancedTracking';

export default function SababaFalafelPage() {
  const [activeTab, setActiveTab] = useState('Lunch');
  const [selectedItem, setSelectedItem] = useState(null);
  const [language, setLanguage] = useState('en'); // Default language is English
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  useEffect(() => {
    // Initialize analytics with restaurant ID
    console.log('Initializing analytics once');
    MenuVistaAdvancedTracking.init('sababa-falafel');
    
    // Track language selection in analytics
    if (language !== 'en') {
      MenuVistaAdvancedTracking.logEvent('language_change', {
        from: 'en',
        to: language,
        timestamp: new Date()
      });
    }
    
    // Clean up on component unmount
    return () => {
      if (MenuVistaAdvancedTracking.currentViewItem) {
        MenuVistaAdvancedTracking.trackItemViewEnd(MenuVistaAdvancedTracking.currentViewItem);
      }
    };
  }, [language]);

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

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  // Handle language selection
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  // Menu Item Modal Component
  const MenuItemModal = ({ item, onClose }) => {
    if (!item) return null;
    
    // Get the correct item data based on language
    const itemName = language === 'ar' ? (item.nameAr || item.name) : item.name;
    const itemDescription = language === 'ar' ? (item.descriptionAr || item.description) : item.description;
    
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <div className={styles.modalImageContainer}>
            <img src={item.image} alt={itemName} className={styles.modalImage} />
          </div>
          <div className={styles.modalDetails} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className={styles.modalTitle}>{itemName}</h2>
            <p className={styles.modalDescription}>{itemDescription}</p>
            <p className={styles.modalPrice}>{item.price}</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Translations for UI elements
  const translations = {
    en: {
      restaurantName: 'Sababa Falafel',
      tabs: {
        Lunch: 'Lunch',
        Appetizers: 'Appetizers & Sides',
        Dinner: 'Dinner',
        Drinks: 'Drinks & Desserts'
      },
      menuTitle: 'Menu',
      orderNow: 'Order Now',
      call: 'Call',
      tags: ['Middle Eastern', 'Vegetarian', 'Family-Friendly'],
      hours: 'Mon-Sat 10am-10pm • Sun 10am-8pm',
      backLink: '← Back to all restaurants',
      viewDashboard: 'View Analytics Dashboard',
      viewAltLayout: 'View Alternative Layout',
      layoutInfo: 'Original Layout (3 items per row)'
    },
    ar: {
      restaurantName: 'صبابا فلافل',
      tabs: {
        Lunch: 'الغداء',
        Appetizers: 'المقبلات والجانبية',
        Dinner: 'العشاء',
        Drinks: 'المشروبات والحلويات'
      },
      menuTitle: 'القائمة',
      orderNow: 'اطلب الآن',
      call: 'اتصل',
      tags: ['شرق أوسطي', 'نباتي', 'مناسب للعائلة'],
      hours: 'الاثنين-السبت ١٠ص-١٠م • الأحد ١٠ص-٨م',
      backLink: '← العودة إلى جميع المطاعم',
      viewDashboard: 'عرض لوحة التحليلات',
      viewAltLayout: 'عرض التخطيط البديل',
      layoutInfo: 'التخطيط الأصلي (٣ عناصر في كل صف)'
    }
  };

  // Create menu items data objects for each tab
  const lunchItems = [
    {
      id: 'falafel-bowl',
      name: 'Falafel Bowl',
      description: 'Fresh falafel with hummus, tahini, and pita',
      nameAr: 'طبق الفلافل',
      descriptionAr: 'فلافل طازجة مع حمص، طحينة، وخبز بيتا',
      price: '$12',
      image: '/falafel-bowl.jpg'
    },
    {
      id: 'chicken-bowl',
      name: 'Chicken Bowl',
      description: 'Marinated chicken with rice and salad',
      nameAr: 'طبق الدجاج',
      descriptionAr: 'دجاج متبل مع أرز وسلطة',
      price: '$14',
      image: '/chicken-bowl.jpg'
    },
    {
      id: 'falafel-on-jerusalem-bread',
      name: 'Falafel on Jerusalem Bread',
      description: 'Crispy falafel in fresh bread with tahini and vegetables',
      nameAr: 'فلافل على خبز القدس',
      descriptionAr: 'فلافل مقرمشة في خبز طازج مع طحينة وخضروات',
      price: '$14',
      image: '/falafel-on-jerusalem-bread.jpg'
    },
    {
      id: 'falafel-with-fried-veggies',
      name: 'Falafel With Fried Veggies',
      description: 'Golden falafel in pita with fried vegetables and tahini sauce',
      nameAr: 'فلافل مع خضروات مقلية',
      descriptionAr: 'فلافل ذهبية في خبز بيتا مع خضروات مقلية وصلصة طحينة',
      price: '$15',
      image: '/falafel-with-fried-veggies.jpg'
    },
    {
      id: 'fire-bowl',
      name: 'Fire Bowl',
      description: 'Spicy beef over yellow rice with fresh vegetables and tahini',
      nameAr: 'طبق النار',
      descriptionAr: 'لحم بقري حار على أرز أصفر مع خضروات طازجة وطحينة',
      price: '$17',
      image: '/fire-bowl.jpg'
    },
    {
      id: 'ribeye-bowl',
      name: 'Ribeye Bowl',
      description: 'Tender ribeye strips over yellow rice with fresh vegetables and tahini',
      nameAr: 'طبق ريب آي',
      descriptionAr: 'شرائح لحم ريب آي طرية على أرز أصفر مع خضروات طازجة وطحينة',
      price: '$16',
      image: '/ribeye-bowl.jpg'
    },
    {
      id: 'ribeye-pita',
      name: 'Ribeye Pita',
      description: 'Juicy ribeye in soft pita with fresh vegetables and tahini sauce',
      nameAr: 'ريب آي بيتا',
      descriptionAr: 'لحم ريب آي عصير في خبز بيتا ناعم مع خضروات طازجة وصلصة طحينة',
      price: '$15',
      image: '/ribeye-pita.jpg'
    }
  ];

  const appetizerItems = [
    {
      id: 'hummus',
      name: 'Hummus',
      description: 'Creamy chickpea dip with olive oil and pita',
      nameAr: 'حمص',
      descriptionAr: 'حمص كريمي مع زيت زيتون وخبز بيتا',
      price: '$16',
      image: '/hummus.jpg'
    },
    {
      id: 'fettah-with-ribeye',
      name: 'Fettah With Ribeye',
      description: 'Creamy hummus topped with tender ribeye and toasted pine nuts',
      nameAr: 'فتة مع ريب آي',
      descriptionAr: 'حمص كريمي مع لحم ريب آي طري وصنوبر محمص',
      price: '$18',
      image: '/fettah-with-ribeye.jpg'
    },
    {
      id: 'fettah',
      name: 'Fettah',
      description: 'Traditional hummus topped with pine nuts and fresh herbs',
      nameAr: 'فتة',
      descriptionAr: 'حمص تقليدي مع صنوبر وأعشاب طازجة',
      price: '$16',
      image: '/fettah.jpg'
    },
    {
      id: 'french-fries',
      name: 'French Fries',
      description: 'Crispy golden fries served with ketchup and garlic sauce',
      nameAr: 'بطاطا مقلية',
      descriptionAr: 'بطاطا مقلية مقرمشة تقدم مع كاتشب وصلصة ثوم',
      price: '$6',
      image: '/french-fries.jpg'
    },
    {
      id: 'fried-veggies-8oz',
      name: 'Fried Veggies 8oz',
      description: 'Crispy cauliflower with fried potatoes and roasted eggplant',
      nameAr: 'خضروات مقلية ٨ أونصات',
      descriptionAr: 'قرنبيط مقرمش مع بطاطا مقلية وباذنجان مشوي',
      price: '$9',
      image: '/fried-veggies-8oz.jpg'
    },
    {
      id: 'half-hummus-half-foul',
      name: 'Half Hummus Half Foul',
      description: 'A split plate of hummus and fava bean dip',
      nameAr: 'نصف حمص نصف فول',
      descriptionAr: 'طبق مقسم من الحمص والفول المدمس',
      price: '$10',
      image: '/half-hummus-half-foul.jpg'
    },
    {
      id: '6-piece-falafel',
      name: '6 Piece Falafel',
      description: 'Six freshly fried falafel balls with tahini sauce',
      nameAr: '٦ قطع فلافل',
      descriptionAr: 'ست كرات فلافل مقلية طازجة مع صلصة طحينة',
      price: '$8',
      image: '/6-piece-falafel.jpg'
    },
    {
      id: 'pita-chips',
      name: 'Pita Chips',
      description: 'Crispy pita chips seasoned with herbs',
      nameAr: 'رقائق بيتا',
      descriptionAr: 'رقائق بيتا مقرمشة متبلة بالأعشاب',
      price: '$5',
      image: '/pita-chips.jpg'
    }
  ];

  const dinnerItems = [
    {
      id: 'family-pack',
      name: 'Family Pack',
      description: 'Assorted dishes perfect for sharing with family',
      nameAr: 'وجبة عائلية',
      descriptionAr: 'تشكيلة من الأطباق المثالية للمشاركة مع العائلة',
      price: '$32',
      image: '/family-pack.jpg'
    },
    {
      id: 'premium-family-pack',
      name: 'Premium Family Pack',
      description: 'Seasonal vegetables lightly fried in olive oil',
      nameAr: 'وجبة عائلية فاخرة',
      descriptionAr: 'خضروات موسمية مقلية قليلاً في زيت الزيتون',
      price: '$38',
      image: '/premium-family-pack.jpg'
    },
    {
      id: 'dinner-falafel-bowl',
      name: 'Falafel Bowl',
      description: 'Fresh falafel with hummus, tahini, and pita',
      nameAr: 'طبق الفلافل',
      descriptionAr: 'فلافل طازجة مع حمص، طحينة، وخبز بيتا',
      price: '$12',
      image: '/falafel-bowl.jpg'
    },
    {
      id: 'dinner-ribeye-bowl',
      name: 'Ribeye Bowl',
      description: 'Tender ribeye strips over yellow rice with fresh vegetables and tahini',
      nameAr: 'طبق ريب آي',
      descriptionAr: 'شرائح لحم ريب آي طرية على أرز أصفر مع خضروات طازجة وطحينة',
      price: '$16',
      image: '/ribeye-bowl.jpg'
    }
  ];

  const drinksItems = [
    {
      id: 'hibiscus-lemonade',
      name: 'Hibiscus Lemonade',
      description: 'Refreshing hibiscus-infused lemonade',
      nameAr: 'ليموناضة بالكركديه',
      descriptionAr: 'ليموناضة منعشة مع نكهة الكركديه',
      price: '$4',
      image: '/hibiscus-lemonade.jpg'
    },
    {
      id: 'baklava',
      name: 'Baklava',
      description: 'Sweet pastry with layers of nuts and honey',
      nameAr: 'بقلاوة',
      descriptionAr: 'حلوى عربية محلاة بطبقات من المكسرات والعسل',
      price: '$6',
      image: '/baklava.jpg'
    },
    {
      id: 'peach-crumble',
      name: 'Peach Crumble',
      description: 'Sweet peach dessert with a golden buttery crumble topping',
      nameAr: 'كرامبل الخوخ',
      descriptionAr: 'حلوى الخوخ الحلوة مع طبقة من فتات الزبدة الذهبية',
      price: '$8',
      image: '/peach-crumble.jpg'
    },
    {
      id: 'rice-pudding',
      name: 'Rice Pudding',
      description: 'Creamy rice pudding with cinnamon and a hint of vanilla',
      nameAr: 'أرز باللبن',
      descriptionAr: 'أرز باللبن كريمي مع القرفة ونكهة الفانيليا',
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
    <div className={styles.container} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Selector */}
      <div className={styles.languageSelectorContainer}>
        <button 
          className={styles.languageButton}
          onClick={toggleLanguageDropdown}
          aria-label="Select language"
        >
          {language === 'en' ? 'English' : 'العربية'} <span className={styles.dropdownArrow}>▼</span>
        </button>
        {showLanguageDropdown && (
          <div className={styles.languageDropdown}>
            <button 
              className={`${styles.languageOption} ${language === 'en' ? styles.activeLanguage : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              English
            </button>
            <button 
              className={`${styles.languageOption} ${language === 'ar' ? styles.activeLanguage : ''}`}
              onClick={() => handleLanguageChange('ar')}
            >
              العربية
            </button>
          </div>
        )}
      </div>

      {/* Fixed Buttons */}
      <div className={styles.fixedButtonsContainer}>
        <a 
          href="https://www.sababafalafelshop.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.fixedOrderButton}
        >
          {translations[language].orderNow}
        </a>
        <button 
          className={styles.fixedCallButton}
          onClick={() => window.open('tel:+1-714-242-8977')}
        >
          {translations[language].call}
        </button>
      </div>

      {/* Hero image */}
      <div className={styles.heroImage}>
        <img 
          src="/sababa-falafel.jpg"
          alt={translations[language].restaurantName} 
          className={styles.coverImage}
        />
      </div>
      
      {/* Restaurant name */}
      <h1 className={styles.restaurantName}>{translations[language].restaurantName}</h1>

      {/* Layout info */}
      <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem', color: '#666' }}>
        {translations[language].layoutInfo}
      </div>

      {/* View Alternative Layout Button */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Link 
          href="/sababa-falafel-alt-layout" 
          className={styles.viewOptionsButton || "inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"}
        >
          {translations[language].viewAltLayout}
        </Link>
      </div>
      
      {/* Tags */}
      <div className={styles.tagContainer}>
        {translations[language].tags.map((tag, index) => (
          <span key={index} className={styles.tag}>{tag}</span>
        ))}
      </div>
      
      {/* Menu tabs */}
      <div className={styles.menuTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Appetizers' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Appetizers')}
        >
          {translations[language].tabs.Appetizers}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Lunch' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Lunch')}
        >
          {translations[language].tabs.Lunch}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Dinner' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Dinner')}
        >
          {translations[language].tabs.Dinner}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Drinks' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Drinks')}
        >
          {translations[language].tabs.Drinks}
        </button>
      </div>
      
      {/* Menu content */}
      <div className={styles.menuContent}>
        <h2 className={styles.menuHeading}>
          {activeTab === 'Drinks' ? translations[language].tabs.Drinks : 
           activeTab === 'Appetizers' ? translations[language].tabs.Appetizers : 
           translations[language].tabs[activeTab]} {translations[language].menuTitle}
        </h2>
        
        {/* Menu Grid - using the data objects */}
        <div className={styles.menuGrid}>
          {getCurrentItems().map(item => {
            // Get the correct item data based on language
            const itemName = language === 'ar' ? (item.nameAr || item.name) : item.name;
            const itemDescription = language === 'ar' ? (item.descriptionAr || item.description) : item.description;
            
            return (
              <div 
                className={styles.menuCard} 
                key={item.id}
                data-item-id={item.id}
                data-category={activeTab}
                onClick={() => handleItemClick(item)}
              >
                <div className={styles.menuImageContainer}>
                  <img src={item.image} alt={itemName} className={styles.menuCardImage} />
                </div>
                <div className={styles.menuCardContent}>
                  <h3 className={styles.menuCardName}>{itemName}</h3>
                  <p className={styles.menuCardDescription}>{itemDescription}</p>
                  <p className={styles.menuCardPrice}>{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.socialIcons}>
          <a 
            href="https://www.instagram.com/sababafalafelshop/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Follow us on Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a 
            href="https://www.tiktok.com/@sababafalafelshop?lang=en" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Follow us on TikTok"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.966-1.212-2.068-1.212-3.338h-3.025v14.05c0 1.577-1.281 2.858-2.858 2.858s-2.858-1.281-2.858-2.858 1.281-2.858 2.858-2.858c.297 0 .583.046.853.131V9.328a6.83 6.83 0 0 0-.853-.055c-3.762 0-6.808 3.046-6.808 6.808s3.046 6.808 6.808 6.808 6.808-3.046 6.808-6.808V8.515a9.15 9.15 0 0 0 5.372 1.706v-3.95a5.122 5.122 0 0 1-3.505-2.709z"/>
            </svg>
          </a>
        </div>
        <div className={styles.hours}>{translations[language].hours}</div>
      </div>

      <div className="mt-4 mb-8">
        <Link 
          href={`/dashboard?restaurant=sababa-falafel`} 
          className={styles.dashboardLink || "text-blue-600 hover:underline"}
        >
          {translations[language].viewDashboard}
        </Link>
      </div>
      
      <Link href="/" className={styles.backLink}>{translations[language].backLink}</Link>
      
      {/* Menu Item Modal */}
      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={closeModal} />
      )}
    </div>
  );
}