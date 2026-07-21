/*
|-----------------------------------------
| Why choose us data for Section 52
|-----------------------------------------
*/

export interface ISection52Reason {
  marker: string;
  title: string;
  description: string;
}

export interface ISection52Data {
  eyebrow: string;
  title: string;
  description: string;
  reasons: ISection52Reason[];
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
}

export interface Section52Props {
  data?: ISection52Data | string;
}

export const defaultDataSection52: ISection52Data = {
  eyebrow: 'Why choose us',
  title: 'Clear, responsive, and student-first.',
  description: 'From the first profile check to final visa guidance, every step is planned around the student’s real eligibility and timeline.',
  reasons: [
    {
      marker: 'C',
      title: 'Expert counsellors',
      description: 'Get destination, university, and subject recommendations based on your profile and goals.',
    },
    {
      marker: 'P',
      title: 'Personalized guidance',
      description: 'Every student receives a practical application plan with clear next actions.',
    },
    {
      marker: 'T',
      title: 'Transparent process',
      description: 'Know your required documents, expected timeline, fees, and admission stages before you apply.',
    },
    {
      marker: 'S',
      title: 'Scholarship support',
      description: 'Find merit-based, country-wise, and university-funded scholarship opportunities.',
    },
    {
      marker: 'R',
      title: 'Fast response',
      description: 'Students receive quick follow-up for document checks, offers, and visa updates.',
    },
    {
      marker: 'L',
      title: 'Local to global',
      description: 'Support from Bangladesh with global admission options across top destinations.',
    },
  ],
  backgroundColor: '#f4f6f8',
  cardColor: '#ffffff',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
};
