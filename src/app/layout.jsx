import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AppLayout from '@/components/layout/AppLayout';

export const metadata = {
  metadataBase: new URL('https://electrolify.com'),
  title: 'Electrolify | Premium Elektronika və Ağıllı Qadcetlər',
  description: 'Azərbaycanın ən etibarlı e-ticarət platforması. Orijinal məhsullar, 50 AZN-dən yuxarı pulsuz çatdırılma və 100% zəmanət.',
  keywords: 'elektronika, smart saat, simsiz qulaqlıq, magsafe, baku, azərbaycan, online alisveris',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Electrolify | Premium Elektronika',
    description: 'Xüsusi endirimlər və sürətli çatdırılma ilə sifariş verin.',
    url: 'https://electrolify.com',
    siteName: 'Electrolify',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Electrolify Logo',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body className="min-h-screen bg-[#F8F9FA] text-neutral-900 selection:bg-[#FF5B00] selection:text-white flex flex-col">
        <CartProvider>
          <AppLayout>{children}</AppLayout>
        </CartProvider>
      </body>
    </html>
  );
}
