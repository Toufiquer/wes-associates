'use client';

import { LayoutDashboard, LogIn, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa6';

import { useSession } from '@/lib/auth-client';

export type TopBannerActionId = 'call' | 'email' | 'location' | 'messenger' | 'whatsapp';

export interface TopBannerActionLink {
  id: TopBannerActionId;
  label: string;
  isPublished: boolean;
  fontColor: string;
  size: number;
  padding: number;
  url: string;
  openInNewTab: boolean;
}

export interface TopBannerBrandConfig {
  topBannerIsPublished?: boolean;
  topBannerBackgroundColor?: string;
  topBannerTextColor?: string;
  topBannerDisabledUrls?: string[];
  topBannerActionLinks?: TopBannerActionLink[];
}

const defaultActionLinks: TopBannerActionLink[] = [
  { id: 'call', label: 'Call', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'tel:+8801303537667', openInNewTab: false },
  { id: 'email', label: 'Email', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'mailto:info@wesassociates.com', openInNewTab: false },
  { id: 'location', label: 'Location', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://maps.google.com', openInNewTab: true },
  { id: 'messenger', label: 'Messager', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://m.me/', openInNewTab: true },
  { id: 'whatsapp', label: 'WhatsApp', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://wa.me/8801303537667', openInNewTab: true },
];

const defaultConfig: Required<TopBannerBrandConfig> = {
  topBannerIsPublished: true,
  topBannerBackgroundColor: '#080c14',
  topBannerTextColor: '#ffffff',
  topBannerDisabledUrls: [],
  topBannerActionLinks: defaultActionLinks,
};

const actionIcons = {
  call: Phone,
  email: Mail,
  location: MapPin,
  messenger: FaFacebookMessenger,
  whatsapp: FaWhatsapp,
};

const getSafeActionUrl = (url: string) => (/^(https?:\/\/|mailto:|tel:)/i.test(url.trim()) ? url.trim() : '#');

const getActionDisplayValue = (action: TopBannerActionLink) => {
  const value = action.url.trim();
  if (action.id === 'call') return value.replace(/^tel:/i, '');
  if (action.id === 'email') return value.replace(/^mailto:/i, '');
  if (action.id === 'whatsapp') return value.replace(/^https?:\/\/(?:www\.)?wa\.me\//i, '+');
  return value || 'No data added';
};

const TopBanner = ({ config: incomingConfig }: { config: TopBannerBrandConfig }) => {
  const config = { ...defaultConfig, ...incomingConfig };
  const pathname = usePathname();
  const session = useSession();
  const isLoggedIn = !!session?.data?.session;

  const normalizeUrl = (url: string) => url.split('?')[0].split('#')[0].replace(/\/$/, '');
  const currentUrl = normalizeUrl(pathname || '/');
  const isDisabledUrl = config.topBannerDisabledUrls.some(disabledUrl => currentUrl.includes(normalizeUrl(disabledUrl)));
  const visibleActionLinks = config.topBannerActionLinks.filter(action => action.isPublished);

  if (!config.topBannerIsPublished || isDisabledUrl) return null;

  return (
    <div className="w-full text-[10px] font-semibold" style={{ backgroundColor: config.topBannerBackgroundColor, color: config.topBannerTextColor }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          {visibleActionLinks.map(action => {
            const Icon = actionIcons[action.id] || FaWhatsapp;
            const safeUrl = getSafeActionUrl(action.url);

            return (
              <a
                key={action.id}
                href={safeUrl}
                target={action.openInNewTab && safeUrl !== '#' ? '_blank' : undefined}
                rel={action.openInNewTab && safeUrl !== '#' ? 'noopener noreferrer' : undefined}
                aria-label={action.label}
                title={action.label}
                className="group relative grid place-items-center rounded-full bg-white/10 transition hover:bg-[#ed1c24]"
                style={{ color: action.fontColor, padding: `${action.padding}px` }}
              >
                <Icon aria-hidden="true" size={action.size} />
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-lg group-hover:block group-focus-visible:block"
                >
                  <span className="font-bold">{action.label}:</span> {getActionDisplayValue(action)}
                </span>
              </a>
            );
          })}
        </div>

        <Link
          href={isLoggedIn ? '/dashboard' : '/login'}
          className="flex items-center gap-1.5 rounded-full bg-[#ed1c24] px-3 py-1.5 font-bold text-white transition hover:bg-[#c9141b]"
        >
          {isLoggedIn ? <LayoutDashboard aria-hidden="true" size={12} /> : <LogIn aria-hidden="true" size={12} />}
          {isLoggedIn ? 'Dashboard' : 'Login'}
        </Link>
      </div>
    </div>
  );
};

export default TopBanner;
