
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Coffee, ShoppingCart, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const LandingPage = () => {
  const [cafeName, setCafeName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const navigate = useNavigate();

  const handleCreateCafe = async () => {
    if (!cafeName || !ownerEmail) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    const cafeId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem(`cafe_${cafeId}`, JSON.stringify({
      id: cafeId,
      name: cafeName,
      ownerEmail,
      menu: [],
      orders: []
    }));

    toast({
      title: "Success",
      description: "Café created successfully!",
    });

    navigate(`/owner/${cafeId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">QR Café</h1>
        <p className="text-xl text-gray-600 mb-8">Digital Menu Platform for Modern Cafés</p>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold">QR Code Menu</h3>
              <p className="text-sm text-gray-600">Generate QR codes for contactless menu access</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Coffee className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold">Easy Management</h3>
              <p className="text-sm text-gray-600">Add and edit menu items effortlessly</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold">Digital Cart</h3>
              <p className="text-sm text-gray-600">Customers can add items and place orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-sm text-gray-600">Integrated payment gateway and UPI support</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Your Café</CardTitle>
          <CardDescription>Set up your digital menu in minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Café Name"
            value={cafeName}
            onChange={(e) => setCafeName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Owner Email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />
          <Button onClick={handleCreateCafe} className="w-full">
            Create Café
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;
