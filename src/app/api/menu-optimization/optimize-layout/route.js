import { getEventsForRestaurant } from '../../analytics/track/storage';
import { getPositionValue } from '../position-values';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { restaurantId, menuItems, menuLayout, fetchSummaryOnly } = await request.json();
    
    if (!restaurantId) {
      return new Response(JSON.stringify({ error: 'Missing required data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // If we only need a summary for the dashboard, we can skip some heavy processing
    if (fetchSummaryOnly) {
      // Get any saved recommendations data to avoid recomputing
      try {
        // Check for cached optimization data
        const cachedDataPath = path.join(process.cwd(), `optimization-cache-${restaurantId}.json`);
        
        if (fs.existsSync(cachedDataPath)) {
          const cachedData = JSON.parse(fs.readFileSync(cachedDataPath, 'utf8'));
          // Only return if the data is less than 24 hours old
          const cacheAge = Date.now() - cachedData.timestamp;
          if (cacheAge < 24 * 60 * 60 * 1000) { // 24 hours
            return new Response(JSON.stringify({
              projectedImpact: cachedData.projectedImpact,
              recommendations: cachedData.recommendations.slice(0, 3) // Only top 3 for dashboard
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
      } catch (cacheError) {
        console.error('Error reading cached optimization data:', cacheError);
        // Continue with regular processing
      }
    }
    
    // Continue with regular processing if no valid cache or not a summary request
    if (!menuItems || !menuLayout) {
      return new Response(JSON.stringify({ error: 'Missing required data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get any saved margin data for this restaurant
    let marginData = [];
    try {
      const marginResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/menu-optimization/margin-data?restaurant=${restaurantId}`);
      if (marginResponse.ok) {
        marginData = await marginResponse.json();
      }
    } catch (marginError) {
      console.error('Error fetching margin data:', marginError);
      // Continue without margin data
    }
    
    // If margin data exists, enhance the menuItems with it
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
    
    // Get all analytics events for this restaurant
    const events = getEventsForRestaurant(restaurantId);
    
    // Process the data to get key metrics
    const itemMetrics = processItemMetrics(events, menuItems);
    
    // Determine optimal positions
    const optimizedLayout = optimizeMenuLayout(itemMetrics, menuLayout);
    
    // Generate specific recommendations
    const recommendations = generateRecommendations(menuLayout, optimizedLayout, itemMetrics);
    
    // Calculate projected impact
    const projectedImpact = recommendations.reduce((total, rec) => total + parseFloat(rec.projectedRevenue), 0).toFixed(2);
    
    // If this is a summary request and we've processed recommendations,
    // cache the results for future dashboard views
    if (fetchSummaryOnly && recommendations.length > 0) {
      try {
        const cacheData = {
          timestamp: Date.now(),
          projectedImpact,
          recommendations
        };
        
        fs.writeFileSync(
          path.join(process.cwd(), `optimization-cache-${restaurantId}.json`),
          JSON.stringify(cacheData)
        );
      } catch (cacheError) {
        console.error('Error caching optimization data:', cacheError);
        // Non-critical, continue without caching
      }
    }
    
    return new Response(JSON.stringify({
      optimizedLayout,
      recommendations,
      projectedImpact
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error optimizing menu layout:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to optimize menu layout' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Process item metrics from events
function processItemMetrics(events, menuItems) {
  const itemMetrics = {};
  
  // Initialize metrics for all menu items
  menuItems.forEach(item => {
    itemMetrics[item.id] = {
      id: item.id,
      name: item.name,
      category: item.category,
      cost: parseFloat(item.cost) || 0,
      price: parseFloat(item.price?.replace('$', '')) || 0,
      margin: parseFloat(item.margin) || 0,
      priority: item.priority || 'medium',
      views: 0,
      clicks: 0,
      conversionRate: 0,
      averageViewTime: 0
    };
  });
  
  // Count views and clicks
  const itemViews = {};
  const itemClicks = {};
  const viewTimes = {};
  
  events.forEach(event => {
    if (event.eventType === 'item_view_start' && event.itemId) {
      itemViews[event.itemId] = (itemViews[event.itemId] || 0) + 1;
    }
    else if (event.eventType === 'item_click' && event.itemId) {
      itemClicks[event.itemId] = (itemClicks[event.itemId] || 0) + 1;
    }
    else if (event.eventType === 'item_view_end' && event.itemId && event.duration) {
      if (!viewTimes[event.itemId]) {
        viewTimes[event.itemId] = [];
      }
      viewTimes[event.itemId].push(event.duration);
    }
  });
  
  // Calculate metrics for each item
  Object.keys(itemMetrics).forEach(itemId => {
    const item = itemMetrics[itemId];
    item.views = itemViews[itemId] || 0;
    item.clicks = itemClicks[itemId] || 0;
    
    // Calculate conversion rate (clicks / views)
    item.conversionRate = item.views > 0 ? (item.clicks / item.views) : 0;
    
    // Calculate average view time
    const times = viewTimes[itemId] || [];
    item.averageViewTime = times.length > 0 
      ? times.reduce((sum, time) => sum + time, 0) / times.length 
      : 0;
    
    // Calculate importance score based on margin, priority and conversion
    const marginFactor = item.margin > 0 ? item.margin / 100 : 0.3; // Default to 30% if no margin data
    const priorityFactor = item.priority === 'high' ? 1.5 : (item.priority === 'medium' ? 1 : 0.5);
    const conversionFactor = Math.min(item.conversionRate * 10, 1); // Cap at 1
    
    item.importanceScore = marginFactor * priorityFactor * (1 + conversionFactor);
    
    // If we have no data yet, generate a reasonable importance score
    if (item.importanceScore === 0) {
      // Use price as a proxy for importance if available
      item.importanceScore = (item.price / 20) * priorityFactor; // Assuming $20 is high-end
    }
  });
  
  return itemMetrics;
}

// Optimize menu layout based on item metrics and position values
function optimizeMenuLayout(itemMetrics, currentLayout) {
  // Clone current layout
  const optimizedLayout = JSON.parse(JSON.stringify(currentLayout));
  
  // Get all menu items sorted by importance score
  const sortedItems = Object.values(itemMetrics)
    .sort((a, b) => b.importanceScore - a.importanceScore);
  
  // Get all positions sorted by value
  const allPositions = [];
  
  // For each category section
  currentLayout.forEach((section, sectionIndex) => {
    // For each row in the section
    section.items.forEach((row, rowIndex) => {
      // For each column position
      row.forEach((itemId, colIndex) => {
        if (itemId) { // Only consider positions that have items
          const positionValue = getPositionValue(rowIndex, colIndex, 'desktop');
          
          allPositions.push({
            sectionIndex,
            rowIndex,
            colIndex,
            value: positionValue,
            currentItemId: itemId
          });
        }
      });
    });
  });
  
  // Sort positions by value (highest first)
  allPositions.sort((a, b) => b.value - a.value);
  
  // Assign items to positions, maintaining category groupings
  sortedItems.forEach(item => {
    // Find best available position for this item within its category
    const itemCategory = item.category;
    
    // Find section index for this category
    let targetSectionIndex = currentLayout.findIndex(
      section => section.category === itemCategory
    );
    
    if (targetSectionIndex === -1) {
      // If category not found, skip this item
      return;
    }
    
    // Find best position in this section
    const bestPosition = allPositions.find(pos => 
      pos.sectionIndex === targetSectionIndex && 
      itemMetrics[pos.currentItemId]?.importanceScore < item.importanceScore
    );
    
    if (bestPosition) {
      // Swap the items
      const itemBeingReplaced = bestPosition.currentItemId;
      
      // Update the optimized layout
      optimizedLayout[bestPosition.sectionIndex].items[bestPosition.rowIndex][bestPosition.colIndex] = item.id;
      
      // Find current position of the item we're optimizing
      const currentPosition = allPositions.find(pos => pos.currentItemId === item.id);
      
      if (currentPosition) {
        // Place the replaced item in the position of the item we just moved
        optimizedLayout[currentPosition.sectionIndex].items[currentPosition.rowIndex][currentPosition.colIndex] = itemBeingReplaced;
        
        // Update allPositions to reflect the swap
        bestPosition.currentItemId = item.id;
        currentPosition.currentItemId = itemBeingReplaced;
      }
    }
  });
  
  return optimizedLayout;
}

// Generate specific recommendations
function generateRecommendations(currentLayout, optimizedLayout, itemMetrics) {
  const recommendations = [];
  
  // For each category section
  optimizedLayout.forEach((section, sectionIndex) => {
    const categoryName = section.category;
    
    // For each row in the section
    section.items.forEach((row, rowIndex) => {
      // For each column position
      row.forEach((itemId, colIndex) => {
        // Check if this item was moved
        const currentItemId = currentLayout[sectionIndex].items[rowIndex][colIndex];
        
        if (itemId && currentItemId !== itemId) {
          // This item was moved here from somewhere else
          const item = itemMetrics[itemId];
          
          // Find where it was previously
          let prevRowIndex, prevColIndex;
          
          outerLoop:
          for (let s = 0; s < currentLayout.length; s++) {
            for (let r = 0; r < currentLayout[s].items.length; r++) {
              for (let c = 0; c < currentLayout[s].items[r].length; c++) {
                if (currentLayout[s].items[r][c] === itemId) {
                  prevRowIndex = r;
                  prevColIndex = c;
                  break outerLoop;
                }
              }
            }
          }
          
          // Calculate position value improvement
          const prevPositionValue = getPositionValue(prevRowIndex, prevColIndex, 'desktop');
          const newPositionValue = getPositionValue(rowIndex, colIndex, 'desktop');
          
          // Calculate projected improvement
          const visibilityImprovement = ((newPositionValue - prevPositionValue) / prevPositionValue) * 100;
          
          // Estimate order increase based on visibility improvement (conservative estimate)
          const estimatedOrderIncrease = visibilityImprovement * 0.3; // 10% visibility = 3% more orders
          
          // Calculate revenue impact
          const price = itemMetrics[itemId].price || 0;
          const margin = itemMetrics[itemId].margin / 100 || 0.3; // Default to 30% margin
          const currentViews = itemMetrics[itemId].views || 1;
          const currentOrders = itemMetrics[itemId].clicks || 0;
          
          // Current order rate
          const currentOrderRate = currentOrders / Math.max(currentViews, 1);
          
          // Estimated new order rate
          const newOrderRate = currentOrderRate * (1 + (estimatedOrderIncrease / 100));
          
          // Expected additional orders per 100 views
          const additionalOrdersPer100 = (newOrderRate - currentOrderRate) * 100;
          
          // Revenue impact per 100 views
          const revenueImpactPer100 = additionalOrdersPer100 * price * margin;
          
          // Scale to monthly estimate based on current traffic
          const monthlyViewsEstimate = Math.max(currentViews * 4, 20); // Assuming current data is ~1 week, minimum 20
          const projectedRevenue = (revenueImpactPer100 / 100) * monthlyViewsEstimate;
          
          // Add recommendation if impact is meaningful
          if (visibilityImprovement > 5) {
            recommendations.push({
              itemId,
              itemName: item.name,
              category: categoryName,
              fromPosition: `Row ${prevRowIndex + 1}, Column ${prevColIndex + 1}`,
              toPosition: `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
              visibilityImprovement: Math.round(visibilityImprovement),
              estimatedOrderIncrease: estimatedOrderIncrease.toFixed(1),
              projectedRevenue: projectedRevenue.toFixed(2),
              confidence: projectedRevenue > 50 ? 'High' : (projectedRevenue > 20 ? 'Medium' : 'Low')
            });
          }
        }
      });
    });
  });
  
  // Sort recommendations by projected revenue impact
  return recommendations.sort((a, b) => parseFloat(b.projectedRevenue) - parseFloat(a.projectedRevenue));
}