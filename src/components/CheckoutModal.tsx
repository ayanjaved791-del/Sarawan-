import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ShoppingBag, Truck, Phone, User, MapPin, FileText, Loader2, MessageSquare, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { RestaurantConfig, Order } from '../types';
import { formatPrice } from '../utils/formatters';

interface CheckoutModalProps {
  config: RestaurantConfig;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ config, onOrderSuccess }) => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, subtotal, clearCart } = useCart();
  const { t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const deliveryFee = config.deliveryFee ?? 150;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!phone.trim() || cleanPhone.length < 7) {
      setErrorMessage('Please enter a valid reachable phone number for the delivery rider.');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('Please enter a full, complete delivery address (street, area, house/flat #).');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add food items to order.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
        items: cart.map((ci) => ({
          menuItemId: ci.menuItemId,
          name: ci.name,
          category: ci.category,
          selectedVariantName: ci.selectedVariant?.name,
          price: ci.unitPrice,
          quantity: ci.quantity,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server rejected order. Please verify your details.');
      }

      if (data.success && data.order) {
        // Clear cart and trigger success
        clearCart();
        setIsCheckoutOpen(false);
        onOrderSuccess(data.order);
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (err: any) {
      console.error('Order submission failed:', err);
      setErrorMessage(err.message || 'Failed to place order. Please check your internet connection or call the restaurant directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before ordering.');
      return;
    }

    // Build pre-formatted order message for WhatsApp
    const lines: string[] = [];
    lines.push('*✨ NEW ORDER - SARAWAN FAST FOOD ✨*');
    lines.push('----------------------------------------');

    if (customerName.trim()) {
      lines.push(`*Customer Name:* ${customerName.trim()}`);
    }
    if (phone.trim()) {
      lines.push(`*Phone:* ${phone.trim()}`);
    }
    if (address.trim()) {
      lines.push(`*Delivery Address:* ${address.trim()}`);
    }
    if (notes.trim()) {
      lines.push(`*Special Notes:* ${notes.trim()}`);
    }

    lines.push('----------------------------------------');
    lines.push('*🛒 ORDER ITEMS:*');
    cart.forEach((item, index) => {
      const variantText = item.selectedVariant?.name ? ` (${item.selectedVariant.name})` : '';
      const lineTotal = item.unitPrice * item.quantity;
      lines.push(`${index + 1}. *${item.name}*${variantText} x ${item.quantity} = Rs. ${lineTotal}`);
    });

    lines.push('----------------------------------------');
    lines.push(`*Subtotal:* Rs. ${subtotal}`);
    lines.push(`*Delivery Fee:* Rs. ${deliveryFee}`);
    lines.push(`*Total Payable (COD):* *Rs. ${grandTotal}*`);
    lines.push('----------------------------------------');
    lines.push('Please confirm my delivery order and estimated arrival time. Thank you!');

    const rawPhone = config.whatsapp || config.phone || '0335-3131686';
    let targetPhone = rawPhone.replace(/[^0-9]/g, '');
    if (targetPhone.startsWith('0')) {
      targetPhone = '92' + targetPhone.slice(1);
    } else if (!targetPhone.startsWith('92')) {
      targetPhone = '92' + targetPhone;
    }

    const encodedText = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;

    // Open WhatsApp link in new window/tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-stone-900/80 border-b border-stone-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-semibold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-sans font-semibold text-stone-100">{t.deliveryInfoTitle}</h3>
              <p className="text-xs text-stone-400">{t.cashOnDelivery} (COD)</p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            disabled={isSubmitting}
            className="text-stone-400 hover:text-white w-11 h-11 flex items-center justify-center rounded-xl hover:bg-stone-800 transition touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-1">
              {t.fullName} *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-1">
              {t.phoneNumber} *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0300 1234567 or +92 3..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Our receptionist or delivery rider will call this number to confirm dispatch.
            </p>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-1">
              {t.deliveryAddress} *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat #, Street, Nearby Landmark, Area / Sector..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-1">
              {t.specialInstructions}
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Make it medium spicy, ring bell on arrival..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none"
              />
            </div>
          </div>

          {/* Order Bill Summary */}
          <div className="bg-stone-900/90 border border-stone-800/80 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex justify-between text-stone-400">
              <span>{t.cartTitle} ({cart.length})</span>
              <span className="font-medium text-stone-200">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>{t.deliveryFee}</span>
              <span className="font-medium text-stone-200">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-semibold text-stone-100">
              <span>{t.totalPayable}</span>
              <span className="text-amber-400">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Action CTAs: Direct COD & Direct to WhatsApp */}
          <div className="pt-2 space-y-3">
            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 sm:py-4 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-semibold rounded-xl text-sm sm:text-base shadow-xl shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2 touch-manipulation"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting to Receptionist...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{t.confirmOrder} ({formatPrice(grandTotal)})</span>
                </>
              )}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-800"></div>
              <span className="flex-shrink mx-3 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                {t.orOrderDirectlyViaWhatsapp}
              </span>
              <div className="flex-grow border-t border-stone-800"></div>
            </div>

            <button
              id="direct-to-whatsapp-btn"
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/20 active:scale-98 transition flex items-center justify-center gap-2 touch-manipulation border border-emerald-500/30"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span>{t.directToWhatsapp}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
            <p className="text-[11px] text-center text-stone-400">
              Sends your selected items, address, and bill directly to Sarawan WhatsApp ({config.whatsapp || '0335-3131686'}).
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};
