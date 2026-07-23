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

const siteUrl = 'https://www.wesassociates.com';
const siteTitle = 'WES Associates | Study Abroad Consultancy Firm in Bangladesh';
const siteDescription =
  'WES Associates is a Bangladesh-based study abroad consultancy firm helping students choose universities, prepare applications, and plan their international education.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | WES Associates',
  },
  description: siteDescription,
  applicationName: 'WES Associates',
  keywords: [
    'WES',
    'wesassociates',
    'WES Associates',
    'consultancy firm in Bangladesh',
    'best consultancy firm in Bangladesh',
    'best consultancy firm',
    'study abroad consultancy Bangladesh',
    'education consultancy Bangladesh',
  ],
  authors: [{ name: 'WES Associates', url: siteUrl }],
  creator: 'WES Associates',
  publisher: 'WES Associates',
  category: 'Education',
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: siteUrl,
    siteName: 'WES Associates',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/icons/icon-1280x720.png',
        width: 1280,
        height: 720,
        alt: 'WES Associates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/icons/icon-1280x720.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
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
