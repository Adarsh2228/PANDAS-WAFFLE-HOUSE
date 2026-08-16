'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story } from '@/store/useStore';

interface StoriesViewerProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
}

export default function StoriesViewer({ stories, initialIndex = 0, onClose }: StoriesViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const duration = 5000; // 5 seconds per story
    const interval = 50; // update every 50ms
    const step = (100 / (duration / interval));

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (progress >= 100) {
      handleNext();
    }
  }, [progress]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setProgress(0);
    }
  };

  if (!stories.length) return null;

  const currentStory = stories[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col sm:items-center sm:justify-center"
      >
        <div className="relative w-full h-full sm:w-[400px] sm:h-[800px] sm:max-h-[90vh] bg-black sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-4">
            {stories.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header Info */}
          <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xl">🐼</div>
              <span className="text-white font-bold text-sm text-shadow">Pandas Waffle House</span>
              <span className="text-white/70 text-xs text-shadow ml-2">
                {Math.round((Date.now() - currentStory.createdAt) / 3600000)}h
              </span>
            </div>
            <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Tap Zones */}
          <div className="absolute inset-0 z-10 flex">
            <div className="w-1/3 h-full" onClick={handlePrev} />
            <div className="w-2/3 h-full" onClick={handleNext} />
          </div>

          {/* Story Image */}
          <img
            src={currentStory.imageUrl}
            alt="Story"
            className="w-full h-full object-cover"
          />

          {/* Caption Overlay */}
          {currentStory.caption && (
            <div className="absolute bottom-10 left-0 right-0 z-20 px-6 text-center pointer-events-none">
              <div className="inline-block bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-medium border border-white/10">
                {currentStory.caption}
              </div>
            </div>
          )}

          {/* Nav Buttons (Desktop) */}
          <div className="absolute inset-y-0 left-0 right-0 hidden sm:flex items-center justify-between px-2 pointer-events-none z-30">
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
