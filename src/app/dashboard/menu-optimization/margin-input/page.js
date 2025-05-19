'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function MarginInputPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurant');

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        // Fetch menu items
        const response = await fetch(`/api/menu-items?restaurant=${restaurantId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        
        const menuItems = await response.json();
        
        // Fetch any existing margin data
        try {
          const marginResponse = await fetch(`/api/menu-optimization/margin-data?restaurant=${restaurantId}`);
          if (marginResponse.ok) {
            const marginData = await marginResponse.json();
            
            // Merge the margin data with menu items
            const itemsWithMargins = menuItems.map(item => {
              const marginInfo = marginData.find(m => m.itemId === item.id);
              return {
                ...item,
                cost: marginInfo?.cost || '',
                // Extract numeric value from price (remove $)
                price: item.price?.replace('$', '') || '',
                margin: marginInfo?.margin || '',
                priority: marginInfo?.priority || 'medium'
              };
            });
            
            setMenuItems(itemsWithMargins);
          } else {
            // No margin data yet, just add empty fields
            const itemsWithEmptyMargins = menuItems.map(item => ({
              ...item,
              cost: '',
              // Extract numeric value from price (remove $)
              price: item.price?.replace('$', '') || '',
              margin: '',
              priority: 'medium'
            }));
            
            setMenuItems(itemsWithEmptyMargins);
          }
        } catch (marginErr) {
          console.error('Error fetching margin data:', marginErr);
          // Still proceed with empty margin fields
          const itemsWithEmptyMargins = menuItems.map(item => ({
            ...item,
            cost: '',
            price: item.price?.replace('$', '') || '',
            margin: '',
            priority: 'medium'
          }));
          
          setMenuItems(itemsWithEmptyMargins);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load menu items:', err);
        setError('Failed to load menu items. Try refreshing the page.');
        setLoading(false);
      }
    }
    
    if (restaurantId) {
      fetchMenuItems();
    } else {
      setError('Restaurant ID is required');
      setLoading(false);
    }
  }, [restaurantId]);

  const calculateMargin = (price, cost) => {
    if (!price || !cost || isNaN(price) || isNaN(cost) || parseFloat(cost) <= 0) {
      return '';
    }
    
    const marginValue = ((parseFloat(price) - parseFloat(cost)) / parseFloat(price)) * 100;
    return marginValue.toFixed(1);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index][field] = value;
    
    // Auto-calculate margin when price and cost are both set
    if ((field === 'price' || field === 'cost') && 
        updatedItems[index].price && updatedItems[index].cost) {
      updatedItems[index].margin = calculateMargin(
        updatedItems[index].price, 
        updatedItems[index].cost
      );
    }
    
    setMenuItems(updatedItems);
  };

  const saveMarginData = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      // Prepare data for saving
      const marginData = menuItems.map(item => ({
        itemId: item.id,
        cost: item.cost ? parseFloat(item.cost) : null,
        margin: item.margin ? parseFloat(item.margin) : null,
        priority: item.priority
      })).filter(item => item.cost !== null || item.margin !== null);
      
      const response = await fetch('/api/menu-optimization/margin-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurantId,
          marginData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save margin data');
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving margin data:', err);
      setError('Failed to save margin data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading menu items...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Menu Item Profit Margins</h1>
      <p className="mb-6 text-gray-600">
        Enter your cost and price for each menu item to help our AI optimize your menu layout for maximum profit. 
        All data remains confidential and is used only for optimization purposes.
      </p>
      
      {saved && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p className="font-bold">Margin data saved successfully!</p>
          <p>Your menu optimization recommendations will now prioritize high-margin items.</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Why Margin Data Matters</h2>
        <p className="mb-4">
          By providing your cost and price information, our AI can optimize your menu layout to maximize overall 
          profitability, not just views or clicks. This means we'll prioritize your most profitable items in the 
          best positions.
        </p>
        <div className="flex flex-col md:flex-row gap-4 text-center">
          <div className="flex-1 p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-700 font-bold text-lg mb-1">Step 1</div>
            <div>Enter your food costs</div>
          </div>
          <div className="flex-1 p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-700 font-bold text-lg mb-1">Step 2</div>
            <div>Review auto-calculated margins</div>
          </div>
          <div className="flex-1 p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-700 font-bold text-lg mb-1">Step 3</div>
            <div>Set priority for special items</div>
          </div>
          <div className="flex-1 p-4 bg-green-50 rounded-lg">
            <div className="text-green-700 font-bold text-lg mb-1">Result</div>
            <div>Get profit-optimized menu layout</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold">Menu Item Margin Data</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Menu Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost ($)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price ($)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margin (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.cost}
                      onChange={(e) => handleInputChange(index, 'cost', e.target.value)}
                      placeholder="Enter cost"
                      className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                      placeholder="Enter price"
                      className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      item.margin >= 50 ? 'text-green-600' : 
                      item.margin >= 30 ? 'text-green-500' : 
                      item.margin > 0 ? 'text-yellow-600' : ''
                    }`}>
                      {item.margin}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={item.priority}
                      onChange={(e) => handleInputChange(index, 'priority', e.target.value)}
                      className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <p>* High margin items will be prioritized in premium menu positions</p>
          <p>* Priority lets you override margin-based placement for special items</p>
        </div>
        
        <div className="flex space-x-4">
          <Link
            href={`/dashboard?restaurant=${restaurantId}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          
          <button
            onClick={saveMarginData}
            disabled={saving}
            className={`px-4 py-2 rounded-md text-white ${
              saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save Margin Data'}
          </button>
        </div>
      </div>
    </div>
  );
}