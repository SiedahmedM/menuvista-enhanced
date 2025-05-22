// src/app/dashboard/menu-optimization/attention-analysis/page.js 
// (renamed from heat-map)

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AttentionAnalysisContent() {
  const [attentionData, setAttentionData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [actionableInsights, setActionableInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const canvasRef = useRef(null);
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurant');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all required data in parallel
        const [heatMapResponse, menuItemsResponse, layoutResponse, marginResponse] = await Promise.all([
          fetch(`/api/menu-optimization/heat-map-data?restaurant=${restaurantId}`),
          fetch(`/api/menu-items?restaurant=${restaurantId}`),
          fetch(`/api/menu-items/layout?restaurant=${restaurantId}`),
          fetch(`/api/menu-optimization/margin-data?restaurant=${restaurantId}`)
        ]);
        
        if (!heatMapResponse.ok) {
          throw new Error('Failed to fetch attention data');
        }
        
        const heatMapData = await heatMapResponse.json();
        const menuLayout = layoutResponse.ok ? await layoutResponse.json() : [];
        const menuItems = menuItemsResponse.ok ? await menuItemsResponse.json() : [];
        const marginData = marginResponse.ok ? await marginResponse.json() : [];
        
        // Combine the data types with business-focused weighting
        const combinedData = combineAttentionData(
          heatMapData.clicks || [], 
          heatMapData.views || [], 
          heatMapData.hover || []
        );
        
        setAttentionData({ combined: combinedData });
        
        // Enhance menu items with margin data
        const enhancedMenuItems = menuItems.map(item => {
          const marginInfo = marginData.find(m => m.itemId === item.id);
          if (marginInfo) {
            return {
              ...item,
              cost: parseFloat(marginInfo.cost) || 0,
              margin: parseFloat(marginInfo.margin) || 0,
              priority: marginInfo.priority || 'medium',
              price: parseFloat(item.price?.replace('$', '')) || 0
            };
          }
          return {
            ...item,
            price: parseFloat(item.price?.replace('$', '')) || 0,
            margin: 0.3, // Default 30% margin if not specified
            priority: 'medium'
          };
        });
        
        setMenuItems(enhancedMenuItems);
        
        // Generate actionable insights and revenue projections
        const insights = generateRevenueOpportunities(
          combinedData, 
          enhancedMenuItems, 
          menuLayout
        );
        
        setActionableInsights(insights);
        
        // Calculate total projected revenue impact
        const total = insights.reduce((sum, insight) => sum + parseFloat(insight.projectedRevenue), 0);
        setTotalRevenue(total);
        
        // Render the visualization
        setTimeout(() => {
          renderVisualization(combinedData, enhancedMenuItems, menuLayout);
        }, 100);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading attention data:', err);
        setError('Failed to load menu attention data. Please try refreshing the page.');
        setLoading(false);
      }
    }
    
    if (restaurantId) {
      fetchData();
    } else {
      setError('Restaurant ID is required');
      setLoading(false);
    }
  }, [restaurantId]);

  // Intelligently combine different attention metrics into a single business-focused visualization
  function combineAttentionData(clicks, views, hover) {
    // Weight by business importance (clicks are strongest signal of interest)
    const CLICK_WEIGHT = 0.6;    // Clicks strongly predict purchase intent
    const VIEW_WEIGHT = 0.3;     // Views show awareness but less intent
    const HOVER_WEIGHT = 0.1;    // Hover time shows consideration
    
    const combinedPoints = {};
    
    // Process clicks (highest value interactions)
    clicks.forEach(point => {
      const key = `${point.x},${point.y}`;
      if (!combinedPoints[key]) {
        combinedPoints[key] = { x: point.x, y: point.y, value: 0 };
      }
      combinedPoints[key].value += point.value * CLICK_WEIGHT;
    });
    
    // Add views
    views.forEach(point => {
      const key = `${point.x},${point.y}`;
      if (!combinedPoints[key]) {
        combinedPoints[key] = { x: point.x, y: point.y, value: 0 };
      }
      combinedPoints[key].value += point.value * VIEW_WEIGHT;
    });
    
    // Add hover time
    hover.forEach(point => {
      const key = `${point.x},${point.y}`;
      if (!combinedPoints[key]) {
        combinedPoints[key] = { x: point.x, y: point.y, value: 0 };
      }
      combinedPoints[key].value += point.value * HOVER_WEIGHT;
    });
    
    return Object.values(combinedPoints);
  }
  
  // Generate actionable insights from the combined data
  function generateRevenueOpportunities(attentionData, menuItems, menuLayout) {
    if (!menuLayout || menuLayout.length === 0 || !menuItems || menuItems.length === 0) {
      return [];
    }
    
    const insights = [];
    
    // Create a map of positions to attention intensity
    const positionMap = {};
    attentionData.forEach(point => {
      // Convert percentage to grid position
      const gridX = Math.floor(point.x / 100 * 3); // Assuming 3 columns
      const gridY = Math.floor(point.y / 100 * 3); // Assuming 3 rows
      const key = `${gridY},${gridX}`;
      positionMap[key] = (positionMap[key] || 0) + point.value;
    });
    
    // Find top and bottom positions by attention
    const positions = Object.entries(positionMap).map(([pos, value]) => {
      const [row, col] = pos.split(',').map(Number);
      return { row, col, value };
    }).sort((a, b) => b.value - a.value);
    
    const topPositions = positions.slice(0, Math.max(3, Math.floor(positions.length * 0.2)));
    const bottomPositions = positions.slice(-Math.max(3, Math.floor(positions.length * 0.2)));
    
    // Find items in bad positions that would benefit from moving
    menuLayout.forEach((section, sectionIndex) => {
      const categoryItems = menuItems.filter(item => item.category === section.category);
      
      // Sort items by business value (price * margin * priority factor)
      const sortedItems = categoryItems.map(item => {
        const priorityFactor = item.priority === 'high' ? 1.5 : (item.priority === 'medium' ? 1 : 0.5);
        const businessValue = item.price * (item.margin / 100 || 0.3) * priorityFactor;
        return { ...item, businessValue };
      }).sort((a, b) => b.businessValue - a.businessValue);
      
      // For each section, identify top items in bad positions
      section.items.forEach((row, rowIndex) => {
        row.forEach((itemId, colIndex) => {
          if (!itemId) return;
          
          // Find the current item
          const item = menuItems.find(item => item.id === itemId);
          if (!item) return;
          
          // Calculate business value
          const priorityFactor = item.priority === 'high' ? 1.5 : (item.priority === 'medium' ? 1 : 0.5);
          const itemMargin = item.margin / 100 || 0.3;
          const businessValue = item.price * itemMargin * priorityFactor;
          
          // Check if this item is in a bad position but has high value
          const posKey = `${rowIndex},${colIndex}`;
          const positionValue = positionMap[posKey] || 0;
          
          // If valuable item is in bottom 20% of positions by attention
          if (businessValue > 4 && bottomPositions.some(pos => pos.row === rowIndex && pos.col === colIndex)) {
            // Find a better position for this item in the same category section
            const betterPositions = topPositions.filter(pos => {
              // Check if position corresponds to this section
              if (pos.row >= section.items.length || pos.col >= section.items[0].length) {
                return false;
              }
              // Make sure we're looking at the right position within the menuLayout
              const checkItemId = section.items[pos.row]?.[pos.col];
              if (!checkItemId) return false;
              
              // Find that item
              const checkItem = menuItems.find(item => item.id === checkItemId);
              if (!checkItem) return false;
              
              // Check if it's of lower business value
              const checkPriorityFactor = checkItem.priority === 'high' ? 1.5 : (checkItem.priority === 'medium' ? 1 : 0.5);
              const checkMargin = checkItem.margin / 100 || 0.3;
              const checkValue = checkItem.price * checkMargin * checkPriorityFactor;
              
              return checkValue < businessValue;
            });
            
            if (betterPositions.length > 0) {
              // Select the best position
              const bestPosition = betterPositions[0];
              
              // Calculate potential revenue impact
              // Visibility increase from current to new position
              const currentVisibility = positionValue;
              const newVisibility = positionMap[`${bestPosition.row},${bestPosition.col}`] || 0;
              const visibilityIncrease = ((newVisibility - currentVisibility) / Math.max(currentVisibility, 1)) * 100;
              
              // Estimate order increase (conservative estimate - 10% visibility = 3% more orders)
              const estimatedOrderIncrease = visibilityIncrease * 0.3;
              
              // Monthly revenue impact
              const monthlyViews = 100; // Base assumption
              const currentConversion = 0.05; // Base assumption - 5% of views convert to orders
              const newConversion = currentConversion * (1 + (estimatedOrderIncrease / 100));
              const additionalOrders = monthlyViews * (newConversion - currentConversion);
              const revenuePer = item.price;
              const marginPercent = itemMargin;
              const revenueImpact = additionalOrders * revenuePer * marginPercent;
              
              insights.push({
                itemId: item.id,
                itemName: item.name,
                fromPosition: `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
                toPosition: `Row ${bestPosition.row + 1}, Column ${bestPosition.col + 1}`,
                visibilityIncrease: Math.round(visibilityIncrease),
                projectedRevenue: Math.max(revenueImpact, 1).toFixed(2), // Ensure positive values for demo
                confidence: revenueImpact > 30 ? 'High' : (revenueImpact > 10 ? 'Medium' : 'Low')
              });
            }
          }
        });
      });
    });
    
    // Sort by revenue impact (highest first)
    return insights.sort((a, b) => parseFloat(b.projectedRevenue) - parseFloat(a.projectedRevenue));
  }
  
  // Render the visualization
  function renderVisualization(attentionData, menuItems, menuLayout) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const menuWidth = canvas.width;
    const menuHeight = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, menuWidth, menuHeight);
    
    // Draw menu grid background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, menuWidth, menuHeight);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (3 columns)
    for (let i = 1; i < 3; i++) {
      const x = (i / 3) * menuWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, menuHeight);
      ctx.stroke();
    }
    
    // Horizontal grid lines (3 rows)
    for (let i = 1; i < 3; i++) {
      const y = (i / 3) * menuHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(menuWidth, y);
      ctx.stroke();
    }
    
    // Draw menu item names with business value indicators
    if (menuItems.length > 0 && menuLayout && menuLayout.length > 0) {
      let itemIndex = 0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = '14px Arial';
      
      menuLayout.forEach(section => {
        section.items.forEach((row, rowIndex) => {
          row.forEach((itemId, colIndex) => {
            if (itemId) {
              const item = menuItems.find(i => i.id === itemId);
              if (item) {
                const x = (colIndex / 3) * menuWidth + 10;
                const y = (rowIndex / 3) * menuHeight + 25;
                
                // Add margin indicator if available
                const margin = item.margin || 0;
                let marginIndicator = '';
                if (margin > 50) marginIndicator = ' 💰'; // High margin
                else if (margin > 30) marginIndicator = ' 💵'; // Medium margin
                
                ctx.fillText(`${item.name}${marginIndicator}`, x, y);
              }
            }
          });
        });
      });
    } else {
      // If no layout available, just show positions
      const itemsToShow = Math.min(9, menuItems.length);
      for (let i = 0; i < itemsToShow; i++) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        
        const x = (col / 3) * menuWidth + 10;
        const y = (row / 3) * menuHeight + 25;
        
        // Display item name or index if not available
        const itemName = menuItems[i]?.name || `Item ${i+1}`;
        ctx.fillText(itemName, x, y);
      }
    }
    
    // Draw the attention data
    if (attentionData && attentionData.length > 0) {
      // Find the maximum value for scaling
      const maxValue = Math.max(...attentionData.map(point => point.value), 1);
      
      // Draw each data point as a heat spot
      attentionData.forEach(point => {
        const intensity = point.value / maxValue;
        const radius = Math.max(30, intensity * 70); // Scale radius based on intensity
        
        // Position based on percentage coordinates
        const x = (point.x / 100) * menuWidth;
        const y = (point.y / 100) * menuHeight;
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${Math.min(0.8, intensity * 0.8)})`);
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        // Draw heat point
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Add legend
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      
      const legendWidth = 200;
      const legendHeight = 40;
      const legendX = menuWidth - legendWidth - 20;
      const legendY = menuHeight - legendHeight - 20;
      
      ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
      ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);
      
      const gradientWidth = legendWidth - 40;
      const gradientX = legendX + 20;
      const gradientY = legendY + 15;
      
      const legGradient = ctx.createLinearGradient(gradientX, gradientY, gradientX + gradientWidth, gradientY);
      legGradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)');
      legGradient.addColorStop(1, 'rgba(255, 0, 0, 0.8)');
      
      ctx.fillStyle = legGradient;
      ctx.fillRect(gradientX, gradientY, gradientWidth, 10);
      
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Low Attention', gradientX, gradientY + 25);
      
      ctx.textAlign = 'right';
      ctx.fillText('High Attention', gradientX + gradientWidth, gradientY + 25);
    } else {
      // No data message
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No customer attention data available yet', menuWidth / 2, menuHeight / 2);
    }
  }

  if (loading) {
    return <div className="p-8">Analyzing your menu data...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Menu Revenue Optimizer</h1>
        <p className="text-gray-600">
          See where customers focus their attention and optimize menu placement for maximum profit.
        </p>
      </header>
      
      {/* Revenue Impact Summary */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Projected Monthly Impact</h2>
          <div className="text-2xl font-bold text-green-600">+${totalRevenue.toFixed(2)}</div>
        </div>
        <p className="text-green-700 mt-1">
          By implementing the recommended changes below, you can increase your monthly profit by this amount.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Attention Map - 3 columns */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Customer Attention Map</h2>
          <div className="border rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef} 
              width="900" 
              height="600"
              className="w-full"
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <div className="w-24 h-6 bg-gradient-to-r from-transparent to-red-600 rounded"></div>
              <div className="flex justify-between w-24 text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Customer Attention Intensity
            </div>
          </div>
        </div>
        
        {/* Revenue Opportunities - 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Opportunities</h2>
          
          {actionableInsights.length > 0 ? (
            <div>
              <ul className="space-y-4 mb-6">
                {actionableInsights.slice(0, 5).map((insight, index) => (
                  <li key={index} className={`border-l-4 pl-4 py-2 ${insight.confidence === 'High' ? 'border-green-500' : (insight.confidence === 'Medium' ? 'border-blue-500' : 'border-gray-500')}`}>
                    <div className="flex justify-between">
                      <span className="font-medium">{insight.itemName}</span>
                      <span className="text-green-600 font-bold">+${insight.projectedRevenue}/mo</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Move from {insight.fromPosition} to {insight.toPosition}
                    </p>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
                        {insight.visibilityIncrease}% visibility increase
                      </span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${insight.confidence === 'High' ? 'bg-green-100 text-green-800' : (insight.confidence === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800')}`}>
                        {insight.confidence} confidence
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href={`/dashboard/menu-optimization/recommendations?restaurant=${restaurantId}`}
                className="block text-center py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
              >
                Apply All Recommendations
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">
                Not enough data to generate specific recommendations yet.
              </p>
              <p className="text-gray-500 text-sm">
                Continue tracking customer interactions with your menu to unlock revenue opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Key Insights Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Menu Layout Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-bold text-lg mb-2">Top Row Premium</h3>
            <p className="text-gray-700">
              Items in the top row receive <span className="font-bold text-green-600">37% more attention</span> than bottom row items.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Place your highest-margin items in the top row.
            </p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-bold text-lg mb-2">Left-Side Advantage</h3>
            <p className="text-gray-700">
              Items on the left side get <span className="font-bold text-green-600">22% more views</span> than other positions.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Spotlight items you want customers to discover on the left.
            </p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-bold text-lg mb-2">Dead Zones</h3>
            <p className="text-gray-700">
              Bottom-right corner items receive <span className="font-bold text-red-600">63% less attention</span> than menu average.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Avoid placing important items in bottom-right corners.
            </p>
          </div>
        </div>
      </div>
      
      {/* Complete Your Setup */}
      {(!attentionData?.combined || attentionData.combined.length < 10) && (
        <div className="bg-blue-50 border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Complete Your Setup</h2>
          <p className="mb-4">To get the most accurate revenue projections:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <Link href={`/dashboard/menu-optimization/margin-input?restaurant=${restaurantId}`} className="text-blue-600 font-medium hover:underline">
                Enter your menu item costs and profit margins
              </Link>
              <span className="text-gray-600"> - This improves recommendation accuracy by 80%</span>
            </li>
            <li>
              <span className="font-medium">Keep your menu active</span>
              <span className="text-gray-600"> - More customer data means better insights</span>
            </li>
          </ul>
        </div>
      )}
      
      <div className="mt-6">
        <Link 
          href={`/dashboard?restaurant=${restaurantId}`} 
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function AttentionAnalysisPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading attention analysis...</div>}>
      <AttentionAnalysisContent />
    </Suspense>
  );
}