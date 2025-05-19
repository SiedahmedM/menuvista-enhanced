export async function GET(request) {
    try {
      // Get restaurant ID from query parameter
      const { searchParams } = new URL(request.url);
      const restaurantId = searchParams.get('restaurant');
      
      if (!restaurantId) {
        return new Response(JSON.stringify({ error: 'Restaurant ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // This is a mock response - in a real implementation, you'd fetch the actual layout from your database
      // The layout represents the current menu structure for the restaurant
      const layout = [
        {
          category: 'Lunch',
          items: [
            ['falafel-bowl', 'chicken-bowl', 'falafel-on-jerusalem-bread'],
            ['falafel-with-fried-veggies', 'fire-bowl', 'ribeye-bowl'],
            ['ribeye-pita']
          ]
        },
        {
          category: 'Appetizers',
          items: [
            ['hummus', 'fettah-with-ribeye', 'fettah'],
            ['french-fries', 'fried-veggies-8oz', 'half-hummus-half-foul'],
            ['6-piece-falafel', 'pita-chips']
          ]
        },
        {
          category: 'Dinner',
          items: [
            ['family-pack', 'premium-family-pack'],
            ['dinner-falafel-bowl', 'dinner-ribeye-bowl']
          ]
        },
        {
          category: 'Drinks',
          items: [
            ['hibiscus-lemonade', 'baklava'],
            ['peach-crumble', 'rice-pudding']
          ]
        }
      ];
      
      return new Response(JSON.stringify(layout), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error fetching menu layout:', error);
      
      return new Response(JSON.stringify({ error: 'Failed to fetch menu layout' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }