'use client';

import { MenuItemData } from '@/store/useStore';
import { Star, Clock, Sparkles } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItemData;
  onOpenDetail: (item: MenuItemData) => void;
  onOpenCustomize: (item: MenuItemData) => void;
}

export default function MenuItemCard({ item, onOpenDetail, onOpenCustomize }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image & Overlaid Badges */}
      <div 
        onClick={() => onOpenDetail(item)}
        className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top-Left Category/Trending Badge */}
        {item.isTrending && (
          <div className="absolute top-3 left-3 bg-[#EA580C] text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
            🔥 TRENDING
          </div>
        )}

        {/* Bottom Image Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Rating Badge */}
          <div className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>{item.rating} ({item.reviewCount})</span>
          </div>

          {/* Prep Time Badge */}
          <div className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Clock size={12} className="text-amber-800" />
            <span>{item.prepTime}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onOpenDetail(item)}
            className="font-extrabold text-slate-900 text-base leading-snug mb-1 cursor-pointer hover:text-emerald-800 transition-colors line-clamp-1"
          >
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Customize Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Base Price</span>
            <span className="text-lg font-black text-slate-900 leading-tight">₹{item.basePrice}</span>
          </div>

          <button
            onClick={() => onOpenCustomize(item)}
            className="bg-[#115E3B] text-white text-xs font-black px-3.5 py-2.5 rounded-xl shadow-sm hover:bg-emerald-900 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-yellow-300" />
            <span>Customize</span>
          </button>
        </div>
      </div>
    </div>
  );
}
