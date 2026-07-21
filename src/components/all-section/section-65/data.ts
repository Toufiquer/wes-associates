export interface ISection65Data {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  topImage: string;
  bottomImage: string;
  centerImage: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  textColor: string;
}

export interface Section65Props {
  data?: ISection65Data | string;
}

export const defaultDataSection65: ISection65Data = {
  eyebrow: 'About VISATHing!',
  title: 'What is',
  highlightedTitle: 'VISATHing!',
  description:
    'VISATHing is a registered trademark of VISATHing Global Holding LLC based out of UAE operating business in Bangladesh, India, Nepal, and UAE. We are a travel technology company striving to build a convenient travel ecosystem by connecting different immigration/consular authorities to the global population of travelers with the help of innovative services and the latest technologies.',
  topImage: 'https://placehold.co/480x320/e2e8f0/475569?text=About+Top',
  bottomImage: 'https://placehold.co/480x320/e2e8f0/475569?text=About+Bottom',
  centerImage: 'https://placehold.co/720x520/dbeafe/1d4ed8?text=About+VISATHing',
  backgroundColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  textColor: '#5f6780',
};
