/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface FooterLink {
  id: number;
  title: string;
  link: string;
}

export interface SocialLink {
  id: number;
  platform: 'facebook' | 'youtube' | 'whatsapp' | string;
  link: string;
  iconClass: string;
  backgroundColor: string;
}

export interface FeatureBadge {
  id: number;
  title: string;
  iconClass: string;
}

export interface IFooter2Data {
  promoText: string;
  promoButtonText: string;
  promoButtonLink: string;
  featureBadges: FeatureBadge[];
  brandName: string;
  tagline: string;
  socialLinks: SocialLink[];
  menuTitle: string;
  menuLinks: FooterLink[];
  informationTitle: string;
  informationLinks: FooterLink[];
  paymentBadges: string[];
  copyrightText: string;
  showSupportBadge: boolean;
  supportBadgeText: string;
  showAskAiButton: boolean;
  askAiText: string;
  askAiLink: string;
}

export const defaultDataFooter2: IFooter2Data = {
  promoText: 'আপনি যদি নিচের বাটন ক্লিক করে পার্চেস করেন তাহলে Extra ২০% ডিসকাউন্ট পাবেন।',
  promoButtonText: 'Get Extra 20% Discount',
  promoButtonLink: '#',
  featureBadges: [
    { id: 1, title: 'Free Domain', iconClass: 'ti ti-world' },
    { id: 2, title: 'Free SSL', iconClass: 'ti ti-shield-check' },
    { id: 3, title: '99.9% Uptime', iconClass: 'ti ti-bolt' },
    { id: 4, title: 'LiteSpeed', iconClass: 'ti ti-server' },
  ],
  brandName: 'Wes Associates',
  tagline:
    'বিনামূল্যে WordPress টেমপ্লেট নিয়ে সহজে ওয়েবসাইট তৈরি করুন। ১-ক্লিক ইম্পোর্টে সম্পূর্ণ ডিজাইন তৈরি করুন এবং Elementor দিয়ে নিজের মতো কাস্টমাইজ করুন।',
  socialLinks: [
    { id: 1, platform: 'facebook', link: '#', iconClass: 'ti ti-brand-facebook', backgroundColor: '#1877f2' },
    { id: 2, platform: 'youtube', link: '#', iconClass: 'ti ti-brand-youtube', backgroundColor: '#dc2626' },
    { id: 3, platform: 'whatsapp', link: '#', iconClass: 'ti ti-brand-whatsapp', backgroundColor: '#22c55e' },
  ],
  menuTitle: 'Our Menu',
  menuLinks: [
    { id: 1, title: 'Import Plugin', link: '#' },
    { id: 2, title: 'Membership', link: '#' },
    { id: 3, title: 'About Us', link: '#' },
    { id: 4, title: 'Contact Us', link: '#' },
  ],
  informationTitle: 'Information',
  informationLinks: [
    { id: 1, title: 'Terms & Condition', link: '#' },
    { id: 2, title: 'Privacy Policy', link: '#' },
    { id: 3, title: 'Delivery Policy', link: '#' },
    { id: 4, title: 'Refund Policy', link: '#' },
  ],
  paymentBadges: ['VISA', 'bKash', 'Nagad', 'Rocket', 'DBBL', 'SSL', 'Upay'],
  copyrightText: 'Copyright © 2025 Wes Associates',
  showSupportBadge: true,
  supportBadgeText: '🇵🇸 #StandWithPalestine',
  showAskAiButton: true,
  askAiText: 'Ask AI',
  askAiLink: '#',
};
