
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Coffee } from 'lucide-react';

const OrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: any) => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Order not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Coffee className="h-16 w-16 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <p className="text-gray-600">Order ID: {order.id}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Order Placed</span>
                </div>
                <div className="h-px bg-gray-300 flex-1"></div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>Preparing</span>
                </div>
                <div className="h-px bg-gray-300 flex-1"></div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>Ready</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Table:</span>
                    <span>{order.tableNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <Badge>{order.paymentMethod}</Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Estimated preparation time: 15-20 minutes</p>
                <p>You will be notified when your order is ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderStatus;
