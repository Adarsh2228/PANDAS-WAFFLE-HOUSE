import type { Metadata } from 'next';
import TrendsClient from '@/components/TrendsClient';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "What's Trending 🔥 | Pandas Waffle House",
  description: "See what's trending at Pandas Waffle House — top-rated waffles, most ordered items and fan favourites!",
};

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <TrendsClient />
      </main>
    </div>
  );
}
