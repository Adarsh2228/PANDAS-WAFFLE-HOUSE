'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MenuItemData } from '@/store/useStore';
import MenuCard3D from './MenuCard3D';

interface MenuSectionProps {
  categoryName: string;
  items: MenuItemData[];
  config: { color: string; bg: string; gradient: string; emoji: string; tagline: string };
  onOpenDetail: (item: MenuItemData) => void;
  onOpenCustomize: (item: MenuItemData) => void;
  pandaSide?: 'left' | 'right';
}

// Animated panda SVGs (inline emoji-based SVG characters)
const PANDA_POSES = [
  // Panda hanging from bamboo
  ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
    <div className={`select-none pointer-events-none ${className}`} style={style}>
      <div className="text-6xl sm:text-7xl panda-float" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>🐼</div>
      <div className="text-3xl text-green-600 -mt-2 panda-float-slow" style={{ animationDelay: '0.3s' }}>🎋</div>
    </div>
  ),
  // Panda waving
  ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
    <div className={`select-none pointer-events-none text-center ${className}`} style={style}>
      <div className="text-6xl sm:text-7xl panda-bounce">🐼</div>
      <div className="text-2xl panda-wave" style={{ animationDelay: '0.5s', display: 'inline-block' }}>🌿</div>
    </div>
  ),
  // Panda with food
  ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
    <div className={`select-none pointer-events-none text-center ${className}`} style={style}>
      <div className="relative">
        <div className="text-6xl sm:text-7xl panda-float">🐼</div>
        <div className="text-3xl absolute -bottom-2 -right-2 panda-bounce" style={{ animationDelay: '0.4s' }}>🧇</div>
      </div>
    </div>
  ),
];

export default function MenuSection({
  categoryName,
  items,
  config,
  onOpenDetail,
  onOpenCustomize,
  pandaSide = 'right',
}: MenuSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const visibleItems = showAll ? items : items.slice(0, 6);
  const PandaComp = PANDA_POSES[Math.floor(Math.abs(categoryName.charCodeAt(0)) % PANDA_POSES.length)];

  return (
    <section
      ref={sectionRef}
      id={`section-${categoryName.replace(/\s+/g, '-').toLowerCase()}`}
      className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Floating panda mascot - Left */}
      <div
        className="absolute hidden lg:block top-0 z-10 -left-16 xl:-left-24 panda-peek"
        style={{ animationDelay: '0.4s' }}
      >
        <PandaComp />
      </div>

      {/* Floating panda mascot - Right (Added more pandas as requested) */}
      <div
        className="absolute hidden lg:block top-0 z-10 -right-16 xl:-right-24 panda-peek-right"
        style={{ animationDelay: '1.2s' }}
      >
        <PandaComp />
      </div>

      {/* Section Header */}
      <div
        className="relative rounded-3xl p-6 mb-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${config.bg}, white)` }}
      >
        {/* Background glow blob */}
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: config.color }}
        />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Category icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}aa)` }}
            >
              {config.emoji}
            </div>
            <div>
              <h2
                className="text-2xl sm:text-3xl font-black leading-tight"
                style={{ color: config.color }}
              >
                {categoryName}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">{config.tagline}</p>
            </div>
          </div>

          {/* Mobile panda */}
          <div className="text-4xl panda-float lg:hidden">🐼</div>
        </div>

        {/* Color accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl"
          style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}55)` }}
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleItems.map((item, idx) => (
          <MenuCard3D
            key={item.id}
            item={item}
            accentColor={config.color}
            accentBg={config.bg}
            onOpenDetail={onOpenDetail}
            onOpenCustomize={onOpenCustomize}
            animationDelay={idx * 60}
          />
        ))}
      </div>

      {/* Show More / Show Less */}
      {items.length > 6 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-2 font-black text-sm px-6 py-3 rounded-full border-2 transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              borderColor: config.color,
              color: config.color,
              background: showAll ? config.bg : 'white',
            }}
          >
            {showAll ? (
              <>Show Less</>
            ) : (
              <>
                View All {items.length} Items
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
