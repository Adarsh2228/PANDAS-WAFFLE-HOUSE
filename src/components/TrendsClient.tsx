'use client';

import { useState } from 'react';
import TrendsSection from './TrendsSection';
import ItemDetailModal from './ItemDetailModal';
import WaffleBuilderModal from './WaffleBuilderModal';
import CartDrawer from './CartDrawer';
import { MenuItemData } from '@/store/useStore';

export default function TrendsClient() {
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItemData | null>(null);
  const [selectedCustomizeItem, setSelectedCustomizeItem] = useState<MenuItemData | null>(null);

  return (
    <>
      <TrendsSection
        onOpenDetail={setSelectedDetailItem}
        onOpenCustomize={setSelectedCustomizeItem}
      />
      {selectedDetailItem && (
        <ItemDetailModal
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          onOpenCustomize={(item) => {
            setSelectedDetailItem(null);
            setSelectedCustomizeItem(item);
          }}
        />
      )}
      {selectedCustomizeItem && (
        <WaffleBuilderModal
          item={selectedCustomizeItem}
          onClose={() => setSelectedCustomizeItem(null)}
        />
      )}
      <CartDrawer />
    </>
  );
}
