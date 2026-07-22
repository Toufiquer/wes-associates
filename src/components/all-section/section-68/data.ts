export interface ISection68Data {
  titlePrefix: string;
  highlightedTitle: string;
  titleSuffix: string;
  paragraphs: string[];
  primaryImage: string;
  topImage: string;
  bottomImage: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  textColor: string;
}

export interface Section68Props {
  data?: ISection68Data | string;
}

export const defaultDataSection68: ISection68Data = {
  titlePrefix: 'Why choose WES Associates for your',
  highlightedTitle: 'study-abroad',
  titleSuffix: 'needs?',
  paragraphs: [
    'Choosing the right course, university, and destination can shape your future. WES Associates provides clear, personalized guidance so you can make informed decisions with confidence.',
    'Our experienced team supports you throughout the entire process, including university selection, applications, documentation, visa guidance, and pre-departure preparation.',
    'WES Associates is based in Bangladesh and works with students across the entire country. Wherever you live, you can access reliable, professional support for your international education journey.',
  ],
  primaryImage: 'https://placehold.co/720x520/dbeafe/1d4ed8?text=Study+Abroad+Guidance',
  topImage: 'https://placehold.co/480x320/e2e8f0/475569?text=Why+Choose+Us',
  bottomImage: 'https://placehold.co/480x320/e2e8f0/475569?text=Reliable+Service',
  backgroundColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  textColor: '#5f6780',
};
