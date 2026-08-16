'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Plus, Minus, Check } from 'lucide-react';
import type { MenuItem, Review, Topping } from '@prisma/client';
import { useStore, WaffleBaseOption, ToppingOption } from '@/store/useStore';

type MenuItemWithReviews = MenuItem & { reviews: Review[] };

interface ItemDetailClientProps {
  menuItem: MenuItemWithReviews;
  toppings?: Topping[]; // Ignored, we use store toppings now
}

export default function ItemDetailClient({ menuItem }: ItemDetailClientProps) {
  const router = useRouter();
  const { addToCart, waffleBases, extraToppings } = useStore();
  
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedBase, setSelectedBase] = useState<WaffleBaseOption>(waffleBases[0]);
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [showPeekingPanda, setShowPeekingPanda] = useState(false);

  // Calculate rating
  const avgRating = menuItem.reviews.length
    ? (menuItem.reviews.reduce((acc, r) => acc + r.rating, 0) / menuItem.reviews.length).toFixed(1)
    : 'New';

  const totalPrice = (menuItem.basePrice + (selectedBase?.price || 0) + selectedToppings.reduce((sum, t) => sum + t.price, 0)) * quantity;

  const handleAddTopping = (topping: ToppingOption) => {
    const isSelected = selectedToppings.find(t => t.id === topping.id);
    if (isSelected) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
      // Trigger peeking panda
      setShowPeekingPanda(false); // Reset animation if re-triggered quickly
      setTimeout(() => setShowPeekingPanda(true), 10);
      setTimeout(() => setShowPeekingPanda(false), 2000);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      cartItemId: Math.random().toString(36).substring(7),
      menuItem: menuItem as any,
      waffleBase: selectedBase,
      toppings: selectedToppings as any,
      quantity,
      totalPrice,
    });
    router.push('/cart');
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24 relative overflow-hidden">
      {/* Header Image & Back Button */}
      <div className="relative h-72 bg-slate-200">
        <button 
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm text-slate-800 hover:bg-white"
        >
          <ArrowLeft size={24} />
        </button>
        {menuItem.imageUrl ? (
          <img src={menuItem.imageUrl} alt={menuItem.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl text-slate-300">🧇</div>
        )}
      </div>

      {/* Body content */}
      <div className="p-5 -mt-6 relative bg-slate-50 rounded-t-3xl border-t border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-extrabold text-slate-800 leading-tight">{menuItem.name}</h1>
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-bold shadow-sm">
            <Star size={14} fill="currentColor" /> {avgRating}
          </div>
        </div>
        
        <p className="text-green-600 font-black text-xl mb-4">₹{menuItem.basePrice}</p>
        
        <p className="text-slate-600 leading-relaxed mb-8">{menuItem.description}</p>

        {/* Reviews Section */}
        {menuItem.reviews.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-slate-800 mb-3 text-lg">Reviews</h3>
            <div className="space-y-3">
              {menuItem.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex text-yellow-400 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 pb-safe">
        <button 
          onClick={() => setIsBuilderOpen(true)}
          className="w-full bg-green-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-green-600 active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          Customize & Order
        </button>
      </div>

      {/* Waffle Builder Modal */}
      <AnimatePresence>
        {isBuilderOpen && (
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-white h-[85vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden relative">
              <div className="p-4 flex justify-between items-center border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Waffle Builder 🎨</h2>
                <button 
                  onClick={() => setIsBuilderOpen(false)}
                  className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200"
                >
                  <ArrowLeft size={20} className="rotate-180" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 pb-32">
                <div className="aspect-video bg-amber-50 rounded-2xl border-2 border-amber-200 mb-6 flex items-center justify-center relative overflow-hidden">
                   {/* Dummy visual waffle representation */}
                   <span className="text-6xl z-10">🧇</span>
                   {selectedToppings.length > 0 && (
                     <div className="absolute inset-0 flex flex-wrap items-center justify-center opacity-70">
                       {selectedToppings.map(t => <span key={t.id} className="text-2xl m-1">✨</span>)}
                     </div>
                   )}
                </div>

                {/* Base Selection */}
                <h3 className="font-bold text-slate-800 mb-3">Choose Waffle Base</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {waffleBases.map((base) => {
                    const isSelected = selectedBase?.id === base.id;
                    return (
                      <button
                        key={base.id}
                        onClick={() => setSelectedBase(base)}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all flex items-start gap-3 relative ${
                          isSelected
                            ? 'bg-[#4A1E05] text-white border-[#4A1E05] shadow-md'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
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
                        <span className={`absolute top-3 right-3 text-xs font-black ${isSelected ? 'text-yellow-300' : 'text-slate-900'}`}>
                          {base.price === 0 ? 'FREE' : `+ ₹${base.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <h3 className="font-bold text-slate-800 mb-3">Add Toppings</h3>
                <div className="space-y-3">
                  {extraToppings.map(topping => {
                    const isSelected = selectedToppings.some(t => t.id === topping.id);
                    return (
                      <button
                        key={topping.id}
                        onClick={() => handleAddTopping(topping)}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-all ${
                          isSelected ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-green-500 text-white' : 'bg-slate-100 text-transparent'}`}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <span className="font-semibold text-slate-700">{topping.name}</span>
                        </div>
                        <span className="text-green-600 font-bold">+₹{topping.price}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Builder Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-slate-600 hover:text-slate-900"><Minus size={20}/></button>
                  <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-slate-600 hover:text-slate-900"><Plus size={20}/></button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="bg-green-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all flex items-center gap-2"
                >
                  Add <span className="font-normal opacity-80">|</span> ₹{totalPrice}
                </button>
              </div>

              {/* Peeking Panda Animation */}
              <AnimatePresence>
                {showPeekingPanda && (
                  <motion.div
                    initial={{ y: 100, x: 50, rotate: 10 }}
                    animate={{ y: 0, x: 0, rotate: -5 }}
                    exit={{ y: 100, rotate: 10 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="absolute -bottom-4 right-4 z-50 pointer-events-none drop-shadow-xl"
                  >
                    {/* Placeholder for real Lottie Panda */}
                    <div className="w-24 h-24 bg-white rounded-t-full rounded-bl-full flex items-center justify-center border-4 border-slate-800">
                      <span className="text-5xl">🐼</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
