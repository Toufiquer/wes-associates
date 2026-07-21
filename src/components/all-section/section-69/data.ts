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
  logos: ['/globe.svg', '/globe.svg', '/globe.svg', '/globe.svg', '/globe.svg', '/globe.svg'],
  backgroundColor: '#f8f8fc',
  headingColor: '#050505',
  textColor: '#8a91aa',
};
