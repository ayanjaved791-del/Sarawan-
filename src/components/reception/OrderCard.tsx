import React from 'react';
import { Phone, MapPin, Clock, Printer, CheckCircle, ChefHat, Bike, CheckCheck, XCircle, AlertCircle, BellRing } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatPrice, formatDateTime, getRelativeTime } from '../../utils/formatters';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAcknowledge: (orderId: string) => void;
  onPrintReceipt: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  onAcknowledge,
  onPrintReceipt,
}) => {
  const isNewAndUnacknowledged = order.status === 'NEW' && !order.acknowledgedByReception;
  const cleanPhone = order.phone.replace(/[^0-9+]/g, '');

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'ACCEPTED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'PREPARING':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'OUT_FOR_DELIVERY':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'CANCELLED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div
      id={`reception-order-${order.id}`}
      className={`bg-stone-900 rounded-3xl border transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between ${
        isNewAndUnacknowledged
          ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20 animate-pulse'
          : 'border-stone-800 hover:border-stone-700'
      }`}
    >
      {/* Top Banner / Order Info */}
      <div>
        <div className="p-4 sm:p-5 bg-stone-950/60 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-base sm:text-lg font-mono font-bold text-stone-100">
              #{order.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>{getRelativeTime(order.createdAt)}</span>
            </span>
            <button
              onClick={() => onPrintReceipt(order)}
              className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
              title="Print Kitchen Ticket / Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* High Priority Unacknowledged Alert Banner */}
        {isNewAndUnacknowledged && (
          <div className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-stone-950 flex items-center justify-between gap-2 text-xs font-bold">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 animate-bounce" />
              <span>NEW INCOMING ORDER - Awaiting Reception Action</span>
            </div>
            <button
              onClick={() => onAcknowledge(order.id)}
              className="px-2.5 py-1 bg-stone-950 hover:bg-stone-900 text-amber-300 rounded-md text-[11px] font-extrabold uppercase transition"
            >
              Acknowledge Alert
            </button>
          </div>
        )}

        {/* Customer & Address Details */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-stone-100">{order.customerName}</h4>
              <p className="text-xs text-stone-400 mt-0.5">Order Time: {formatDateTime(order.createdAt)}</p>
            </div>

            {/* Click to call button */}
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-semibold border border-stone-700 transition self-start sm:self-auto"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{order.phone}</span>
            </a>
          </div>

          {/* Delivery Address */}
          <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800/80 flex items-start gap-2.5 text-xs text-stone-300">
            <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-semibold text-stone-200">Delivery Address:</span>
              <p className="mt-0.5 text-stone-300 leading-relaxed">{order.address}</p>
              {order.notes && (
                <p className="mt-1.5 text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-[11px]">
                  <strong>Special Instructions:</strong> {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Ordered Food Items List */}
          <div className="mt-4">
            <h5 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Food Items ({order.items.reduce((acc, it) => acc + it.quantity, 0)} pcs):
            </h5>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {order.items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-stone-950/50 border border-stone-800/50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-amber-500/15 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
                      {it.quantity}x
                    </span>
                    <div>
                      <span className="text-stone-200 font-semibold">{it.name}</span>
                      {it.selectedVariantName && (
                        <span className="text-stone-400 text-[10px] ml-1">
                          ({it.selectedVariantName})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-stone-300">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals Bar */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-400">
              Subtotal: {formatPrice(order.subtotal)} + Delivery: {formatPrice(order.deliveryFee)}
            </span>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block uppercase">Total (COD)</span>
              <span className="text-base font-bold text-amber-400 font-mono">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Workflow Buttons */}
      <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {order.status === 'NEW' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}
                className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-98 transition"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Accept Order</span>
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                className="py-2.5 px-3 bg-stone-800 hover:bg-rose-950 hover:text-rose-300 text-stone-400 rounded-xl text-xs font-semibold border border-stone-700 transition"
              >
                Cancel
              </button>
            </>
          )}

          {order.status === 'ACCEPTED' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-98 transition"
              >
                <ChefHat className="w-4 h-4" />
                <span>Start Preparing</span>
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                className="py-2.5 px-3 bg-stone-800 hover:bg-rose-950 hover:text-rose-300 text-stone-400 rounded-xl text-xs font-semibold border border-stone-700 transition"
              >
                Cancel
              </button>
            </>
          )}

          {order.status === 'PREPARING' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                className="flex-1 py-2.5 px-3 bg-orange-500 hover:bg-orange-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-98 transition"
              >
                <Bike className="w-4 h-4" />
                <span>Out for Delivery</span>
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                className="py-2.5 px-3 bg-stone-800 hover:bg-rose-950 hover:text-rose-300 text-stone-400 rounded-xl text-xs font-semibold border border-stone-700 transition"
              >
                Cancel
              </button>
            </>
          )}

          {order.status === 'OUT_FOR_DELIVERY' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-98 transition"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Complete Order (Delivered & Paid)</span>
            </button>
          )}

          {order.status === 'COMPLETED' && (
            <div className="w-full py-2 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
              <CheckCheck className="w-4 h-4" />
              <span>Order Fulfilled & Closed</span>
            </div>
          )}

          {order.status === 'CANCELLED' && (
            <div className="w-full py-2 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Order Cancelled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
