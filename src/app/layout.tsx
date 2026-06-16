import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Sports Stream - WebStorm",
  description: "Premium Sports Live Matches streaming portal",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23ff4757'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Clappr Media Player Engine Script */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.min.js"
          strategy="beforeInteractive"
        />
        {/* Google Analytics Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FRTBSRJGT0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FRTBSRJGT0');
          `}
        </Script>
      </head>
      <body>
        {children}
        
        {/* Third Party Native Ads Script Hooks */}
        <Script strategy="lazyOnload" id="ad-tag-1">
          {`
            (function(s){s.dataset.zone='11148608',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
          `}
        </Script>
        <Script strategy="lazyOnload" id="ad-tag-2">
          {`
            (function(s){s.dataset.zone='11148687',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
          `}
        </Script>
      </body>
    </html>
  );
}
