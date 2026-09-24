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
import { FullMenuPage } from './components/FullMenuPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { MenuItem, RestaurantConfig, Order } from './types';
import { INITIAL_MENU, INITIAL_CATEGORIES, DEFAULT_CONFIG } from './data/initialMenu';

export default function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'full-menu' | 'product'>('customer');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [config, setConfig] = useState<RestaurantConfig>(DEFAULT_CONFIG);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Active placed order (from checkout)
  const [, setActiveOrder] = useState<Order | null>(null);

  // Check URL pathname or query parameters for menu or product access
  useEffect(() => {
    const handleRouteChange = () => {
      const params = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname.replace(/\/$/, '');

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

      if (activeProdId) {
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
    setCurrentView('customer');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setActiveOrder(order);
  };

  // Dedicated Product Detail Page View (Daraz / Amazon style)
  const activeProduct = menuItems.find((m) => m.id === selectedProductId) || menuItems[0];

  return (
    <LanguageProvider>
      <CartProvider>
        {currentView === 'product' && activeProduct ? (
          <ProductDetailPage
            item={activeProduct}
            allItems={menuItems}
            config={config}
            onBack={handleBackFromProduct}
            onSelectRelatedItem={handleSelectProduct}
            onNavigateToSection={handleNavigateToSection}
            onOpenFullMenu={handleOpenFullMenu}
          />
        ) : currentView === 'full-menu' ? (
          <FullMenuPage
            menuItems={menuItems}
            categories={categories}
            config={config}
            onBackToHome={handleBackFromFullMenu}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
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
          </div>
        )}

        {/* Global Cart Drawer */}
        <CartDrawer config={config} />

        {/* Global Checkout Modal */}
        <CheckoutModal
          config={config}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* Global Floating WhatsApp Action */}
        <WhatsAppFloatingButton config={config} />
      </CartProvider>
    </LanguageProvider>
  );
}
