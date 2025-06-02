
const API_BASE_URL = 'http://localhost:3001/api';

// Mock data for development when backend is not available
const mockCafes = [
  {
    _id: 'wgi4axpgb',
    name: 'Sample Café',
    ownerEmail: 'owner@example.com',
    address: '123 Main Street, City',
    phone: '+1-234-567-8900',
    menu: [
      {
        _id: '1',
        name: 'Cappuccino',
        price: 120,
        description: 'Rich espresso with steamed milk foam',
        category: 'Beverage',
        available: true
      },
      {
        _id: '2',
        name: 'Margherita Pizza',
        price: 350,
        description: 'Classic pizza with tomato, mozzarella, and basil',
        category: 'Food',
        available: true
      },
      {
        _id: '3',
        name: 'Chocolate Cake',
        price: 180,
        description: 'Decadent chocolate cake with rich frosting',
        category: 'Dessert',
        available: true
      }
    ],
    isActive: true
  }
];

// Check if backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export const apiService = {
  // Cafe endpoints
  getCafe: async (cafeId: string) => {
    const backendAvailable = await isBackendAvailable();
    
    if (backendAvailable) {
      const response = await fetch(`${API_BASE_URL}/cafes/${cafeId}`);
      if (!response.ok) throw new Error('Failed to fetch cafe');
      return response.json();
    } else {
      // Use mock data
      const cafe = mockCafes.find(c => c._id === cafeId);
      if (!cafe) throw new Error('Cafe not found');
      return cafe;
    }
  },

  getMenu: async (cafeId: string) => {
    const backendAvailable = await isBackendAvailable();
    
    if (backendAvailable) {
      const response = await fetch(`${API_BASE_URL}/menu/${cafeId}`);
      if (!response.ok) throw new Error('Failed to fetch menu');
      return response.json();
    } else {
      // Use mock data
      const cafe = mockCafes.find(c => c._id === cafeId);
      return cafe ? cafe.menu : [];
    }
  },

  addMenuItem: async (cafeId: string, item: any) => {
    const backendAvailable = await isBackendAvailable();
    
    if (backendAvailable) {
      const response = await fetch(`${API_BASE_URL}/menu/${cafeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to add menu item');
      return response.json();
    } else {
      // Mock response
      const newItem = {
        _id: Date.now().toString(),
        ...item,
        available: true
      };
      
      // Add to mock data
      const cafe = mockCafes.find(c => c._id === cafeId);
      if (cafe) {
        cafe.menu.push(newItem);
      }
      
      return newItem;
    }
  },

  deleteMenuItem: async (cafeId: string, itemId: string) => {
    const backendAvailable = await isBackendAvailable();
    
    if (backendAvailable) {
      const response = await fetch(`${API_BASE_URL}/menu/${cafeId}/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete menu item');
      return;
    } else {
      // Remove from mock data
      const cafe = mockCafes.find(c => c._id === cafeId);
      if (cafe) {
        cafe.menu = cafe.menu.filter(item => item._id !== itemId);
      }
    }
  }
};
