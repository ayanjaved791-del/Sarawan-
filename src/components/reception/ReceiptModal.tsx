import React from 'react';
import { X, Printer, Phone, MapPin } from 'lucide-react';
import { Order, RestaurantConfig } from '../../types';
import { formatPrice, formatDateTime } from '../../utils/formatters';

interface ReceiptModalProps {
  order: Order | null;
  config: RestaurantConfig;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, config, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Controls (hidden during print) */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Kitchen Ticket & Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Style */}
        <div className="p-6 sm:p-8 font-mono text-xs text-stone-200 print:text-black print:p-4 space-y-4">
          <div className="text-center pb-3 border-b border-dashed border-stone-700 print:border-black space-y-1">
            <h2 className="text-lg font-bold uppercase tracking-wider">{config.name}</h2>
            <p className="text-[10px] text-stone-400 print:text-gray-700">{config.address}</p>
            <p className="text-[10px] text-stone-400 print:text-gray-700">Phone: {config.phone}</p>
          </div>

          <div className="flex justify-between text-[11px] pb-2 border-b border-dashed border-stone-700 print:border-black">
            <div>
              <p className="font-bold text-amber-400 print:text-black">ORDER #{order.id}</p>
              <p className="text-stone-400 print:text-gray-600 text-[10px]">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-stone-800 print:bg-gray-200 font-bold uppercase text-[10px]">
                {order.status}
              </span>
              <p className="text-[10px] text-stone-400 print:text-gray-600 mt-0.5">Payment: COD</p>
            </div>
          </div>

          {/* Customer details */}
          <div className="bg-stone-950/50 print:bg-transparent p-3 rounded-xl border border-stone-800 print:border-black space-y-1 text-[11px]">
            <p className="font-bold text-stone-100 print:text-black">Customer: {order.customerName}</p>
            <p className="text-stone-300 print:text-black">Phone: {order.phone}</p>
            <p className="text-stone-300 print:text-black">Address: {order.address}</p>
            {order.notes && (
              <p className="text-amber-400 print:text-black font-bold pt-1">
                Special Note: {order.notes}
              </p>
            )}
          </div>

          {/* Items table */}
          <div>
            <div className="flex justify-between font-bold pb-1 border-b border-stone-700 print:border-black text-[11px]">
              <span>ITEM</span>
              <span>QTY</span>
              <span>TOTAL</span>
            </div>
            <div className="divide-y divide-stone-800 print:divide-gray-300 py-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between items-start text-[11px]">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-stone-100 print:text-black">{it.name}</p>
                    {it.selectedVariantName && (
                      <p className="text-[10px] text-stone-400 print:text-gray-600">
                        ({it.selectedVariantName})
                      </p>
                    )}
                  </div>
                  <span className="w-10 text-center font-bold">{it.quantity}x</span>
                  <span className="w-16 text-right font-medium">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-dashed border-stone-700 print:border-black space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-stone-700 print:border-black text-amber-400 print:text-black">
              <span>TOTAL (COD):</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="text-center pt-4 text-[10px] text-stone-500 print:text-gray-600">
            <p>Thank you for choosing {config.name}!</p>
            <p>Kitchen Ticket generated for dispatch</p>
          </div>
        </div>

      </div>
    </div>
  );
};
