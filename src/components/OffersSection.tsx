'use client';

import { useRef, useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { MenuItemData, useStore } from '@/store/useStore';

interface OffersSectionProps {
  onOpenCustomize: (item: MenuItemData) => void;
}

const COMBO_STYLES = [
  { emoji: '💑', color: '#DB2777', bg: 'from-pink-500 to-rose-600', bgLight: '#FDF2F8' },
  { emoji: '🎉', color: '#7C3AED', bg: 'from-violet-500 to-purple-700', bgLight: '#F5F3FF' },
  { emoji: '⚡', color: '#D97706', bg: 'from-amber-500 to-orange-600', bgLight: '#FFFBEB' },
  { emoji: '🐼', color: '#059669', bg: 'from-emerald-500 to-green-600', bgLight: '#ECFDF5' },
];

export default function OffersSection({ onOpenCustomize }: OffersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { menuItems, productVisibility } = useStore();

  const offers = (menuItems || []).filter((i) => i.category === 'Offers' && (productVisibility[i.id] ?? (i.isEnabled !== false)));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle featured offer
  useEffect(() => {
    if (offers.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [offers.length]);

  if (offers.length === 0) return null;

  const featured = offers[activeIndex];
  const featuredStyle = COMBO_STYLES[activeIndex % COMBO_STYLES.length];

  return (
    <section
      ref={sectionRef}
      id="section-offers"
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
          🏷️
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-red-600 leading-tight">Offers & Combos</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Best value deals, specially curated for you</p>
        </div>
        <div className="ml-auto text-4xl panda-float hidden sm:block">🐼</div>
      </div>

      {/* Featured Offer Banner — auto-cycling */}
      <div
        className={`relative rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden transition-all duration-500 text-white`}
        style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}
      >
        <div
          className="absolute inset-0 rounded-3xl transition-all duration-700"
          style={{ background: `linear-gradient(135deg, ${featuredStyle.color}dd, ${featuredStyle.color}99)` }}
        />
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl">{featuredStyle.emoji}</span>
              <div>
                <div className="text-xs font-black uppercase tracking-widest opacity-75 mb-0.5">🔥 Special Deal</div>
                <h3 className="text-2xl font-black">{featured.name}</h3>
              </div>
            </div>
            <p className="text-white/80 font-medium mb-3">{featured.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black">₹{featured.basePrice}/-</span>
            </div>
          </div>
          <div className="text-7xl sm:text-8xl panda-float">🐼</div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {offers.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: i === activeIndex ? 'white' : 'rgba(255,255,255,0.4)', width: i === activeIndex ? '20px' : '8px' }}
            />
          ))}
        </div>
      </div>

      {/* Combo Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {offers.map((offer, idx) => {
          const style = COMBO_STYLES[idx % COMBO_STYLES.length];
          return (
            <div
              key={offer.id}
              className="relative rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer animate-scale-in"
              style={{
                background: style.bgLight,
                borderColor: style.color + '44',
                animationDelay: `${idx * 100}ms`,
              }}
              onClick={() => onOpenCustomize(offer)}
            >
              {/* Color top strip */}
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${style.color}, ${style.color}88)` }} />

              <div className="p-5 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${style.color}, ${style.color}99)` }}
                >
                  {style.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 text-base leading-snug">{offer.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">{offer.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-black text-lg" style={{ color: style.color }}>₹{offer.basePrice}/-</span>
                  </div>
                </div>
                <button
                  className="ripple-btn text-white text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1 flex-shrink-0 active:scale-95 transition-all"
                  style={{ background: style.color }}
                >
                  <ShoppingCart size={13} />
                  Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
