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
  const { totalCount, setIsCartOpen } = useCart();
  const { language, toggleLanguage, setLanguage, t, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rawPhone = config.whatsapp || config.phone || '0335-3131686';
  let targetPhone = rawPhone.replace(/[^0-9]/g, '');
  if (targetPhone.startsWith('0')) {
    targetPhone = '92' + targetPhone.slice(1);
  } else if (!targetPhone.startsWith('92')) {
    targetPhone = '92' + targetPhone;
  }
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
    isUrdu ? 'السلام علیکم سروان! مجھے کھانا آرڈر کرنا ہے۔' : 'Hello Sarawan! I would like to place an order.'
  )}`;

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

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-md shadow-emerald-600/25 active:scale-98 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>{t.orderOnWhatsapp}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
