export interface CountryFact {
  id: string;
  label: string;
  value: string;
}

export interface CountryHighlight {
  id: string;
  title: string;
  description: string;
}

export interface IPage10Data {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  titlePrefix: string;
  countryName: string;
  heroDescription: string;
  heroImage: string;
  flagImage: string;
  mapImage: string;
  facts: CountryFact[];
  aboutTitle: string;
  aboutDescription: string;
  cultureTitle: string;
  cultureDescription: string;
  studentLifeTitle: string;
  studentLifeDescription: string;
  highlightsTitle: string;
  highlights: CountryHighlight[];
  ctaTitle: string;
  ctaDescription: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  backgroundColor: string;
  surfaceColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
}

export interface Page10Props {
  data?: IPage10Data | string;
}

export const defaultDataPage10: IPage10Data = {
  pageUid: 'page-uid-10',
  pageName: 'About the Country',
  eyebrow: 'Study Destination',
  titlePrefix: 'About',
  countryName: 'Canada',
  heroDescription:
    'Discover the character, opportunities, and student experience that make Canada an inspiring destination for international education.',
  heroImage: '/globe.svg',
  flagImage: '/globe.svg',
  mapImage: '/globe.svg',
  facts: [
    { id: 'fact-capital', label: 'Capital', value: 'Ottawa' },
    { id: 'fact-language', label: 'Languages', value: 'English & French' },
    { id: 'fact-currency', label: 'Currency', value: 'Canadian Dollar' },
    { id: 'fact-region', label: 'Region', value: 'North America' },
  ],
  aboutTitle: 'A welcoming place to learn and grow',
  aboutDescription:
    'Canada combines globally respected education with diverse communities, modern cities, and remarkable natural landscapes. Students can experience a supportive multicultural environment while building academic knowledge and practical skills.',
  cultureTitle: 'Culture and community',
  cultureDescription:
    'People from many cultures call Canada home. This diversity shapes everyday life, food, festivals, arts, and campus communities, helping international students feel connected while discovering new perspectives.',
  studentLifeTitle: 'Life as an international student',
  studentLifeDescription:
    'Students can explore vibrant cities, welcoming campuses, outdoor activities, and community events while developing independence and lasting international connections.',
  highlightsTitle: 'Why students choose Canada',
  highlights: [
    { id: 'highlight-education', title: 'Academic Excellence', description: 'Learn through respected institutions, modern facilities, and career-focused programs.' },
    { id: 'highlight-community', title: 'Multicultural Life', description: 'Join diverse, inclusive communities and experience cultures from around the world.' },
    { id: 'highlight-opportunity', title: 'Future Opportunities', description: 'Develop practical skills, professional confidence, and a strong international network.' },
  ],
  ctaTitle: 'Ready to explore your study options?',
  ctaDescription: 'Speak with our education counsellors and plan the next step of your journey.',
  primaryButtonText: 'Book Counselling',
  primaryButtonUrl: '#',
  secondaryButtonText: 'Explore Programs',
  secondaryButtonUrl: '#',
  backgroundColor: '#f8fafc',
  surfaceColor: '#ffffff',
  headingColor: '#0f172a',
  textColor: '#5f6b7a',
  accentColor: '#2563eb',
};
