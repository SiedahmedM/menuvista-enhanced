// src/app/api/menu-items/route.js
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
      
      // This is a mock response - in a real application, you'd fetch this from your database
      const menuItems = [
        {
          id: 'falafel-bowl',
          name: 'Falafel Bowl',
          description: 'Fresh falafel with hummus, tahini, and pita',
          price: '$12',
          category: 'Lunch',
          image: '/falafel-bowl.jpg'
        },
        {
          id: 'chicken-bowl',
          name: 'Chicken Bowl',
          description: 'Marinated chicken with rice and salad',
          price: '$14',
          category: 'Lunch',
          image: '/chicken-bowl.jpg'
        },
        {
          id: 'falafel-on-jerusalem-bread',
          name: 'Falafel on Jerusalem Bread',
          description: 'Crispy falafel in fresh bread with tahini and vegetables',
          price: '$14',
          category: 'Lunch',
          image: '/falafel-on-jerusalem-bread.jpg'
        },
        {
          id: 'falafel-with-fried-veggies',
          name: 'Falafel With Fried Veggies',
          description: 'Golden falafel in pita with fried vegetables and tahini sauce',
          price: '$15',
          category: 'Lunch',
          image: '/falafel-with-fried-veggies.jpg'
        },
        {
          id: 'fire-bowl',
          name: 'Fire Bowl',
          description: 'Spicy beef over yellow rice with fresh vegetables and tahini',
          price: '$17',
          category: 'Lunch',
          image: '/fire-bowl.jpg'
        },
        {
          id: 'ribeye-bowl',
          name: 'Ribeye Bowl',
          description: 'Tender ribeye strips over yellow rice with fresh vegetables and tahini',
          price: '$16',
          category: 'Lunch',
          image: '/ribeye-bowl.jpg'
        },
        {
          id: 'ribeye-pita',
          name: 'Ribeye Pita',
          description: 'Juicy ribeye in soft pita with fresh vegetables and tahini sauce',
          price: '$15',
          category: 'Lunch',
          image: '/ribeye-pita.jpg'
        },
        // Add more items as needed
      ];
      
      return new Response(JSON.stringify(menuItems), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error fetching menu items:', error);
      
      return new Response(JSON.stringify({ error: 'Failed to fetch menu items' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }