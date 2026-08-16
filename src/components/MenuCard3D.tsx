'use client';

import { useState } from 'react';
import { Star, ShoppingCart, Flame, Tag } from 'lucide-react';
import { MenuItemData } from '@/store/useStore';

interface MenuCard3DProps {
  item: MenuItemData;
  accentColor: string;
  accentBg: string;
  onOpenDetail: (item: MenuItemData) => void;
  onOpenCustomize: (item: MenuItemData) => void;
  animationDelay?: number;
}

function PriceDisplay({ item }: { item: MenuItemData }) {
  if (item.priceSmall && item.priceBig) {
    return (
      <div className="flex items-end gap-1.5">
        <div className="text-center">
          <span className="text-[9px] font-bold uppercase text-slate-400 block leading-none mb-0.5">Small</span>
          <span className="text-base font-black text-slate-900 leading-none">₹{item.priceSmall}</span>
        </div>
        <span className="text-slate-300 font-light mb-0.5">|</span>
        <div className="text-center">
          <span className="text-[9px] font-bold uppercase text-slate-400 block leading-none mb-0.5">Big</span>
          <span className="text-base font-black text-slate-900 leading-none">₹{item.priceBig}</span>
        </div>
      </div>
    );
  }
  if (item.price5pc && item.price10pc) {
    return (
      <div className="flex items-end gap-1.5">
        <div className="text-center">
          <span className="text-[9px] font-bold uppercase text-slate-400 block leading-none mb-0.5">5 PC</span>
          <span className="text-base font-black text-slate-900 leading-none">₹{item.price5pc}</span>
        </div>
        <span className="text-slate-300 font-light mb-0.5">|</span>
        <div className="text-center">
          <span className="text-[9px] font-bold uppercase text-slate-400 block leading-none mb-0.5">10 PC</span>
          <span className="text-base font-black text-slate-900 leading-none">₹{item.price10pc}</span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <span className="text-[9px] font-bold uppercase text-slate-400 block leading-none mb-0.5">Price</span>
      <span className="text-xl font-black text-slate-900 leading-none">₹{item.basePrice}</span>
    </div>
  );
}

export default function MenuCard3D({
  item,
  accentColor,
  accentBg,
  onOpenDetail,
  onOpenCustomize,
  animationDelay = 0,
}: MenuCard3DProps) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.02)`,
      boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(0,0,0,0.18)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease',
    });
  };

  const displayName = item.name
    .replace(/Sandwich Waffle$/, '')
    .replace(/Belgium Waffle$/, '')
    .replace(/Bowl Cake$/, '')
    .replace(/Pan Cake$/, '')
    .trim();

  return (
    <div
      className="animate-scale-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden cursor-pointer relative group"
        style={{
          ...tiltStyle,
          transition: tiltStyle.transition || 'transform 0.15s ease, box-shadow 0.15s ease',
          transformStyle: 'preserve-3d',
          boxShadow: tiltStyle.boxShadow || '0 4px 16px rgba(0,0,0,0.08)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onOpenDetail(item)}
      >
        {/* Shine overlay */}
        <div className="card-shine absolute inset-0 z-10 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%)',
          }}
        />

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Category color top bar */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accentColor }} />

          {/* Trending badge */}
          {item.isTrending && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-full shadow-lg">
              <Flame size={10} className="flame-icon" />
              Hot
            </div>
          )}

          {/* Offer badge */}
          {item.isOffer && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-full shadow-lg border border-red-400 offer-border">
              <Tag size={10} />
              Combo Deal
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute bottom-3 left-3 glass text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
            <span className="text-slate-400 font-normal">({item.reviewCount})</span>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }}
          />
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Category pill */}
          <div
            className="inline-flex items-center text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
            style={{ background: accentBg, color: accentColor }}
          >
            {item.category}
          </div>

          <h3 className="font-extrabold text-slate-900 text-[15px] leading-snug mb-1 line-clamp-1">
            {displayName}
          </h3>

          {item.subtitle && (
            <p className="text-[10px] text-slate-400 font-medium mb-1.5 line-clamp-1 italic">
              {item.subtitle}
            </p>
          )}

          <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <PriceDisplay item={item} />

            <button
              onClick={(e) => { e.stopPropagation(); onOpenCustomize(item); }}
              className="ripple-btn flex items-center gap-1.5 text-white text-xs font-black px-3.5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
            >
              <ShoppingCart size={13} />
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
