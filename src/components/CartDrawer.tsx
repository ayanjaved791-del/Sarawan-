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
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                  isBelowMin
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 active:scale-98'
                }`}
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
