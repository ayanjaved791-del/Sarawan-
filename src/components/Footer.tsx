import React from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';
import { RestaurantConfig } from '../types';
import { SarawanLogo } from './SarawanLogo';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  config: RestaurantConfig;
  onNavigateToSection: (sectionId: string) => void;
  onOpenFullMenu?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigateToSection, onOpenFullMenu }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <SarawanLogo size="sm" rounded="xl" />
              <span className="text-xl font-sans font-semibold text-stone-100">
                {t.brandName}
              </span>
            </div>
            <p className="text-stone-400 max-w-sm leading-relaxed">
              {t.footerAbout}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
              <span className="text-stone-300 font-medium">100% Halal Certified</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300 font-medium">Daily Fresh Meat</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300 font-medium">Desi Ghee & Iron Wok</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-xs">
              {t.quickNav}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateToSection('home')}
                  className="hover:text-amber-400 transition"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('menu')}
                  className="hover:text-amber-400 transition"
                >
                  {t.navMenu}
                </button>
              </li>
              <li>
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
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('about')}
                  className="hover:text-amber-400 transition"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('contact')}
                  className="hover:text-amber-400 transition"
                >
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Order Hotline & Timings */}
          <div className="space-y-2.5">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-xs">
              {t.deliveryHelpline}
            </h4>
            <p className="text-stone-400 text-xs">
              Hot meals delivered fresh to your doorstep in thermal bags.
            </p>
            <div className="pt-1 space-y-1.5 text-xs">
              <a
                href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
                className="text-amber-400 font-mono font-semibold hover:underline flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{config.phone}</span>
              </a>
              <p className="text-stone-400 flex items-center gap-1.5 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>{config.openingHours}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Sarawan. {t.allRightsReserved}</p>
          <p className="flex items-center gap-1">
            <span>Freshly crafted culinary experience for food lovers.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
