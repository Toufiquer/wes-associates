/*
|-----------------------------------------
| Frequently asked questions data for Section 64
|-----------------------------------------
*/

export interface ISection65Faq {
  question: string;
  answer: string;
}

export interface ISection65Data {
  eyebrow: string;
  title: string;
  description: string;
  faqs: ISection65Faq[];
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section65Props {
  data?: ISection65Data | string;
}

export const defaultDataSection65: ISection65Data = {
  eyebrow: 'FAQ',
  title: 'Common student questions.',
  description: 'These quick answers help students understand what to expect before booking counselling.',
  faqs: [
    { question: 'Can I apply without IELTS?', answer: 'Some universities may accept MOI, PTE, or no-test pathways depending on your country, institution, and academic background.' },
    { question: 'Which country is best for me?', answer: 'The right destination depends on your budget, subject, academic profile, career goal, and preferred post-study options.' },
    { question: 'Do you help with scholarships?', answer: 'Yes. We identify suitable merit-based, university-funded, and country-specific scholarship opportunities.' },
    { question: 'What should I bring for counselling?', answer: 'Bring your academic documents, passport if available, English test result, and an idea of your preferred subject and budget.' },
  ],
  backgroundColor: '#ffffff',
  cardColor: '#ffffff',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
  borderColor: '#e2e8f0',
};
