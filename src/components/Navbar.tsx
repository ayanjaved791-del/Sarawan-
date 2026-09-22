import React, { useState } from 'react';
import { ShoppingBag, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { RestaurantConfig } from '../types';
import { SarawanLogo } from './SarawanLogo';

interface NavbarProps {
  config: RestaurantConfig;
  onNavigateToSection: (sectionId: string) => void;
  onOpenFullMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ config, onNavigateToSection, onOpenFullMenu }) => {
  const { totalCount, setIsCartOpen, activeOrder, setIsTrackingOpen } = useCart();
  const { language, toggleLanguage, setLanguage, t, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 transition-all">
      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigateToSection('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="group-hover:scale-105 transition-transform duration-300">
            <SarawanLogo size="md" rounded="2xl" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-sans font-semibold tracking-tight text-stone-100 group-hover:text-amber-400 transition">
              {t.brandName}
            </span>
            <span className="block text-xs font-sans text-stone-400 tracking-wider uppercase font-medium">
              {t.brandTagline}
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-300">
          <button
            onClick={() => onNavigateToSection('home')}
            className="hover:text-amber-400 transition"
          >
            {t.navHome}
          </button>
          <button
            onClick={() => {
              if (onOpenFullMenu) {
                onOpenFullMenu();
              } else {
                onNavigateToSection('menu');
              }
            }}
            className="hover:text-amber-400 transition"
          >
            {t.navFullMenu}
          </button>
          <button
            onClick={() => onNavigateToSection('about')}
            className="hover:text-amber-400 transition"
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => onNavigateToSection('contact')}
            className="hover:text-amber-400 transition"
          >
            {t.navContact}
          </button>

          {activeOrder && (
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1.5 text-amber-400 font-medium bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-lg hover:bg-amber-900/40 transition"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{t.navTrackOrder} ({activeOrder.id})</span>
            </button>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Toggle Pill */}
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5 sm:p-1 text-xs font-medium">
            <button
              type="button"
              id="lang-btn-en"
              onClick={() => setLanguage('en')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition touch-manipulation flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Switch to English"
            >
              <span>EN</span>
            </button>
            <button
              type="button"
              id="lang-btn-ur"
              onClick={() => setLanguage('ur')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition touch-manipulation flex items-center gap-1 ${
                language === 'ur'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="اردو میں تبدیل کریں"
            >
              <span className="font-semibold font-sans">اردو</span>
            </button>
          </div>

          {/* Order / Cart trigger */}
          <button
            id="nav-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 px-3.5 sm:px-4 py-2.5 rounded-xl font-medium shadow-md shadow-amber-500/20 active:scale-95 transition touch-manipulation"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-semibold">{t.navCart}</span>
            {totalCount > 0 && (
              <span className="bg-stone-950 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold min-w-[20px] text-center">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 text-stone-300 hover:text-white bg-stone-900 rounded-xl border border-stone-800 transition touch-manipulation"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-6 py-5 space-y-4 animate-in slide-in-from-top-2">
          {/* Language Toggle in Mobile Drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Language / زبان</span>
            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  language === 'en' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ur')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  language === 'ur' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
                }`}
              >
                اردو
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 font-medium text-stone-200">
            <button
              onClick={() => {
                onNavigateToSection('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-800/60"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => {
                if (onOpenFullMenu) {
                  onOpenFullMenu();
                } else {
                  onNavigateToSection('menu');
                }
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-800/60"
            >
              {t.navFullMenu}
            </button>
            <button
              onClick={() => {
                onNavigateToSection('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-800/60"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => {
                onNavigateToSection('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-800/60"
            >
              {t.navContact}
            </button>

            {activeOrder && (
              <button
                onClick={() => {
                  setIsTrackingOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-amber-400 font-semibold flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {t.navTrackOrder} ({activeOrder.id})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
