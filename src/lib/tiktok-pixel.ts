'use client';

export type TikTokEventPayload = Record<string, string | number | boolean | null | undefined>;

export const TIKTOK_PIXEL_CURRENCY = 'BDT';

export const trackTikTokEvent = (eventName: string, payload?: TikTokEventPayload) => {
  if (typeof window === 'undefined' || typeof window.ttq?.track !== 'function') return;
  window.ttq.track(eventName, payload);
};
