export interface FooterLink {
  id: number;
  title: string;
  link: string;
}

export interface IFooter4Data {
  brandName: string;
  tagline: string;

  destinationsTitle: string;
  destinationsLinks: FooterLink[];

  servicesTitle: string;
  servicesLinks: FooterLink[];

  contactTitle: string;
  contactEmail: string;
  contactPhone: string;

  copyrightText: string;
  bottomRightText: string;
}

export const defaultDataFooter4: IFooter4Data = {
  brandName: 'WES Associates',
  tagline:
    'Professional study abroad consultancy for students from Bangladesh, with support for consultation, admission, scholarship, documentation, and visa guidance.',

  destinationsTitle: 'Destinations',
  destinationsLinks: [
    { id: 1, title: 'UK', link: '#' },
    { id: 2, title: 'USA', link: '#' },
    { id: 3, title: 'Canada', link: '#' },
    { id: 4, title: 'Australia', link: '#' },
  ],

  servicesTitle: 'Services',
  servicesLinks: [
    { id: 1, title: 'Consultation', link: '#' },
    { id: 2, title: 'Admission', link: '#' },
    { id: 3, title: 'Scholarship', link: '#' },
    { id: 4, title: 'Visa guidance', link: '#' },
  ],

  contactTitle: 'Contact',
  contactEmail: 'info@wesassociates.com',
  contactPhone: '+880 1300-111222',

  copyrightText: '© 2026 WES Associates. All rights reserved.',
  bottomRightText: 'Designed for responsive study abroad consultation.',
};
