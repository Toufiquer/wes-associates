/*
|-----------------------------------------
| Student journey data for Section 54
|-----------------------------------------
*/

export interface ISection54Step {
  number: string;
  title: string;
}

export interface ISection54Data {
  eyebrow: string;
  title: string;
  description: string;
  originLabel: string;
  originTitle: string;
  originDescription: string;
  destinationLabel: string;
  destinationTitle: string;
  destinationDescription: string;
  steps: ISection54Step[];
  sectionBackgroundColor: string;
  gradientStart: string;
  gradientEnd: string;
  accentColor: string;
  stepCardColor: string;
  stepTextColor: string;
}

export interface Section54Props {
  data?: ISection54Data | string;
}

export const defaultDataSection54: ISection54Data = {
  eyebrow: 'Visual student journey',
  title: 'From Bangladesh to the USA through WES Associates.',
  description: 'See how a student can move from first counselling to a USA campus with a guided admission, scholarship, document, and visa process.',
  originLabel: 'Starting point',
  originTitle: 'Bangladesh',
  originDescription: 'Profile check, counselling, and destination planning.',
  destinationLabel: 'Destination',
  destinationTitle: 'United States',
  destinationDescription: 'Admission, visa guidance, and pre-departure support.',
  steps: [
    { number: '01', title: 'Student consultation' },
    { number: '02', title: 'USA university shortlist' },
    { number: '03', title: 'Application and offer' },
    { number: '04', title: 'Visa and fly abroad' },
  ],
  sectionBackgroundColor: '#f4f6f8',
  gradientStart: '#132846',
  gradientEnd: '#ce1b2b',
  accentColor: '#ed1c24',
  stepCardColor: '#ffffff',
  stepTextColor: '#0b1222',
};
