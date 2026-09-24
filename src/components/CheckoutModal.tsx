import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  AlertCircle,
  Phone,
  User,
  MapPin,
  FileText,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { RestaurantConfig, Order } from '../types';
import { formatPrice } from '../utils/formatters';

interface CheckoutModalProps {
  config: RestaurantConfig;
  onOrderSuccess?: (order: Order) => void;
}

const NAME_KEY = 'sarawan_customer_name';
const PHONE_KEY = 'sarawan_customer_phone';
const ADDRESS_KEY = 'sarawan_customer_address';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ config, onOrderSuccess }) => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, subtotal, clearCart, setActiveOrder } = useCart();
  const { t, isUrdu } = useLanguage();

  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem(NAME_KEY) || '';
    } catch {
      return '';
    }
  });

  const [phone, setPhone] = useState(() => {
    try {
      return localStorage.getItem(PHONE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [address, setAddress] = useState(() => {
    try {
      return localStorage.getItem(ADDRESS_KEY) || '';
    } catch {
      return '';
    }
  });

  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string>('');
  const [lastWebWhatsappUrl, setLastWebWhatsappUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [rawOrderText, setRawOrderText] = useState<string>('');

  // Reset states when modal is opened
  useEffect(() => {
    if (isCheckoutOpen) {
      setOrderSent(false);
      setErrorMessage(null);
      setCopied(false);
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const deliveryFee = config.deliveryFee ?? 150;
  const grandTotal = subtotal + deliveryFee;

  // Format the target WhatsApp number for Pakistan (0335-3131686 -> 923353131686)
  const getCleanWhatsappNumber = (): string => {
    const raw = config.whatsapp || config.phone || '0335-3131686';
    let target = raw.replace(/[^0-9]/g, '');
    if (target.startsWith('0')) {
      target = '92' + target.slice(1);
    } else if (!target.startsWith('92')) {
      target = '92' + target;
    }
    return target;
  };

  const handleSendWhatsappOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage(
        isUrdu
          ? 'براہ کرم اپنا پورا نام درج کریں (کم از کم ۲ حروف)۔'
          : 'Please enter your full name (minimum 2 characters).'
      );
      return;
    }

    const cleanPhoneDigits = phone.replace(/[^0-9+]/g, '');
    if (!phone.trim() || cleanPhoneDigits.length < 7) {
      setErrorMessage(
        isUrdu
          ? 'براہ کرم درست واٹس ایپ / فون نمبر درج کریں تاکہ رائیڈر آپ سے رابطہ کر سکے۔'
          : 'Please enter a valid WhatsApp / phone number for delivery confirmation.'
      );
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage(
        isUrdu
          ? 'براہ کرم مکمل پتہ درج کریں (گلی، علاقہ، مکان نمبر)۔'
          : 'Please enter a complete delivery address (house #, street, landmark, area).'
      );
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(
        isUrdu
          ? 'آپ کا کارٹ خالی ہے۔ براہ کرم کھانے شامل کریں۔'
          : 'Your cart is empty. Please select food items to order.'
      );
      return;
    }

    // Persist details for convenience next time
    try {
      localStorage.setItem(NAME_KEY, customerName.trim());
      localStorage.setItem(PHONE_KEY, phone.trim());
      localStorage.setItem(ADDRESS_KEY, address.trim());
    } catch {}

    const orderId = `SW-${Date.now().toString().slice(-5)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const timestamp = `${formattedDate}, ${formattedTime}`;

    // Build ultra-clean, professional WhatsApp order template in standard restaurant voucher format
    let fullMessage = '';

    if (isUrdu) {
      const itemsList = cart
        .map((item, idx) => {
          const variant = item.selectedVariant?.name ? ` (${item.selectedVariant.name})` : '';
          const lineTotal = item.unitPrice * item.quantity;
          return `${idx + 1}. *${item.name}*${variant}\n   تعداد: ${item.quantity} × Rs. ${item.unitPrice} = *Rs. ${lineTotal}*`;
        })
        .join('\n');

      const instructionsLine = notes.trim()
        ? `\n• خاص ہدایات: ${notes.trim()}`
        : '';

      fullMessage = [
        '*سروان فاسٹ فوڈ اینڈ باربی کیو*',
        '*آن لائن ڈیلیوری آرڈر کی تفصیلات*',
        '----------------------------------------',
        `آرڈر ریفرنس: #${orderId}`,
        `تاریخ و وقت: ${timestamp}`,
        'ادائیگی کا طریقہ: کیش آن ڈیلیوری (سی او ڈی)',
        '',
        '*کسٹمر کی معلومات*',
        `• نام: ${customerName.trim()}`,
        `• رابطہ نمبر: ${phone.trim()}`,
        `• ڈیلیوری پتہ: ${address.trim()}، کراچی${instructionsLine}`,
        '',
        '*آرڈر کی تفصیل*',
        itemsList,
        '',
        '*بل کی تفصیل*',
        '----------------------------------------',
        `کھانے کا بل: Rs. ${subtotal}`,
        `ڈیلیوری چارجز: Rs. ${deliveryFee}`,
        `*کل واجب الادا رقم: Rs. ${grandTotal}*`,
        '----------------------------------------',
        '',
        'براہ کرم اس آرڈر کی تصدیق فرمائیں اور رائیڈر کے پہنچنے کا وقت بتا دیں۔ شکریہ!',
      ].join('\n');
    } else {
      const itemsList = cart
        .map((item, idx) => {
          const variant = item.selectedVariant?.name ? ` (${item.selectedVariant.name})` : '';
          const lineTotal = item.unitPrice * item.quantity;
          return `${idx + 1}. *${item.name}*${variant}\n   Qty: ${item.quantity} × Rs. ${item.unitPrice} = *Rs. ${lineTotal}*`;
        })
        .join('\n');

      const instructionsLine = notes.trim()
        ? `\n• Special Instructions: ${notes.trim()}`
        : '';

      fullMessage = [
        '*SARAWAN FAST FOOD & BBQ*',
        '*Online Delivery Order Ticket*',
        '----------------------------------------',
        `Order Ref: #${orderId}`,
        `Date & Time: ${timestamp}`,
        'Payment Mode: Cash on Delivery (COD)',
        '',
        '*CUSTOMER & DELIVERY DETAILS*',
        `• Customer Name: ${customerName.trim()}`,
        `• Contact Number: ${phone.trim()}`,
        `• Delivery Address: ${address.trim()}, Karachi${instructionsLine}`,
        '',
        '*ITEMS ORDERED*',
        itemsList,
        '',
        '*BILL BREAKDOWN*',
        '----------------------------------------',
        `Food Subtotal: Rs. ${subtotal}`,
        `Standard Delivery: Rs. ${deliveryFee}`,
        `*NET TOTAL BILL: Rs. ${grandTotal}*`,
        '----------------------------------------',
        '',
        'Please reply with *CONFIRMED* along with your rider ETA. Thank you!',
      ].join('\n');
    }

    setRawOrderText(fullMessage);

    const targetPhone = getCleanWhatsappNumber();
    const encodedText = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;
    const webWhatsappUrl = `https://web.whatsapp.com/send?phone=${targetPhone}&text=${encodedText}`;

    setLastWhatsappUrl(whatsappUrl);
    setLastWebWhatsappUrl(webWhatsappUrl);

    // Launch WhatsApp
    try {
      const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!opened) {
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      window.location.href = whatsappUrl;
    }

    // Create an order record for local state
    const nowIso = new Date().toISOString();
    const localOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items: cart.map((ci, idx) => ({
        id: `oi-${idx}-${Date.now()}`,
        menuItemId: ci.menuItemId,
        name: ci.name,
        category: ci.category,
        selectedVariantName: ci.selectedVariant?.name,
        price: ci.unitPrice,
        quantity: ci.quantity,
      })),
      subtotal,
      deliveryFee,
      total: grandTotal,
      status: 'NEW',
      notes: notes.trim() || undefined,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setActiveOrder(localOrder);
    if (onOrderSuccess) {
      onOrderSuccess(localOrder);
    }

    // Record order in backend database asynchronously
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      }).catch(() => {});
    } catch {}

    // Clear cart and display sent confirmation view
    clearCart();
    setOrderSent(true);
  };

  const handleCopyOrder = () => {
    if (!rawOrderText) return;
    try {
      navigator.clipboard.writeText(rawOrderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-900/90 to-emerald-950/50 border-b border-stone-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-semibold shadow-inner">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-sans font-semibold text-stone-100 flex items-center gap-2">
                <span>{t.whatsappOrderTitle}</span>
              </h3>
              <p className="text-xs text-stone-400">
                To WhatsApp: {config.whatsapp || '0335-3131686'} • {t.cashOnDelivery}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-stone-400 hover:text-white w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-800 transition touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {orderSent ? (
          /* Confirmation Success State */
          <div className="p-6 sm:p-8 space-y-5 text-center animate-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-stone-100">{t.orderSentTitle}</h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-sm mx-auto leading-relaxed">
                {t.orderSentDesc}
              </p>
            </div>

            {/* Sent details summary */}
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 text-left space-y-2 text-xs">
              <div className="flex justify-between items-start text-stone-400">
                <span>👤 Customer:</span>
                <span className="font-semibold text-stone-200 text-right">{customerName}</span>
              </div>
              <div className="flex justify-between items-start text-stone-400">
                <span>📱 WhatsApp Number:</span>
                <span className="font-semibold text-emerald-400 font-mono text-right">{phone}</span>
              </div>
              <div className="flex justify-between items-start text-stone-400">
                <span>📍 Delivery Address:</span>
                <span className="font-semibold text-stone-200 text-right max-w-[220px]">{address}</span>
              </div>
              <div className="pt-2 border-t border-stone-800 flex justify-between text-stone-100 font-bold">
                <span>💰 Total Bill (COD):</span>
                <span className="text-amber-400 text-sm">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* WhatsApp message template preview */}
            {rawOrderText && (
              <div className="text-left bg-stone-900/90 border border-emerald-900/40 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>WhatsApp Order Template</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Sent to: 0335-3131686</span>
                </div>
                <pre className="text-[11px] font-mono text-stone-300 bg-stone-950/80 p-3 rounded-xl max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-stone-800/80 text-left select-all">
                  {rawOrderText}
                </pre>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <a
                href={lastWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-emerald-600/30 active:scale-98 transition flex items-center justify-center gap-2.5 touch-manipulation"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>{t.reopenWhatsapp} (App / Mobile)</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </a>

              {lastWebWhatsappUrl && (
                <a
                  href={lastWebWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open directly in WhatsApp Web</span>
                </a>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{t.copiedToClipboard}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t.copyOrderText}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 rounded-xl text-xs font-semibold transition"
                >
                  {t.orderMoreFood}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* WhatsApp Order Delivery Form */
          <form onSubmit={handleSendWhatsappOrder} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Explanation Notice */}
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl flex items-start gap-3 text-xs text-emerald-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-emerald-300">
                  {t.whatsappOrderTitle}
                </p>
                <p className="text-[11px] leading-relaxed text-emerald-200/90">
                  {t.whatsappNotice}
                </p>
              </div>
            </div>

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
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            {/* Phone Number (User login whatsapp) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider">
                  {t.phoneLabel} *
                </label>
                <span className="text-[10px] text-emerald-400 font-medium">Your WhatsApp ID</span>
              </div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {t.phoneHelp}
              </p>
            </div>

            {/* Delivery Address */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider">
                  {t.deliveryAddress} *
                </label>
                <span className="text-[10px] text-stone-500">Karachi</span>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street, Near Landmark, Area, Karachi"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {t.addressHelp}
              </p>
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
                  placeholder="e.g. Mild spicy, send extra green raita, ring bell..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
                />
              </div>
            </div>

            {/* Order Items & Bill Breakdown */}
            <div className="bg-stone-900/90 border border-stone-800/80 rounded-2xl p-4 text-xs space-y-2.5">
              <div className="font-semibold text-stone-300 border-b border-stone-800 pb-2 flex items-center justify-between">
                <span>Selected Items ({cart.length})</span>
                <span className="text-amber-400 font-mono">{formatPrice(subtotal)}</span>
              </div>

              <div className="max-h-28 overflow-y-auto divide-y divide-stone-800/40 pr-1">
                {cart.map((c) => (
                  <div key={c.cartItemId} className="py-1.5 flex justify-between items-center text-[11px]">
                    <span className="text-stone-300 truncate max-w-[220px]">
                      {c.name} {c.selectedVariant ? `(${c.selectedVariant.name})` : ''} × {c.quantity}
                    </span>
                    <span className="text-stone-400 font-medium ml-2">
                      {formatPrice(c.unitPrice * c.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-800 pt-2 space-y-1 text-stone-400">
                <div className="flex justify-between">
                  <span>{t.deliveryFee}</span>
                  <span className="text-stone-300">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="pt-1.5 border-t border-stone-800/80 flex justify-between text-sm font-bold text-stone-100">
                  <span>{t.totalPayable}</span>
                  <span className="text-emerald-400 text-base">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Submit Action: Direct to WhatsApp */}
            <div className="pt-2">
              <button
                id="send-whatsapp-order-btn"
                type="submit"
                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-base shadow-xl shadow-emerald-600/30 active:scale-98 transition flex items-center justify-center gap-3 touch-manipulation border border-emerald-500/40"
              >
                <svg className="w-6 h-6 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>{t.sendOrderViaWhatsapp} ({formatPrice(grandTotal)})</span>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sends from your WhatsApp account to Sarawan ({config.whatsapp || '0335-3131686'})</span>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
