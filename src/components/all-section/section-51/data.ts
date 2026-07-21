/*
|-----------------------------------------
| About WES data for Section 51
|-----------------------------------------
*/

export interface ISection51Data {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  backgroundColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
}

export interface Section51Props {
  data?: ISection51Data | string;
}

export const defaultDataSection51: ISection51Data = {
  eyebrow: 'About WES Associates',
  title: 'Experienced counselling for a smarter study abroad journey.',
  description:
    'WES Associates is built for students who need practical direction, not confusing promises. We review your academic background, English proficiency, budget, career goals, and preferred destination before recommending the best admission route.',
  highlights: [
    'Personalized guidance instead of one-size-fits-all advice.',
    'Transparent application, scholarship, and visa preparation support.',
    'Country-wise documentation checklist and timeline planning.',
  ],
  backgroundColor: '#ffffff',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
};
