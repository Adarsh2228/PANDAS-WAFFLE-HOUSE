import type { Metadata } from 'next';
import OffersClient from '@/components/OffersClient';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Offers & Combos 🏷️ | Pandas Waffle House',
  description: 'Best combo deals and special offers at Pandas Waffle House — Date Night, Party Box, Express Meal and more!',
};

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <OffersClient />
      </main>
    </div>
  );
}
