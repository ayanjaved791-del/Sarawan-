import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { INITIAL_MENU_ITEMS } from './src/data/initialMenuData';

dotenv.config();

export type OrderStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'ON_THE_WAY'
  | 'COMPLETED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  isPopular?: boolean;
  isSpecial?: boolean;
  variants?: MenuItemVariant[];
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  category?: string;
  selectedVariantName?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
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

// Default restaurant config fallback
const DEFAULT_CONFIG: RestaurantConfig = {
  name: 'Sarawan',
  phone: '0335-3131686',
  whatsapp: '0335-3131686',
  address: 'Sarawan Fast Food, Karachi',
  openingHours: '12:00 PM - 02:00 AM (Open 7 Days a Week)',
  deliveryFee: 150,
  minOrderAmount: 300,
  estimatedTime: '35 - 45 Mins',
  isAcceptingOrders: true,
  currency: 'Rs.',
};

// Data persistence paths
const BASE_DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'sarawan_data') : path.join(process.cwd(), 'data');
const DATA_DIR = BASE_DATA_DIR;
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Warning: Could not create data directory, using in-memory mode:', err);
}

function safeReadJSON<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      } catch {}
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
    console.error(`Warning: Failed writing persistence file ${filePath}:`, error);
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {}
    }
  }
}

// In-memory cache synced with disk
const ROOT_MENU_FILE = path.join(process.cwd(), 'new_menu_137.json');
let menuCache: MenuItem[] = [];

try {
  const persisted = safeReadJSON<MenuItem[]>(MENU_FILE, []);
  if (Array.isArray(persisted) && persisted.length > 0) {
    menuCache = persisted;
  }
} catch (e) {
  console.warn('Could not read persisted menu file:', e);
}

// Fallback to root file or bundled data
if (menuCache.length === 0) {
  try {
    if (fs.existsSync(ROOT_MENU_FILE)) {
      const rawRoot = fs.readFileSync(ROOT_MENU_FILE, 'utf-8');
      const parsed = JSON.parse(rawRoot);
      if (Array.isArray(parsed) && parsed.length > 0) {
        menuCache = parsed;
        safeWriteJSON(MENU_FILE, menuCache);
      }
    }
  } catch (e) {
    console.warn('Could not read root menu file:', e);
  }
}

// Ultimate fallback: bundled 137 items (works 100% on Vercel and serverless)
if (menuCache.length === 0 && Array.isArray(INITIAL_MENU_ITEMS) && INITIAL_MENU_ITEMS.length > 0) {
  menuCache = [...(INITIAL_MENU_ITEMS as unknown as MenuItem[])];
  safeWriteJSON(MENU_FILE, menuCache);
}

let ordersCache: Order[] = safeReadJSON<Order[]>(ORDERS_FILE, []);
let configCache: RestaurantConfig = safeReadJSON<RestaurantConfig>(CONFIG_FILE, DEFAULT_CONFIG);

if (configCache.phone !== DEFAULT_CONFIG.phone) {
  configCache = { ...configCache, phone: DEFAULT_CONFIG.phone, whatsapp: DEFAULT_CONFIG.whatsapp };
  safeWriteJSON(CONFIG_FILE, configCache);
}

const db = {
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
  getOrders(): Order[] {
    return [...ordersCache].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  getOrderById(id: string): Order | undefined {
    return ordersCache.find((o) => o.id.toLowerCase() === id.toLowerCase());
  },
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
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
  getConfig(): RestaurantConfig {
    return configCache;
  },
  updateConfig(updates: Partial<RestaurantConfig>): RestaurantConfig {
    configCache = { ...configCache, ...updates };
    safeWriteJSON(CONFIG_FILE, configCache);
    return configCache;
  },
};

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Enable CORS for external previews & clients
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Normalize request URL for serverless / proxy rewrites
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.url.startsWith('/api/') && req.url !== '/api') {
    if (
      req.url.startsWith('/menu') ||
      req.url.startsWith('/orders') ||
      req.url.startsWith('/config') ||
      req.url.startsWith('/auth') ||
      req.url.startsWith('/health') ||
      req.url.startsWith('/admin')
    ) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    }
  }
  next();
});

// Security credentials
const RECEPTIONIST_USER = process.env.RECEPTIONIST_USERNAME || 'admin';
const RECEPTIONIST_PASS = process.env.RECEPTIONIST_PASSWORD || 'sarwan_reception_secure_password';
const SESSION_SECRET = process.env.SESSION_SECRET || 'sarwan-restaurant-internal-session-secret-salt-2026';

// Helper to create and verify signed tokens
function generateToken(username: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = `${username}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [user, expiresAtStr, signature] = decoded.split(':');
    if (!user || !expiresAtStr || !signature) return false;

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return false;

    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`${user}:${expiresAtStr}`)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

// Receptionist Auth Middleware
function requireReceptionist(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : (req.query.token as string | undefined);

  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Unauthorized. Receptionist credentials required.' });
    return;
  }
  next();
}

// Realtime Server-Sent Events (SSE) Hub
const receptionClients = new Set<Response>();

function broadcastToReception(eventType: string, data: any) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of receptionClients) {
    try {
      client.write(payload);
    } catch (err) {
      console.error('Error broadcasting SSE to client:', err);
      receptionClients.delete(client);
    }
  }
}

// Send periodic heartbeat to keep SSE alive
const heartbeatTimer = setInterval(() => {
  for (const client of receptionClients) {
    try {
      client.write(': heartbeat\n\n');
    } catch {
      receptionClients.delete(client);
    }
  }
}, 20000);
if (heartbeatTimer.unref) {
  heartbeatTimer.unref();
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get restaurant configuration
app.get('/api/config', (req: Request, res: Response) => {
  res.json(db.getConfig());
});

// Get menu
app.get('/api/menu', (req: Request, res: Response) => {
  res.json(db.getMenu());
});

// Customer: Place an order
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customerName, phone, address, notes, items } = req.body;

    // Server-side validations
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      res.status(400).json({ error: 'Please enter a valid customer name (at least 2 characters).' });
      return;
    }

    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    if (!phone || cleanPhone.length < 7) {
      res.status(400).json({ error: 'Please enter a valid reachable phone number.' });
      return;
    }

    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      res.status(400).json({ error: 'Please enter a complete delivery address.' });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Order must contain at least one food item.' });
      return;
    }

    // Validate and recalculate subtotal safely from verified item prices
    let subtotal = 0;
    const validatedItems = items.map((it: any) => {
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      const price = Number(it.price) || 0;
      subtotal += price * qty;
      return {
        id: it.id || `oi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        menuItemId: it.menuItemId || '',
        name: String(it.name || 'Food Item'),
        category: String(it.category || 'General'),
        selectedVariantName: it.selectedVariantName ? String(it.selectedVariantName) : undefined,
        price,
        quantity: qty,
      };
    });

    const config = db.getConfig();
    const deliveryFee = config.deliveryFee ?? 150;
    const total = subtotal + deliveryFee;

    const newOrder = db.createOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes ? String(notes).trim() : undefined,
      items: validatedItems,
      subtotal,
      deliveryFee,
      total,
    });

    // Real-time broadcast to all receptionists immediately!
    broadcastToReception('NEW_ORDER', newOrder);

    console.log(`[Order Created] ${newOrder.id} - ${newOrder.customerName} - Rs. ${newOrder.total}`);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to place order. Please try again or call the restaurant directly.' });
  }
});

// Customer: Check status of their specific order
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found. Please verify your order number.' });
    return;
  }
  // Privacy safe: return order information for tracking
  res.json(order);
});

// ==========================================
// RECEPTIONIST AUTH & PROTECTED ROUTES
// ==========================================

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === RECEPTIONIST_USER && password === RECEPTIONIST_PASS) {
    const token = generateToken(username);
    res.json({ success: true, token, username });
  } else {
    res.status(401).json({ error: 'Invalid receptionist username or password.' });
  }
});

// Verify token
app.get('/api/auth/verify', requireReceptionist, (req: Request, res: Response) => {
  res.json({ valid: true, user: RECEPTIONIST_USER });
});

// Receptionist SSE Stream (real-time push)
app.get('/api/realtime/reception', (req: Request, res: Response) => {
  const token = (req.query.token as string | undefined) || req.headers.authorization?.slice(7);
  if (!verifyToken(token)) {
    res.status(401).send('Unauthorized');
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  receptionClients.add(res);

  // Send initial connection confirmation
  res.write(`event: CONNECTED\ndata: ${JSON.stringify({ connected: true, time: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    receptionClients.delete(res);
  });
});

// Receptionist: Get all orders
app.get('/api/admin/orders', requireReceptionist, (req: Request, res: Response) => {
  res.json(db.getOrders());
});

// Receptionist: Update order status
app.patch('/api/admin/orders/:id/status', requireReceptionist, (req: Request, res: Response) => {
  const { status } = req.body as { status: OrderStatus };
  const validStatuses: OrderStatus[] = ['NEW', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid order status provided.' });
    return;
  }

  const updatedOrder = db.updateOrderStatus(req.params.id, status);
  if (!updatedOrder) {
    res.status(404).json({ error: 'Order not found.' });
    return;
  }

  // Notify connected receptionists and tracking clients
  broadcastToReception('ORDER_UPDATED', updatedOrder);

  res.json({ success: true, order: updatedOrder });
});

// Receptionist: Acknowledge high-priority notification
app.patch('/api/admin/orders/:id/acknowledge', requireReceptionist, (req: Request, res: Response) => {
  const order = db.acknowledgeOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found.' });
    return;
  }
  broadcastToReception('ORDER_UPDATED', order);
  res.json({ success: true, order });
});

// Admin: Add Menu Item
app.post('/api/admin/menu', requireReceptionist, (req: Request, res: Response) => {
  try {
    const { name, category, description, price, image, variants, available, isPopular, isSpecial } = req.body;
    if (!name || !category || price === undefined) {
      res.status(400).json({ error: 'Name, category, and price are required.' });
      return;
    }

    const newItem = db.addMenuItem({
      name: String(name).trim(),
      category: String(category).trim(),
      description: String(description || '').trim(),
      price: Number(price),
      image: image || undefined,
      variants: Array.isArray(variants) ? variants : undefined,
      available: available !== false,
      isPopular: Boolean(isPopular),
      isSpecial: Boolean(isSpecial),
    });

    broadcastToReception('MENU_UPDATED', db.getMenu());
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add menu item.' });
  }
});

// Admin: Update Menu Item
app.put('/api/admin/menu/:id', requireReceptionist, (req: Request, res: Response) => {
  const updated = db.updateMenuItem(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Menu item not found.' });
    return;
  }
  broadcastToReception('MENU_UPDATED', db.getMenu());
  res.json({ success: true, item: updated });
});

// Admin: Delete Menu Item
app.delete('/api/admin/menu/:id', requireReceptionist, (req: Request, res: Response) => {
  const success = db.deleteMenuItem(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Menu item not found.' });
    return;
  }
  broadcastToReception('MENU_UPDATED', db.getMenu());
  res.json({ success: true });
});

// Admin: Toggle Menu Item Availability
app.patch('/api/admin/menu/:id/toggle', requireReceptionist, (req: Request, res: Response) => {
  const updated = db.toggleMenuItemAvailability(req.params.id);
  if (!updated) {
    res.status(404).json({ error: 'Menu item not found.' });
    return;
  }
  broadcastToReception('MENU_UPDATED', db.getMenu());
  res.json({ success: true, item: updated });
});

// Admin: Update Restaurant Config
app.patch('/api/admin/config', requireReceptionist, (req: Request, res: Response) => {
  const updated = db.updateConfig(req.body);
  broadcastToReception('CONFIG_UPDATED', updated);
  res.json({ success: true, config: updated });
});

// Explicit 404 handler for unmatched API routes
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'API route not found' });
});

// Static assets serving
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src/assets/images')));
app.use('/assets/images', express.static(path.join(process.cwd(), 'src/assets/images')));

// ==========================================
// VITE DEV & PROD ASSET SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen when running directly in standalone mode (not when imported as a serverless function)
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Sarawan Server listening on http://0.0.0.0:${PORT}`);
    });
  }
}

// Only run standalone Vite dev server or static server when NOT in Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
