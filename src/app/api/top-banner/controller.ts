/*
|-----------------------------------------
| setting up Top Banner Controller for the App
|-----------------------------------------
*/

import TopBannerSettings, { ITopBannerSettings, ITopBannerSocialLink } from './model';

export const DEFAULT_TOP_BANNER = {
  topBannerIsPublished: true,
  topBannerPosition: 'scroll',
  topBannerMessage: 'Buy All - Lifetime Access',
  topBannerHighlightText: '৳9950 Only',
  topBannerCountdownEndAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  topBannerButtonText: 'Get Offer',
  topBannerButtonUrl: '/offers',
  topBannerBackgroundColor: '#2563eb',
  topBannerTextColor: '#ffffff',
  topBannerHighlightColor: '#fde047',
  topBannerButtonBackgroundColor: '#facc15',
  topBannerButtonTextColor: '#111827',
  topBannerDisabledUrls: [],
  contactEmail: 'info@wesassociates.com',
  contactPhone: '+880 1303-537667',
  contactHours: 'Sat-Thu, 10:00 AM - 7:00 PM',
  topBannerSocialLinks: [
    { id: 'facebook', label: 'Facebook', iconUrl: '', url: 'https://facebook.com', isPublished: true },
    { id: 'youtube', label: 'YouTube', iconUrl: '', url: 'https://youtube.com', isPublished: true },
    { id: 'linkedin', label: 'LinkedIn', iconUrl: '', url: 'https://linkedin.com', isPublished: true },
  ],
};

const topBannerFields = [
  'topBannerIsPublished',
  'topBannerPosition',
  'topBannerMessage',
  'topBannerHighlightText',
  'topBannerCountdownEndAt',
  'topBannerButtonText',
  'topBannerButtonUrl',
  'topBannerBackgroundColor',
  'topBannerTextColor',
  'topBannerHighlightColor',
  'topBannerButtonBackgroundColor',
  'topBannerButtonTextColor',
  'topBannerDisabledUrls',
  'contactEmail',
  'contactPhone',
  'contactHours',
  'topBannerSocialLinks',
] as const;

const normalizeSocialLinks = (links: ITopBannerSocialLink[] | undefined) => {
  if (!Array.isArray(links)) return undefined;

  return links.slice(0, 12).map((link, index) => ({
    id: String(link.id || `social-${index + 1}`).slice(0, 80),
    label: String(link.label || '').trim().slice(0, 80),
    iconUrl: String(link.iconUrl || '').trim().slice(0, 2048),
    url: String(link.url || '').trim().slice(0, 2048),
    isPublished: link.isPublished !== false,
  }));
};

export const getTopBanner = async () => {
  const settings = await TopBannerSettings.findOne().lean();
  return settings ? { ...DEFAULT_TOP_BANNER, ...settings } : DEFAULT_TOP_BANNER;
};

export const updateTopBanner = (data: Partial<ITopBannerSettings>) => {
  const cleanData = Object.fromEntries(topBannerFields.map(field => [field, data[field]]).filter(([, value]) => value !== undefined));
  const socialLinks = normalizeSocialLinks(data.topBannerSocialLinks);
  if (socialLinks) cleanData.topBannerSocialLinks = socialLinks;
  return TopBannerSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
};
