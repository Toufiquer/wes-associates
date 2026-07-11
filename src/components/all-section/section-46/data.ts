export interface ISection46Data {
  pageUid: string;
  pageName: string;
  text: string;
  link: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface Section46Props {
  data?: ISection46Data;
}

export const defaultDataSection46: ISection46Data = {
  pageUid: 'section-uid-46',
  pageName: 'Section 46',
  text: '🚀 We Recommend Hostinger',
  link: '#',
  gradientFrom: '#2563eb',
  gradientTo: '#7c3aed',
};

