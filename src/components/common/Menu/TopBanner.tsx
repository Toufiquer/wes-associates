'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock } from 'lucide-react';

export interface TopBannerSocialLink {
  id: string;
  label: string;
  iconUrl: string;
  url: string;
  isPublished: boolean;
}

export interface TopBannerBrandConfig {
  topBannerIsPublished?: boolean;
  topBannerBackgroundColor?: string;
  topBannerTextColor?: string;
  topBannerDisabledUrls?: string[];
  contactEmail?: string;
  contactPhone?: string;
  contactHours?: string;
  topBannerSocialLinks?: TopBannerSocialLink[];
}

const defaultConfig: Required<TopBannerBrandConfig> = {
  topBannerIsPublished: true,
  topBannerBackgroundColor: '#000000',
  topBannerTextColor: '#9ca3af',
  topBannerDisabledUrls: [],
  contactEmail: 'info@wesassociates.com',
  contactPhone: '+880 1300-111111',
  contactHours: 'Sat-Thu, 10:00 AM - 7:00 PM',
  topBannerSocialLinks: [
    { id: 'facebook', label: 'Facebook', iconUrl: '', url: 'https://facebook.com', isPublished: true },
    { id: 'youtube', label: 'YouTube', iconUrl: '', url: 'https://youtube.com', isPublished: true },
    { id: 'linkedin', label: 'LinkedIn', iconUrl: '', url: 'https://linkedin.com', isPublished: true },
  ],
};

const getSafeSocialUrl = (url: string) => (/^https?:\/\//i.test(url.trim()) ? url.trim() : '#');

const TopBanner = ({ config: incomingConfig }: { config: TopBannerBrandConfig }) => {
  const config = { ...defaultConfig, ...incomingConfig };
  const pathname = usePathname();

  const normalizeUrl = (url: string) => url.split('?')[0].split('#')[0].replace(/\/$/, '');
  const currentUrl = normalizeUrl(pathname || '/');
  const isDisabledUrl = config.topBannerDisabledUrls.some(d => currentUrl.includes(normalizeUrl(d)));
  const visibleSocialLinks = config.topBannerSocialLinks.filter(social => social.isPublished && (social.label || social.iconUrl));

  if (!config.topBannerIsPublished || isDisabledUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-white/10 text-xs md:text-sm overflow-hidden"
      style={{ backgroundColor: config.topBannerBackgroundColor, color: config.topBannerTextColor }}
    >
      <div className="max-w-[1480px] mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-5">
          <a href={`mailto:${config.contactEmail}`} className="flex items-center gap-2 hover:text-white transition-colors duration-300">
            <Mail size={14} /> <span>{config.contactEmail}</span>
          </a>
          <a href={`tel:${config.contactPhone}`} className="flex items-center gap-2 hover:text-white transition-colors duration-300">
            <Phone size={14} /> <span>{config.contactPhone}</span>
          </a>
          <div className="hidden sm:flex items-center gap-2">
            <Clock size={14} /> <span>{config.contactHours}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {visibleSocialLinks.map(social => (
              <a
                key={social.id}
                href={getSafeSocialUrl(social.url)}
                target={getSafeSocialUrl(social.url) !== '#' ? '_blank' : undefined}
                rel={getSafeSocialUrl(social.url) !== '#' ? 'noopener noreferrer' : undefined}
                aria-label={social.label || 'Social media'}
                className="w-7 h-7 flex items-center justify-center overflow-hidden rounded-full border border-white/20 hover:border-white hover:text-white transition-all duration-300 font-bold text-[10px] hover:bg-white/10"
              >
                {social.iconUrl ? (
                  <span
                    aria-hidden="true"
                    className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${JSON.stringify(social.iconUrl)})` }}
                  />
                ) : (
                  social.label.slice(0, 2).toUpperCase()
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBanner;
