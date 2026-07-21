/*
|-----------------------------------------
| Student success data for Section 60
|-----------------------------------------
*/

export interface ISection60Testimonial {
  quote: string;
  attribution: string;
}

export interface ISection60Data {
  eyebrow: string;
  title: string;
  description: string;
  testimonials: ISection60Testimonial[];
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section60Props {
  data?: ISection60Data | string;
}

export const defaultDataSection60: ISection60Data = {
  eyebrow: 'Student success',
  title: 'Guidance that makes the next step visible.',
  description: 'WES Associates focuses on practical outcomes: admission readiness, document accuracy, scholarship potential, and visa preparation.',
  testimonials: [
    { quote: 'The team helped me understand which country and course fit my budget and result.', attribution: 'Prospective student - UK pathway' },
    { quote: 'My documents and SOP became much clearer after the counselling session.', attribution: 'Prospective student - Canada pathway' },
    { quote: 'I got a full checklist and knew exactly what to prepare for application.', attribution: 'Prospective student - Europe pathway' },
  ],
  backgroundColor: '#ffffff',
  cardColor: '#ffffff',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
  borderColor: '#e2e8f0',
};
