import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ReceptionLogin } from './components/reception/ReceptionLogin';
import { ReceptionDashboard } from './components/reception/ReceptionDashboard';
import { FullMenuPage } from './components/FullMenuPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { MenuItem, RestaurantConfig, Order } from './types';
import { INITIAL_MENU, INITIAL_CATEGORIES, DEFAULT_CONFIG } from './data/initialMenu';
import { Clock, Loader2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'reception' | 'full-menu' | 'product'>('customer');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return sessionStorage.getItem('sarwan_reception_token');
  });
  const [authUsername, setAuthUsername] = useState<string>('admin');

  const [config, setConfig] = useState<RestaurantConfig>(DEFAULT_CONFIG);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Active trackable order (from checkout or session)
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Check URL pathname or query parameters for explicit separate reception, menu, or product access
  useEffect(() => {
    const handleRouteChange = () => {
      // Clear any legacy hash leftover from earlier sessions
      if (window.location.hash === '#reception') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }

      const params = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname.replace(/\/$/, '');

      const isReceptionRoute =
        pathname === '/reception' ||
        params.get('portal') === 'reception' ||
        params.get('view') === 'reception';

      const isMenuRoute =
        pathname === '/menu' ||
        params.get('view') === 'menu' ||
        window.location.hash === '#all-menu';

      // Product route check: /product/:id or ?product=id
      const productQueryId = params.get('product') || params.get('item');
      let pathProductId: string | null = null;
      if (pathname.startsWith('/product/')) {
        pathProductId = pathname.replace('/product/', '');
      }

      const activeProdId = pathProductId || productQueryId;

      if (isReceptionRoute) {
        setCurrentView('reception');
      } else if (activeProdId) {
        setSelectedProductId(activeProdId);
        setCurrentView('product');
      } else if (isMenuRoute) {
        setCurrentView('full-menu');
      } else {
        setCurrentView('customer');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Fetch menu and config from backend
  const loadAppData = async () => {
    try {
      const [menuRes, configRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/config'),
      ]);

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        if (Array.isArray(menuData) && menuData.length > 0) {
          setMenuItems(menuData);
          const uniqueCats = Array.from(new Set(menuData.map((m: MenuItem) => m.category)));
          if (uniqueCats.length > 0) {
            setCategories(uniqueCats as string[]);
          }
        }
      }

      if (configRes.ok) {
        const configData = await configRes.json();
        if (configData && configData.name) {
          setConfig(configData);
        }
      }
    } catch (err) {
      console.warn('Using local menu fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  const handleLoginSuccess = (token: string, username: string) => {
    setAuthToken(token);
    setAuthUsername(username);
    sessionStorage.setItem('sarwan_reception_token', token);
  };

  const handleLogout = () => {
    setAuthToken(null);
    sessionStorage.removeItem('sarwan_reception_token');
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (currentView !== 'customer') {
      setCurrentView('customer');
      window.history.pushState(null, '', '/');
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenFullMenu = () => {
    setCurrentView('full-menu');
    window.history.pushState(null, '', '/menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromFullMenu = () => {
    setCurrentView('customer');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedProductId(item.id);
    setCurrentView('product');
    window.history.pushState(null, '', `/product/${item.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProduct = () => {
    // If user came from full-menu or customer, go back smoothly
    setCurrentView('customer');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setActiveOrder(order);
    setIsTrackerOpen(true);
  };

  const handleExitReception = () => {
    setCurrentView('customer');
    window.history.pushState(null, '', '/');
  };

  // Dedicated Product Detail Page View (Daraz / Amazon style)
  const activeProduct = menuItems.find((m) => m.id === selectedProductId) || menuItems[0];

  if (currentView === 'product' && activeProduct) {
    return (
      <LanguageProvider>
        <CartProvider>
          <ProductDetailPage
            item={activeProduct}
            allItems={menuItems}
            config={config}
            onBack={handleBackFromProduct}
            onSelectRelatedItem={handleSelectProduct}
            onNavigateToSection={handleNavigateToSection}
            onOpenFullMenu={handleOpenFullMenu}
          />
          <CartDrawer config={config} />
          <CheckoutModal
            config={config}
            onOrderSuccess={handleOrderSuccess}
          />
          {activeOrder && (
            <OrderTrackerModal
              order={activeOrder}
              config={config}
              isOpen={isTrackerOpen}
              onClose={() => setIsTrackerOpen(false)}
            />
          )}
          {/* Floating Quick Tracker Pill */}
          {activeOrder && !isTrackerOpen && (
            <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto z-40 animate-in slide-in-from-bottom-4">
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-3 sm:py-2.5 rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 font-semibold text-xs border border-amber-400 active:scale-95 transition touch-manipulation"
              >
                <Clock className="w-4 h-4 animate-spin text-stone-950 flex-shrink-0" />
                <span className="truncate">Track Order #{activeOrder.id} ({activeOrder.status})</span>
              </button>
            </div>
          )}
        </CartProvider>
      </LanguageProvider>
    );
  }

  // Full Categorized Menu Page View
  if (currentView === 'full-menu') {
    return (
      <LanguageProvider>
        <CartProvider>
          <FullMenuPage
            menuItems={menuItems}
            categories={categories}
            config={config}
            onBackToHome={handleBackFromFullMenu}
            onSelectProduct={handleSelectProduct}
          />
          <CartDrawer config={config} />
          <CheckoutModal
            config={config}
            onOrderSuccess={handleOrderSuccess}
          />
          {activeOrder && (
            <OrderTrackerModal
              order={activeOrder}
              config={config}
              isOpen={isTrackerOpen}
              onClose={() => setIsTrackerOpen(false)}
            />
          )}
          {/* Floating Quick Tracker Pill */}
          {activeOrder && !isTrackerOpen && (
            <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto z-40 animate-in slide-in-from-bottom-4">
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-3 sm:py-2.5 rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 font-semibold text-xs border border-amber-400 active:scale-95 transition touch-manipulation"
              >
                <Clock className="w-4 h-4 animate-spin text-stone-950 flex-shrink-0" />
                <span className="truncate">Track Order #{activeOrder.id} ({activeOrder.status})</span>
              </button>
            </div>
          )}
        </CartProvider>
      </LanguageProvider>
    );
  }

  // Receptionist View (Direct access only via /reception or /#reception)
  if (currentView === 'reception') {
    if (!authToken) {
      return (
        <ReceptionLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToWebsite={handleExitReception}
        />
      );
    }

    return (
      <ReceptionDashboard
        authToken={authToken}
        username={authUsername}
        config={config}
        menuItems={menuItems}
        categories={categories}
        onLogout={handleLogout}
        onBackToWebsite={handleExitReception}
        onRefreshMenu={loadAppData}
      />
    );
  }

  // Customer-facing Website (No visible staff/reception buttons or links)
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-600 selection:text-white flex flex-col">
          
          {/* Navigation Bar */}
          <Navbar
            config={config}
            onNavigateToSection={handleNavigateToSection}
            onOpenFullMenu={handleOpenFullMenu}
          />

          {/* Hero Section */}
          <Hero
            config={config}
            onViewMenu={handleOpenFullMenu}
            onOrderOnline={() => handleNavigateToSection('menu')}
          />

          {/* Menu Section */}
          <MenuSection
            menuItems={menuItems}
            categories={categories}
            onOpenFullMenu={handleOpenFullMenu}
            onSelectProduct={handleSelectProduct}
          />

          {/* About Section */}
          <AboutSection />

          {/* Contact & Delivery Section */}
          <ContactSection config={config} />

          {/* Footer */}
          <Footer
            config={config}
            onNavigateToSection={handleNavigateToSection}
            onOpenFullMenu={handleOpenFullMenu}
          />

          {/* Cart Drawer */}
          <CartDrawer config={config} />

          {/* Checkout Modal */}
          <CheckoutModal
            config={config}
            onOrderSuccess={handleOrderSuccess}
          />

          {/* Order Tracker Modal */}
          {activeOrder && (
            <OrderTrackerModal
              order={activeOrder}
              config={config}
              isOpen={isTrackerOpen}
              onClose={() => setIsTrackerOpen(false)}
            />
          )}

          {/* Floating Quick Tracker Pill (if customer has placed an order in current session) */}
          {activeOrder && !isTrackerOpen && (
            <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto z-40 animate-in slide-in-from-bottom-4">
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-3 sm:py-2.5 rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 font-semibold text-xs border border-amber-400 active:scale-95 transition touch-manipulation"
              >
                <Clock className="w-4 h-4 animate-spin text-stone-950 flex-shrink-0" />
                <span className="truncate">Track Order #{activeOrder.id} ({activeOrder.status})</span>
              </button>
            </div>
          )}

        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
