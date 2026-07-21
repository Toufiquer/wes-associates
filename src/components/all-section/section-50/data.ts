/*
|-----------------------------------------
| Statistics strip data for Section 50
|-----------------------------------------
*/

export interface ISection50Stat {
  value: string;
  label: string;
}

export interface ISection50Data {
  stats: ISection50Stat[];
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section50Props {
  data?: ISection50Data | string;
}

export const defaultDataSection50: ISection50Data = {
  stats: [
    { value: '12+', label: 'Popular study destinations' },
    { value: '100%', label: 'Transparent admission process' },
    { value: '1:1', label: 'Personalized counselling' },
    { value: '24h', label: 'Quick response for students' },
  ],
  backgroundColor: '#ffffff',
  accentColor: '#ed1c24',
  textColor: '#0b1222',
  borderColor: '#e2e8f0',
};
