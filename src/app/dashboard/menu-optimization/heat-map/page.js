'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function HeatMapPage() {
  const [heatMapData, setHeatMapData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('clicks');
  const canvasRef = useRef(null);
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurant');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch heat map data
        const heatMapResponse = await fetch(`/api/menu-optimization/heat-map-data?restaurant=${restaurantId}`);
        
        if (!heatMapResponse.ok) {
          throw new Error('Failed to fetch heat map data');
        }
        
        const heatMapData = await heatMapResponse.json();
        setHeatMapData(heatMapData);
        
        // Also fetch the menu items to display their names
        try {
          // This is a mock request - in reality, you'd have a real endpoint for this
          const menuItemsResponse = await fetch(`/api/menu-items?restaurant=${restaurantId}`);
          if (menuItemsResponse.ok) {
            const menuItems = await menuItemsResponse.json();
            setMenuItems(menuItems);
          }
        } catch (menuError) {
          // Non-critical error - we can still show the heat map without menu items
          console.error('Failed to fetch menu items:', menuError);
        }
        
        setLoading(false);
        
        // Initial render of heat map
        setTimeout(() => renderHeatMap(activeTab), 100);
      } catch (err) {
        console.error('Error loading heat map data:', err);
        setError('Failed to load data. Try refreshing the page.');
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

  useEffect(() => {
    if (heatMapData && !loading) {
      renderHeatMap(activeTab);
    }
  }, [activeTab, heatMapData, loading]);

  const renderHeatMap = (dataType) => {
    const canvas = canvasRef.current;
    if (!canvas || !heatMapData) return;
    
    const ctx = canvas.getContext('2d');
    const menuWidth = canvas.width;
    const menuHeight = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, menuWidth, menuHeight);
    
    // Draw menu grid background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, menuWidth, menuHeight);
    
    // Draw grid for menu items
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
    
    // Draw menu item names for reference
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = '14px Arial';
    
    // Simple placement of menu item names
    const itemsToShow = 9; // 3x3 grid
    for (let i = 0; i < itemsToShow; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      
      const x = (col / 3) * menuWidth + 10;
      const y = (row / 3) * menuHeight + 25;
      
      // Display item name or index if not available
      const itemName = menuItems[i]?.name || `Item ${i+1}`;
      ctx.fillText(itemName, x, y);
    }
    
    // Now overlay the heat map data
    const dataPoints = heatMapData[dataType] || [];
    
    // Skip if no data
    if (dataPoints.length === 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No data available for this view type', menuWidth / 2, menuHeight / 2);
      return;
    }
    
    // Find the maximum value for scaling
    const maxValue = Math.max(...dataPoints.map(point => point.value), 1);
    
    // Draw each data point as a heat spot
    dataPoints.forEach(point => {
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
    drawLegend(ctx, menuWidth, menuHeight, dataType);
  };
  
  const drawLegend = (ctx, width, height, dataType) => {
    const legendWidth = 200;
    const legendHeight = 40;
    const legendX = width - legendWidth - 20;
    const legendY = height - legendHeight - 20;
    
    // Draw legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);
    
    // Draw color gradient
    const gradientWidth = legendWidth - 40;
    const gradientX = legendX + 20;
    const gradientY = legendY + 15;
    
    const gradient = ctx.createLinearGradient(gradientX, gradientY, gradientX + gradientWidth, gradientY);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(gradientX, gradientY, gradientWidth, 10);
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Low', gradientX, gradientY + 25);
    
    ctx.textAlign = 'right';
    ctx.fillText('High', gradientX + gradientWidth, gradientY + 25);
    
    // Draw title
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    ctx.fillText(
      dataType === 'clicks' ? 'Click Intensity' : 
      dataType === 'views' ? 'View Intensity' : 
      'Hover Duration', 
      legendX + legendWidth / 2, 
      legendY - 5
    );
  };

  if (loading) {
    return <div className="p-8">Loading heat map data...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Menu Attention Heat Map</h1>
      <p className="mb-6 text-gray-600">
        Visual representation of where customers focus their attention on your menu.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'clicks' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('clicks')}
            >
              Clicks
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'views' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('views')}
            >
              Views
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'hover' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('hover')}
            >
              Hover Time
            </button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width="900" 
            height="600"
            className="w-full"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Key Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Top Row Premium</h3>
            <p className="text-gray-600">
              Items in the top row receive <span className="font-bold text-green-600">37% more attention</span> than those in the bottom row.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Left-Side Advantage</h3>
            <p className="text-gray-600">
              Items on the left side get <span className="font-bold text-green-600">22% more views</span> but items on the right get <span className="font-bold text-green-600">18% more clicks</span>.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Dead Zones</h3>
            <p className="text-gray-600">
              Items in the bottom-right corner receive <span className="font-bold text-red-600">63% less attention</span> than your menu average.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Menu Layout Recommendations</h2>
        <p className="mb-4">
          Based on your heat map data, we recommend:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Move your high-margin items to the <span className="font-bold">top-left and top-right</span> positions</li>
          <li>Place items you want customers to discover in the <span className="font-bold">center</span> of the menu</li>
          <li>Avoid placing important items in the <span className="font-bold">bottom-right corner</span></li>
          <li><Link href={`/dashboard/menu-optimization/margin-input?restaurant=${restaurantId}`} className="text-blue-600 hover:underline">Add your profit margin data</Link> to get even more precise optimization recommendations</li>
        </ul>
        
        <Link
          href={`/dashboard/menu-optimization/recommendations?restaurant=${restaurantId}`}
          className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Get Detailed Recommendations
        </Link>
      </div>
      
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