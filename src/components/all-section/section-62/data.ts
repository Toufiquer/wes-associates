/*
|-----------------------------------------
| Document checklist data for Section 62
|-----------------------------------------
*/

export interface ISection62DocumentGroup {
  title: string;
  description: string;
}

export interface ISection62Data {
  eyebrow: string;
  title: string;
  description: string;
  documentGroups: ISection62DocumentGroup[];
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section62Props {
  data?: ISection62Data | string;
}

export const defaultDataSection62: ISection62Data = {
  eyebrow: 'Document checklist',
  title: 'Prepare your file before deadlines.',
  description: 'A well-organized file helps universities and visa officers understand your academic and financial profile faster.',
  documentGroups: [
    { title: 'Academic documents', description: 'Certificates, transcripts, grading scale, and institution information.' },
    { title: 'Identity documents', description: 'Passport, photos, birth certificate, and national ID where needed.' },
    { title: 'Financial documents', description: 'Bank statements, sponsor documents, income evidence, and affidavits.' },
  ],
  backgroundColor: '#ffffff',
  cardColor: '#ffffff',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
  borderColor: '#e2e8f0',
};
