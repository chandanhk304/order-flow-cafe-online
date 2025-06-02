
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CafeData {
  _id: string;
  name: string;
  menu: MenuItem[];
}

const CustomerMenu = () => {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cafe, setCafe] = useState<CafeData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = 'http://localhost:3001/api';

  useEffect(() => {
    fetchCafeAndMenu();
    
    const cartData = localStorage.getItem(`cart_${cafeId}`);
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, [cafeId]);

  const fetchCafeAndMenu = async () => {
    try {
      const [cafeResponse, menuResponse] = await Promise.all([
        fetch(`${apiUrl}/cafes/${cafeId}`),
        fetch(`${apiUrl}/menu/${cafeId}`)
      ]);

      if (cafeResponse.ok && menuResponse.ok) {
        const cafeData = await cafeResponse.json();
        const menuData = await menuResponse.json();
        
        setCafe(cafeData);
        setMenu(menuData);
      } else {
        toast({
          title: "Error",
          description: "Failed to load menu data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem(`cart_${cafeId}`, JSON.stringify(updatedCart));

    toast({
      title: "Added to cart",
      description: `${item.name} added to cart`,
    });
  };

  const updateQuantity = (itemId: string, change: number) => {
    const updatedCart = cart.map(item => {
      if (item._id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    setCart(updatedCart);
    localStorage.setItem(`cart_${cafeId}`, JSON.stringify(updatedCart));
  };

  const getCartQuantity = (itemId: string) => {
    const item = cart.find(cartItem => cartItem._id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading menu...</div>;
  }

  if (!cafe || menu.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Menu Available</h2>
          <p className="text-gray-600">This cafe hasn't added any menu items yet.</p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(menu.map(item => item.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cafe.name}</h1>
          <p className="text-gray-600">Digital Menu</p>
        </div>
        <Button
          onClick={() => navigate(`/cart/${cafeId}`)}
          className="relative"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart ({getTotalItems()})
        </Button>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu
              .filter(item => item.category === category)
              .map(item => {
                const quantity = getCartQuantity(item._id);
                return (
                  <Card key={item._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge>{item.category}</Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">₹{item.price}</span>
                        {quantity === 0 ? (
                          <Button
                            onClick={() => addToCart(item)}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item._id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold">{quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item._id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerMenu;
