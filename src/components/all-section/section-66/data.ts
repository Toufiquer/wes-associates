export interface ISection66Stat {
  value: string;
  label: string;
}

export interface ISection66Data {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  paragraphs: string[];
  stats: ISection66Stat[];
  cardBackgroundImage: string;
  backgroundColor: string;
  cardColor: string;
  headingColor: string;
  accentColor: string;
  statColor: string;
  textColor: string;
}

export interface Section66Props {
  data?: ISection66Data | string;
}

export const defaultDataSection66: ISection66Data = {
  eyebrow: 'Our History',
  title: 'What We',
  highlightedTitle: 'Do?',
  paragraphs: [
    'We aggressively target any issues in the global travel scenario and don’t rest until we find a solution. As VISATHing was founded in Bangladesh, we started from scratch by eliminating recurring visa hassles one by one for Bangladeshi travelers. Over the years we have successfully eradicated the lack of accurate travel/visa information by building the largest visa database www.visathing.com with accurate visa and travel information.',
    'We tried to answer the questions of Bangladeshi travelers through a dedicated visa hotline and social media.',
    'We have developed services that would guide a traveler to prepare a visa application with proper documentation with our premium consultancy. With our Visa Processing Service, we have enabled travelers to avoid unnecessary cross-country trips to non-resident embassies for visa processing.',
  ],
  stats: [
    { value: '196+', label: 'Countries Visa Information' },
    { value: '1,000+', label: 'Organization Relying on Us' },
    { value: '5.7M+', label: 'Travelers Served from Bangladesh' },
  ],
  cardBackgroundImage: '/globe.svg',
  backgroundColor: '#f8f8fc',
  cardColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  statColor: '#ff9400',
  textColor: '#5f6780',
};
