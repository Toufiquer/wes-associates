/*
|-----------------------------------------
| Study Abroad experience hero data for Section 49
|-----------------------------------------
*/

export interface ISection49Data {
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

export interface Section49Props {
  data?: ISection49Data | string;
}

export const defaultDataSection49: ISection49Data = {
  titleLineOne: '১৬ বছরের বিশ্বস্ত পথচলা',
  titleEnglish: 'STUDY ABROAD',
  titleEnglishSuffix: 'সেবায়',
  titleHighlight: 'আপনার স্বপ্নের সঙ্গী',
  descriptionLead: 'গত ১৬ বছর ধরে আমরা শিক্ষার্থীদের পাশে আছি।',
  descriptionAccent: '16 YEARS OF EXPERIENCE',
  descriptionTail:
    '— বিশ্বমানের বিশ্ববিদ্যালয় নির্বাচন থেকে শুরু করে আবেদন, ভিসা ও প্রি-ডিপার্চার সহায়তা পর্যন্ত। Your global education journey starts with trusted guidance.',
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
