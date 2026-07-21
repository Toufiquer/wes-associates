/*
|-----------------------------------------
| Scholarship opportunities data for Section 57
|-----------------------------------------
*/

export interface ISection57Opportunity {
  title: string;
  description: string;
}

export interface ISection57Data {
  eyebrow: string;
  title: string;
  description: string;
  opportunities: ISection57Opportunity[];
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section57Props {
  data?: ISection57Data | string;
}

export const defaultDataSection57: ISection57Data = {
  eyebrow: 'Scholarships',
  title: 'Find opportunities that can reduce your study cost.',
  description: 'Scholarship availability depends on academic results, English proficiency, country, subject, intake, and university policy. We help students identify and apply to suitable options.',
  opportunities: [
    { title: 'Merit scholarships', description: 'For students with strong academic performance and competitive profiles.' },
    { title: 'Country-wise awards', description: 'Options for the UK, USA, Canada, Australia, Europe, Malaysia, China, and more.' },
    { title: 'University discounts', description: 'Tuition waivers and early-bird awards from selected institutions.' },
    { title: 'Application timing', description: 'Plan early so scholarship deadlines do not close before your file is ready.' },
  ],
  backgroundColor: '#f4f6f8',
  cardColor: '#ffffff',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
  borderColor: '#e2e8f0',
};
