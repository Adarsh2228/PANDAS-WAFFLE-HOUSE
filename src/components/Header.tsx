'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ShoppingBag, Bike, ShoppingBagIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import StoriesViewer from './StoriesViewer';

const NAV_LINKS = [
  { href: '/',       label: 'Home',    emoji: '🏠', color: '#059669', bg: 'from-emerald-500 to-green-600' },
  { href: '/offers', label: 'Offers',  emoji: '🏷️', color: '#DC2626', bg: 'from-red-500 to-rose-600' },
  { href: '/trends', label: 'Trends',  emoji: '🔥', color: '#EA580C', bg: 'from-orange-500 to-red-500' },
  { href: '/blogs',  label: 'Blogs',   emoji: '📖', color: '#0D9488', bg: 'from-teal-500 to-cyan-600' },
];

export default function Header() {
  const { orderType, setOrderType, cart, setIsCartOpen, stories } = useStore();
  const pathname  = usePathname();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: 'rgba(255,251,242,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(217,119,6,0.15)' }}>
      {/* Top accent stripe */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,#065F46,#D97706,#DC2626,#7C3AED,#065F46)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">

        {/* ── LEFT: Brand & Stories ─────────────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="relative w-12 h-12 rounded-full shrink-0 overflow-hidden shadow-lg border-[3px] border-emerald-300"
            >
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
                style={{ borderRadius: '50%' }}
              />
            </motion.div>
          </Link>

          <Link href="/" className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg font-black tracking-tight leading-none"
                style={{ background: 'linear-gradient(135deg,#065F46,#D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                PANDAS WAFFLE HOUSE
              </h1>
            </div>
            <p className="text-[10px] font-bold text-amber-700/80 mt-0.5 tracking-wide hover:underline cursor-pointer">
              🧇 Fresh Waffles · Bowls · Pan Cakes
            </p>
          </Link>
        </div>

        {/* ── CENTER: Nav Links (desktop) ──────────────────── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black transition-all duration-200 group"
                style={isActive
                  ? { background: `linear-gradient(135deg,${link.color}22,${link.color}11)`, color: link.color, boxShadow: `0 0 0 2px ${link.color}44` }
                  : { color: '#64748B' }
                }
              >
                <motion.span
                  whileHover={{ scale: 1.2, rotate: link.emoji === '🔥' ? [0, -10, 10, 0] : 0 }}
                  className="text-base leading-none"
                >
                  {link.emoji}
                </motion.span>
                <span className="group-hover:text-slate-900 transition-colors" style={isActive ? { color: link.color } : {}}>
                  {link.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full"
                    style={{ background: link.color }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── CENTER: Delivery toggle (desktop) ────────────── */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
          {[
            { type: 'delivery', icon: <Bike size={13}/>, label: 'Delivery' },
            { type: 'pickup',   icon: <ShoppingBagIcon size={13}/>, label: 'Pickup' },
          ].map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => setOrderType(type as 'delivery' | 'pickup')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all"
              style={orderType === type
                ? { background: 'linear-gradient(135deg,#065F46,#059669)', color: 'white', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }
                : { color: '#475569' }
              }
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ── RIGHT: Cart + Hamburger ───────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cart button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 text-white font-black text-sm px-4 py-2.5 rounded-full shadow-lg"
            style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}
            aria-label="View Cart"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {totalCartCount > 0 && (
                <motion.span
                  key={totalCartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 text-[11px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#1C1917' }}
                >
                  {totalCartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 flex flex-col gap-1">
              <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }} className="h-0.5 bg-slate-700 rounded-full" />
              <motion.div animate={{ opacity: menuOpen ? 0 : 1 }} className="h-0.5 bg-slate-700 rounded-full" />
              <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }} className="h-0.5 bg-slate-700 rounded-full" />
            </div>
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-amber-100"
            style={{ background: 'rgba(255,251,242,0.98)' }}
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all"
                  style={{ background: `linear-gradient(135deg,${link.color}12,${link.color}06)`, color: link.color, border: `1px solid ${link.color}22` }}
                >
                  <span className="text-xl">{link.emoji}</span>
                  {link.label}
                </Link>
              ))}
              {/* Mobile delivery toggle */}
              <div className="flex gap-2 pt-1">
                {[
                  { type: 'delivery', icon: <Bike size={13}/>, label: 'Delivery' },
                  { type: 'pickup', icon: <ShoppingBagIcon size={13}/>, label: 'Pickup' },
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => { setOrderType(type as 'delivery' | 'pickup'); setMenuOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black border transition-all"
                    style={orderType === type
                      ? { background: '#065F46', color: 'white', borderColor: '#065F46' }
                      : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }
                    }
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
