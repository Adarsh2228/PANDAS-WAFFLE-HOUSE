'use client';

import { useState } from 'react';
import OffersSection from './OffersSection';
import ItemDetailModal from './ItemDetailModal';
import WaffleBuilderModal from './WaffleBuilderModal';
import CartDrawer from './CartDrawer';
import { MenuItemData } from '@/store/useStore';

export default function OffersClient() {
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItemData | null>(null);
  const [selectedCustomizeItem, setSelectedCustomizeItem] = useState<MenuItemData | null>(null);

  return (
    <>
      <OffersSection
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
