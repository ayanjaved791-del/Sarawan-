import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Flame,
  Clock,
  ChevronRight,
  MessageSquare,
  BadgeCheck
} from 'lucide-react';
import { MenuItem, MenuItemVariant, RestaurantConfig } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatters';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface ProductDetailPageProps {
  item: MenuItem;
  allItems: MenuItem[];
  config: RestaurantConfig;
  onBack: () => void;
  onSelectRelatedItem: (item: MenuItem) => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenFullMenu: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  item,
  allItems,
  config,
  onBack,
  onSelectRelatedItem,
  onNavigateToSection,
  onOpenFullMenu,
}) => {
  const { cart, addToCart, updateQuantity, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const { t } = useLanguage();

  // Active selected variant
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | undefined>(() => {
    return item.variants && item.variants.length > 0 ? item.variants[0] : undefined;
  });

  // Quantity selector
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [selectedCookingNote, setSelectedCookingNote] = useState<string>('');

  // When item changes, reset selection
  useEffect(() => {
    setSelectedVariant(item.variants && item.variants.length > 0 ? item.variants[0] : undefined);
    setQuantity(1);
    setSelectedCookingNote('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [item.id]);

  const currentPrice = selectedVariant ? selectedVariant.price : item.price;
  const originalPrice = Math.round(currentPrice * 1.15); // Authentic e-commerce strikethrough discount display
  const discountPercent = 13;

  // Cart item matching
  const variantKey = selectedVariant ? selectedVariant.id : 'default';
  const cartItemId = `${item.id}-${variantKey}`;
  const existingInCart = cart.find((c) => c.cartItemId === cartItemId);

  // Related products from same category or popular
  const relatedItems = allItems
    .filter((it) => it.id !== item.id && (it.category === item.category || it.isPopular))
    .slice(0, 4);

  // Handle Add to Cart
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item, selectedVariant, selectedCookingNote || undefined);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  // Handle Instant Buy Now
  const handleBuyNow = () => {
    addToCart(item, selectedVariant, selectedCookingNote || undefined);
    setIsCheckoutOpen(true);
  };

  // Handle Share Product
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${item.name} - Sarawan Fast Food`,
          text: `Check out ${item.name} on Sarawan Fast Food!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        config={config}
        onNavigateToSection={onNavigateToSection}
        onOpenFullMenu={onOpenFullMenu}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Amazon/Daraz Style Breadcrumb navigation */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-stone-400 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.productBack}</span>
          </button>
          <ChevronRight className="w-3 h-3 text-stone-600" />
          <button
            onClick={onOpenFullMenu}
            className="hover:text-amber-400 transition"
          >
            {t.navFullMenu}
          </button>
          <ChevronRight className="w-3 h-3 text-stone-600" />
          <span className="text-stone-400">{item.category}</span>
          <ChevronRight className="w-3 h-3 text-stone-600" />
          <span className="text-stone-200 font-medium truncate max-w-[200px] sm:max-w-none">
            {item.name}
          </span>
        </div>

        {/* Product Page Main Grid (Amazon/Daraz 2-column or 3-column layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* ================= COLUMN 1: Image Showcase (5 cols on lg) ================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden shadow-2xl group">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-black/10" />

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-amber-500 text-stone-950 text-xs font-bold px-3 py-1 rounded-md shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" /> {t.productSarawanChoice}
                </span>
                {item.isSpecial && (
                  <span className="bg-stone-900/90 text-amber-300 border border-amber-500/40 text-[11px] font-semibold px-2.5 py-0.5 rounded shadow">
                    {t.chefSpecial}
                  </span>
                )}
              </div>

              {/* Wishlist & Share floating actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition ${
                    isWishlisted
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : 'bg-stone-900/80 border-stone-700 text-stone-300 hover:text-white'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-stone-900/80 border border-stone-700 text-stone-300 hover:text-white backdrop-blur-md transition"
                  aria-label="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Category Pill at bottom */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-stone-950/80 backdrop-blur-md text-stone-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-700">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Thumbnail previews / trust highlights */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-xl text-center">
                <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-[11px] text-stone-300 block font-medium">{t.halalCertified}</span>
                <span className="text-[10px] text-stone-500">{t.freshMeatDaily}</span>
              </div>
              <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-xl text-center">
                <Truck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-[11px] text-stone-300 block font-medium">{t.homeDelivery}</span>
                <span className="text-[10px] text-stone-500">{config.estimatedTime || '35-45 Mins'}</span>
              </div>
              <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-xl text-center">
                <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-[11px] text-stone-300 block font-medium">{t.verifiedKitchen}</span>
                <span className="text-[10px] text-stone-500">{t.productFreshNotice}</span>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2: Product Core Details (7 cols on lg) ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Brand Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400 uppercase tracking-wider mb-2">
                <span>Brand: {t.brandName}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> {t.verifiedKitchen}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-stone-100 tracking-tight leading-tight">
                {item.name}
              </h1>
            </div>

            {/* Amazon Price Box */}
            <div className="p-4 sm:p-5 bg-stone-900/80 border border-stone-800 rounded-2xl space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold font-sans text-amber-400">
                  {formatPrice(currentPrice)}
                </span>
                <span className="text-stone-500 text-base line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  -{discountPercent}% OFF
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {t.productFreshNotice}
              </p>
            </div>

            {/* Product Variations / Portions (like Amazon Size / Color selector) */}
            {item.variants && item.variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                    {t.selectPortion}
                  </label>
                  <span className="text-xs text-amber-400 font-medium">
                    {selectedVariant?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {item.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-amber-200 ring-1 ring-amber-500 shadow-md shadow-amber-950/30'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-semibold text-xs truncate">{variant.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <span className="text-sm font-bold text-amber-400">
                          Rs. {variant.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cooking Notes / Custom Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 block">
                {t.cookingPreference}
              </label>
              <div className="flex flex-wrap gap-2">
                {['Normal Spicy', 'Extra Spicy', 'Mild / Less Spicy', 'Extra Raita & Salad', 'Extra Crispy'].map(
                  (pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() =>
                        setSelectedCookingNote(selectedCookingNote === pref ? '' : pref)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        selectedCookingNote === pref
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      {pref}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons (Add to Cart / Buy Now) */}
            <div className="p-5 bg-stone-900/60 border border-stone-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  {t.quantity}
                </span>
                <div className="flex items-center bg-stone-950 border border-stone-700 rounded-xl p-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-40 flex items-center justify-center transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-amber-400 text-base">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-stone-400">
                  {t.subtotal} <span className="font-bold text-amber-400 text-sm">Rs. {currentPrice * quantity}</span>
                </div>
              </div>

              {/* Action Buttons: Add to Cart (Daraz style) & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!item.available}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2 touch-manipulation disabled:bg-stone-800 disabled:text-stone-500"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.addToCart}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!item.available}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20 active:scale-98 transition flex items-center justify-center gap-2 touch-manipulation disabled:bg-stone-800 disabled:text-stone-500"
                >
                  <Zap className="w-4 h-4" />
                  <span>{t.buyNow}</span>
                </button>
              </div>

              {addedToast && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Added {quantity}x {item.name} to cart!</span>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="underline font-semibold hover:text-white ml-2"
                  >
                    View Cart
                  </button>
                </div>
              )}

              {copiedLink && (
                <div className="p-2.5 bg-amber-950/80 border border-amber-700 text-amber-300 rounded-xl text-xs text-center">
                  Product link copied to clipboard!
                </div>
              )}
            </div>

            {/* Delivery & Service Guarantees Card (Daraz / Amazon style sidebar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-900/40 border border-stone-800 rounded-2xl text-xs">
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">{t.homeDelivery}</span>
                  <span className="text-stone-400">Within {config.estimatedTime || '35 - 45 Mins'} in hot insulated containers.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">{t.cashOnDelivery}</span>
                  <span className="text-stone-400">Pay cash directly to our rider after inspecting food.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">{t.kitchenHours}</span>
                  <span className="text-stone-400">{config.openingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">{t.directAssistance}</span>
                  <span className="text-stone-400">Call / WhatsApp: {config.phone}</span>
                </div>
              </div>
            </div>

            {/* Description & Recipe Specifications */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-semibold text-stone-100 border-b border-stone-800 pb-2">
                {t.dishDescription}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {item.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-2.5 bg-stone-900/70 rounded-xl border border-stone-800">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Cuisine Type</span>
                  <span className="text-stone-200 font-medium">{item.category}</span>
                </div>
                <div className="p-2.5 bg-stone-900/70 rounded-xl border border-stone-800">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Serving Temperature</span>
                  <span className="text-stone-200 font-medium">Piping Hot & Fresh</span>
                </div>
                <div className="p-2.5 bg-stone-900/70 rounded-xl border border-stone-800">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Packaging</span>
                  <span className="text-stone-200 font-medium">Food-grade Sealed</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= Related Products Carousel / Grid (Amazon style "Customers Also Ordered") ================= */}
        {relatedItems.length > 0 && (
          <section className="mt-16 pt-10 border-t border-stone-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-stone-100">
                  {t.frequentlyOrderedTogether}
                </h2>
                <p className="text-xs text-stone-400">
                  {t.heroTag}
                </p>
              </div>
              <button
                onClick={onOpenFullMenu}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>{t.navFullMenu}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedItems.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedItem(rel)}
                  className="bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-stone-900">
                    <img
                      src={rel.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-stone-950/80 backdrop-blur-md text-stone-300 text-[10px] px-2 py-0.5 rounded border border-stone-700">
                      {rel.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-200 group-hover:text-amber-400 transition line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                        {rel.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-800/80 mt-2">
                      <span className="text-sm font-bold text-amber-400">
                        {formatPrice(rel.price)}
                      </span>
                      <span className="text-[11px] text-amber-400 font-medium group-hover:underline">
                        {t.viewDetails} →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onNavigateToSection={onNavigateToSection}
        onOpenFullMenu={onOpenFullMenu}
      />
    </div>
  );
};
