
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import QRCodeGenerator from '@/components/QRCodeGenerator';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
}

interface CafeData {
  id: string;
  name: string;
  ownerEmail: string;
  menu: MenuItem[];
  orders: any[];
}

const CafeOwnerDashboard = () => {
  const { cafeId } = useParams();
  const [cafe, setCafe] = useState<CafeData | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Food'
  });
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const cafeData = localStorage.getItem(`cafe_${cafeId}`);
    if (cafeData) {
      setCafe(JSON.parse(cafeData));
    }
  }, [cafeId]);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const item: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name,
      price: parseFloat(newItem.price),
      description: newItem.description,
      category: newItem.category,
      available: true
    };

    const updatedCafe = {
      ...cafe!,
      menu: [...cafe!.menu, item]
    };

    setCafe(updatedCafe);
    localStorage.setItem(`cafe_${cafeId}`, JSON.stringify(updatedCafe));

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
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedCafe = {
      ...cafe!,
      menu: cafe!.menu.filter(item => item.id !== itemId)
    };

    setCafe(updatedCafe);
    localStorage.setItem(`cafe_${cafeId}`, JSON.stringify(updatedCafe));

    toast({
      title: "Success",
      description: "Menu item deleted successfully!",
    });
  };

  if (!cafe) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const menuUrl = `${window.location.origin}/menu/${cafeId}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{cafe.name}</h1>
        <p className="text-gray-600">Owner Dashboard</p>
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
              <Card key={item.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
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
