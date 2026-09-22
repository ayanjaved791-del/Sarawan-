import React from 'react';
import { Flame, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 sm:py-24 bg-stone-950 border-b border-stone-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-stone-800 h-48 sm:h-60 bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
                    alt="Authentic Karahi cooking"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-stone-800 h-36 sm:h-44 bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80"
                    alt="Fresh Tandoori Naan"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="rounded-2xl overflow-hidden border border-stone-800 h-36 sm:h-44 bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80"
                    alt="Charcoal BBQ Grill"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-stone-800 h-48 sm:h-60 bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80"
                    alt="Royal Falooda & Desserts"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-amber-500 font-medium text-xs tracking-widest uppercase">
              {t.aboutTag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-semibold text-stone-100 leading-tight">
              {t.aboutTitle}
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {t.aboutDescription1}
            </p>

            <p className="text-stone-400 text-sm leading-relaxed">
              {t.aboutDescription2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                  <Flame className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-stone-200">{t.aboutFeature1}</h4>
                <p className="text-xs text-stone-400 mt-1">
                  {t.aboutFeature1Desc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-stone-200">{t.aboutFeature3}</h4>
                <p className="text-xs text-stone-400 mt-1">
                  {t.aboutFeature3Desc}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
