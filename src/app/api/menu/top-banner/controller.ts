/*
|-----------------------------------------
| setting up Top Banner Controller for the App
|-----------------------------------------
*/

import TopBannerSettings, { ITopBannerSettings } from './model';

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
] as const;

export const getTopBanner = async () => {
  const settings = await TopBannerSettings.findOne().lean();
  return settings ? { ...DEFAULT_TOP_BANNER, ...settings } : DEFAULT_TOP_BANNER;
};

export const updateTopBanner = (data: Partial<ITopBannerSettings>) => {
  const cleanData = Object.fromEntries(topBannerFields.map(field => [field, data[field]]).filter(([, value]) => value !== undefined));
  return TopBannerSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
};
