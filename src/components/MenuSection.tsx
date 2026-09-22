import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Flame, Sparkles, AlertCircle, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { MenuItem, MenuItemVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatters';

interface MenuSectionProps {
  menuItems: MenuItem[];
  categories: string[];
  onOpenFullMenu: () => void;
  onSelectProduct?: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  categories,
  onOpenFullMenu,
  onSelectProduct,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, addToCart, updateQuantity } = useCart();

  // Selected variant state per item ID
  const [selectedVariants, setSelectedVariants] = useState<Record<string, MenuItemVariant>>({});

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

  // When viewing "All" items without a specific search query, display only the first 12 items
  const isAllView = selectedCategory === 'All' && !searchQuery.trim();
  const displayedItems = isAllView ? filteredItems.slice(0, 12) : filteredItems;

  const handleVariantChange = (itemId: string, variant: MenuItemVariant) => {
    setSelectedVariants((prev) => ({ ...prev, [itemId]: variant }));
  };

  return (
    <section id="menu" className="py-16 sm:py-20 bg-stone-900/60 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-500 font-medium text-xs tracking-widest uppercase">
            {t.brandName}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-semibold text-stone-100 mt-2">
            {t.menuTitle}
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-3">
            {t.menuSubtitle}
          </p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-stone-950 border border-stone-700/80 rounded-2xl pl-12 pr-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm shadow-inner transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-xs text-stone-400 hover:text-stone-200 transition touch-manipulation"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Scrollable horizontally edge-to-edge on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent mb-8">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex-shrink-0 touch-manipulation ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-950 text-stone-300 border border-stone-800 hover:border-stone-700 hover:text-white'
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
                className={`px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex-shrink-0 touch-manipulation ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'bg-stone-950 text-stone-300 border border-stone-800 hover:border-stone-700 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-stone-950/40 rounded-3xl border border-stone-800/80 p-8">
            <AlertCircle className="w-12 h-12 text-amber-500/50 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-stone-200">No dishes match your search</h3>
            <p className="text-stone-400 text-sm mt-1">Try another category or search term.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => {
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
                id={`menu-item-${item.id}`}
                className={`bg-stone-950 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-950/20 ${
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
                      {!item.available && (
                        <span className="bg-rose-900/90 text-rose-200 text-[10px] font-semibold uppercase px-2 py-0.5 rounded border border-rose-700">
                          Unavailable
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
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-stone-100 group-hover:text-amber-400 transition leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 min-h-[32px]">
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
                      /* Quantity modifier if already in cart */
                      <div className="flex items-center bg-stone-900 border border-stone-700 rounded-xl p-1 sm:p-0.5 gap-2 sm:gap-1.5 shadow-inner">
                        <button
                          type="button"
                          onClick={() => updateQuantity(cartItemId, existingCartItem.quantity - 1)}
                          className="w-11 h-11 sm:w-8 sm:h-8 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 flex items-center justify-center transition touch-manipulation"
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
                          className="w-11 h-11 sm:w-8 sm:h-8 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-stone-950 flex items-center justify-center font-semibold transition touch-manipulation"
                          title="Increase quantity"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* Add to Cart button */
                      <button
                        type="button"
                        id={`add-to-cart-${item.id}`}
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

        {/* Show More link / button below grid */}
        <div className="mt-12 text-center flex flex-col items-center justify-center">
          <p className="text-stone-400 text-sm mb-3">
            {isAllView
              ? `Showing 12 of ${filteredItems.length} delicious items in All Items`
              : `Showing ${displayedItems.length} items`}
          </p>

          <button
            id="show-more-menu-btn"
            onClick={onOpenFullMenu}
            className="group inline-flex items-center gap-3 bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-amber-400 border border-amber-500/40 hover:border-amber-400 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-xl shadow-stone-950/50 active:scale-98 touch-manipulation cursor-pointer"
          >
            <UtensilsCrossed className="w-5 h-5 text-amber-400 group-hover:text-stone-950 transition-colors" />
            <span>{t.showAllMenu}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
          
          <span className="text-xs text-stone-500 mt-2">
            Click to browse full categorized menu with Karahi, BBQ, Broast, Handi, Roll, Chinese & Ice Creams
          </span>
        </div>

      </div>
    </section>
  );
};
