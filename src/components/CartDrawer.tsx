import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { RestaurantConfig } from '../types';
import { formatPrice } from '../utils/formatters';

interface CartDrawerProps {
  config: RestaurantConfig;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ config }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalCount,
    setIsCheckoutOpen,
  } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  const deliveryFee = config.deliveryFee ?? 150;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee : 0;
  const isBelowMin = subtotal > 0 && subtotal < config.minOrderAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-stone-950 border-l border-stone-800 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-sans font-semibold text-stone-100">{t.cartTitle}</h3>
                <p className="text-xs text-stone-400">
                  {totalCount} {t.itemsSelected}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-11 h-11 flex items-center justify-center text-stone-400 hover:text-white rounded-xl hover:bg-stone-900 transition touch-manipulation"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-stone-800/80">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold text-stone-200">{t.cartEmpty}</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  {t.heroTag}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-400 text-xs font-semibold rounded-xl transition"
                >
                  {t.showAllMenu}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="pt-4 first:pt-0 flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-stone-100">{item.name}</h4>
                        <span className="text-xs font-semibold text-amber-400">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>

                      {item.selectedVariant && (
                        <span className="inline-block text-[11px] text-amber-400/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded mt-1">
                          {t.portionServing} {item.selectedVariant.name} ({formatPrice(item.selectedVariant.price)})
                        </span>
                      )}

                      <div className="flex items-center justify-between mt-3.5">
                        <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1 sm:p-0.5 gap-2 sm:gap-1.5 shadow-inner">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-11 h-11 sm:w-8 sm:h-8 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 flex items-center justify-center transition touch-manipulation"
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <span className="text-base sm:text-xs font-semibold text-stone-200 min-w-[28px] sm:min-w-[18px] text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-11 h-11 sm:w-8 sm:h-8 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-stone-950 font-semibold flex items-center justify-center transition touch-manipulation"
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-900/60 active:bg-stone-900 transition touch-manipulation"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-900/60 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>{t.subtotal}</span>
                  <span className="text-stone-200 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>{t.deliveryFee}</span>
                  <span className="text-stone-200 font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="pt-2 border-t border-stone-800 flex justify-between text-base font-semibold text-stone-100">
                  <span>{t.totalPayable}</span>
                  <span className="text-amber-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {isBelowMin && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>Minimum order for delivery is Rs. {config.minOrderAmount}. Please add more items.</span>
                </div>
              )}

              <button
                id="cart-proceed-checkout-btn"
                disabled={isBelowMin}
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg transition touch-manipulation ${
                  isBelowMin
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-98'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>{t.proceedToWhatsappOrder}</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
