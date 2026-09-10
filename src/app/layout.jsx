import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import GlobalWhatsAppButton from '@/components/common/GlobalWhatsAppButton';

export const metadata = {
  title: 'Electrolify.com | Premium Elektronika və Ağıllı Qadcetlər',
  description: 'Azərbaycanın ən etibarlı e-ticarət platforması. Orijinal məhsullar, 24 saatda sürətli çatdırılma və 100% zəmanət.',
  keywords: 'elektronika, smart saat, simsiz qulaqlıq, magsafe, baku, azərbaycan, online alisveris',
  openGraph: {
    title: 'Electrolify.com | Premium Elektronika',
    description: 'Xüsusi endirimlər və sürətli çatdırılma ilə sifariş verin.',
    url: 'https://electrolify.com',
    siteName: 'Electrolify.com',
    locale: 'az_AZ',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body className="min-h-screen bg-[#F8F9FA] text-neutral-900 selection:bg-[#FF5B00] selection:text-white flex flex-col">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <GlobalWhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
