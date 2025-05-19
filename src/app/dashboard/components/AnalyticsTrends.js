// src/app/dashboard/components/AnalyticsTrends.js

export default function AnalyticsTrends({ analyticsData }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Most Viewed Menu Items</h2>
          {analyticsData.mostViewedItems?.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-right p-2">Views</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.mostViewedItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="text-right p-2">{item.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No view data available yet. Try interacting with the menu.</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
          {analyticsData.popularCategories?.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Views</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.popularCategories.map((category, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{category.name}</td>
                    <td className="text-right p-2">{category.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No category data available yet. Try changing menu tabs.</p>
          )}
        </div>
      </div>
    );
  }