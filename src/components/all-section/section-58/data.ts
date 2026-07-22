/*
|-----------------------------------------
| Study Abroad experience hero data for Section 49
|-----------------------------------------
*/

export interface ISection58Data {
  titleLineOne: string;
  titleEnglish: string;
  titleEnglishSuffix: string;
  titleHighlight: string;
  descriptionLead: string;
  descriptionAccent: string;
  descriptionTail: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundColor: string;
  gridColor: string;
  headingColor: string;
  accentColor: string;
  descriptionColor: string;
}

export interface Section58Props {
  data?: ISection58Data | string;
}

export const defaultDataSection58: ISection58Data = {
  titleLineOne: '১৬ বছরের অভিজ্ঞতায়',
  titleEnglish: 'STUDY ABROAD',
  titleEnglishSuffix: 'START',
  titleHighlight: 'YOUR STORY.',
  descriptionLead: 'স্বপ্ন আপনার,',
  descriptionAccent: '16 YEARS OF TRUST',
  descriptionTail: 'সঠিক পথ দেখানোর দায়িত্ব আমাদের।',
  primaryButtonText: 'ফ্রি কাউন্সেলিং',
  primaryButtonLink: '/application',
  secondaryButtonText: 'Apply Now',
  secondaryButtonLink: '/application',
  backgroundColor: '#fafaf9',
  gridColor: '#e5e7eb',
  headingColor: '#111827',
  accentColor: '#cf0a2c',
  descriptionColor: '#475569',
};
