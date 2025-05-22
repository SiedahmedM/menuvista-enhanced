'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function MenuRecommendationsContent() {
  const [recommendations, setRecommendations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(null);
  const [optimizedLayout, setOptimizedLayout] = useState(null);
  const [totalImpact, setTotalImpact] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurant');

  useEffect(() => {
    async function fetchData() {
      try {
        // First get the current menu layout and items
        const [layoutResponse, itemsResponse] = await Promise.all([
          fetch(`/api/menu-items/layout?restaurant=${restaurantId}`),
          fetch(`/api/menu-items?restaurant=${restaurantId}`)
        ]);
        
        if (!layoutResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to fetch menu data');
        }
        
        const currentLayout = await layoutResponse.json();
        const menuItems = await itemsResponse.json();
        
        setCurrentLayout(currentLayout);
        setMenuItems(menuItems);
        
        // Now get the optimization recommendations
        const optimizeResponse = await fetch('/api/menu-optimization/optimize-layout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            restaurantId,
            menuItems,
            menuLayout: currentLayout
          })
        });
        
        if (!optimizeResponse.ok) {
          throw new Error('Failed to generate optimization recommendations');
        }
        
        const optimizationData = await optimizeResponse.json();
        
        setRecommendations(optimizationData.recommendations);
        setOptimizedLayout(optimizationData.optimizedLayout);
        setTotalImpact(parseFloat(optimizationData.projectedImpact));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to generate recommendations. Please try again.');
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

  const applyRecommendations = async () => {
    if (!optimizedLayout) return;
    
    setApplying(true);
    
    try {
      // This is a mock implementation - in a real app, you'd save the new layout to your database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Redirect to success page or show success message
      window.location.href = `/dashboard?restaurant=${restaurantId}&optimized=true`;
    } catch (err) {
      setError('Failed to apply recommendations. Please try again.');
      setApplying(false);
    }
  };

  const getItemById = (itemId) => {
    return menuItems.find(item => item.id === itemId) || { name: 'Unknown Item' };
  };

  if (loading) {
    return <div className="p-8">Generating menu optimization recommendations...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  // If no significant recommendations, show appropriate message
  if (recommendations.length === 0 || totalImpact < 10) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Menu Layout Analysis</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Your menu layout is already well-optimized!</h2>
          <p className="mb-2">
            Based on our analysis, your current menu layout is already performing well. 
            We don't see significant improvements that would impact your revenue.
          </p>
          <p>
            Continue monitoring your menu analytics and check back after collecting more customer data.
          </p>
        </div>
        
        <Link href={`/dashboard?restaurant=${restaurantId}`} className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Menu Optimization Recommendations</h1>
      
      <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
        <h2 className="text-xl font-bold text-green-700 mb-2">
          Projected Monthly Revenue Increase: ${totalImpact.toFixed(2)}
        </h2>
        <p className="text-green-700">
          By implementing these menu layout changes, we project you can increase your monthly profits 
          based on current traffic patterns and menu item performance.
        </p>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Top Recommendations</h2>
      
      <div className="bg-white rounded shadow overflow-hidden mb-8">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Menu Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommendation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibility Increase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projected Impact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recommendations.map((rec, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{rec.itemName}</div>
                  <div className="text-sm text-gray-500">{rec.category}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    Move from {rec.fromPosition} to {rec.toPosition}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    +{rec.visibilityImprovement}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    +${parseFloat(rec.projectedRevenue).toFixed(2)}/month
                  </div>
                  <div className="text-xs text-gray-500">
                    Est. {rec.estimatedOrderIncrease}% more orders
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    rec.confidence === 'High' 
                      ? 'bg-green-100 text-green-800' 
                      : rec.confidence === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rec.confidence}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="text-gray-600">
          <p className="mb-2"><strong>How this works:</strong> Our AI analyzes customer behavior patterns and item performance data.</p>
          <p>Recommendations are based on eye-tracking research and your actual menu performance data.</p>
        </div>
        
        <button
          onClick={applyRecommendations}
          disabled={applying}
          className={`px-6 py-3 rounded font-bold text-white ${
            applying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {applying ? 'Applying Changes...' : 'Apply These Recommendations'}
        </button>
      </div>
      
      <div className="border-t pt-6">
        <Link href={`/dashboard?restaurant=${restaurantId}`} className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function MenuRecommendationsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading recommendations...</div>}>
      <MenuRecommendationsContent />
    </Suspense>
  );
}