/*
|-----------------------------------------
| setting up Layout for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import { GoogleTagManager } from '@next/third-parties/google';

import { ReduxProvider } from '@/redux/provider';

import PWAPopup from '@/components/common/PWAPopUp';
import FooterServer from '@/components/common/Footer/FooterServer';
import MenuComponentWithSession from '@/components/common/Menu/MenuWithSession';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import FacebookPixel from '@/components/facebook-pixel';
import FacebookPixelPageView from '@/components/facebook-pixel-pageview';
import GtmRouteChange from '@/components/gtm-route-change';
import TikTokPixel from '@/components/tiktok-pixel';
import TikTokRouteChangeTracker from '@/components/tiktok-route-change-tracker';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import TecBuzzFooter from '@/components/TecBuzzFooter';

export const metadata: Metadata = {
  title: 'Wes Associates',
  description: 'Where your dream comes true',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {pixelId ? <FacebookPixel pixelId={pixelId} /> : null}
      {tiktokPixelId ? <TikTokPixel pixelId={tiktokPixelId} /> : null}
      <SpeedInsights />
      <body className="antialiased font-sans bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col">
        <ReduxProvider>
          <MenuComponentWithSession />
          <main className=" animate-in fade-in duration-500">{children}</main>
          <FooterServer />
          <TecBuzzFooter />
          <PWAPopup />
          <WhatsAppButton />
        </ReduxProvider>
        <Toaster position="top-right" richColors closeButton theme="light" />
        <ToastContainer style={{ top: '80px', zIndex: 9999 }} toastClassName="backdrop-blur-md bg-white/90 shadow-xl border border-slate-100 rounded-xl" />
        <FacebookPixelPageView />
        <GtmRouteChange />
        <TikTokRouteChangeTracker />
      </body>
    </html>
  );
}
