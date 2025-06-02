
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import CafeOwnerDashboard from "./components/CafeOwnerDashboard";
import CustomerMenu from "./components/CustomerMenu";
import Cart from "./components/Cart";
import OrderStatus from "./components/OrderStatus";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/owner/:cafeId" element={<CafeOwnerDashboard />} />
            <Route path="/menu/:cafeId" element={<CustomerMenu />} />
            <Route path="/cart/:cafeId" element={<Cart />} />
            <Route path="/order/:orderId" element={<OrderStatus />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
