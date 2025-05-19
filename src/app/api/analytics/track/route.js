// src/app/api/analytics/track/route.js
import { saveEvent } from './storage';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Log to clearly show we're receiving data
    console.log('API ENDPOINT RECEIVED:', data);
    
    // Save the event to our storage
    const success = saveEvent(data);
    
    if (success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.error('Failed to save event to storage');
      throw new Error('Failed to save event');
    }
  } catch (error) {
    console.error('API ERROR:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to process analytics data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}