// src/app/api/menu-optimization/position-values.js

// Position values based on eye-tracking studies (%)
// Higher values indicate more attention/visibility
export const defaultPositionValues = [
    [90, 85, 75, 65, 55, 45],  // Top row most valuable
    [80, 70, 65, 60, 50, 40],
    [70, 65, 60, 55, 45, 35],
    [60, 55, 50, 45, 40, 30],
    [50, 45, 40, 35, 30, 25],
    [40, 35, 30, 25, 20, 15]   // Bottom row least valuable
  ];
  
  // Get position value based on grid coordinates and device type
  export function getPositionValue(row, col, deviceType = 'desktop') {
    // Adjust for different device types
    let adjustment = 1.0;
    
    switch(deviceType) {
      case 'mobile':
        // Mobile is more linear - top positions get even more attention
        adjustment = row === 0 ? 1.2 : 0.9;
        break;
      case 'tablet':
        // Tablets have more balanced viewing
        adjustment = 1.0;
        break;
      default: // desktop
        adjustment = 1.0;
    }
    
    // Get base value from matrix, default to 10 if out of bounds
    const baseValue = defaultPositionValues[row]?.[col] || 10;
    
    return Math.round(baseValue * adjustment);
  }
  
  // Function to convert grid-based positions to percentage-based
  export function gridToPercentage(row, col, gridRows, gridCols) {
    return {
      x: Math.round((col / (gridCols - 1)) * 100),
      y: Math.round((row / (gridRows - 1)) * 100)
    };
  }
  
  // Function to convert percentage-based positions to grid-based
  export function percentageToGrid(xPercent, yPercent, gridRows, gridCols) {
    return {
      row: Math.min(Math.round((yPercent / 100) * (gridRows - 1)), gridRows - 1),
      col: Math.min(Math.round((xPercent / 100) * (gridCols - 1)), gridCols - 1)
    };
  }
  
  // Get optimized position for a given item based on importance
  export function getOptimalPosition(importance, gridRows, gridCols) {
    // Convert importance (0-1) to a position in the grid
    // Higher importance items should be placed in higher-value positions
    
    // Create a flattened array of all positions with their values
    const positions = [];
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        positions.push({
          row,
          col,
          value: getPositionValue(row, col)
        });
      }
    }
    
    // Sort by value (highest first)
    positions.sort((a, b) => b.value - a.value);
    
    // Select position based on importance percentile
    const index = Math.min(
      Math.floor(importance * positions.length), 
      positions.length - 1
    );
    
    return positions[index];
  }