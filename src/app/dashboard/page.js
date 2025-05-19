// src/app/dashboard/page.js (Update the existing dashboard page)

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OptimizationSummary from './components/OptimizationSummary';
import AnalyticsTrends from './components/AnalyticsTrends';
import FeatureCards from './components/FeatureCards';

export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [optimizationData, setOptimizationData] = useState(null);
  const [marginCompletion, setMarginCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurant');
  const optimized = searchParams.get('optimized');

  useEffect(() => {
    if (!restaurantId) {
      setError('Restaurant ID is required');
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        // Fetch all necessary data in parallel
        const [analyticsResponse, marginResponse, menuItemsResponse, menuLayoutResponse] = await Promise.all([
          fetch(`/api/analytics/dashboard?restaurant=${restaurantId}`),
          fetch(`/api/menu-optimization/margin-data?restaurant=${restaurantId}`),
          fetch(`/api/menu-items?restaurant=${restaurantId}`),
          fetch(`/api/menu-items/layout?restaurant=${restaurantId}`)
        ]);

        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const analyticsData = await analyticsResponse.json();
        setAnalyticsData(analyticsData);

        // Calculate margin data completion percentage
        if (marginResponse.ok) {
          const marginData = await marginResponse.json();
          // Calculate completion percentage based on items with margin data
          if (analyticsData.itemAnalysis && analyticsData.itemAnalysis.length > 0) {
            const completion = marginData.length / analyticsData.itemAnalysis.length * 100;
            setMarginCompletion(Math.round(completion));
          }
        }

        // Try to fetch menu data
        let menuItems = [], menuLayout = [];
        if (menuItemsResponse.ok && menuLayoutResponse.ok) {
          menuItems = await menuItemsResponse.json();
          menuLayout = await menuLayoutResponse.json();
        }

        // Try to fetch optimization data if available
        try {
          const optimizationResponse = await fetch('/api/menu-optimization/optimize-layout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              restaurantId,
              // We only need a simplified version for dashboard summary
              fetchSummaryOnly: true,
              menuItems,
              menuLayout
            })
          });

          if (optimizationResponse.ok) {
            const optimizationData = await optimizationResponse.json();
            setOptimizationData(optimizationData);
          }
        } catch (optError) {
          console.error('Optional optimization data fetch failed:', optError);
          // This is non-critical, so we don't set an error state
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [restaurantId]);

  if (loading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  if (!analyticsData) {
    return <div className="p-8">No analytics data available</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MenuVista Dashboard</h1>
        {restaurantId && (
          <h2 className="text-xl mb-2">Restaurant: {restaurantId}</h2>
        )}

        {optimized && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">Menu optimization changes have been applied successfully!</p>
            <p>Your menu is now optimized for better performance.</p>
          </div>
        )}
      </header>

      {/* Key metrics summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Total Sessions</h3>
          <p className="text-3xl">{analyticsData.sessionCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Most Viewed Item</h3>
          <p className="text-xl">{analyticsData.mostViewedItems?.[0]?.name || 'No data yet'}</p>
          <p className="text-gray-600">{analyticsData.mostViewedItems?.[0]?.views || 0} views</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Projected Impact</h3>
          <p className="text-xl text-green-600">
            +${optimizationData?.projectedImpact || '0.00'}<span className="text-sm">/month</span>
          </p>
        </div>
      </div>

      {/* Menu Optimization Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span>Menu Optimization</span>
          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">New</span>
        </h2>
        
        {/* Feature cards grid */}
        <FeatureCards 
          restaurantId={restaurantId} 
          sessionCount={analyticsData.sessionCount}
          marginCompletion={marginCompletion}
          projectedRevenue={optimizationData?.projectedImpact || 0}
        />
      </div>

      {/* Analytics Trends */}
      <AnalyticsTrends analyticsData={analyticsData} />
      
      {/* Menu Analytics */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Menu Item Analysis</h2>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          {analyticsData.itemAnalysis?.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-right p-2">Views</th>
                  <th className="text-right p-2">Avg. View Time (sec)</th>
                  <th className="text-right p-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.itemAnalysis.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="text-right p-2">{item.views}</td>
                    <td className="text-right p-2">{item.avgViewTime}</td>
                    <td className="text-right p-2">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No item analysis data available yet.</p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <Link href={`/${restaurantId}`} className="text-blue-600 hover:underline">
          ← Back to Restaurant
        </Link>
      </div>
    </div>
  );
}