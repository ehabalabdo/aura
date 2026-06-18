
import React, { useState, useEffect } from 'react';
import { AppView, ClosetItem, Language, User, MarketProduct, Order } from './types';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Wardrobe from './components/Wardrobe';
import Atelier from './components/Atelier';
import Boutique from './components/Boutique';
import Dashboard from './components/Dashboard';
import AdminPortal from './components/AdminPortal';
import CartModal from './components/CartModal';
import { MARKET_PRODUCTS as INITIAL_PRODUCTS } from './constants';

const CF_API = 'https://aura-products-api.loopehab.workers.dev';
const CF_TOKEN = 'zBYkMumfhc6wxnFZXSTdOrqolEWVKsbp';

const App: React.FC = () => {
  const { currentUser, loading: authLoading, setCurrentUser } = useAuth();
  const [language, setLanguage] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<AppView>(AppView.Home);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const S_PRODUCTS = 'fitfusion_products_v4';
  const S_CLOSET = 'fitfusion_closet_v4';
  const S_ORDERS = 'fitfusion_orders_v4';

  const [closetItems, setClosetItems] = useState<ClosetItem[]>(() => {
    const saved = localStorage.getItem(S_CLOSET);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({ ...item, addedAt: new Date(item.addedAt) }));
      } catch (e) { return []; }
    }
    return [];
  });

  const [boutiqueProducts, setBoutiqueProducts] = useState<MarketProduct[]>(() => {
    const saved = localStorage.getItem(S_PRODUCTS);
    if (saved !== null) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PRODUCTS; }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(S_ORDERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((o: any) => ({ ...o, createdAt: new Date(o.createdAt) }));
      } catch (e) { return []; }
    }
    return [];
  });

  const [cart, setCart] = useState<MarketProduct[]>([]);

  // Auto-redirect based on authentication state and role
  useEffect(() => {
    if (!authLoading && currentUser) {
      if (currentUser.role === 'admin') {
        setCurrentView(AppView.AdminPortal);
      } else {
        setCurrentView(AppView.Dashboard);
      }
    }
  }, [currentUser, authLoading]);

  // Load products from Cloudflare KV on mount (overrides localStorage)
  const [cfLoaded, setCfLoaded] = useState(false);
  useEffect(() => {
    fetch(`${CF_API}/products`)
      .then(r => r.json())
      .then((items: MarketProduct[]) => {
        if (Array.isArray(items) && items.length > 0) {
          setBoutiqueProducts(items);
          localStorage.setItem(S_PRODUCTS, JSON.stringify(items));
        }
        setCfLoaded(true);
      })
      .catch(() => setCfLoaded(true));
  }, []);

  // Save products to Cloudflare KV + localStorage when they change
  useEffect(() => {
    if (!cfLoaded) return;
    localStorage.setItem(S_PRODUCTS, JSON.stringify(boutiqueProducts));
    if (CF_TOKEN) {
      fetch(`${CF_API}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CF_TOKEN}` },
        body: JSON.stringify(boutiqueProducts)
      }).catch(console.error);
    }
  }, [boutiqueProducts, cfLoaded]);

  useEffect(() => {
    localStorage.setItem(S_CLOSET, JSON.stringify(closetItems));
  }, [closetItems]);

  useEffect(() => {
    localStorage.setItem(S_ORDERS, JSON.stringify(orders));
  }, [orders]);

  const globalDelete = (id: string) => {
    setBoutiqueProducts(prev => prev.filter(p => p.id !== id));
    setRefreshKey(k => k + 1);
  };

  const handleAddToCart = (product: MarketProduct) => {
    setCart(prev => [...prev, product]);
    setIsCartOpen(true);
  };

  const placeOrder = () => {
    if (!currentUser || cart.length === 0) return;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      items: [...cart],
      totalPrice: cart.reduce((sum, item) => sum + item.price, 0),
      status: 'pending',
      createdAt: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setCurrentView(AppView.Dashboard);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const renderView = () => {
    // Public pages anyone can view without logging in
    const PUBLIC_VIEWS = [AppView.Home, AppView.Boutique];
    if (!currentUser && !PUBLIC_VIEWS.includes(currentView)) {
      return <div className="p-20 text-center font-display text-2xl">{language === 'ar' ? 'يرجى تسجيل الدخول' : 'Please Login'}</div>;
    }

    switch (currentView) {
      case AppView.Home: return <Home setView={setCurrentView} lang={language} />;
      case AppView.Wardrobe: return <Wardrobe items={closetItems} setItems={setClosetItems} lang={language} />;
      case AppView.Atelier: return <Atelier lang={language} />;
      case AppView.Boutique: return <Boutique products={boutiqueProducts} onAddToCart={handleAddToCart} lang={language} />;
      case AppView.Dashboard: return <Dashboard items={closetItems} orders={orders.filter(o => o.userId === currentUser?.id)} lang={language} />;
      case AppView.AdminPortal:
        return currentUser?.role === 'admin' ? 
          <AdminPortal 
            key={`admin-${refreshKey}`}
            products={boutiqueProducts} 
            setProducts={setBoutiqueProducts} 
            orders={orders}
            onUpdateOrder={updateOrderStatus}
            onDelete={globalDelete} 
            lang={language} 
          /> : <div>Access Denied</div>;
      default: return <Home setView={setCurrentView} lang={language} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{language === 'en' ? 'Loading...' : 'جاري التحميل...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#fafafa] ${language === 'ar' ? 'rtl' : 'ltr font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar 
        currentView={currentView} setView={setCurrentView} lang={language} setLang={setLanguage} 
        user={currentUser} onLogout={() => { setCurrentUser(null); setCurrentView(AppView.Home); }}
        onLogin={setCurrentUser}
        cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)}
      />
      
      <CartModal 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
        cart={cart} setCart={setCart} onPlaceOrder={placeOrder} lang={language} 
      />
      <main className="flex-grow">{renderView()}</main>
      <footer className="bg-white border-t border-gray-100 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-4 font-display text-3xl text-gray-900 tracking-[0.4em]">FITFUSION</p>
          <div className="h-px w-20 bg-amber-200 mx-auto mb-6"></div>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest">© 2024 FitFusion AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
