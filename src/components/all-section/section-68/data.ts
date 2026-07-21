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
  titlePrefix: 'Why choose VISATHing for your',
  highlightedTitle: 'visa processing',
  titleSuffix: 'needs?',
  paragraphs: [
    'Some visa processing centers have reliability issues because they don’t have a secure server system. This creates the possibility of visa rejection.',
    "There are lots of visa processing support centers in Bangladesh. When you look for expertise and experience, few of them are worthy to qualify. In terms of expertise and experience, VISATHing is the only place where people can get reliable service. VISATHing's knowledge of different visa policies is authentic and professional.",
    'VISATHing is a technology-based visa service provider in Bangladesh. You can get an A to Z visa processing service through VISATHing online visa processing for Bangladesh.',
  ],
  primaryImage: '/globe.svg',
  topImage: '/globe.svg',
  bottomImage: '/globe.svg',
  backgroundColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  textColor: '#5f6780',
};
