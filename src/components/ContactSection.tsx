import React from 'react';
import { Phone, MessageSquare, Clock, MapPin, Navigation, Bike, Check } from 'lucide-react';
import { RestaurantConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContactSectionProps {
  config: RestaurantConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
  const { t } = useLanguage();
  const cleanPhone = config.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = config.whatsapp.replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="py-16 sm:py-20 bg-stone-900/40 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-500 font-medium text-xs tracking-widest uppercase">
            {t.contactTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans font-semibold text-stone-100 mt-2">
            {t.contactTitle}
          </h2>
          <p className="text-stone-400 text-sm mt-3">
            {t.contactDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Phone Call Card */}
          <div className="bg-stone-950 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-stone-100">{t.deliveryHelpline}</h3>
              <p className="text-xs text-stone-400 mt-1">
                {t.deliveryHelplineDesc}
              </p>
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                  Delivery Phone Number
                </span>
                <p className="text-2xl font-bold text-amber-400 tracking-wide font-mono mt-0.5">
                  0335-3131686
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-col gap-2">
              <a
                href="tel:03353131686"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 active:scale-98 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call 0335-3131686 Now</span>
              </a>

              {/* WhatsApp Ordering Option */}
              <a
                href="https://wa.me/923353131686?text=Hello%20Sarawan,%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.orderOnWhatsapp} (0335-3131686)</span>
              </a>
            </div>
          </div>

          {/* Location & Dining Card */}
          <div className="bg-stone-950 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-stone-100">{t.restaurantLocation}</h3>
              <p className="text-xs text-stone-400 mt-1">
                {t.restaurantLocationDesc}
              </p>
              <p className="text-sm font-medium text-stone-200 mt-4 leading-relaxed">
                {config.address}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800/80">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent('Sarawan ' + config.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>{t.getDirections}</span>
              </a>
            </div>
          </div>

          {/* Hours & Delivery Area Card */}
          <div className="bg-stone-950 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-stone-100">{t.deliveryHoursTitle}</h3>
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-stone-400 font-normal min-w-[70px]">Hours:</span>
                  <span className="text-stone-200 font-medium">{config.openingHours}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-stone-400 font-normal min-w-[70px]">Delivery:</span>
                  <span className="text-amber-400 font-medium">Standard Rs. {config.deliveryFee}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-stone-400 font-normal min-w-[70px]">Avg Time:</span>
                  <span className="text-stone-200 font-medium">{config.estimatedTime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-stone-400 font-normal min-w-[70px]">Payment:</span>
                  <span className="text-emerald-400 font-medium">{t.cashOnDelivery} (COD)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800/80">
              <div className="p-3 bg-stone-900 rounded-xl flex items-center gap-2.5 text-xs text-stone-300">
                <Bike className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{t.deliveryHoursDesc}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Google Maps Location Embed */}
        <div className="mt-12 bg-stone-950 rounded-2xl border border-stone-800 p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-amber-500 font-medium text-xs tracking-wider uppercase">
                Find Us on Map
              </span>
              <h3 className="text-xl font-semibold text-stone-100 flex items-center gap-2 mt-0.5">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Sarawan Fast Food Location</span>
              </h3>
            </div>
            <a
              href="https://www.google.com/maps/place/Sarawan+Fast+Food/@24.9552058,66.6850275,12z/data=!4m6!3m5!1s0x3eb36bedad6802c5:0x8432e93cdc256e3b!8m2!3d24.9552058!4d66.6850276!16s%2Fg%2F11b8z_2y_v"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
            >
              <span>Open in Google Maps</span>
              <Navigation className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full rounded-xl overflow-hidden border border-stone-800/80 bg-stone-900 shadow-inner aspect-[16/9] sm:aspect-[21/9] min-h-[350px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231508.5162059937!2d66.68502759453125!3d24.9552058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb36bedad6802c5%3A0x8432e93cdc256e3b!2sSarawan%20Fast%20Food!5e0!3m2!1sen!2s!4v1789864331295!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '350px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Sarawan Fast Food Location Map"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
