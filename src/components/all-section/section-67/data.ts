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
  missionEyebrow: 'Our Journey',
  missionTitle: 'Our',
  missionHighlightedTitle: 'Mission',
  missionDescription:
    'Our mission is to eliminate the fear of complicated processing systems for acquiring visa/travel permits from every international traveler and help every government to make efficient & informed visa decisions.',
  visionEyebrow: 'Our Journey',
  visionTitle: 'Our',
  visionHighlightedTitle: 'Vision',
  visionDescription:
    'Our Vision is to significantly minimize human intervention, maximize virtual communications, and include computerized service processes in the travel document acquisition system. We believe it will create a borderless travel experience for every international traveler.',
  missionPrimaryImage: '/globe.svg',
  missionTopImage: '/globe.svg',
  missionBottomImage: '/globe.svg',
  visionPrimaryImage: '/globe.svg',
  visionTopImage: '/globe.svg',
  visionBottomImage: '/globe.svg',
  backgroundColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  textColor: '#5f6780',
};
