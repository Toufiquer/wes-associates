/*
|-----------------------------------------
| IELTS hero data for Section 49
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
  titleLineOne: 'ভয়কে জয় করে',
  titleEnglish: 'IELTS',
  titleEnglishSuffix: '-এ',
  titleHighlight: 'সফল হোন',
  descriptionLead: 'রাশেদ ভাইয়ের ইউটিউব ক্লাস দেখে',
  descriptionAccent: 'IELTS-এ',
  descriptionTail:
    'সফল হয়েছেন হাজারো শিক্ষার্থী - এবার আপনার পালা! IELTS পরীক্ষায় সফলতার জন্য প্রয়োজন সঠিক দিকনির্দেশনা ও প্রস্তুতির কৌশল।',
  primaryButtonText: 'অ্যাডমিশন ওপেন',
  primaryButtonLink: '/application',
  secondaryButtonText: 'মক টেস্ট',
  secondaryButtonLink: '/test',
  backgroundColor: '#fafaf9',
  gridColor: '#e5e7eb',
  headingColor: '#111827',
  accentColor: '#cf0a2c',
  descriptionColor: '#475569',
};
