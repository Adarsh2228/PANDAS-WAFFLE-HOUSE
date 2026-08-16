'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ArrowLeft, Trash2, Leaf, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, bambooPoints, addBambooPoints, redeemBambooPoints } = useStore();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const maxDiscount = isRedeeming ? Math.min(bambooPoints, subtotal) : 0;
  const finalTotal = Math.max(0, subtotal - maxDiscount);

  // Earn 10 points per ₹100 spent on final total
  const pointsEarned = Math.floor(finalTotal / 100) * 10;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) return;

    let message = `🐼 *New Order from ${name}* 🐼\n`;
    message += `📍 Table/Address: ${address}\n\n`;
    
    cart.forEach(item => {
      message += `*${item.quantity}x ${item.menuItem.name}*\n`;
      if (item.toppings.length > 0) {
        message += `   + ${item.toppings.map(t => t.name).join(', ')}\n`;
      }
      message += `   ₹${item.totalPrice}\n\n`;
    });
    
    message += `💰 *Subtotal: ₹${subtotal}*\n`;
    if (isRedeeming) {
      message += `🎋 Redeemed Points: -₹${maxDiscount}\n`;
    }
    message += `💳 *Final Total: ₹${finalTotal}*\n\n`;
    message += `🎁 Earned this order: ${pointsEarned} Bamboo Points`;

    const shopPhone = '1234567890'; // User will replace this
    const encoded = encodeURIComponent(message);
    
    // Update local storage points and cart
    addBambooPoints(pointsEarned);
    if (isRedeeming) redeemBambooPoints(maxDiscount);
    clearCart();

    setOrderSuccess(true);

    setTimeout(() => {
      window.open(`https://wa.me/${shopPhone}?text=${encoded}`, '_blank');
      router.push('/');
    }, 2500);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8 border-4 border-green-500"
        >
          <span className="text-7xl">🛵🐼</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-green-700 mb-4"
        >
          Order Preparing!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-green-800 text-lg mb-8 max-w-xs"
        >
          Redirecting to WhatsApp to complete your order...
        </motion.p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Your Cart</h1>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {cart.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <span className="text-6xl mb-4 grayscale opacity-50 block">🛒</span>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.cartItemId} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-3xl overflow-hidden shrink-0">
                    {item.menuItem.imageUrl ? (
                      <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>🧇</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800 leading-tight pr-2">
                        {item.quantity}x {item.menuItem.name}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {item.toppings.length > 0 && (
                      <p className="text-xs text-slate-500 mb-2">
                        + {item.toppings.map(t => t.name).join(', ')}
                      </p>
                    )}
                    <p className="text-green-600 font-bold">₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bamboo Points */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-green-200 p-2 rounded-full text-green-700">
                  <Leaf size={24} />
                </div>
                <div>
                  <p className="font-bold text-green-900 leading-tight">Bamboo Points</p>
                  <p className="text-sm text-green-700">{bambooPoints} Available</p>
                </div>
              </div>
              {bambooPoints >= 100 && (
                <button
                  onClick={() => setIsRedeeming(!isRedeeming)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    isRedeeming 
                      ? 'bg-green-700 text-white shadow-inner' 
                      : 'bg-green-500 text-white shadow-md hover:bg-green-600'
                  }`}
                >
                  {isRedeeming ? 'Applied!' : 'Redeem'}
                </button>
              )}
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Checkout Details</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Your Name</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., John Doe" 
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Table Number or Address</label>
                  <input 
                    required
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="E.g., Table 5" 
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {isRedeeming && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Points Discount</span>
                    <span>-₹{maxDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-slate-800 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
                <p className="text-xs text-right text-green-600 font-medium">
                  + Earn {pointsEarned} Bamboo Points!
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#25D366] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-[#20bd5a] active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                <Send size={20} /> Order via WhatsApp
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
