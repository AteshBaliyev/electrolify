'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import GlobalWhatsAppButton from '@/components/common/GlobalWhatsAppButton';
import { trackPageView } from '@/lib/metaPixel';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isCheckout = pathname === '/checkout';

  // Bütün səhifə keçidlərində Meta Pixel PageView hadisəsini avtomatik işə sal
  useEffect(() => {
    trackPageView();
  }, [pathname]);

  // Checkout səhifəsində tam diqqət yayındırmayan (distraction-free) rejim:
  // Başlıq (Header), Elan (AnnouncementBar), Altlıq (Footer) və üzən WhatsApp düyməsi gizlədilir.
  if (isCheckout) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <CartDrawer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <GlobalWhatsAppButton />
    </>
  );
}
