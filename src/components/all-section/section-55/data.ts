/*
|-----------------------------------------
| Student services data for Section 55
|-----------------------------------------
*/

export interface ISection55Service {
  number: string;
  title: string;
  description: string;
}

export interface ISection55Data {
  eyebrow: string;
  title: string;
  description: string;
  services: ISection55Service[];
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section55Props {
  data?: ISection55Data | string;
}

export const defaultDataSection55: ISection55Data = {
  eyebrow: 'Our services',
  title: 'Everything students need before applying abroad.',
  description: 'A complete service flow from consultation to visa application guidance, built around the requirement notes.',
  services: [
    { number: '01', title: 'Free consultation', description: 'Discuss academic background, target country, budget, English score, and career plans.' },
    { number: '02', title: 'Profile evaluation', description: 'Review SSC, HSC, diploma, bachelor, IELTS, PTE, MOI, or other eligibility factors.' },
    { number: '03', title: 'University selection', description: 'Shortlist universities that match your budget, subject, intake, and admission chances.' },
    { number: '04', title: 'Application support', description: 'Prepare forms, submit applications, and follow up with admission offices.' },
    { number: '05', title: 'Document legalization', description: 'Guide students through certificate, transcript, affidavit, and verification preparation.' },
    { number: '06', title: 'Visa guidance', description: 'Support SOP, financial documents, interview readiness, and final visa submission.' },
  ],
  backgroundColor: '#080c14',
  cardColor: '#111722',
  accentColor: '#ed1c24',
  headingColor: '#ffffff',
  textColor: '#94a3b8',
  borderColor: '#273244',
};
