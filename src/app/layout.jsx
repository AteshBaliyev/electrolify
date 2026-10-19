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

        {/* Shopify Storefront Analytics (Trekkie & Monorail) - Shopify Live View və Seans Sayğacı üçün */}
        <Script
          id="shopify-analytics-setup"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  function genUUID() {
                    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
                      return crypto.randomUUID();
                    }
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                      return v.toString(16);
                    });
                  }
                  function getCookie(name) {
                    var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\\.$?*|{}\\(\\)\\[\\]\\\\\\/+^])/g, '\\\\$1') + '=([^;]*)'));
                    return m ? decodeURIComponent(m[1]) : '';
                  }
                  function setCookie(name, val, maxAge) {
                    document.cookie = name + '=' + encodeURIComponent(val) + '; path=/; max-age=' + maxAge + '; SameSite=Lax';
                  }
                  if (!getCookie('_shopify_y')) {
                    setCookie('_shopify_y', genUUID(), 31536000);
                  }
                  if (!getCookie('_shopify_s')) {
                    setCookie('_shopify_s', genUUID(), 1800);
                  }

                  window.Shopify = window.Shopify || {};
                  window.Shopify.shop = 'zi73g2-zx.myshopify.com';
                  window.Shopify.currency = { active: 'AZN', rate: '1.0' };
                  window.ShopifyAnalytics = window.ShopifyAnalytics || {};
                  window.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {};
                  window.ShopifyAnalytics.meta.currency = 'AZN';
                  window.ShopifyAnalytics.merchantGoogleAnalytics = function() {};

                  var trekkie = window.ShopifyAnalytics.lib = window.trekkie = window.trekkie || [];
                  if (!trekkie.integrations) {
                    trekkie.methods = ['identify', 'page', 'ready', 'track', 'trackForm', 'trackLink'];
                    trekkie.factory = function(method) {
                      return function() {
                        var args = Array.prototype.slice.call(arguments);
                        args.unshift(method);
                        trekkie.push(args);
                        return trekkie;
                      };
                    };
                    for (var i = 0; i < trekkie.methods.length; i++) {
                      var key = trekkie.methods[i];
                      trekkie[key] = trekkie.factory(key);
                    }
                  }
                  trekkie.load({
                    "Trekkie": {
                      "appName": "storefront",
                      "development": false,
                      "defaultAttributes": {
                        "shopId": 85294186752,
                        "isMerchantRequest": null,
                        "themeId": 165263671552,
                        "themeCityHash": "15481927197172546807",
                        "contentLanguage": "az",
                        "currency": "AZN"
                      },
                      "isServerSideCookieWritingEnabled": true,
                      "monorailRegion": "shop_domain"
                    },
                    "Session Attribution": {}
                  });
                  trekkie.ready(function() {
                    window.ShopifyAnalytics.lib = window.trekkie;
                  });
                } catch(e) {
                  console.warn('[Shopify Analytics Init]', e);
                }
              })();
            `,
          }}
        />
        <Script
          id="shopify-trekkie-lib"
          strategy="afterInteractive"
          src="https://cdn.shopify.com/s/trekkie.storefront.min.js"
        />
      </head>
      <body className="min-h-screen bg-[#F8F9FA] text-neutral-900 selection:bg-[#FF5B00] selection:text-white flex flex-col">
        <CartProvider>
          <AppLayout>{children}</AppLayout>
        </CartProvider>
      </body>
    </html>
  );
}
