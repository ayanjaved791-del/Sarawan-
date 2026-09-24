import React from 'react';
import { Utensils, ShoppingBag, Phone } from 'lucide-react';
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-6">
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

          <p className="text-base sm:text-lg lg:text-xl text-stone-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.heroDescription}
          </p>

          {/* Hero CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              id="hero-order-online-btn"
              onClick={onOrderOnline}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm sm:text-base shadow-lg shadow-emerald-600/30 active:scale-95 transition flex items-center justify-center gap-2.5 touch-manipulation border border-emerald-500/30"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
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
      </div>
    </section>
  );
};
