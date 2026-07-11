'use client';

export type MetaPixelEventPayload = Record<string, string | number | boolean | null | undefined | Array<string | number>>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_CURRENCY = 'BDT';

export const trackMetaEvent = (eventName: string, payload?: MetaPixelEventPayload) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', eventName, payload);
};

export const trackMetaCustomEvent = (eventName: string, payload?: MetaPixelEventPayload) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('trackCustom', eventName, payload);
};
