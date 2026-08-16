'use client';

import { Search, Bike } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function HeroBanner({ searchQuery, setSearchQuery }: HeroBannerProps) {
  return (
    <div className="space-y-3 my-3">

      {/* ── Main Hero Card ─────────────────────────────────────── */}
      <div className="bg-[#4A1E05] text-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden border border-amber-900/40">
        {/* Background Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FDE68A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
          {/* ── Delivery promo badge ─────── */}
          <div className="inline-flex items-center gap-1.5 bg-[#FEF08A] text-[#854D0E] font-black text-xs px-3 py-1.5 rounded-full shadow w-fit flex-wrap">
            <Bike size={14} className="shrink-0" />
            <span>Fast Home Delivery • Earn 10 Bamboo Pts per ₹100</span>
          </div>

          {/* ── Main Heading ─────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Freshly Baked Waffles Delivered Hot 🧇
              </h2>
              <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed font-medium max-w-lg">
                Order your favorite Belgian waffle bowls, lava cakes &amp; desserts online! Baked fresh with love by Panda Chef Bam-Bam.
              </p>
            </div>

            {/* ── Search bar ───────────────── */}
            <div className="w-full sm:w-72 md:w-80 shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-300/70" size={18} aria-hidden="true" />
                <input
                  id="waffle-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search waffles, cakes, gelato..."
                  aria-label="Search menu items"
                  className="w-full bg-[#361502]/90 border border-amber-700/50 text-white placeholder-amber-200/50 pl-11 pr-4 py-3 sm:py-3.5 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
