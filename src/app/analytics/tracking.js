// src/app/analytics/tracking.js

/**
 * MenuVista Analytics - Core Tracking Module
 * Tracks user interactions with restaurant menus
 */

export const MenuVistaAnalytics = {
    sessionId: null,
    sessionStartTime: null,
    restaurantId: null,
    viewSequence: [],
    currentViewItem: null,
    currentViewStartTime: null,
    
    // Initialize tracking on page load
    init: function(restaurantId) {
      if (typeof window === 'undefined') return; // Skip during SSR

      // Check if already initialized for this restaurant
      if (this.sessionId && this.restaurantId === restaurantId) {
        console.log('Analytics already initialized for restaurant:', restaurantId);
        return; // Skip re-initialization
      }
      
      this.sessionId = this.generateSessionId();
      this.sessionStartTime = new Date();
      this.restaurantId = restaurantId;
      
      // Capture device and browser info
      this.deviceInfo = {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      };
      
      // Log session start
      this.logEvent('session_start', {
        sessionId: this.sessionId,
        restaurantId: this.restaurantId,
        deviceInfo: this.deviceInfo,
        timestamp: this.sessionStartTime
      });
      
      // Set up handlers for menu interactions
      this.setupEventListeners();
      
      // Handle page unload
      window.addEventListener('beforeunload', () => {
        this.trackSessionEnd();
      });
      
      console.log('MenuVista Analytics initialized for restaurant:', restaurantId);
    },
    
    // Generate unique session ID
    generateSessionId: function() {
      return 'mv_' + Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15) + 
             '_' + new Date().getTime();
    },
    
    // Set up event listeners for menu interactions
    setupEventListeners: function() {
      // Wait for content to be fully loaded
      setTimeout(() => {
        // Track when user views menu items (using menu-card class from your existing code)
        document.querySelectorAll('.menuCard').forEach(item => {
          // Add data attributes if they don't exist
          if (!item.dataset.itemId) {
            const itemName = item.querySelector('.menuCardName')?.textContent.trim();
            item.dataset.itemId = itemName ? itemName.replace(/\s+/g, '-').toLowerCase() : 'unknown-item';
            
            const category = this.detectCategoryFromDOM(item);
            item.dataset.category = category;
          }
          
          // Using Intersection Observer to track when items become visible
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.trackItemView(entry.target.dataset.itemId, entry.target.dataset.category);
              } else {
                this.trackItemViewEnd(entry.target.dataset.itemId);
              }
            });
          }, { threshold: 0.7 }); // Item is considered viewed when 70% visible
          
          observer.observe(item);
          
          // Also track clicks on menu items
          item.addEventListener('click', () => {
            this.trackItemClick(item.dataset.itemId, item.dataset.category);
          });
        });
        
        // Track menu section navigation (using tabButton class from your structure)
        document.querySelectorAll('.tabButton').forEach(button => {
          button.addEventListener('click', () => {
            const section = button.textContent.trim();
            this.trackSectionChange(section);
          });
        });
      }, 1000); // Wait 1 second for content to load fully
    },
    
    // Try to detect the category of a menu item based on DOM structure
    detectCategoryFromDOM: function(menuItem) {
      // Try to find active tab
      const activeTab = document.querySelector('.activeTab');
      if (activeTab) {
        return activeTab.textContent.trim();
      }
      
      // Fallback to detecting from parent containers
      let current = menuItem;
      while (current && current !== document.body) {
        if (current.classList.contains('menuGrid') && current.parentElement) {
          // Try to find a heading before this grid
          const headings = current.parentElement.querySelectorAll('h2');
          for (const heading of headings) {
            if (heading.textContent.includes('Menu')) {
              return heading.textContent.replace('Menu', '').trim();
            }
          }
        }
        current = current.parentElement;
      }
      
      return 'unknown';
    },
    
    // Track when user views a menu item
    trackItemView: function(itemId, category) {
      // If already viewing an item, end that view first
      if (this.currentViewItem) {
        this.trackItemViewEnd(this.currentViewItem);
      }
      
      this.currentViewItem = itemId;
      this.currentViewStartTime = new Date();
      
      this.logEvent('item_view_start', {
        itemId: itemId,
        category: category,
        timestamp: this.currentViewStartTime
      });
    },
    
    // Track when user stops viewing a menu item
    trackItemViewEnd: function(itemId) {
      if (this.currentViewItem === itemId && this.currentViewStartTime) {
        const endTime = new Date();
        const viewDuration = endTime - this.currentViewStartTime;
        
        this.viewSequence.push({
          itemId: itemId,
          duration: viewDuration,
          startTime: this.currentViewStartTime,
          endTime: endTime
        });
        
        this.logEvent('item_view_end', {
          itemId: itemId,
          duration: viewDuration,
          timestamp: endTime
        });
        
        this.currentViewItem = null;
        this.currentViewStartTime = null;
      }
    },
    
    // Track when user clicks on a menu item
    trackItemClick: function(itemId, category) {
      // Get all previously viewed items
      const previousViews = this.viewSequence.filter(view => view.itemId === itemId);
      
      // Calculate total time spent viewing this item previously
      const totalPreviousViewTime = previousViews.reduce((total, view) => total + view.duration, 0);
      
      this.logEvent('item_click', {
        itemId: itemId,
        category: category,
        timestamp: new Date(),
        // Add enhanced metrics
        viewCount: previousViews.length,
        totalViewTime: totalPreviousViewTime,
        averageViewTime: previousViews.length > 0 ? totalPreviousViewTime / previousViews.length : 0,
        // Add view sequence position
        sequencePosition: this.viewSequence.length
      });
    },
    
    // Track when user changes menu sections
    trackSectionChange: function(sectionName) {
      this.logEvent('section_change', {
        section: sectionName,
        timestamp: new Date()
      });
    },
    
    // Track session end
    trackSessionEnd: function() {
      const endTime = new Date();
      const sessionDuration = endTime - this.sessionStartTime;
      
      this.logEvent('session_end', {
        sessionId: this.sessionId,
        duration: sessionDuration,
        viewSequence: this.viewSequence,
        timestamp: endTime
      });
    },
    
    // Log event to server
    logEvent: function(eventType, eventData) {
      if (typeof window === 'undefined') return; // Skip during SSR
      
      const payload = {
        eventType: eventType,
        sessionId: this.sessionId,
        restaurantId: this.restaurantId,
        ...eventData
      };
      
      // Debug log
      console.log('Analytics event:', eventType, payload);
      
      // Send to server endpoint
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        // Use beacon API for exit events to ensure they're sent
        keepalive: eventType === 'session_end'
      }).catch(error => {
        console.error('Error logging analytics event:', error);
        
        // Fallback to local storage if network request fails
        if (localStorage) {
          const storedEvents = JSON.parse(localStorage.getItem('mv_offline_events') || '[]');
          storedEvents.push(payload);
          localStorage.setItem('mv_offline_events', JSON.stringify(storedEvents));
        }
      });
    }
  };
  
  export default MenuVistaAnalytics;