import fs from 'fs';
import path from 'path';

// Define path for the margin data file
const dataFilePath = path.join(process.cwd(), 'margin-data.json');

// Initialize file if it doesn't exist
function initializeStorageFile() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({}));
    console.log('Created new margin data file at:', dataFilePath);
  }
}

export async function POST(request) {
  try {
    const { restaurantId, marginData } = await request.json();
    
    if (!restaurantId || !marginData) {
      return new Response(JSON.stringify({ error: 'Missing required data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Ensure file exists
    initializeStorageFile();
    
    // Read existing data
    let allData = {};
    try {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      allData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error reading margin data file:', error);
      allData = {};
    }
    
    // Update data for this restaurant
    allData[restaurantId] = marginData;
    
    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(allData, null, 2));
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error saving margin data:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to save margin data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurant');
    
    if (!restaurantId) {
      return new Response(JSON.stringify({ error: 'Restaurant ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Ensure file exists
    initializeStorageFile();
    
    // Read data
    let marginData = [];
    try {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      const allData = JSON.parse(rawData);
      marginData = allData[restaurantId] || [];
    } catch (error) {
      console.error('Error reading margin data file:', error);
      marginData = [];
    }
    
    return new Response(JSON.stringify(marginData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error retrieving margin data:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to retrieve margin data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}