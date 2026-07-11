export interface VideoReview {
  id: number;
  label: string;
  sub: string;
  backgroundColor: string;
  link: string;
}

export interface ISection45Data {
  pageUid: string;
  pageName: string;
  badgeText: string;
  title: string;
  subtitle: string;
  videos: VideoReview[];
}

export interface Section45Props {
  data?: ISection45Data;
}

export const defaultDataSection45: ISection45Data = {
  pageUid: 'section-uid-45',
  pageName: 'Section 45',
  badgeText: 'Trusted Video Reviews',
  title: 'What Creators Say',
  subtitle: 'Creators দের Borbila নিয়ে published YouTube videos এক জায়গায় দেখুন।',
  videos: [
    { id: 1, label: 'Borbila Template Review', sub: 'Creator review and practical walkthrough.', backgroundColor: '#0f172a', link: '#' },
    { id: 2, label: 'Borbila Website Tutorial', sub: 'Step-by-step setup and usage experience.', backgroundColor: '#172554', link: '#' },
    { id: 3, label: 'Borbila Setup Guide', sub: 'Template import and customization guide.', backgroundColor: '#1c1917', link: '#' },
    { id: 4, label: 'Borbila Creator Review', sub: 'Real creator opinion about Borbila.', backgroundColor: '#1a1a2e', link: '#' },
  ],
};

