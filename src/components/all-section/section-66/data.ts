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
  eyebrow: 'About WES Associates',
  title: 'What We',
  highlightedTitle: 'Do?',
  paragraphs: [
    'WES Associates is a Bangladesh-based education consultancy committed to helping students confidently pursue higher education opportunities abroad. We provide clear, reliable, and personalized guidance at every stage of the study-abroad journey.',
    'Our experienced team supports students with course and university selection, applications, documentation, visa guidance, and pre-departure preparation according to their individual goals.',
    'We work with students from every part of Bangladesh. Wherever you live in the country, WES Associates is ready to provide accessible, professional support and help turn your international education plans into reality.',
  ],
  stats: [
    { value: 'Nationwide', label: 'Support Across Bangladesh' },
    { value: 'End-to-End', label: 'Study Abroad Guidance' },
    { value: 'Personalized', label: 'Student Support' },
  ],
  cardBackgroundImage: 'https://placehold.co/1200x720/e2e8f0/475569?text=Our+History',
  backgroundColor: '#f8f8fc',
  cardColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  statColor: '#ff9400',
  textColor: '#5f6780',
};
