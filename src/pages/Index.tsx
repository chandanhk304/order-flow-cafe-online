
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/components/LandingPage';
import CafeOwnerDashboard from '@/components/CafeOwnerDashboard';
import CustomerMenu from '@/components/CustomerMenu';
import Cart from '@/components/Cart';
import OrderStatus from '@/components/OrderStatus';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/owner/:cafeId" element={<CafeOwnerDashboard />} />
            <Route path="/menu/:cafeId" element={<CustomerMenu />} />
            <Route path="/cart/:cafeId" element={<Cart />} />
            <Route path="/order/:orderId" element={<OrderStatus />} />
          </Routes>
        </Router>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
};

export default Index;
