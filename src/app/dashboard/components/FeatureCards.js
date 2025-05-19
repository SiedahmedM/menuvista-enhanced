// src/app/dashboard/components/FeatureCards.js

import Link from 'next/link';

export default function FeatureCards({ restaurantId, sessionCount, marginCompletion, projectedRevenue }) {
  return (
    <div>
      {/* Optimization cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heat Map Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">Menu Heat Map</h3>
              <p className="text-gray-600 mb-4">
                Visualize where customers focus their attention on your menu.
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              Attention Analytics
            </div>
          </div>
          
          <div className="mb-4">
            <div className="h-2 bg-blue-100 rounded">
              <div className="h-2 bg-blue-600 rounded" style={{ width: '78%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Data Collection: 78% Complete</span>
              <span>{sessionCount}+ Views Tracked</span>
            </div>
          </div>
          
          <Link
            href={`/dashboard/menu-optimization/heat-map?restaurant=${restaurantId}`}
            className="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            View Menu Heat Map
          </Link>
        </div>
        
        {/* Recommendations Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">AI Recommendations</h3>
              <p className="text-gray-600 mb-4">
                Get AI-powered suggestions to optimize your menu layout for increased revenue.
              </p>
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              Revenue Boosting
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="text-3xl font-bold text-green-600 mr-2">
              +${parseFloat(projectedRevenue).toFixed(2)}
            </div>
            <div className="text-gray-600">Projected Revenue Increase</div>
          </div>
          
          <Link
            href={`/dashboard/menu-optimization/recommendations?restaurant=${restaurantId}`}
            className="block text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            View Menu Recommendations
          </Link>
        </div>
      </div>

      {/* Margin Data Input Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">Profit Margin Analysis</h3>
            <p className="text-gray-600 mb-4">
              Set your menu item costs and prices to get precise optimization recommendations based on profitability.
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            Optimization Tool
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Item margin data completion:</span>
            <span className="font-medium">{marginCompletion}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded">
            <div className="h-2 bg-blue-600 rounded" style={{ width: `${marginCompletion}%` }}></div>
          </div>
        </div>
        
        <Link
          href={`/dashboard/menu-optimization/margin-input?restaurant=${restaurantId}`}
          className="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {marginCompletion > 0 ? 'Update Margin Data' : 'Enter Margin Data'}
        </Link>
      </div>
    </div>
  );
}