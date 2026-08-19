'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  subtitle?: string;
  badge: string;
  badgeColor: string;
  imageUrl?: string;
  instagramUrl?: string;
  postType: string;
  gradient: string;
  ctaText: string;
  ctaUrl?: string;
  isEnabled: boolean;
  expiresAt?: number;
  createdAt?: number;
}

function useCountdown(expiresAt?: number) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (h > 24) {
        const d = Math.floor(h / 24);
        setTimeLeft(`${d}d ${h % 24}h left`);
      } else if (h > 0) {
        setTimeLeft(`${h}h ${m}m left`);
      } else {
        setTimeLeft(`${m}m ${s}s left`);
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  return timeLeft;
}

function OfferCard({ offer }: { offer: Offer }) {
  const countdown = useCountdown(offer.expiresAt);
  const gradientStyle = `linear-gradient(${offer.gradient})`;
  const isInstagram = offer.postType === 'instagram' && offer.instagramUrl;

  const handleCTA = () => {
    const url = offer.ctaUrl || (isInstagram ? offer.instagramUrl : undefined);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.3 }}
      className="relative flex-shrink-0 w-72 sm:w-80 rounded-3xl overflow-hidden shadow-xl cursor-pointer group select-none"
      onClick={handleCTA}
    >
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ background: gradientStyle }} />

      {/* Cover image */}
      {offer.imageUrl && !isInstagram && (
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
        </div>
      )}

      {/* Instagram preview */}
      {isInstagram && (
        <div className="relative h-44 w-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex flex-col items-center justify-center gap-2 overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #fff 0%, transparent 60%), radial-gradient(circle at 70% 30%, #fff 0%, transparent 60%)' }}
          />
          <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <p className="text-white/90 text-xs font-bold tracking-wide">View on Instagram →</p>
        </div>
      )}

      {/* No image fallback */}
      {!offer.imageUrl && !isInstagram && (
        <div className="relative h-28 flex items-center justify-center">
          <Tag size={36} className="text-white/30" />
        </div>
      )}

      {/* Content */}
      <div className="relative p-5">
        {/* Badge + countdown row */}
        <div className="flex items-center justify-between mb-3">
          <motion.span
            whileHover={{ scale: 1.08 }}
            className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-lg"
            style={{ background: offer.badgeColor, boxShadow: `0 2px 12px ${offer.badgeColor}55` }}
          >
            {offer.badge}
          </motion.span>
          {countdown && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-white/80 bg-black/25 rounded-full px-2.5 py-1 backdrop-blur-sm">
              <Clock size={9} />
              {countdown}
            </span>
          )}
        </div>

        <h3 className="text-white font-black text-base leading-snug line-clamp-2 drop-shadow-sm">{offer.title}</h3>
        {offer.subtitle && (
          <p className="text-white/75 text-xs mt-1.5 leading-relaxed line-clamp-2">{offer.subtitle}</p>
        )}

        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-black text-xs text-white transition-all"
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}
        >
          {offer.ctaText}
          {(offer.ctaUrl || isInstagram) && <ExternalLink size={11} />}
        </motion.div>
      </div>

      {/* Glass shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }}
      />
    </motion.div>
  );
}

export default function LiveOffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/offers?enabled=true', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) setOffers(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    scrollEl?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-72 h-64 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (offers.length === 0) return null;

  return (
    <section className="py-8 relative" id="live-offers-section">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 mb-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              🏷️ <span>Hot Offers &amp; Deals</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Limited time deals — grab them while they last!</p>
          </div>
          {offers.length > 2 && (
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal scroll row */}
        <div
          ref={setScrollEl}
          className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <AnimatePresence>
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ scrollSnapAlign: 'start' }}
              >
                <OfferCard offer={offer} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
