
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Plus, Trash2, Wifi, WifiOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { apiService } from '@/services/api';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
}

interface CafeData {
  _id: string;
  name: string;
  ownerEmail: string;
  menu: MenuItem[];
}

const CafeOwnerDashboard = () => {
  const { cafeId } = useParams();
  const [cafe, setCafe] = useState<CafeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Food'
  });
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchCafe();
  }, [cafeId]);

  const fetchCafe = async () => {
    try {
      console.log('Fetching cafe data for ID:', cafeId);
      const cafeData = await apiService.getCafe(cafeId!);
      console.log('Cafe data received:', cafeData);
      setCafe(cafeData);
      setIsOnline(true);
      
      toast({
        title: "Connected",
        description: "Successfully connected to server",
      });
    } catch (error) {
      console.error('Error fetching cafe:', error);
      setIsOnline(false);
      
      toast({
        title: "Offline Mode",
        description: "Using demo data - backend server not available",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const addedItem = await apiService.addMenuItem(cafeId!, newItem);
      
      setCafe(prev => prev ? {
        ...prev,
        menu: [...prev.menu, addedItem]
      } : null);

      setNewItem({
        name: '',
        price: '',
        description: '',
        category: 'Food'
      });

      toast({
        title: "Success",
        description: "Menu item added successfully!",
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await apiService.deleteMenuItem(cafeId!, itemId);
      
      setCafe(prev => prev ? {
        ...prev,
        menu: prev.menu.filter(item => item._id !== itemId)
      } : null);

      toast({
        title: "Success",
        description: "Menu item deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!cafe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cafe not found</h2>
          <p className="text-gray-600">Please check the cafe ID or try again later.</p>
        </div>
      </div>
    );
  }

  const menuUrl = `${window.location.origin}/menu/${cafeId}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{cafe.name}</h1>
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
        </div>
        <p className="text-gray-600">
          Owner Dashboard {!isOnline && "(Demo Mode - Backend Offline)"}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Generator
            </CardTitle>
            <CardDescription>Generate QR code for your digital menu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Menu URL:</p>
                <p className="text-sm font-mono break-all">{menuUrl}</p>
              </div>
              <Button onClick={() => setShowQR(!showQR)} className="w-full">
                {showQR ? 'Hide QR Code' : 'Generate QR Code'}
              </Button>
              {showQR && <QRCodeGenerator url={menuUrl} />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Menu Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <Input
              placeholder="Price (₹)"
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            />
            <Input
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
            <select
              className="w-full p-2 border rounded-md"
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            >
              <option value="Food">Food</option>
              <option value="Beverage">Beverage</option>
              <option value="Dessert">Dessert</option>
            </select>
            <Button onClick={handleAddItem} className="w-full">Add Item</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Current Menu ({cafe.menu.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cafe.menu.map((item) => (
              <Card key={item._id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">₹{item.price}</span>
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CafeOwnerDashboard;
