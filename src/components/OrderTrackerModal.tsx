import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Clock, Phone, MapPin, ChefHat, Bike, CheckCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { Order, OrderStatus, RestaurantConfig } from '../types';
import { formatPrice, formatDateTime } from '../utils/formatters';

interface OrderTrackerModalProps {
  order: Order;
  config: RestaurantConfig;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
  { key: 'NEW', label: 'Order Placed', desc: 'Received at reception desk', icon: Clock },
  { key: 'ACCEPTED', label: 'Order Confirmed', desc: 'Verified by receptionist', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'In Kitchen', desc: 'Cooking fresh over embers', icon: ChefHat },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Rider dispatched to address', icon: Bike },
  { key: 'COMPLETED', label: 'Delivered', desc: 'Enjoy your meal!', icon: CheckCheck },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, config, isOpen, onClose }) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync internal state if prop updates
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  // Poll server for real-time status updates every 5 seconds while open
  useEffect(() => {
    if (!isOpen || !order?.id) return;

    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && data.id) {
            setCurrentOrder(data);
          }
        }
      } catch {}
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, order?.id]);

  if (!isOpen || !currentOrder) return null;

  const currentStatus = currentOrder.status;
  const isCancelled = currentStatus === 'CANCELLED';

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
        return 0;
      case 'ACCEPTED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  const manualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentOrder(data);
      }
    } catch {}
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-600/20 via-stone-900 to-stone-900 border-b border-stone-800 flex items-center justify-between flex-shrink-0">
          <div>
            <span className="inline-block text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full mb-1">
              Live Order Tracking
            </span>
            <h3 className="text-lg sm:text-xl font-sans font-semibold text-stone-100 flex items-center gap-2">
              <span>Order #{currentOrder.id}</span>
              <button
                onClick={manualRefresh}
                title="Refresh latest status"
                aria-label="Refresh latest status"
                className={`text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800/80 transition touch-manipulation ${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white w-11 h-11 flex items-center justify-center rounded-xl hover:bg-stone-800 transition touch-manipulation"
            aria-label="Close tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
          {/* Success Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-300">Order Placed Successfully</h4>
              <p className="text-xs text-emerald-400/80 mt-0.5">
                Saved in Sarawan kitchen dispatch database. Estimated time: {config.estimatedTime}.
              </p>
            </div>
          </div>

          {/* Cancelled Alert if applicable */}
          {isCancelled ? (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-200 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold">This Order Has Been Cancelled</h4>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  Please call the restaurant receptionist at {config.phone} for assistance.
                </p>
              </div>
            </div>
          ) : (
            /* Progress Stepper */
            <div className="py-2">
              <div className="relative border-l-2 border-stone-800 ml-4 pl-6 space-y-6">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-[35px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                          isCurrent
                            ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 border border-stone-800 text-stone-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5
                            className={`text-sm font-semibold ${
                              isCurrent
                                ? 'text-amber-400'
                                : isDone
                                ? 'text-stone-200'
                                : 'text-stone-500'
                            }`}
                          >
                            {step.label}
                          </h5>
                          {isCurrent && (
                            <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full animate-pulse">
                              Current Status
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery & Customer Info */}
          <div className="bg-stone-900/80 rounded-2xl border border-stone-800/80 p-4 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-stone-400 block font-normal">Deliver To:</span>
                <span className="text-stone-100 font-medium">{currentOrder.customerName}</span>
                <p className="text-stone-300 mt-0.5">{currentOrder.address}</p>
                {currentOrder.notes && (
                  <p className="text-amber-400/90 mt-1 italic">Note: "{currentOrder.notes}"</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2 border-t border-stone-800">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-stone-400">Customer Phone: </span>
                <span className="text-stone-200 font-medium">{currentOrder.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2 border-t border-stone-800">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-stone-400">Ordered at: </span>
                <span className="text-stone-200">{formatDateTime(currentOrder.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Ordered Food Items List */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Items Ordered
            </h4>
            <div className="bg-stone-900/60 rounded-2xl border border-stone-800 divide-y divide-stone-800/60 overflow-hidden">
              {currentOrder.items.map((item, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-stone-800 text-amber-400 font-semibold flex items-center justify-center text-[11px]">
                      {item.quantity}x
                    </span>
                    <div>
                      <span className="text-stone-200 font-medium">{item.name}</span>
                      {item.selectedVariantName && (
                        <span className="text-stone-500 block text-[10px]">
                          ({item.selectedVariantName})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-stone-300 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="p-3.5 bg-stone-900/90 space-y-1 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal:</span>
                  <span>{formatPrice(currentOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Delivery:</span>
                  <span>{formatPrice(currentOrder.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-amber-400 pt-1 border-t border-stone-800">
                  <span>Cash on Delivery:</span>
                  <span>{formatPrice(currentOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Restaurant button */}
          <div className="pt-2">
            <a
              href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-700 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Need Help? Call Reception: {config.phone}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
