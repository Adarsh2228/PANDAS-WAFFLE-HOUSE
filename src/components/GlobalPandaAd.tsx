'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function GlobalPandaAd() {
  const [showAd, setShowAd] = useState(true);

  if (!showAd) return null;

  return (
    <div className="fixed bottom-[180px] sm:bottom-4 left-4 z-50 w-40 sm:w-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white animate-fade-in bg-black pointer-events-auto">
      <button 
        onClick={() => setShowAd(false)}
        className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"
        aria-label="Close Ad"
      >
        <X size={14} />
      </button>
      <video 
        src="/cute-pandas-ad.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline
        className="w-full h-auto object-cover"
      />
    </div>
  );
}
