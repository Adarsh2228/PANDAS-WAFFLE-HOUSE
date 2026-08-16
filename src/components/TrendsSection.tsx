'use client';

import { useRef, useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Star, Award, BarChart2 } from 'lucide-react';
import { MenuItemData, useStore } from '@/store/useStore';

interface TrendsSectionProps {
  onOpenDetail: (item: MenuItemData) => void;
  onOpenCustomize: (item: MenuItemData) => void;
}

const RANK_STYLES = [
  { bg: 'linear-gradient(135deg,#F59E0B,#D97706)', text: '#92400E', icon: '👑', label: '#1 Most Ordered' },
  { bg: 'linear-gradient(135deg,#94A3B8,#64748B)', text: '#1E293B', icon: '🥈', label: '#2 Popular' },
  { bg: 'linear-gradient(135deg,#F97316,#C2410C)', text: '#7C2D12', icon: '🥉', label: '#3 Fan Fav' },
  { bg: 'linear-gradient(135deg,#10B981,#059669)', text: '#064E3B', icon: '⭐', label: 'Top 4' },
  { bg: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', text: '#4C1D95', icon: '🔥', label: 'Top 5' },
  { bg: 'linear-gradient(135deg,#EC4899,#DB2777)', text: '#881337', icon: '💫', label: 'Top 6' },
];

export default function TrendsSection({ onOpenDetail, onOpenCustomize }: TrendsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { productOrderCounts, menuItems, productVisibility } = useStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Sort all menu items by their real order counts — only show ordered items
  const orderedItems = (menuItems || [])
    .filter((item) => productVisibility[item.id] ?? true)
    .map((item) => ({ ...item, orderCount: productOrderCounts[item.id] ?? 0 }))
    .filter((item) => item.orderCount > 0)
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 6);

  const hasOrders = orderedItems.length > 0;
  const maxCount  = hasOrders ? orderedItems[0].orderCount : 1;

  return (
    <section
      ref={sectionRef}
      id="section-trends"
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#EA580C,#DC2626)' }}
        >
          🔥
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-orange-600 leading-tight">What's Trending</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            {hasOrders ? 'Most ordered items by our customers' : 'Order items to see trending products here!'}
          </p>
        </div>
        <div className="ml-auto text-4xl hidden sm:block" style={{ animation: 'panda-float 2s ease-in-out infinite' }}>🐼</div>
      </div>

      {!hasOrders ? (
        /* Empty state */
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
          <div className="text-6xl">📊🐼</div>
          <h3 className="font-black text-slate-800 text-lg">No Orders Yet!</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
            Start ordering your favorite waffles and the most popular ones will appear here automatically!
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-600 text-sm font-bold">
            <TrendingUp size={16} />
            Powered by real order data
          </div>
        </div>
      ) : (
        <>
          {/* Live badge */}
          <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-orange-50 border border-orange-100 rounded-2xl w-fit">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="text-xs font-black text-orange-700">Live Order Rankings</span>
            <span className="text-xs text-orange-500 font-medium">· Updates with every order</span>
          </div>

          {/* Leaderboard */}
          <div className="space-y-3">
            {orderedItems.map((item, idx) => {
              const style = RANK_STYLES[idx] || RANK_STYLES[5];
              const displayName = item.name
                .replace(/Sandwich Waffle$/, '').replace(/Belgium Waffle$/, '')
                .replace(/Bowl Cake$/, '').replace(/Pan Cake$/, '').trim();
              const barWidth = Math.max(10, (item.orderCount / maxCount) * 100);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                  style={{ animationDelay: `${idx * 80}ms` }}
                  onClick={() => onOpenDetail(item)}
                >
                  <div className="flex items-center gap-0">
                    {/* Rank badge */}
                    <div
                      className="w-16 min-h-[80px] flex flex-col items-center justify-center flex-shrink-0 gap-1"
                      style={{ background: style.bg }}
                    >
                      <span className="text-2xl">{style.icon}</span>
                      <span className="text-[8px] font-black text-white/90 text-center px-1 leading-tight">{style.label}</span>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                      <img src={item.imageUrl} alt={displayName} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 px-4 py-3 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-1">{displayName}</h4>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-black text-slate-900 text-base">₹{item.basePrice}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        {/* Order count */}
                        <div className="flex items-center gap-1">
                          <ShoppingBag size={11} className="text-orange-500" />
                          <span className="text-xs font-black text-slate-700">{item.orderCount} orders</span>
                        </div>

                        {/* Order button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); onOpenCustomize(item); }}
                          className="ml-auto text-[10px] font-black px-3 py-1.5 rounded-full text-white active:scale-95 transition-all"
                          style={{ background: 'linear-gradient(135deg,#EA580C,#DC2626)' }}
                        >
                          Order Now
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: isVisible ? `${barWidth}%` : '0%', background: style.bg }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
