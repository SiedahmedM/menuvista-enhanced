// src/app/api/analytics/dashboard/route.js
import { getAllEvents, getEventsForRestaurant } from '../track/storage';

export async function GET(request) {
  try {
    // Get restaurant ID from query parameter, if any
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurant');
    
    console.log('Getting analytics for restaurant:', restaurantId);
    
    // Get events - either for a specific restaurant or all events
    const events = restaurantId 
      ? getEventsForRestaurant(restaurantId) 
      : getAllEvents();
    
    console.log(`Found ${events.length} events for analysis`);
    // Log first few events for debugging
    if (events.length > 0) {
      console.log('Sample events:', events.slice(0, 3));
    }
    
    // Analyze the data to generate insights
    const analytics = analyzeData(events, restaurantId);
    
    return new Response(JSON.stringify(analytics), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error processing analytics request:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate analytics',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

function analyzeData(events, restaurantId) {
  // Additional debug logging
  console.log(`Starting analyzeData with ${events.length} events`);
  
  // Initialize analytics object
  const analytics = {
    sessionCount: 0,
    mostViewedItems: [],
    popularCategories: [],
    itemAnalysis: []
  };
  
  // Get unique session IDs - use a Set to ensure uniqueness
  const sessionSet = new Set();
  events.forEach(event => {
    if (event.eventType === 'session_start' && event.sessionId) {
      sessionSet.add(event.sessionId);
    }
  });

  analytics.sessionCount = sessionSet.size;
  console.log(`Found ${analytics.sessionCount} unique sessions after duplication`);
  
  // Count item views AND CLICKS - check both events
  const itemViews = {};
  const itemClicks = {};
  const itemViewTimes = {};
  const itemCategories = {};
  
  events.forEach(event => {
    // Track both view_start events and click events
    if ((event.eventType === 'item_view_start' || event.eventType === 'item_click') && event.itemId) {
      // Log to debug
      console.log(`Processing ${event.eventType} for item ${event.itemId}`);
      
      // Count views/clicks
      if (event.eventType === 'item_view_start') {
        itemViews[event.itemId] = (itemViews[event.itemId] || 0) + 1;
      } else if (event.eventType === 'item_click') {
        itemClicks[event.itemId] = (itemClicks[event.itemId] || 0) + 1;
      }
      
      // Store category
      if (event.category) {
        itemCategories[event.itemId] = event.category;
      }
    }
    
    if (event.eventType === 'item_view_end' && event.itemId && event.duration) {
      // Store view times
      if (!itemViewTimes[event.itemId]) {
        itemViewTimes[event.itemId] = [];
      }
      itemViewTimes[event.itemId].push(event.duration);
    }
  });
  
  // Combine views and clicks for most popular items
  const itemInteractions = { ...itemViews };
  Object.keys(itemClicks).forEach(itemId => {
    itemInteractions[itemId] = (itemInteractions[itemId] || 0) + itemClicks[itemId];
  });
  
  // Calculate most viewed/clicked items
  analytics.mostViewedItems = Object.entries(itemInteractions)
    .map(([itemId, interactions]) => ({
      name: itemId.replace(/-/g, ' '),
      views: interactions
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  
  console.log('Most viewed items:', analytics.mostViewedItems);
  
  // Calculate popular categories
  const categoryViews = {};
  events.forEach(event => {
    if (event.eventType === 'section_change' && event.section) {
      categoryViews[event.section] = (categoryViews[event.section] || 0) + 1;
    }
  });
  
  analytics.popularCategories = Object.entries(categoryViews)
    .map(([name, views]) => ({ name, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  
  // Build item analysis with average view times
  analytics.itemAnalysis = Object.keys(itemInteractions).map(itemId => {
    const viewTimes = itemViewTimes[itemId] || [];
    const totalViewTime = viewTimes.reduce((sum, time) => sum + time, 0);
    const avgViewTime = viewTimes.length > 0
      ? (totalViewTime / viewTimes.length / 1000).toFixed(1)
      : 0;
    
    return {
      name: itemId.replace(/-/g, ' '),
      views: itemInteractions[itemId],
      avgViewTime,
      category: itemCategories[itemId] || 'Unknown'
    };
  }).sort((a, b) => b.views - a.views);
  
  return analytics;
}