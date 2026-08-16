'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore, CartItem } from '@/store/useStore';
import { X, Trash2, MapPin, User, Phone, Send, Minus, Plus, Bike, ShoppingBagIcon, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────── SPARKLE PARTICLE ──────────────────────────── */
interface SparkleProps { x: number; y: number; color: string; size: number; id: number }

function Sparkle({ x, y, color, size }: SparkleProps) {
  return (
    <motion.div
      className="pointer-events-none fixed z-[200]"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 1, rotate: 0 }}
      animate={{ scale: [0, 1.2, 0], opacity: [1, 1, 0], rotate: 180, y: -40 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 Z" />
      </svg>
    </motion.div>
  );
}

function StarBurst({ x, y }: { x: number; y: number }) {
  const colors = ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#EF4444', '#3B82F6'];
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        const dist = 28 + Math.random() * 20;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        return (
          <motion.div
            key={i}
            className="pointer-events-none fixed z-[200] w-2.5 h-2.5 rounded-full"
            style={{ left: x, top: y, background: colors[i % colors.length] }}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ scale: [0, 1, 0], x: dx, y: dy, opacity: [1, 1, 0] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        );
      })}
    </>
  );
}

/* ─────────────────────────── PANDA EATING BAMBOO ───────────────────────── */
function PandaEatingBamboo({ isHappy }: { isHappy: boolean }) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [bambooStage, setBambooStage] = useState(3); // 3 = full, 0 = eaten

  useEffect(() => {
    if (!isHappy) { setBambooStage(3); return; }
    const interval = setInterval(() => {
      setMouthOpen(true);
      setTimeout(() => {
        setMouthOpen(false);
        setBambooStage((s) => Math.max(0, s - 1));
      }, 350);
    }, 700);
    return () => clearInterval(interval);
  }, [isHappy]);

  const bambooSegments = ['🎋', '🎍', '🌿'];

  return (
    <div className="flex items-end gap-3">
      {/* Bamboo being eaten */}
      <div className="flex flex-col items-center gap-0.5 pb-1">
        {bambooSegments.slice(0, bambooStage).map((seg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0 }}
            className="text-xl"
          >
            {seg}
          </motion.div>
        ))}
        {bambooStage === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-black text-emerald-600">
            😋 Yum!
          </motion.div>
        )}
      </div>

      {/* Panda face */}
      <motion.div
        className="relative"
        animate={isHappy ? { rotate: [0, -5, 5, -3, 3, 0] } : {}}
        transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatDelay: 1 }}
      >
        {/* Panda body */}
        <div className="relative w-20 h-20 bg-white rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center overflow-hidden"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 -4px 12px rgba(0,0,0,0.1)' }}
        >
          {/* Panda ears */}
          <div className="absolute -top-3 -left-2 w-6 h-6 bg-slate-900 rounded-full" />
          <div className="absolute -top-3 -right-2 w-6 h-6 bg-slate-900 rounded-full" />

          {/* Eyes */}
          <div className="absolute top-3 flex gap-2">
            <motion.div
              className="w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center"
              animate={mouthOpen ? { scaleY: 0.3 } : { scaleY: 1 }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
            <motion.div
              className="w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center"
              animate={mouthOpen ? { scaleY: 0.3 } : { scaleY: 1 }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          </div>

          {/* Nose */}
          <div className="absolute top-8 w-3 h-2 bg-rose-400 rounded-full" />

          {/* Mouth */}
          <motion.div
            className="absolute top-10 w-6 border-2 border-slate-900 rounded-b-full"
            animate={{ height: mouthOpen ? '10px' : '4px' }}
            transition={{ duration: 0.15 }}
            style={{ background: mouthOpen ? '#1F2937' : 'transparent' }}
          />

          {/* Paw holding bamboo */}
          <motion.div
            className="absolute -right-4 top-8 text-2xl"
            animate={mouthOpen ? { x: -4 } : { x: 0 }}
            transition={{ duration: 0.15 }}
          >
            🐾
          </motion.div>
        </div>

        {/* Cheeks when happy */}
        {isHappy && (
          <>
            <motion.div
              className="absolute top-8 -left-1 w-5 h-3 bg-rose-300 rounded-full opacity-70"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-8 -right-1 w-5 h-3 bg-rose-300 rounded-full opacity-70"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────── FLOATING STARS ────────────────────────────── */
function FloatingStars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${5 + (i * 17) % 90}%`,
            top: `${10 + (i * 23) % 80}%`,
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.2, 0.8, 0.2],
            rotate: [0, 180, 360],
            scale: [0.7, 1.1, 0.7],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeInOut',
          }}
        >
          <svg width={10 + (i % 4) * 4} height={10 + (i % 4) * 4} viewBox="0 0 24 24"
            fill={['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#EF4444'][i % 5]}
          >
            <path d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────── 3D CART ITEM ──────────────────────────────── */
interface CartItemCardProps {
  item: CartItem;
  onUpdate: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onSparkle: (x: number, y: number) => void;
}

interface Topping {
  id: string;
  name: string;
  price: number;
}

function CartItemCard({ item, onUpdate, onRemove, onSparkle }: CartItemCardProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isRemoving, setIsRemoving] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 10, rotateY: x * 10 });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  const handleAdd = (e: React.MouseEvent) => {
    onUpdate(item.cartItemId, 1);
    onSparkle(e.clientX, e.clientY);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.cartItemId), 400);
  };

  const displayName = item.menuItem.name
    .replace(/Sandwich Waffle$/, '')
    .replace(/Belgium Waffle$/, '')
    .replace(/Bowl Cake$/, '')
    .replace(/Pan Cake$/, '')
    .trim();

  return (
    <AnimatePresence>
      {!isRemoving && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.85, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{
            perspective: 800,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer relative"
            style={{
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              transformStyle: 'preserve-3d',
              boxShadow: `${-tilt.rotateY * 0.8}px ${tilt.rotateX * 0.8}px 20px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)`,
              transition: 'box-shadow 0.2s ease',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="h-1 w-full"
              style={{
                background: item.menuItem.category === 'Sandwich Waffle' ? 'linear-gradient(90deg,#D97706,#F59E0B)'
                  : item.menuItem.category === 'Belgium Waffle' ? 'linear-gradient(90deg,#7C3AED,#8B5CF6)'
                    : item.menuItem.category === 'Bowl Cake' ? 'linear-gradient(90deg,#C2410C,#EA580C)'
                      : item.menuItem.category === 'Pan Cake' ? 'linear-gradient(90deg,#DB2777,#EC4899)'
                        : 'linear-gradient(90deg,#059669,#10B981)',
              }}
            />

            <div className="p-4 space-y-2.5">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-1">{displayName}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.menuItem.category}</p>
                </div>
                <motion.span
                  key={item.totalPrice}
                  initial={{ scale: 1.3, color: '#059669' }}
                  animate={{ scale: 1, color: '#0F172A' }}
                  className="font-black text-base whitespace-nowrap"
                >
                  ₹{item.totalPrice}
                </motion.span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                  {item.waffleBase.icon} {item.waffleBase.name}
                </span>
                {item.toppings.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.toppings.map((t: Topping) => (
                      <span key={t.id} className="text-[9px] font-black uppercase tracking-wider bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded-md border border-violet-100">
                        + {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-0 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-inner">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onUpdate(item.cartItemId, -1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors font-black text-lg"
                  >
                    −
                  </motion.button>
                  <motion.span
                    key={item.quantity}
                    initial={{ scale: 1.4, color: '#7C3AED' }}
                    animate={{ scale: 1, color: '#0F172A' }}
                    className="w-8 text-center font-black text-sm"
                  >
                    {item.quantity}
                  </motion.span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleAdd}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-black text-lg"
                  >
                    +
                  </motion.button>
                </div>

                {/* Remove */}
                <motion.button
                  whileTap={{ scale: 0.7, rotate: 15 }}
                  onClick={handleRemove}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <Trash2 size={15} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── MAIN CART DRAWER ──────────────────────────── */
export default function CartDrawer() {
  const {
    cart, orderType, setOrderType,
    deliveryAddress, setDeliveryAddress,
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    bambooPoints, isLoyaltyEnabled, isCartOpen, setIsCartOpen,
    updateQuantity, removeFromCart, clearCart,
    addBambooPoints, redeemBambooPoints, setBambooPoints, placeOrder,
  } = useStore();

  const [isRedeemed, setIsRedeemed] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);
  const sparkleId = useRef(0);

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Instant loyalty reward (only 10 pts max if order >= 100)
  const pointsAvailable = (isLoyaltyEnabled && subtotal >= 100) ? 10 : 0;
  const maxDiscount = Math.floor(pointsAvailable / 2);
  const discount = isLoyaltyEnabled && isRedeemed && pointsAvailable > 0 ? maxDiscount : 0;
  const finalTotal = Math.max(0, subtotal - discount);

  const addSparkle = (x: number, y: number) => {
    const id = sparkleId.current++;
    const newSparkle: SparkleProps = {
      id, x, y,
      color: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#EF4444'][id % 5],
      size: 16 + Math.random() * 12,
    };
    setSparkles((prev) => [...prev, newSparkle]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 1000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let message = `*PANDAS WAFFLE HOUSE*\n`;
    message += `----------------------\n`;
    message += `*ORDER ID: ${orderId}*\n`;
    message += orderType === 'delivery' ? `*TYPE: DOORSTEP DELIVERY*\n` : `*TYPE: STORE PICKUP*\n`;
    message += `----------------------\n\n`;

    message += `*CUSTOMER DETAILS*\n`;
    if (customerName.trim()) message += `Name: ${customerName}\n`;
    if (customerPhone.trim()) message += `Phone: ${customerPhone}\n`;
    if (orderType === 'delivery' && deliveryAddress.trim()) {
      message += `Delivery Address:\n   ${deliveryAddress.replace(/\n/g, '\n   ')}\n`;
    }

    message += `\n*ORDER DETAILS*\n`;
    message += `----------------------\n`;
    cart.forEach((item, i) => {
      message += `*${i + 1}. ${item.menuItem.name}* (x${item.quantity})\n`;
      message += `   Base: ${item.waffleBase.name}\n`;
      
      if (item.toppings.length > 0) {
        message += `   *Additions:*\n`;
        item.toppings.forEach(t => {
          message += `      + ${t.name}\n`;
        });
      }
      message += `----------------------\n`;
    });

    message += `\n*NOTE TO KITCHEN:*\n`;
    message += `Please check the Admin Panel for order ${orderId} to view full billing and payment details.\n\n`;

    message += `Please confirm my order!`;

    const encodedMsg = encodeURIComponent(message);
    const shopPhone = '+918080734313';

    placeOrder({ id: orderId, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), items: [...cart], total: finalTotal, orderType: orderType === 'delivery' ? 'Delivery' : 'Pickup' });

    setOrderSubmitted(true);
    setBurstPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    setTimeout(() => {
      window.open(`https://wa.me/${shopPhone}?text=${encodedMsg}`, '_blank');
      setOrderSubmitted(false);
      setBurstPos(null);
      setIsCartOpen(false);
    }, 2200);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Global sparkle + burst layer */}
      {sparkles.map((s) => <Sparkle key={s.id} {...s} />)}
      {burstPos && <StarBurst x={burstPos.x} y={burstPos.y} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) setIsCartOpen(false); }}
      >
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="bg-[#FDFAF5] w-full max-w-md h-full shadow-2xl flex flex-col relative overflow-hidden"
          style={{ borderLeft: '1px solid rgba(217,119,6,0.2)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Floating stars in background */}
          <FloatingStars />

          {/* ── HEADER ────────────────────────────────────────── */}
          <div
            className="relative shrink-0 px-5 py-4 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #3D1502 0%, #7C2D12 50%, #92400E 100%)' }}
          >
            {/* Header stars */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={{ left: `${10 + i * 15}%`, top: `${15 + (i % 2) * 45}%` }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.6, 1, 0.6], rotate: [0, 180, 360] }}
                transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#FCD34D" opacity="0.6">
                  <path d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 Z" />
                </svg>
              </motion.div>
            ))}

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Animated cart icon */}
                <motion.div
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center text-2xl border border-white/20"
                >
                  🛍️
                </motion.div>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-amber-50 leading-none">Your Order Cart</h2>
                  <p className="text-[11px] text-amber-300/80 font-medium mt-0.5">Pandas Waffle House</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Item count badge */}
                {cart.length > 0 && (
                  <motion.div
                    key={cart.length}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="w-7 h-7 bg-amber-400 text-amber-950 font-black text-xs rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cart.length}
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* ── SCROLLABLE CONTENT ───────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 relative z-10">

            {cart.length === 0 ? (
              /* Empty cart state with panda */
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-center"
                >
                  <div className="text-8xl mb-2">🐼</div>
                  <div className="text-3xl">🎋🎋🎋</div>
                </motion.div>
                <div className="text-center space-y-1">
                  <p className="font-black text-slate-800 text-base">Panda is waiting for your order!</p>
                  <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                    Pick your favourite waffles and customize them with toppings!
                  </p>
                </div>
                {/* Sparkle trail */}
                <div className="flex gap-2">
                  {['✨', '🧇', '⭐', '🍫', '✨'].map((e, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      className="text-xl"
                    >
                      {e}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* ORDER TYPE TOGGLE */}
                <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
                  {[
                    { type: 'delivery', icon: <Bike size={15} />, label: 'Doorstep Delivery' },
                    { type: 'pickup', icon: <ShoppingBagIcon size={15} />, label: 'Store Pickup' },
                  ].map(({ type, icon, label }) => (
                    <motion.button
                      key={type}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setOrderType(type as 'delivery' | 'pickup')}
                      className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all"
                      style={orderType === type
                        ? { background: 'linear-gradient(135deg,#065F46,#059669)', color: 'white', boxShadow: '0 4px 12px rgba(5,150,105,0.35)' }
                        : { color: '#475569' }
                      }
                    >
                      {icon} {label}
                    </motion.button>
                  ))}
                </div>

                {/* PANDA EATING BAMBOO (shows when cart has items) */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100 flex items-center gap-4 overflow-hidden relative">
                  <FloatingStars />
                  <div className="relative z-10 flex-1 min-w-0">
                    <p className="font-black text-emerald-800 text-sm">Panda Chef is ready! 🔥</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart · ₹{subtotal} total</p>
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                    <PandaEatingBamboo isHappy={true} />
                  </div>
                </div>

                {/* CART ITEMS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-500" />
                      ORDER ITEMS ({cart.length})
                    </h3>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={clearCart}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline transition-colors"
                    >
                      Clear All
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {cart.map((item) => (
                      <CartItemCard
                        key={item.cartItemId}
                        item={item}
                        onUpdate={updateQuantity}
                        onRemove={removeFromCart}
                        onSparkle={addSparkle}
                      />
                    ))}
                  </div>
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-amber-100" style={{ background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)' }}>
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <User size={12} /> CUSTOMER DETAILS
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { label: 'Your Name', icon: <User size={13} className="text-amber-700" />, placeholder: 'Pandas Waffle House', value: customerName, onChange: setCustomerName, type: 'text' },
                      { label: 'Phone Number', icon: <Phone size={13} className="text-amber-700" />, placeholder: 'Pandas Waffle House Contact No', value: customerPhone, onChange: setCustomerPhone, type: 'tel' },
                    ].map(({ label, icon, placeholder, value, onChange, type }) => (
                      <div key={label}>
                        <label className="text-[11px] font-black text-slate-600 block mb-1">{label} *</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
                          <input
                            type={type}
                            required
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-slate-50 border border-amber-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                          />
                        </div>
                      </div>
                    ))}

                    {orderType === 'delivery' && (
                      <div>
                        <label className="text-[11px] font-black text-slate-600 block mb-1">Delivery Address & Landmark *</label>
                        <div className="relative">
                          <MapPin size={13} className="absolute left-3 top-3 text-amber-700" />
                          <textarea
                            required
                            rows={2}
                            placeholder="House No, Street, Landmark..."
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full bg-slate-50 border border-amber-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* INSTANT BAMBOO LOYALTY */}
                {isLoyaltyEnabled && pointsAvailable > 0 && (
                  <motion.div
                    className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' }}>
                      <div className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                          className="text-xl"
                        >
                          🎋
                        </motion.span>
                        <div>
                          <h4 className="font-black text-emerald-900 text-[11px] leading-tight">Instant Reward Unlocked!</h4>
                          <p className="text-[10px] font-bold text-emerald-700">You earned {pointsAvailable} Pts</p>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setIsRedeemed(!isRedeemed)}
                        className="text-[11px] font-black px-3 py-1.5 rounded-full border transition-all shadow-sm"
                        style={isRedeemed
                          ? { background: '#065F46', color: 'white', borderColor: '#065F46' }
                          : { background: 'white', color: '#065F46', borderColor: '#059669' }
                        }
                      >
                        {isRedeemed ? `✓ Applied -₹${discount}` : `Redeem (₹${maxDiscount})`}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* PRICE SUMMARY */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-600">
                      <span>Subtotal</span><span>₹{subtotal}</span>
                    </div>
                    {isRedeemed && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="flex justify-between text-sm font-bold text-emerald-600"
                      >
                        <span>🎋 Bamboo Points</span><span>−₹{discount}</span>
                      </motion.div>
                    )}
                    <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-slate-100">
                      <span>Total Payable</span>
                      <motion.span key={finalTotal} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="text-emerald-700">
                        ₹{finalTotal}
                      </motion.span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── ORDER SUBMITTED OVERLAY ──────────────────────── */}
          <AnimatePresence>
            {orderSubmitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #065F46, #047857, #059669)' }}
              >
                {/* Celebration stars */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{ left: `${Math.random() * 90}%`, top: `${Math.random() * 90}%` }}
                      animate={{ y: [-20, -60], opacity: [1, 0], rotate: [0, 360], scale: [0.5, 1.2] }}
                      transition={{ duration: 1.2 + Math.random(), repeat: Infinity, delay: Math.random() * 0.8 }}
                    >
                      <svg width={12 + Math.random() * 12} height={12 + Math.random() * 12} viewBox="0 0 24 24"
                        fill={['#FCD34D', '#F9A8D4', '#C4B5FD', '#6EE7B7'][i % 4]}
                      >
                        <path d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 Z" />
                      </svg>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-5xl mb-5 shadow-2xl"
                >
                  🐼
                </motion.div>

                <motion.div
                  className="text-6xl mb-4"
                  animate={{ x: [-20, 20], transition: { repeat: Infinity, repeatType: "mirror", duration: 0.5 } }}
                >
                  🛵
                </motion.div>

                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-black mb-2"
                >
                  Order Confirmed! 🎉
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-emerald-200 max-w-xs"
                >
                  Opening WhatsApp to send your order... Panda is baking! 🧇✨
                </motion.p>

                {/* Panda eating bamboo in celebration */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="mt-6"
                >
                  <PandaEatingBamboo isHappy={true} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STICKY ORDER BUTTON ──────────────────────────── */}
          {cart.length > 0 && (
            <div className="shrink-0 p-4 bg-white border-t border-slate-100 relative z-10 flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(5,150,105,0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePlaceOrder}
                className="w-full text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2.5 text-sm relative overflow-hidden ripple-btn"
                style={{ background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)' }}
              >
                {/* Animated shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', backgroundSize: '200% 100%' }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Send size={16} />
                  Place Order via WhatsApp
                  <span className="font-black text-emerald-200">(₹{finalTotal})</span>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
                </span>
              </motion.button>

              {/* Discard Order Button */}
              <button
                onClick={() => {
                  clearCart();
                  setIsCartOpen(false);
                }}
                className="w-full py-2 text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> Discard Order
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
