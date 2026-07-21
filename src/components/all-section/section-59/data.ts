/*
|-----------------------------------------
| Visa support data for Section 59
|-----------------------------------------
*/

export interface ISection59SupportItem {
  title: string;
  description: string;
}

export interface ISection59Data {
  eyebrow: string;
  title: string;
  description: string;
  supportItems: ISection59SupportItem[];
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section59Props {
  data?: ISection59Data | string;
}

export const defaultDataSection59: ISection59Data = {
  eyebrow: 'Visa support',
  title: 'Prepare a stronger, cleaner visa file.',
  description: 'We guide students through the documents and explanation needed for a confident visa application.',
  supportItems: [
    { title: 'SOP review', description: 'Purpose, study plan, career logic, and country selection explained professionally.' },
    { title: 'Document checklist', description: 'Academic, financial, identity, admission, and supporting paperwork organized clearly.' },
    { title: 'Interview guidance', description: 'Practice common questions and build confidence for embassy interviews.' },
    { title: 'Final review', description: 'Check consistency before submission to reduce avoidable mistakes.' },
  ],
  backgroundColor: '#080c14',
  cardColor: '#111722',
  accentColor: '#ed1c24',
  headingColor: '#ffffff',
  textColor: '#94a3b8',
  borderColor: '#273244',
};
