import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { MenuItem, Order, RestaurantConfig, OrderStatus } from '../src/types';
import { INITIAL_MENU, DEFAULT_CONFIG } from '../src/data/initialMenu';

const DATA_DIR = path.join(process.cwd(), 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function safeReadJSON<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}, falling back to default:`, error);
    return fallback;
  }
}

function safeWriteJSON<T>(filePath: string, data: T): void {
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {}
    }
    throw error;
  }
}

// In-memory cache synced with disk
let menuCache: MenuItem[] = safeReadJSON<MenuItem[]>(MENU_FILE, INITIAL_MENU);
let ordersCache: Order[] = safeReadJSON<Order[]>(ORDERS_FILE, []);
let configCache: RestaurantConfig = safeReadJSON<RestaurantConfig>(CONFIG_FILE, DEFAULT_CONFIG);

// Ensure menu file and cache always contain full exact menu dataset
if (menuCache.length < INITIAL_MENU.length) {
  menuCache = [...INITIAL_MENU];
  safeWriteJSON(MENU_FILE, menuCache);
}

// Ensure config file has the exact delivery phone
if (configCache.phone !== DEFAULT_CONFIG.phone) {
  configCache = { ...configCache, phone: DEFAULT_CONFIG.phone, whatsapp: DEFAULT_CONFIG.whatsapp };
  safeWriteJSON(CONFIG_FILE, configCache);
}

export const db = {
  // Menu
  getMenu(): MenuItem[] {
    return menuCache;
  },

  getMenuItem(id: string): MenuItem | undefined {
    return menuCache.find((m) => m.id === id);
  },

  addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    menuCache.unshift(newItem);
    safeWriteJSON(MENU_FILE, menuCache);
    return newItem;
  },

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const index = menuCache.findIndex((m) => m.id === id);
    if (index === -1) return null;
    menuCache[index] = { ...menuCache[index], ...updates };
    safeWriteJSON(MENU_FILE, menuCache);
    return menuCache[index];
  },

  deleteMenuItem(id: string): boolean {
    const prevLen = menuCache.length;
    menuCache = menuCache.filter((m) => m.id !== id);
    if (menuCache.length !== prevLen) {
      safeWriteJSON(MENU_FILE, menuCache);
      return true;
    }
    return false;
  },

  toggleMenuItemAvailability(id: string): MenuItem | null {
    const index = menuCache.findIndex((m) => m.id === id);
    if (index === -1) return null;
    menuCache[index].available = !menuCache[index].available;
    safeWriteJSON(MENU_FILE, menuCache);
    return menuCache[index];
  },

  // Orders
  getOrders(): Order[] {
    return [...ordersCache].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getOrderById(id: string): Order | undefined {
    return ordersCache.find((o) => o.id.toLowerCase() === id.toLowerCase());
  },

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
    // Generate memorable short order ID: SW-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const id = `SW-${randomDigits}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      status: 'NEW',
      createdAt: now,
      updatedAt: now,
      acknowledgedByReception: false,
      estimatedDeliveryTime: configCache.estimatedTime || '35 - 45 Mins',
    };

    ordersCache.unshift(newOrder);
    safeWriteJSON(ORDERS_FILE, ordersCache);
    return newOrder;
  },

  updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const index = ordersCache.findIndex((o) => o.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    ordersCache[index] = {
      ...ordersCache[index],
      status,
      updatedAt: new Date().toISOString(),
      acknowledgedByReception: true,
    };

    safeWriteJSON(ORDERS_FILE, ordersCache);
    return ordersCache[index];
  },

  acknowledgeOrder(id: string): Order | null {
    const index = ordersCache.findIndex((o) => o.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    ordersCache[index] = {
      ...ordersCache[index],
      acknowledgedByReception: true,
    };

    safeWriteJSON(ORDERS_FILE, ordersCache);
    return ordersCache[index];
  },

  // Config
  getConfig(): RestaurantConfig {
    return configCache;
  },

  updateConfig(updates: Partial<RestaurantConfig>): RestaurantConfig {
    configCache = { ...configCache, ...updates };
    safeWriteJSON(CONFIG_FILE, configCache);
    return configCache;
  },
};
