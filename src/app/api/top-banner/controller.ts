/*
|-----------------------------------------
| setting up Top Banner Controller for the App
|-----------------------------------------
*/

import TopBannerSettings, { ITopBannerActionLink, ITopBannerSettings, ITopBannerSocialLink, TopBannerActionId } from './model';

const actionLabels: Record<TopBannerActionId, string> = {
  call: 'Call',
  email: 'Email',
  location: 'Location',
  messenger: 'Messager',
  whatsapp: 'WhatsApp',
};

export const DEFAULT_TOP_BANNER = {
  topBannerIsPublished: true,
  topBannerPosition: 'scroll',
  topBannerMessage: 'Buy All - Lifetime Access',
  topBannerHighlightText: '৳9950 Only',
  topBannerCountdownEndAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  topBannerButtonText: 'Get Offer',
  topBannerButtonUrl: '/offers',
  topBannerBackgroundColor: '#080c14',
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
  topBannerActionLinks: [
    { id: 'call', label: 'Call', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'tel:+8801303537667', openInNewTab: false },
    { id: 'email', label: 'Email', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'mailto:info@wesassociates.com', openInNewTab: false },
    { id: 'location', label: 'Location', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://maps.google.com', openInNewTab: true },
    { id: 'messenger', label: 'Messager', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://m.me/', openInNewTab: true },
    { id: 'whatsapp', label: 'WhatsApp', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://wa.me/8801303537667', openInNewTab: true },
  ] as ITopBannerActionLink[],
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
  'topBannerActionLinks',
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

const normalizeActionLinks = (links: ITopBannerActionLink[] | undefined) => {
  if (!Array.isArray(links)) return undefined;

  const supportedIds = Object.keys(actionLabels) as TopBannerActionId[];
  return links
    .filter(link => supportedIds.includes(link.id))
    .slice(0, supportedIds.length)
    .map(link => ({
      id: link.id,
      label: actionLabels[link.id],
      isPublished: link.isPublished !== false,
      fontColor: /^#[0-9a-f]{6}$/i.test(String(link.fontColor)) ? String(link.fontColor) : '#ffffff',
      size: Math.min(48, Math.max(8, Number(link.size) || 14)),
      padding: Math.min(24, Math.max(0, Number(link.padding) || 0)),
      url: String(link.url || '').trim().slice(0, 2048),
      openInNewTab: link.openInNewTab === true,
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
  const actionLinks = normalizeActionLinks(data.topBannerActionLinks);
  if (actionLinks) cleanData.topBannerActionLinks = actionLinks;
  return TopBannerSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
};
