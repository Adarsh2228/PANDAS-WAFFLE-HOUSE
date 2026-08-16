'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import StoriesViewer from './StoriesViewer';

export default function StatusRow() {
  const { stories } = useStore();
  const [storiesOpen, setStoriesOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // For demonstration, we group stories by user, but here we just show recent ones
  const recentStories = stories?.filter((s) => Date.now() - s.createdAt < 86400000) || [];
  
  if (recentStories.length === 0) return null;

  return (
    <>
      <div className="w-full bg-[#fdf8f0] border-b border-amber-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-4 overflow-x-auto no-scrollbar items-center">
            {recentStories.map((story, i) => (
              <div
                key={story.id}
                className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                onClick={() => {
                  setActiveStoryIndex(i);
                  setStoriesOpen(true);
                }}
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[3px] bg-gradient-to-tr from-emerald-400 to-emerald-600">
                  <div className="w-full h-full rounded-full border-2 border-[#fdf8f0] bg-white overflow-hidden p-1 shadow-sm">
                    <img
                      src={story.thumbnailUrl || story.imageUrl || '/logo.jpg'}
                      alt="Story thumbnail"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 w-16 truncate text-center">
                  {story.caption || `Status ${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {storiesOpen && (
        <StoriesViewer
          stories={recentStories}
          initialIndex={activeStoryIndex}
          onClose={() => setStoriesOpen(false)}
        />
      )}
    </>
  );
}
