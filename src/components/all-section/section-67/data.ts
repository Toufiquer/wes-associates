export interface ISection67Data {
  missionEyebrow: string;
  missionTitle: string;
  missionHighlightedTitle: string;
  missionDescription: string;
  visionEyebrow: string;
  visionTitle: string;
  visionHighlightedTitle: string;
  visionDescription: string;
  missionPrimaryImage: string;
  missionTopImage: string;
  missionBottomImage: string;
  visionPrimaryImage: string;
  visionTopImage: string;
  visionBottomImage: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  textColor: string;
}

export interface Section67Props {
  data?: ISection67Data | string;
}

export const defaultDataSection67: ISection67Data = {
  missionEyebrow: 'WES Associates',
  missionTitle: 'Our',
  missionHighlightedTitle: 'Mission',
  missionDescription:
    'Our mission is to empower students across Bangladesh with trusted, personalized guidance for studying abroad. WES Associates simplifies university selection, applications, documentation, visa guidance, and pre-departure preparation so every student can move forward with confidence.',
  visionEyebrow: 'WES Associates',
  visionTitle: 'Our',
  visionHighlightedTitle: 'Vision',
  visionDescription:
    'Our vision is to become Bangladesh’s most trusted study-abroad consultancy by making quality international education guidance accessible to students in every part of the country. We aim to connect each student with the right opportunities and help them build a successful global future.',
  missionPrimaryImage: 'https://placehold.co/720x520/dbeafe/1d4ed8?text=Our+Mission',
  missionTopImage: 'https://placehold.co/480x320/e2e8f0/475569?text=Mission+Top',
  missionBottomImage: 'https://placehold.co/480x320/e2e8f0/475569?text=Mission+Bottom',
  visionPrimaryImage: 'https://placehold.co/720x520/dbeafe/1d4ed8?text=Our+Vision',
  visionTopImage: 'https://placehold.co/480x320/e2e8f0/475569?text=Vision+Top',
  visionBottomImage: 'https://placehold.co/480x320/e2e8f0/475569?text=Vision+Bottom',
  backgroundColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  textColor: '#5f6780',
};
