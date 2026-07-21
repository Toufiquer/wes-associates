export interface ISection69Data {
  eyebrow: string;
  title: string;
  logos: string[];
  backgroundColor: string;
  headingColor: string;
  textColor: string;
}

export interface Section69Props {
  data?: ISection69Data | string;
}

export const defaultDataSection69: ISection69Data = {
  eyebrow: 'Our Journey',
  title: 'Our Corporate Clients',
  logos: [
    'https://placehold.co/240x120/ffffff/64748b?text=Client+1',
    'https://placehold.co/240x120/ffffff/64748b?text=Client+2',
    'https://placehold.co/240x120/ffffff/64748b?text=Client+3',
    'https://placehold.co/240x120/ffffff/64748b?text=Client+4',
    'https://placehold.co/240x120/ffffff/64748b?text=Client+5',
    'https://placehold.co/240x120/ffffff/64748b?text=Client+6',
  ],
  backgroundColor: '#f8f8fc',
  headingColor: '#050505',
  textColor: '#8a91aa',
};
