// src/app/api/menu-optimization/insights/route.js
import { getEventsForRestaurant } from '../../analytics/track/storage';
import { getPositionValue } from '../position-values';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurant');
    
    if (!restaurantId) {
      return new Response(JSON.stringify({ error: 'Restaurant ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Gather the necessary data
    const [menuItemsResponse, marginResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/menu-items?restaurant=${restaurantId}`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/menu-optimization/margin-data?restaurant=${restaurantId}`)
    ]);
    
    let menuItems = [];
    let marginData = [];
    
    if (menuItemsResponse.ok) {
      menuItems = await menuItemsResponse.json();
    }
    
    if (marginResponse.ok) {
      marginData = await marginResponse.json();
    }
    
    // Enhance menu items with margin data
    if (marginData.length > 0) {
      menuItems = menuItems.map(item => {
        const marginInfo = marginData.find(m => m.itemId === item.id);
        if (marginInfo) {
          return {
            ...item,
            cost: marginInfo.cost,
            margin: marginInfo.margin,
            priority: marginInfo.priority
          };
        }
        return item;
      });
    }
    
    // Get analytics events
    const events = getEventsForRestaurant(restaurantId);
    
    // Generate insights with revenue impact
    const insights = generateInsightsWithRevenue(events, menuItems);
    
    return new Response(JSON.stringify(insights), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error generating menu insights:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to generate insights' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function generateInsightsWithRevenue(events, menuItems) {
  // Implementation similar to your existing recommendation engine but focused on 
  // clear, actionable items with revenue impact based on heat map data
  // ...
}