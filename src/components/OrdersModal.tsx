'use client';

import { useStore } from '@/store/useStore';
import { X, Clock, CheckCircle2, Bike, ShoppingBagIcon } from 'lucide-react';

export default function OrdersModal() {
  const { isOrdersOpen, setIsOrdersOpen, ordersHistory } = useStore();

  if (!isOrdersOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl relative border border-slate-100 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-amber-800" />
            <h3 className="text-lg font-extrabold text-slate-900">
              My Online Orders History
            </h3>
          </div>
          <button
            onClick={() => setIsOrdersOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-4 overflow-y-auto space-y-3 flex-1">
          {ordersHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <span className="text-5xl block opacity-40">📜</span>
              <p className="text-sm font-bold text-slate-700">No recent orders found</p>
              <p className="text-xs text-slate-500">Your online delivery & takeaway orders will appear here!</p>
            </div>
          ) : (
            ordersHistory.map((ord) => (
              <div key={ord.id} className="bg-amber-50/50 border border-amber-200/70 p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-amber-950 flex items-center gap-1">
                    {ord.orderType === 'Delivery' ? <Bike size={13} /> : <ShoppingBagIcon size={13} />}
                    {ord.orderType} • Sent to WhatsApp
                  </span>
                  <span className="font-bold text-slate-500">{ord.date}</span>
                </div>

                <div className="space-y-1">
                  {ord.items.map((item) => (
                    <div key={item.cartItemId} className="text-xs flex justify-between text-slate-800">
                      <span className="font-bold">{item.quantity}x {item.menuItem.name}</span>
                      <span className="font-semibold">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-amber-200/50 flex justify-between items-center text-xs font-black text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-800">₹{ord.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
