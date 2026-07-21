/*
|-----------------------------------------
| News and blog data for Section 63
|-----------------------------------------
*/

export interface ISection63Article {
  title: string;
  description: string;
}

export interface ISection63Data {
  eyebrow: string;
  title: string;
  ctaText: string;
  ctaLink: string;
  articles: ISection63Article[];
  backgroundColor: string;
  cardColor: string;
  gradientStart: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section63Props {
  data?: ISection63Data | string;
}

export const defaultDataSection63: ISection63Data = {
  eyebrow: 'Latest news and blog',
  title: 'Helpful updates for study abroad planning.',
  ctaText: 'Ask a counsellor',
  ctaLink: '#contact',
  articles: [
    { title: 'How to choose your study destination', description: 'Compare tuition, work options, scholarships, and visa requirements before deciding.' },
    { title: 'Scholarship planning tips', description: 'Start early, prepare documents, and target universities that match your profile.' },
    { title: 'Visa file preparation guide', description: 'Keep your SOP, financial documents, and admission evidence consistent.' },
  ],
  backgroundColor: '#f4f6f8',
  cardColor: '#ffffff',
  gradientStart: '#12233c',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
  borderColor: '#e2e8f0',
};
