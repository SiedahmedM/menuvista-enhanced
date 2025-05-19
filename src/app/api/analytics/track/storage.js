// src/app/api/analytics/track/storage.js
import fs from 'fs';
import path from 'path';

// In-memory fallback storage (for development)
const inMemoryEvents = [];

// Define path for our analytics data file
const dataFilePath = path.join(process.cwd(), 'analytics-data.json');

// Initialize file if it doesn't exist
function initializeStorageFile() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({ events: [] }));
      console.log('Created new analytics data file at:', dataFilePath);
    }
  } catch (error) {
    console.error('Error initializing storage file:', error);
    // File operations might be failing - we'll use in-memory fallback
  }
}

// Get all stored analytics events
export function getAllEvents() {
  try {
    initializeStorageFile();
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(rawData).events;
  } catch (error) {
    console.error('Error reading analytics data, using in-memory fallback:', error);
    // Return in-memory events if file operations fail
    return inMemoryEvents;
  }
}

// Save a new analytics event
export function saveEvent(event) {
  try {
    initializeStorageFile();
    
    // Try to read existing data
    let data;
    try {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      data = JSON.parse(rawData);
    } catch (readError) {
      console.error('Error reading existing data, creating new data object:', readError);
      data = { events: [] };
    }
    
    // Add new event with timestamp
    const newEvent = {
      ...event,
      storedAt: new Date().toISOString()
    };
    
    data.events.push(newEvent);
    
    // Also add to in-memory fallback
    inMemoryEvents.push(newEvent);
    
    // Try to write to file
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
      console.log('Saved event to analytics data file');
      return true;
    } catch (writeError) {
      console.error('Error writing to file, using in-memory only:', writeError);
      // Even if file write fails, we've added to in-memory storage
      return true;
    }
  } catch (error) {
    console.error('Error in saveEvent:', error);
    // Last resort - just add to in-memory and return true to prevent further errors
    inMemoryEvents.push({
      ...event,
      storedAt: new Date().toISOString()
    });
    return true;
  }
}

// Get events for a specific restaurant
export function getEventsForRestaurant(restaurantId) {
  const allEvents = getAllEvents();
  return allEvents.filter(event => event.restaurantId === restaurantId);
}