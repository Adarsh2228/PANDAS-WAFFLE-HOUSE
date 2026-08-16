'use client';

const CATEGORIES = [
  { id: 'All',             label: '🐼 All',               activeBg: '#1F2937' },
  { id: 'Sandwich Waffle', label: '🥪 Sandwich Waffle',   activeBg: '#D97706' },
  { id: 'Belgium Waffle',  label: '🧇 Belgium Waffle',    activeBg: '#7C3AED' },
  { id: 'Bowl Cake',       label: '🥣 Bowl Cake',         activeBg: '#C2410C' },
  { id: 'Pan Cake',        label: '🥞 Pan Cake',          activeBg: '#DB2777' },
];

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function CategoryFilter({ activeCategory, setActiveCategory }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="shrink-0 px-4 py-2 rounded-full text-xs font-black tracking-tight transition-all duration-200 shadow-sm border ripple-btn"
            style={isActive
              ? { background: cat.activeBg, color: 'white', borderColor: cat.activeBg, boxShadow: `0 4px 12px ${cat.activeBg}55`, transform: 'scale(1.06)' }
              : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }
            }
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
