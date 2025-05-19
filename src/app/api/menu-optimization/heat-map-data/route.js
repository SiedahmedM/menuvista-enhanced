// src/app/api/menu-optimization/heat-map-data/route.js
import { getEventsForRestaurant } from '../../analytics/track/storage';

export async function GET(request) {
  try {
    // Get restaurant ID from query parameter
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurant');
    
    if (!restaurantId) {
      return new Response(JSON.stringify({ error: 'Restaurant ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get all events for this restaurant
    const events = getEventsForRestaurant(restaurantId);
    
    // Process events to generate heat map data
    const heatMapData = processEventsForHeatMap(events);
    
    return new Response(JSON.stringify(heatMapData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error generating heat map data:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to generate heat map data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Process events to generate heat map data
function processEventsForHeatMap(events) {
  // Initialize heat map data containers
  const clickData = [];
  const viewData = [];
  const hoverData = [];
  
  // Tracking unique positions to avoid duplication
  const positions = new Set();
  
  // Process click events
  events.forEach(event => {
    if (event.eventType === 'item_click' && event.itemId) {
      // For item clicks, use the position of the menu card
      // We'll estimate this based on the item's index in the menu
      // In a real implementation, you'd track the actual pixel coordinates
      
      // Find the index of this item in the menu
      const itemIndex = getItemIndexInMenu(event.itemId);
      if (itemIndex >= 0) {
        const gridPosition = indexToGridPosition(itemIndex);
        
        // Convert grid position to percentage coordinates
        const percentPosition = gridToPercentage(gridPosition.row, gridPosition.col, 3, 3); // Assuming 3x3 grid
        
        // Create a unique key for this position
        const posKey = `${percentPosition.x},${percentPosition.y}`;
        
        // Only add if we haven't seen this position before
        if (!positions.has(posKey)) {
          positions.add(posKey);
          
          clickData.push({
            x: percentPosition.x,
            y: percentPosition.y,
            value: 1 // Start with value 1
          });
        } else {
          // Increment the value for this position
          const existingPoint = clickData.find(point => 
            point.x === percentPosition.x && point.y === percentPosition.y
          );
          if (existingPoint) {
            existingPoint.value += 1;
          }
        }
      }
    }
    else if (event.eventType === 'item_view_start' && event.itemId) {
      // Similar to clicks, but for views
      const itemIndex = getItemIndexInMenu(event.itemId);
      if (itemIndex >= 0) {
        const gridPosition = indexToGridPosition(itemIndex);
        const percentPosition = gridToPercentage(gridPosition.row, gridPosition.col, 3, 3);
        
        const posKey = `${percentPosition.x},${percentPosition.y}`;
        
        if (!positions.has(posKey + '_view')) {
          positions.add(posKey + '_view');
          
          viewData.push({
            x: percentPosition.x,
            y: percentPosition.y,
            value: 1
          });
        } else {
          const existingPoint = viewData.find(point => 
            point.x === percentPosition.x && point.y === percentPosition.y
          );
          if (existingPoint) {
            existingPoint.value += 1;
          }
        }
      }
    }
    else if (event.eventType === 'item_hover' && event.itemId && event.duration) {
      // For hovers, we'll use the duration as the value
      const itemIndex = getItemIndexInMenu(event.itemId);
      if (itemIndex >= 0) {
        const gridPosition = indexToGridPosition(itemIndex);
        const percentPosition = gridToPercentage(gridPosition.row, gridPosition.col, 3, 3);
        
        const posKey = `${percentPosition.x},${percentPosition.y}`;
        
        if (!positions.has(posKey + '_hover')) {
          positions.add(posKey + '_hover');
          
          hoverData.push({
            x: percentPosition.x,
            y: percentPosition.y,
            value: event.duration / 1000 // Convert milliseconds to seconds
          });
        } else {
          const existingPoint = hoverData.find(point => 
            point.x === percentPosition.x && point.y === percentPosition.y
          );
          if (existingPoint) {
            existingPoint.value += event.duration / 1000;
          }
        }
      }
    }
    // Process mouse positions for a more detailed heat map
    else if (event.eventType === 'advanced_session_end' && event.mousePositions) {
      event.mousePositions.forEach(pos => {
        const posKey = `${pos.x},${pos.y}`;
        
        if (!positions.has(posKey + '_mouse')) {
          positions.add(posKey + '_mouse');
          
          // These will be lower value than direct item interactions
          viewData.push({
            x: pos.x,
            y: pos.y,
            value: 0.2 // Lower weight for mouse movements
          });
        } else {
          const existingPoint = viewData.find(point => 
            point.x === pos.x && point.y === pos.y
          );
          if (existingPoint) {
            existingPoint.value += 0.2;
          }
        }
      });
    }
  });
  
  // Add some seed data if we don't have enough real data yet
  if (clickData.length < 5) {
    addSeedData(clickData, 'clicks');
  }
  
  if (viewData.length < 5) {
    addSeedData(viewData, 'views');
  }
  
  if (hoverData.length < 5) {
    addSeedData(hoverData, 'hover');
  }
  
  return {
    clicks: clickData,
    views: viewData,
    hover: hoverData
  };
}

// Helper function to determine item index in the menu
// This is a simplified approximation - in reality, you'd track the actual position
function getItemIndexInMenu(itemId) {
  // This is a simplified mapping - in a real implementation, 
  // you'd get this from your menu data structure
  const itemMap = {
    'falafel-bowl': 0,
    'chicken-bowl': 1,
    'falafel-on-jerusalem-bread': 2,
    'falafel-with-fried-veggies': 3,
    'fire-bowl': 4,
    'ribeye-bowl': 5,
    'ribeye-pita': 6,
    'hummus': 7,
    'fettah-with-ribeye': 8,
    // Add more mappings as needed
  };
  
  return itemMap[itemId] !== undefined ? itemMap[itemId] : -1;
}

// Convert a 1D index to a 2D grid position
function indexToGridPosition(index) {
  // Assuming a 3-column grid layout
  const row = Math.floor(index / 3);
  const col = index % 3;
  
  return { row, col };
}

// Convert grid coordinates to percentage positions
function gridToPercentage(row, col, gridRows, gridCols) {
  // Add some randomness to prevent perfect alignment
  const jitterX = Math.random() * 10 - 5; // ±5%
  const jitterY = Math.random() * 10 - 5; // ±5%
  
  return {
    x: Math.min(100, Math.max(0, Math.round((col / (gridCols - 1)) * 100) + jitterX)),
    y: Math.min(100, Math.max(0, Math.round((row / (gridRows - 1)) * 100) + jitterY))
  };
}

// Add seed data for testing when we don't have enough real data
function addSeedData(dataArray, type) {
  // For clicks - concentrate on the top items
  if (type === 'clicks') {
    dataArray.push({ x: 20, y: 20, value: 10 }); // Top-left - high value
    dataArray.push({ x: 50, y: 20, value: 8 });  // Top-center - high value
    dataArray.push({ x: 80, y: 20, value: 5 });  // Top-right - medium value
    dataArray.push({ x: 30, y: 50, value: 3 });  // Middle - lower value
    dataArray.push({ x: 70, y: 80, value: 1 });  // Bottom - low value
  }
  // For views - more evenly distributed
  else if (type === 'views') {
    dataArray.push({ x: 15, y: 25, value: 20 }); // Top-left - very high value
    dataArray.push({ x: 45, y: 25, value: 15 }); // Top-center - high value
    dataArray.push({ x: 75, y: 25, value: 10 }); // Top-right - medium-high value
    dataArray.push({ x: 25, y: 55, value: 8 });  // Middle-left - medium value
    dataArray.push({ x: 60, y: 55, value: 5 });  // Middle-right - medium-low value
    dataArray.push({ x: 35, y: 85, value: 3 });  // Bottom-left - low value
    dataArray.push({ x: 70, y: 85, value: 2 });  // Bottom-right - very low value
  }
  // For hover - similar to views but different values
  else if (type === 'hover') {
    dataArray.push({ x: 20, y: 20, value: 5 });  // Top-left - 5 seconds
    dataArray.push({ x: 50, y: 20, value: 4 });  // Top-center - 4 seconds
    dataArray.push({ x: 80, y: 20, value: 3 });  // Top-right - 3 seconds
    dataArray.push({ x: 30, y: 50, value: 2 });  // Middle - 2 seconds
    dataArray.push({ x: 60, y: 80, value: 1 });  // Bottom - 1 second
  }
}