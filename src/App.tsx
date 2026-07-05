import React, { useState, useEffect } from 'react';
import { Product, OrderStatus } from './types';
import { storeService } from './lib/storeService';
import Storefront from './components/Storefront';
import Checkout from './components/Checkout';
import Confirmation from './components/Confirmation';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Loader2 } from 'lucide-react';

type Route = 'storefront' | 'checkout' | 'confirmation' | 'login' | 'admin';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('storefront');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Confirmation state
  const [placedOrderId, setPlacedOrderId] = useState<string>('');
  const [placedTotalAmount, setPlacedTotalAmount] = useState<number>(0);
  const [placedQuantity, setPlacedQuantity] = useState<number>(1);

  // Router listener
  useEffect(() => {
    const handleLocationChange = async () => {
      const path = window.location.pathname;
      const loggedIn = await storeService.checkAdminSession();
      setIsAdminLoggedIn(loggedIn);

      if (path === '/login') {
        if (loggedIn) {
          navigate('/admin');
        } else {
          setCurrentRoute('login');
        }
      } else if (path === '/admin') {
        if (loggedIn) {
          setCurrentRoute('admin');
        } else {
          navigate('/login');
        }
      } else {
        // Fallback to storefront (checkout & confirmation are handled inline via CTA state)
        setCurrentRoute('storefront');
      }
    };

    // Load initial product and check auth
    const initApp = async () => {
      try {
        const prod = await storeService.getProduct();
        setProduct(prod);
      } catch (err) {
        console.error('Error loading initial product:', err);
      } finally {
        await handleLocationChange();
        setIsLoading(false);
      }
    };

    initApp();

    // Listen to browser navigation buttons (back/forward)
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Native navigation helper
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    // Trigger popstate manually to fire the route listener
    const popStateEvent = new PopStateEvent('popstate');
    window.dispatchEvent(popStateEvent);
  };

  // Login handler
  const handleAdminLogin = async (email: string, password: string) => {
    const res = await storeService.loginAdmin(email, password);
    if (res.success) {
      setIsAdminLoggedIn(true);
      navigate('/admin');
    }
    return res;
  };

  // Logout handler
  const handleAdminLogout = async () => {
    await storeService.logoutAdmin();
    setIsAdminLoggedIn(false);
    navigate('/login');
  };

  // Checkout submission handler
  const handleCheckoutSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    if (!product) return;

    const totalAmount = product.price * checkoutQuantity;
    const result = await storeService.placeOrder({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      quantity: checkoutQuantity,
      totalAmount: totalAmount,
      productId: product.id
    });

    // Populate order success details
    setPlacedOrderId(result.orderId);
    setPlacedTotalAmount(totalAmount);
    setPlacedQuantity(checkoutQuantity);
    setCurrentRoute('confirmation');
  };

  // Render correct view based on state
  const renderView = () => {
    if (isLoading || !product) {
      return (
        <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center gap-3.5 selection:bg-[#D4AF37] selection:text-black">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#E0D8D0]/60 font-semibold">Booting AeroSound Suite...</span>
        </div>
      );
    }

    switch (currentRoute) {
      case 'storefront':
        return (
          <Storefront
            product={product}
            onBuyNow={(qty) => {
              setCheckoutQuantity(qty);
              setCurrentRoute('checkout');
            }}
          />
        );

      case 'checkout':
        return (
          <Checkout
            product={product}
            quantity={checkoutQuantity}
            onBack={() => setCurrentRoute('storefront')}
            onSubmit={handleCheckoutSubmit}
          />
        );

      case 'confirmation':
        return (
          <Confirmation
            orderId={placedOrderId}
            totalAmount={placedTotalAmount}
            quantity={placedQuantity}
            productName={product.name}
            customerName={product.name} // Display productName/details clearly
            onContinue={() => {
              setCurrentRoute('storefront');
            }}
          />
        );

      case 'login':
        return (
          <AdminLogin
            isDemoMode={storeService.isDemoMode()}
            onBack={() => navigate('/')}
            onLogin={handleAdminLogin}
          />
        );

      case 'admin':
        return (
          <AdminDashboard
            isDemoMode={storeService.isDemoMode()}
            onLogout={handleAdminLogout}
            onGoToStorefront={() => navigate('/')}
          />
        );

      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-500">Route Error</h2>
            <button onClick={() => navigate('/')} className="mt-4 text-blue-500 underline">
              Return to storefront
            </button>
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-[#050505] select-none">{renderView()}</div>;
}
