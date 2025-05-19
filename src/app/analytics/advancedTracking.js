// src/app/analytics/advancedTracking.js

import MenuVistaAnalytics from './tracking';

export const MenuVistaAdvancedTracking = {
  ...MenuVistaAnalytics, // Extend your current analytics
  
  // Track mouse movements and hover positions
  mousePositions: [],
  hoverData: {},
  scrollDepths: {},
  viewportData: {},
  
  // Enhanced initialization
  init: function(restaurantId) {
    // Call original init
    MenuVistaAnalytics.init.call(this, restaurantId);
    
    // Add advanced tracking
    this.setupMouseTracking();
    this.setupScrollTracking();
    this.captureViewportData();
    
    console.log('Advanced tracking initialized for restaurant:', restaurantId);
  },
  
  // Track mouse position every 500ms
  setupMouseTracking: function() {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    let throttleTimer;
    
    document.addEventListener('mousemove', (e) => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          // Capture mouse position as percentage of viewport
          const position = {
            x: Math.round((e.clientX / window.innerWidth) * 100),
            y: Math.round((e.clientY / window.innerHeight) * 100),
            timestamp: new Date()
          };
          
          this.mousePositions.push(position);
          
          // Limit stored positions to prevent memory issues
          if (this.mousePositions.length > 100) {
            this.mousePositions.shift();
          }
          
          throttleTimer = null;
        }, 500);
      }
    });
    
    // Enhanced hover tracking
    setTimeout(() => {
      document.querySelectorAll('.menuCard').forEach(item => {
        const itemId = item.dataset.itemId;
        if (!itemId) return;
        
        item.addEventListener('mouseenter', () => {
          if (!this.hoverData[itemId]) {
            this.hoverData[itemId] = {
              hoverCount: 0,
              totalHoverTime: 0,
              hoverStart: null
            };
          }
          
          this.hoverData[itemId].hoverCount++;
          this.hoverData[itemId].hoverStart = new Date();
        });
        
        item.addEventListener('mouseleave', () => {
          if (!this.hoverData[itemId]?.hoverStart) return;
          
          const hoverDuration = new Date() - this.hoverData[itemId].hoverStart;
          this.hoverData[itemId].totalHoverTime += hoverDuration;
          
          // Log hover events that are meaningful (>300ms)
          if (hoverDuration > 300) {
            this.logEvent('item_hover', {
              itemId: itemId,
              category: item.dataset.category || 'unknown',
              duration: hoverDuration,
              timestamp: new Date()
            });
          }
          
          this.hoverData[itemId].hoverStart = null;
        });
      });
    }, 1000); // Wait for DOM to be fully loaded
  },
  
  // Track scroll depth
  setupScrollTracking: function() {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    let throttleTimer;
    
    window.addEventListener('scroll', () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = document.documentElement.clientHeight;
          
          // Calculate scroll depth as percentage
          const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
          
          // Track max scroll depth per session
          this.scrollDepths[this.sessionId] = Math.max(
            this.scrollDepths[this.sessionId] || 0,
            scrollPercentage
          );
          
          // Log significant scroll events (25%, 50%, 75%, 100%)
          if (scrollPercentage === 25 || scrollPercentage === 50 || 
              scrollPercentage === 75 || scrollPercentage === 100) {
            this.logEvent('scroll_depth', {
              depth: scrollPercentage,
              timestamp: new Date()
            });
          }
          
          throttleTimer = null;
        }, 200);
      }
    });
  },
  
  // Capture viewport data
  captureViewportData: function() {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    this.viewportData = {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      isMobile: this.deviceInfo?.isMobile || false
    };
    
    // Track viewport resizes
    window.addEventListener('resize', () => {
      this.viewportData = {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        isMobile: this.deviceInfo?.isMobile || false
      };
      
      // Log significant viewport changes
      this.logEvent('viewport_change', {
        width: window.innerWidth,
        height: window.innerHeight,
        timestamp: new Date()
      });
    });
  },
  
  // Enhanced session end with all advanced metrics
  trackSessionEnd: function() {
    const endTime = new Date();
    const sessionDuration = endTime - this.sessionStartTime;
    
    this.logEvent('advanced_session_end', {
      sessionId: this.sessionId,
      duration: sessionDuration,
      viewSequence: this.viewSequence,
      mousePositions: this.mousePositions,
      hoverData: this.hoverData,
      scrollDepth: this.scrollDepths[this.sessionId] || 0,
      viewportData: this.viewportData,
      timestamp: endTime
    });
    
    // Also call original session end
    MenuVistaAnalytics.trackSessionEnd.call(this);
  },
  
  // Track visibility of menu items using Intersection Observer
  trackItemVisibility: function() {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;
    
    setTimeout(() => {
      const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: [0.25, 0.5, 0.75, 1.0] // track different visibility thresholds
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const itemId = entry.target.dataset.itemId;
          if (!itemId) return;
          
          const visibilityRatio = Math.round(entry.intersectionRatio * 100);
          
          if (entry.isIntersecting && (visibilityRatio === 25 || visibilityRatio === 50 || 
              visibilityRatio === 75 || visibilityRatio === 100)) {
            this.logEvent('item_visibility', {
              itemId,
              visibilityRatio,
              timestamp: new Date()
            });
          }
        });
      }, options);
      
      // Observe all menu items
      document.querySelectorAll('.menuCard').forEach(item => {
        observer.observe(item);
      });
    }, 1000);
  },
  
  // Track time spent on page
  trackTimeOnPage: function() {
    if (typeof window === 'undefined') return;
    
    // Log time markers every 30 seconds
    this.timeInterval = setInterval(() => {
      const timeSpent = new Date() - this.sessionStartTime;
      
      this.logEvent('time_marker', {
        timeSpent,
        timestamp: new Date()
      });
    }, 30000);
    
    // Clear interval when page is hidden/closed
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        clearInterval(this.timeInterval);
        
        // Log page exit
        this.logEvent('page_exit', {
          timeSpent: new Date() - this.sessionStartTime,
          timestamp: new Date()
        });
      } else if (document.visibilityState === 'visible') {
        // Restart interval when page becomes visible again
        this.trackTimeOnPage();
      }
    });
  }
};

// Initialize all tracking methods
const originalInit = MenuVistaAdvancedTracking.init;
MenuVistaAdvancedTracking.init = function(restaurantId) {
  originalInit.call(this, restaurantId);
  this.trackItemVisibility();
  this.trackTimeOnPage();
};

export default MenuVistaAdvancedTracking;