import React from 'react';
import { Utensils, ShoppingBag, Phone, Flame } from 'lucide-react';
import { RestaurantConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  config: RestaurantConfig;
  onViewMenu: () => void;
  onOrderOnline: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onViewMenu, onOrderOnline }) => {
  const { t, isUrdu } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden bg-stone-950 py-16 sm:py-24 lg:py-28 border-b border-stone-800/60">
      {/* Decorative background glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{t.heroTag}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-stone-100 leading-[1.2] sm:leading-[1.15] break-words">
              {isUrdu ? (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 font-semibold">سروان</span> میں خوش آمدید
                </>
              ) : (
                <>
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 font-semibold">Sarawan</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-stone-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.heroDescription}
            </p>

            {/* Hero CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button
                id="hero-order-online-btn"
                onClick={onOrderOnline}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 touch-manipulation"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{t.heroOrderOnline}</span>
              </button>

              <button
                id="hero-view-menu-btn"
                onClick={onViewMenu}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium rounded-xl text-sm sm:text-base active:scale-95 transition flex items-center justify-center gap-2 touch-manipulation"
              >
                <Utensils className="w-5 h-5 text-amber-400" />
                <span>{t.heroViewMenu}</span>
              </button>

              <a
                href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full sm:w-auto px-4 py-3 sm:py-4 text-stone-400 hover:text-amber-400 font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{config.phone}</span>
              </a>
            </div>
          </div>

          {/* Hero Visual Card / Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-900 group">
                <img
                  src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=900&auto=format&fit=crop&q=80"
                  alt="Sarawan BBQ and Karahi Delicacies"
                  className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                <div className="absolute bottom-6 left-5 right-5 sm:left-6 sm:right-6">
                  <span className="inline-block bg-amber-500 text-stone-950 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-2">
                    Chef's Daily Special
                  </span>
                  <h3 className="text-lg sm:text-xl font-sans font-semibold text-white">
                    Balochi Tikka & Desi Chicken Karahi
                  </h3>
                  <p className="text-stone-300 text-xs mt-1 leading-relaxed">
                    Served with freshly baked Roghni Naan, Zeera Raita, and spicy mint dip.
                  </p>
                </div>
              </div>

              {/* Floating order status badge */}
              <div className="absolute -bottom-5 left-3 right-3 sm:left-auto sm:right-auto sm:-left-6 bg-stone-900/95 backdrop-blur-md border border-stone-700/80 p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold flex-shrink-0">
                  ✓
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs text-stone-400">Online Delivery</p>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-400 truncate">Kitchen Now Accepting Orders</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
