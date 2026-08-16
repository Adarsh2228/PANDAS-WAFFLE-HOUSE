'use client';

import { useState } from 'react';
import { MenuItemData, WaffleBaseOption, ToppingOption, useStore } from '@/store/useStore';
import { X, Sparkles, Check, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaffleBuilderModalProps {
  item: MenuItemData;
  onClose: () => void;
}

export default function WaffleBuilderModal({ item, onClose }: WaffleBuilderModalProps) {
  const { addToCart, waffleBases, extraToppings } = useStore();

  const [selectedBase, setSelectedBase] = useState<WaffleBaseOption>(waffleBases[0]);
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [showPeekingPanda, setShowPeekingPanda] = useState(false);

  const unitPrice = item.basePrice + selectedBase.price + selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (topping: ToppingOption) => {
    const exists = selectedToppings.some((t) => t.id === topping.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
      // Trigger cute peeking panda animation
      setShowPeekingPanda(true);
      setTimeout(() => setShowPeekingPanda(false), 2000);
    }
  };

  const handleAdd = () => {
    addToCart({
      cartItemId: Math.random().toString(36).substring(7),
      menuItem: item,
      waffleBase: selectedBase,
      toppings: selectedToppings,
      quantity,
      totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative my-auto border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Dark Chocolate Top Header */}
        <div className="bg-[#4A1E05] text-white p-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-900/60 flex items-center justify-center text-xl border border-amber-700/50">
              🧇
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-none text-amber-50">
                Interactive Waffle Builder
              </h2>
              <p className="text-xs text-amber-200/80 font-medium mt-1">
                {item.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-amber-200 hover:text-white bg-amber-950/60 hover:bg-amber-950 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1 relative">
          {/* Selected Preview Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
            <span className="text-4xl inline-block animate-bounce">{selectedBase.icon}</span>
            <h3 className="font-extrabold text-slate-900 text-base">{selectedBase.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{selectedBase.description}</p>
          </div>

          {/* STEP 1: CHOOSE WAFFLE BASE */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                STEP 1: CHOOSE WAFFLE BASE
              </h4>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                1 Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {waffleBases.map((base) => {
                const isSelected = selectedBase.id === base.id;
                return (
                  <button
                    key={base.id}
                    onClick={() => setSelectedBase(base)}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-[#4A1E05] text-white border-[#4A1E05] shadow-md scale-[1.02]'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{base.icon}</span>
                    <div className="flex-1 pr-6">
                      <p className={`font-black text-xs leading-snug ${isSelected ? 'text-amber-50' : 'text-slate-900'}`}>
                        {base.name}
                      </p>
                      <p className={`text-[11px] font-medium leading-tight mt-0.5 ${isSelected ? 'text-amber-200/80' : 'text-slate-500'}`}>
                        {base.description}
                      </p>
                    </div>

                    <span className={`absolute top-3 right-3 text-xs font-black ${
                      isSelected ? 'text-yellow-300' : 'text-slate-900'
                    }`}>
                      {base.price === 0 ? 'FREE' : `+ ₹${base.price}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: CHOOSE EXTRA TOPPINGS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                STEP 2: CHOOSE EXTRA TOPPINGS (OPTIONAL)
              </h4>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>

            <div className="space-y-2">
              {extraToppings.map((top) => {
                const isChecked = selectedToppings.some((t) => t.id === top.id);
                return (
                  <button
                    key={top.id}
                    onClick={() => toggleTopping(top)}
                    className={`w-full p-3.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-transparent border border-slate-300'
                      }`}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="font-bold text-xs text-slate-800">{top.name}</span>
                    </div>

                    <span className="text-xs font-black text-emerald-800">
                      + ₹{top.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Peeking Panda Animation */}
        <AnimatePresence>
          {showPeekingPanda && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="absolute bottom-20 right-6 z-40 bg-white p-3 rounded-full shadow-2xl border-2 border-emerald-600 flex items-center gap-2"
            >
              <span className="text-3xl">🐼</span>
              <span className="text-xs font-black text-emerald-950 pr-2">Yummy topping added!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Footer */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center gap-3">
          {/* Quantity Pill */}
          <div className="flex items-center gap-3 bg-slate-100 px-3 py-2 rounded-2xl border border-slate-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 text-slate-700 hover:text-slate-950 font-bold"
            >
              <Minus size={16} />
            </button>
            <span className="font-black text-base w-4 text-center text-slate-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-slate-700 hover:text-slate-950 font-bold"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#4A1E05] hover:bg-[#361502] text-white font-extrabold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-between px-5 text-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-300" />
              <span>Add to Order</span>
            </div>
            <span className="font-black text-base text-yellow-300">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
