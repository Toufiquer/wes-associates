'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock } from 'lucide-react';

export interface TopBannerBrandConfig {
  topBannerIsPublished?: boolean;
  topBannerBackgroundColor?: string;
  topBannerTextColor?: string;
  topBannerDisabledUrls?: string[];
  contactEmail?: string;
  contactPhone?: string;
  contactHours?: string;
}

const defaultConfig: Required<TopBannerBrandConfig> = {
  topBannerIsPublished: true,
  topBannerBackgroundColor: '#000000',
  topBannerTextColor: '#9ca3af',
  topBannerDisabledUrls: [],
  contactEmail: 'info@wesassociates.com',
  contactPhone: '+880 1303-537667',
  contactHours: 'Sat-Thu, 10:00 AM - 7:00 PM',
};

const TopBanner = ({ config: incomingConfig }: { config: TopBannerBrandConfig }) => {
  const config = { ...defaultConfig, ...incomingConfig };
  const pathname = usePathname();

  const normalizeUrl = (url: string) => url.split('?')[0].split('#')[0].replace(/\/$/, '');
  const currentUrl = normalizeUrl(pathname || '/');
  const isDisabledUrl = config.topBannerDisabledUrls.some(d => currentUrl.includes(normalizeUrl(d)));

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
            {[{ label: 'FB' }, { label: 'YT' }, { label: 'IN' }].map((social, i) => (
              <button
                key={i}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-white/20 hover:border-white hover:text-white transition-all duration-300 font-bold text-[10px] hover:bg-white/10"
              >
                {social.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBanner;
