/*
|-----------------------------------------
| Admission process data for Section 56
|-----------------------------------------
*/

export interface ISection56Step {
  number: string;
  title: string;
  description: string;
}

export interface ISection56Data {
  eyebrow: string;
  title: string;
  description: string;
  steps: ISection56Step[];
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  markerColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section56Props {
  data?: ISection56Data | string;
}

export const defaultDataSection56: ISection56Data = {
  eyebrow: 'Admission process',
  title: 'Step-by-step route from counselling to fly abroad.',
  description: 'Students can follow a clear sequence so nothing important is missed.',
  steps: [
    { number: '01', title: 'Free consultation', description: 'Share your goals, budget, academic history, and preferred country.' },
    { number: '02', title: 'Profile evaluation', description: 'We check your eligibility and recommend realistic options.' },
    { number: '03', title: 'University selection', description: 'Choose programs and institutions that match your profile.' },
    { number: '04', title: 'Application and offer letter', description: 'Submit admission applications and manage offer letter follow-ups.' },
    { number: '05', title: 'Tuition deposit and visa file', description: 'Prepare financials, SOP, documents, and final visa application guidance.' },
    { number: '06', title: 'Fly abroad', description: 'Receive pre-departure guidance before your international study journey begins.' },
  ],
  backgroundColor: '#ffffff',
  cardColor: '#ffffff',
  accentColor: '#ed1c24',
  markerColor: '#0b1222',
  headingColor: '#0b1222',
  textColor: '#64748b',
  borderColor: '#e2e8f0',
};
