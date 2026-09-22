export type OrderStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface MenuItemVariant {
  id: string;
  name: string; // e.g. 'Plate', 'Half', 'Full', 'Chest', 'Leg', 'Single', 'Double'
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // Base price or primary variant price
  image?: string;
  variants?: MenuItemVariant[];
  available: boolean;
  isPopular?: boolean;
  isSpecial?: boolean;
}

export interface CartItem {
  cartItemId: string; // unique per line (menuItemId + variant)
  menuItemId: string;
  name: string;
  category: string;
  selectedVariant?: MenuItemVariant;
  unitPrice: number;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  category: string;
  selectedVariantName?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
  acknowledgedByReception?: boolean;
}

export interface RestaurantConfig {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  minOrderAmount: number;
  estimatedTime: string;
  isAcceptingOrders: boolean;
  currency: string;
}
