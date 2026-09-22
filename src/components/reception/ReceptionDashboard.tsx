import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  BellOff,
  RefreshCw,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  CheckCheck,
  XCircle,
  Volume2,
  VolumeX,
  Store,
  UtensilsCrossed,
  ShieldCheck,
  Sliders,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { Order, OrderStatus, MenuItem, RestaurantConfig } from '../../types';
import { OrderCard } from './OrderCard';
import { AdminMenuManager } from './AdminMenuManager';
import { SarawanLogo } from '../SarawanLogo';
import { ReceiptModal } from './ReceiptModal';
import { playNewOrderChime, playConfirmationTone } from '../../utils/audio';
import { formatPrice } from '../../utils/formatters';

interface ReceptionDashboardProps {
  authToken: string;
  username: string;
  config: RestaurantConfig;
  menuItems: MenuItem[];
  categories: string[];
  onLogout: () => void;
  onBackToWebsite: () => void;
  onRefreshMenu: () => void;
}

type TabType = 'orders' | 'menu' | 'settings';

export const ReceptionDashboard: React.FC<ReceptionDashboardProps> = ({
  authToken,
  username,
  config,
  menuItems,
  categories,
  onLogout,
  onBackToWebsite,
  onRefreshMenu,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  // SSE real-time state
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);

  // New incoming order notification banner
  const [incomingAlertOrder, setIncomingAlertOrder] = useState<Order | null>(null);

  // Receipt printing modal
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Store config editing
  const [storePhone, setStorePhone] = useState(config.phone);
  const [storeDeliveryFee, setStoreDeliveryFee] = useState(config.deliveryFee);
  const [storeEstimatedTime, setStoreEstimatedTime] = useState(config.estimatedTime);
  const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial orders
  const fetchOrders = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else if (res.status === 401) {
        onLogout();
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [authToken]);

  // Setup Server-Sent Events (SSE) connection
  useEffect(() => {
    let reconnectTimeout: any;

    const connectSSE = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const sseUrl = `/api/realtime/reception?token=${encodeURIComponent(authToken)}`;
      const es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
      };

      // Handle custom events
      es.addEventListener('NEW_ORDER', (e: MessageEvent) => {
        try {
          const newOrder: Order = JSON.parse(e.data);
          // Play notification chime
          if (soundEnabled) {
            playNewOrderChime();
          }

          // Trigger high-visibility toast banner
          setIncomingAlertOrder(newOrder);

          // Prepend to orders list if not already present
          setOrders((prev) => {
            if (prev.some((o) => o.id === newOrder.id)) return prev;
            return [newOrder, ...prev];
          });
        } catch (err) {
          console.error('Failed to process NEW_ORDER event:', err);
        }
      });

      es.addEventListener('ORDER_UPDATED', (e: MessageEvent) => {
        try {
          const updatedOrder: Order = JSON.parse(e.data);
          setOrders((prev) =>
            prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
          );
        } catch (err) {
          console.error('Failed to process ORDER_UPDATED event:', err);
        }
      });

      es.addEventListener('MENU_UPDATED', () => {
        onRefreshMenu();
      });

      es.onerror = () => {
        setIsConnected(false);
        es.close();
        // Exponential backoff reconnect
        reconnectTimeout = setTimeout(() => {
          setReconnectCount((c) => c + 1);
        }, 4000);
      };
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [authToken, reconnectCount, soundEnabled]);

  // Update order status action
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      playConfirmationTone();
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (incomingAlertOrder?.id === orderId) {
          setIncomingAlertOrder(null);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Acknowledge order alert
  const handleAcknowledge = async (orderId: string) => {
    try {
      playConfirmationTone();
      const res = await fetch(`/api/admin/orders/${orderId}/acknowledge`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (incomingAlertOrder?.id === orderId) {
          setIncomingAlertOrder(null);
        }
      }
    } catch {}
  };

  // Save restaurant config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingConfig(true);
    setConfigSuccess(false);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          phone: storePhone,
          deliveryFee: Number(storeDeliveryFee),
          estimatedTime: storeEstimatedTime,
        }),
      });
      if (res.ok) {
        setConfigSuccess(true);
        setTimeout(() => setConfigSuccess(false), 4000);
      }
    } catch {
    } finally {
      setIsUpdatingConfig(false);
    }
  };

  // Filter calculations
  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;
  const preparingCount = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING').length;
  const outCount = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'PREPARING'
        ? order.status === 'PREPARING' || order.status === 'ACCEPTED'
        : order.status === statusFilter;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query) ||
      order.address.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      
      {/* Top Receptionist Command Bar */}
      <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand & Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
              title="Return to Customer Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <SarawanLogo size="sm" rounded="xl" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-sans font-bold text-stone-100 tracking-tight">
                  Sarawan Reception
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Kitchen Dispatch
                </span>
              </div>
              <span className="text-[11px] text-stone-400 block font-mono">
                Operator: {username}
              </span>
            </div>
          </div>

          {/* Connection status pill, sound bell, actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Real-time connection badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isConnected
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-800 text-amber-300 animate-pulse'
              }`}
              title={isConnected ? 'Live Real-time SSE Connected' : 'Reconnecting to Server...'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="hidden md:inline">
                {isConnected ? 'Realtime Live' : 'Reconnecting...'}
              </span>
            </div>

            {/* Test Audio Chime & Mute Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playNewOrderChime();
              }}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                soundEnabled
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
              title={soundEnabled ? 'Order notification chime is ON. Click to mute.' : 'Sound is OFF. Click to enable.'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden lg:inline text-xs">
                {soundEnabled ? 'Bell On' : 'Muted'}
              </span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchOrders(false)}
              disabled={isRefreshing}
              className="p-2 text-stone-300 hover:text-white bg-stone-800 rounded-xl border border-stone-700 transition"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 text-stone-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-xl border border-transparent hover:border-rose-800 transition"
              title="Logout from Reception Desk"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Persistent Floating Notification for Incoming Order */}
      {incomingAlertOrder && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-stone-950 px-4 py-3 shadow-2xl border-b-2 border-stone-950 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide">
                🔥 NEW ORDER RECEIVED: #{incomingAlertOrder.id} — {incomingAlertOrder.customerName}
              </p>
              <p className="text-xs font-semibold text-stone-900">
                Phone: {incomingAlertOrder.phone} • Total: {formatPrice(incomingAlertOrder.total)} •{' '}
                {incomingAlertOrder.items.length} items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAcknowledge(incomingAlertOrder.id)}
              className="px-4 py-2 bg-stone-950 hover:bg-stone-900 text-amber-300 font-extrabold rounded-xl text-xs uppercase shadow transition"
            >
              Acknowledge Alert
            </button>
            <button
              onClick={() => handleUpdateStatus(incomingAlertOrder.id, 'ACCEPTED')}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-950 font-extrabold rounded-xl text-xs uppercase shadow transition"
            >
              Accept & Start
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs (Orders / Menu / Settings) */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition touch-manipulation ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-white bg-stone-900 border border-stone-800'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Incoming Orders</span>
              {newOrdersCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  {newOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition touch-manipulation ${
                activeTab === 'menu'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-white bg-stone-900 border border-stone-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Menu & Prices ({menuItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition touch-manipulation ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-white bg-stone-900 border border-stone-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Store Settings</span>
            </button>
          </div>

          <div className="text-xs text-stone-400 flex items-center gap-2 font-mono">
            <span>Total Orders Logged: <strong>{orders.length}</strong></span>
          </div>
        </div>

        {/* Tab 1: Orders Pipeline View */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Status Filter Tabs & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Status Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    statusFilter === 'ALL'
                      ? 'bg-stone-200 text-stone-950'
                      : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'
                  }`}
                >
                  All ({orders.length})
                </button>

                <button
                  onClick={() => setStatusFilter('NEW')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    statusFilter === 'NEW'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'bg-stone-900 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>NEW ORDERS ({newOrdersCount})</span>
                </button>

                <button
                  onClick={() => setStatusFilter('PREPARING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    statusFilter === 'PREPARING'
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-900 text-purple-300 border border-purple-800/40'
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>PREPARING ({preparingCount})</span>
                </button>

                <button
                  onClick={() => setStatusFilter('OUT_FOR_DELIVERY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    statusFilter === 'OUT_FOR_DELIVERY'
                      ? 'bg-orange-500 text-stone-950'
                      : 'bg-stone-900 text-orange-300 border border-orange-800/40'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>OUT FOR DELIVERY ({outCount})</span>
                </button>

                <button
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    statusFilter === 'COMPLETED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 text-emerald-400 border border-emerald-800/40'
                  }`}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>COMPLETED</span>
                </button>

                <button
                  onClick={() => setStatusFilter('CANCELLED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    statusFilter === 'CANCELLED'
                      ? 'bg-rose-700 text-white'
                      : 'bg-stone-900 text-rose-400 border border-rose-800/40'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>CANCELLED</span>
                </button>
              </div>

              {/* Search Order */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID, phone, customer..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

            </div>

            {/* Empty state */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-20 bg-stone-900/40 border border-stone-800 rounded-3xl p-8">
                <Clock className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-300">No Orders in this view</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Orders placed by customers on the website will automatically appear here in real time.
                </p>
              </div>
            )}

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  onAcknowledge={handleAcknowledge}
                  onPrintReceipt={(o) => setReceiptOrder(o)}
                />
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Admin Menu Management */}
        {activeTab === 'menu' && (
          <AdminMenuManager
            menuItems={menuItems}
            categories={categories}
            authToken={authToken}
            onRefreshMenu={onRefreshMenu}
          />
        )}

        {/* Tab 3: Store Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-sans font-bold text-stone-100">Restaurant Settings</h3>
              <p className="text-xs text-stone-400 mt-1">
                Configure delivery rates, estimated preparation time, and official customer helpline.
              </p>
            </div>

            {configSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                Settings updated successfully and applied to the website!
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Official Reception / Delivery Phone
                </label>
                <input
                  type="text"
                  required
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Standard Delivery Fee (Rs.)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={storeDeliveryFee}
                    onChange={(e) => setStoreDeliveryFee(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Estimated Delivery Time
                  </label>
                  <input
                    type="text"
                    required
                    value={storeEstimatedTime}
                    onChange={(e) => setStoreEstimatedTime(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdatingConfig}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm shadow-md transition"
                >
                  {isUpdatingConfig ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        config={config}
        onClose={() => setReceiptOrder(null)}
      />

    </div>
  );
};
