import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, Plus, Minus, Flame, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { MenuItem, MenuItemVariant, RestaurantConfig } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatters';
import { SarawanLogo } from './SarawanLogo';

interface FullMenuPageProps {
  menuItems: MenuItem[];
  categories: string[];
  config: RestaurantConfig;
  onBackToHome: () => void;
  onSelectProduct?: (item: MenuItem) => void;
}

export const FullMenuPage: React.FC<FullMenuPageProps> = ({
  menuItems,
  categories,
  config,
  onBackToHome,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, addToCart, updateQuantity, setIsCartOpen, totalCount } = useCart();
  const { t } = useLanguage();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, MenuItemVariant>>({});

  const handleVariantChange = (itemId: string, variant: MenuItemVariant) => {
    setSelectedVariants((prev) => ({ ...prev, [itemId]: variant }));
  };

  // Group items by category if 'All' is selected, or filter to selected category
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Grouped by categories for categorized display
  const categorizedSections = useMemo(() => {
    const map = new Map<string, MenuItem[]>();

    filteredItems.forEach((item) => {
      const cat = item.category;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(item);
    });

    return Array.from(map.entries());
  }, [filteredItems]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-stone-300 hover:text-amber-400 bg-stone-900 border border-stone-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition active:scale-95 touch-manipulation"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.productBack}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5">
              <SarawanLogo size="sm" rounded="xl" />
              <span className="font-semibold text-stone-100 text-lg">{t.brandName} {t.navFullMenu}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:03353131686"
              className="hidden md:flex items-center gap-2 text-xs font-mono font-medium text-amber-400 bg-stone-900 border border-stone-800 px-3 py-2 rounded-xl"
            >
              <span>{t.deliveryHelpline}: 0335-3131686</span>
            </a>

            <button
              id="fullmenu-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative min-h-[42px] px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition touch-manipulation"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-semibold">{t.navCart}</span>
              {totalCount > 0 && (
                <span className="bg-stone-950 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title & Subtitle */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-medium tracking-widest uppercase">
            <span>{t.halalCertified}</span>
            <span>•</span>
            <span>{t.freshMeatDaily}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-stone-100 mt-2">
            {t.brandName} {t.navFullMenu}
          </h1>
          <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl">
            {t.menuSubtitle}
          </p>
        </div>

        {/* Search & Category Filtering Controls */}
        <div className="sticky top-20 z-30 bg-stone-950/95 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-stone-800/80 mb-8">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-stone-900 border border-stone-700/80 rounded-2xl pl-11 pr-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm shadow-inner transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex-shrink-0 touch-manipulation ${
                selectedCategory === 'All'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-700 hover:text-white'
              }`}
            >
              {t.allCategories} ({menuItems.length})
            </button>

            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.category.toLowerCase() === cat.toLowerCase()).length;
              if (count === 0) return null;
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex-shrink-0 touch-manipulation ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-700 hover:text-white'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800 p-8">
            <AlertCircle className="w-12 h-12 text-amber-500/50 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-stone-200">{t.noItemsFound}</h3>
            <p className="text-stone-400 text-sm mt-1">{t.searchPlaceholder}</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2.5 bg-amber-500 text-stone-950 rounded-xl text-xs font-semibold"
            >
              {t.allCategories}
            </button>
          </div>
        )}

        {/* Categorized Food Items Display */}
        <div className="space-y-14">
          {categorizedSections.map(([catName, items]) => (
            <section key={catName} id={`category-${catName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
              {/* Category Section Header */}
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-6 bg-amber-500 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl font-sans font-bold text-stone-100">
                    {catName}
                  </h2>
                  <span className="text-xs bg-stone-900 text-stone-400 border border-stone-800 px-2.5 py-1 rounded-full font-mono">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              {/* Grid for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const activeVariant =
                    selectedVariants[item.id] ||
                    (item.variants && item.variants.length > 0 ? item.variants[0] : undefined);
                  const currentPrice = activeVariant ? activeVariant.price : item.price;
                  const variantKey = activeVariant ? activeVariant.id : 'default';
                  const cartItemId = `${item.id}-${variantKey}`;
                  const existingCartItem = cart.find((c) => c.cartItemId === cartItemId);

                  return (
                    <div
                      key={item.id}
                      id={`fullmenu-item-${item.id}`}
                      className={`bg-stone-900/60 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-950/20 ${
                        !item.available ? 'opacity-65 border-stone-800/60' : 'border-stone-800'
                      }`}
                    >
                      <div>
                        {/* Food Image (Clickable for Product Detail) */}
                        <div
                          onClick={() => onSelectProduct?.(item)}
                          className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-900 cursor-pointer"
                          title={`View ${item.name} details`}
                        >
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />

                          {/* Category pill */}
                          <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-stone-300 text-[11px] font-medium px-2.5 py-1 rounded-md border border-stone-700/60">
                            {item.category}
                          </span>

                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                            {item.isSpecial && (
                              <span className="bg-amber-500 text-stone-950 text-[10px] font-semibold uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> {t.chefSpecial}
                              </span>
                            )}
                            {item.isPopular && !item.isSpecial && (
                              <span className="bg-orange-600 text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
                                <Flame className="w-3 h-3" /> {t.popularChoice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Body Content */}
                        <div className="p-5">
                          <div
                            onClick={() => onSelectProduct?.(item)}
                            className="cursor-pointer"
                            title={`View ${item.name} details`}
                          >
                            <h3 className="text-lg font-semibold text-stone-100 group-hover:text-amber-400 transition leading-snug">
                              {item.name}
                            </h3>

                            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 min-h-[32px] mt-1.5">
                              {item.description}
                            </p>
                          </div>

                          {/* Variants selector (if present) */}
                          {item.variants && item.variants.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-stone-800/80">
                              <label className="text-[11px] uppercase font-medium tracking-wider text-stone-400 block mb-1.5">
                                {t.portionServing}
                              </label>
                              <div className="grid grid-cols-2 gap-1.5">
                                {item.variants.map((v) => {
                                  const isSelected = (activeVariant?.id || item.variants![0].id) === v.id;
                                  return (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => handleVariantChange(item.id, v)}
                                      className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium border text-left transition flex items-center justify-between touch-manipulation active:scale-98 ${
                                        isSelected
                                          ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                                      }`}
                                    >
                                      <span className="truncate">{v.name}</span>
                                      <span className="text-[10px] opacity-80 ml-1">Rs.{v.price}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer: Price & Add to Cart */}
                      <div className="p-5 pt-0 mt-2">
                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-800/60">
                          <div>
                            <span className="text-[10px] text-stone-400 block uppercase font-medium">Price</span>
                            <span className="text-lg font-semibold text-amber-400">
                              {formatPrice(currentPrice)}
                            </span>
                          </div>

                          {!item.available ? (
                            <span className="text-xs text-stone-500 italic">Sold Out</span>
                          ) : existingCartItem ? (
                            <div className="flex items-center bg-stone-900 border border-stone-700 rounded-xl p-1 sm:p-0.5 gap-2 sm:gap-1.5 shadow-inner">
                              <button
                                type="button"
                                onClick={() => updateQuantity(cartItemId, existingCartItem.quantity - 1)}
                                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 flex items-center justify-center transition touch-manipulation"
                                title="Decrease quantity"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                              </button>
                              <span className="text-base sm:text-sm font-semibold text-amber-400 min-w-[28px] sm:min-w-[20px] text-center select-none">
                                {existingCartItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(cartItemId, existingCartItem.quantity + 1)}
                                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-stone-950 flex items-center justify-center font-semibold transition touch-manipulation"
                                title="Increase quantity"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              id={`fullmenu-add-${item.id}`}
                              onClick={() => addToCart(item, activeVariant)}
                              className="min-h-[44px] px-5 py-3 sm:py-2.5 sm:min-h-[38px] bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 active:scale-95 transition touch-manipulation"
                            >
                              <Plus className="w-4 h-4" />
                              <span>{t.addToCart}</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer Banner */}
      <footer className="border-t border-stone-800 bg-stone-900/60 py-8 px-4 text-center">
        <p className="text-xs text-stone-400">
          {t.deliveryHelpline}: <a href="tel:03353131686" className="text-amber-400 font-mono font-medium underline">0335-3131686</a>
        </p>
        <p className="text-[11px] text-stone-500 mt-2">
          © {new Date().getFullYear()} {t.brandName} Fast Food & BBQ. {t.allRightsReserved}.
        </p>
      </footer>
    </div>
  );
};
