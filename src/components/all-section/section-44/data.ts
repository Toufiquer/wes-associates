export interface HeroStat {
  id: number;
  value: string;
  label: string;
}

export interface HeroFeature {
  id: number;
  icon: string;
  label: string;
}

export interface ISection44Data {
  pageUid: string;
  pageName: string;
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  stats: HeroStat[];
  features: HeroFeature[];
}

export interface Section44Props {
  data?: ISection44Data;
}

export const defaultDataSection44: ISection44Data = {
  pageUid: 'section-uid-44',
  pageName: 'Section 44',
  badgeText: '🇧🇩 Made for Bangladeshi Creators',
  titleLine1: 'Premium WordPress',
  titleLine2: 'Templates & Plugins',
  subtitle: 'One-click import. Elementor ready. Build stunning websites without writing a single line of code.',
  stats: [
    { id: 1, value: '500+', label: 'Templates' },
    { id: 2, value: '50+', label: 'Plugins' },
    { id: 3, value: '10K+', label: 'Happy Customers' },
    { id: 4, value: '99.9%', label: 'Uptime' },
  ],
  features: [
    { id: 1, icon: 'ti-world', label: 'Free Domain' },
    { id: 2, icon: 'ti-shield-check', label: 'Free SSL' },
    { id: 3, icon: 'ti-bolt', label: 'LiteSpeed' },
    { id: 4, icon: 'ti-server', label: '99.9% Uptime' },
  ],
};

