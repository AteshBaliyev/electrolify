import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AppLayout from '@/components/layout/AppLayout';
import { FB_PIXEL_ID } from '@/lib/metaPixel';

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
      <head>
        {/* Meta (Facebook) Pixel Əsas Kodu (Base Code) - strategy="afterInteractive" saytın açılma sürətini (FCP) ləngitmir */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-screen bg-[#F8F9FA] text-neutral-900 selection:bg-[#FF5B00] selection:text-white flex flex-col">
        <CartProvider>
          <AppLayout>{children}</AppLayout>
        </CartProvider>
      </body>
    </html>
  );
}
