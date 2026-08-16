'use client';

import { useStore } from '@/store/useStore';
import { X, Sparkles, Heart, Utensils } from 'lucide-react';

export default function PandaChefModal() {
  const { isPandaChefOpen, setIsPandaChefOpen } = useStore();

  if (!isPandaChefOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-emerald-100 text-center space-y-4">
        <button
          onClick={() => setIsPandaChefOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-5xl shadow-inner border-2 border-emerald-300">
          🐼
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
            Panda Chef Bam-Bam <Sparkles size={16} className="text-yellow-500" />
          </h3>
          <p className="text-xs text-emerald-700 font-bold mt-0.5">Head Waffle Connoisseur</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl text-xs text-emerald-950 font-medium text-left leading-relaxed space-y-2">
          <p className="font-bold flex items-center gap-1">
            <Utensils size={14} className="text-emerald-700" /> Chef's Daily Secret Tip:
          </p>
          <p>
            "Every waffle is griddled fresh using organic Hokkaido cream and real Belgian dark cocoa. Pair your waffle bowl with Hokkaido Vanilla gelato for maximum bliss!"
          </p>
        </div>

        <button
          onClick={() => setIsPandaChefOpen(false)}
          className="w-full bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg hover:bg-emerald-900 transition-colors text-xs flex items-center justify-center gap-1.5"
        >
          <Heart size={14} className="fill-red-400 text-red-400" /> Thanks, Chef Bam-Bam!
        </button>
      </div>
    </div>
  );
}
