// src/app/dashboard/components/OptimizationSummary.js

export default function OptimizationSummary({ optimizationData }) {
    if (!optimizationData || !optimizationData.recommendations || optimizationData.recommendations.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-2">Optimization Status</h3>
          <p className="text-gray-600">
            We're still collecting data to generate optimization recommendations.
            Continue using your menu to gather more customer insights.
          </p>
        </div>
      );
    }
  
    // Get top 3 recommendations
    const topRecommendations = optimizationData.recommendations.slice(0, 3);
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-2">Top Optimization Insights</h3>
        
        <div className="mb-4">
          <div className="text-2xl font-bold text-green-600">
            +${parseFloat(optimizationData.projectedImpact).toFixed(2)}/month
          </div>
          <div className="text-gray-600">Projected revenue increase from all recommendations</div>
        </div>
        
        <ul className="list-disc pl-5 space-y-2">
          {topRecommendations.map((rec, index) => (
            <li key={index}>
              Move <strong>{rec.itemName}</strong> from {rec.fromPosition} to {rec.toPosition}
              <span className="text-green-600 ml-2">+${parseFloat(rec.projectedRevenue).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }