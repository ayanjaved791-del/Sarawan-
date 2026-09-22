import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, MenuItemVariant, Order } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, variant?: MenuItemVariant, notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'sarwan_cart_v1';
const RECENT_ORDER_KEY = 'sarwan_recent_order_id';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Try to load recent order if available on mount
  useEffect(() => {
    try {
      const savedOrderId = localStorage.getItem(RECENT_ORDER_KEY);
      if (savedOrderId && !activeOrder) {
        fetch(`/api/orders/${savedOrderId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && data.id) {
              setActiveOrder(data);
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  const addToCart = (item: MenuItem, variant?: MenuItemVariant, notes?: string) => {
    const unitPrice = variant ? variant.price : item.price;
    const variantKey = variant ? variant.id : 'default';
    const cartItemId = `${item.id}-${variantKey}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        if (notes) updated[existingIndex].notes = notes;
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItemId: item.id,
          name: item.name,
          category: item.category,
          selectedVariant: variant,
          unitPrice,
          quantity: 1,
          notes,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((it) => (it.cartItemId === cartItemId ? { ...it, quantity } : it))
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const totalCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = cart.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);

  const handleSetActiveOrder = (order: Order | null) => {
    setActiveOrder(order);
    try {
      if (order?.id) {
        localStorage.setItem(RECENT_ORDER_KEY, order.id);
      }
    } catch {}
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrder,
        setActiveOrder: handleSetActiveOrder,
        isTrackingOpen,
        setIsTrackingOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
