export interface ISection65Data {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  topImage: string;
  bottomImage: string;
  centerImage: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  textColor: string;
}

export interface Section65Props {
  data?: ISection65Data | string;
}

export const defaultDataSection65: ISection65Data = {
  eyebrow: 'About WES Associates',
  title: 'Who are',
  highlightedTitle: 'WES Associates?',
  description:
    'WES Associates is a Bangladesh-based education consultancy dedicated to helping students pursue their study-abroad goals with trusted guidance and personalized support. From university selection and applications to visa guidance and pre-departure preparation, our experienced team supports students across Bangladesh, wherever they are in the country.',
  topImage: 'https://placehold.co/480x320/e2e8f0/475569?text=About+Top',
  bottomImage: 'https://placehold.co/480x320/e2e8f0/475569?text=About+Bottom',
  centerImage: 'https://placehold.co/720x520/dbeafe/1d4ed8?text=About+WES+Associates',
  backgroundColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  textColor: '#5f6780',
};
