/*
|-----------------------------------------
| Study destinations data for Section 53
|-----------------------------------------
*/

export interface ISection53Destination {
  code: string;
  name: string;
  description: string;
}

export interface ISection53Data {
  eyebrow: string;
  title: string;
  description: string;
  destinations: ISection53Destination[];
  backgroundColor: string;
  cardColor: string;
  gradientStart: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
}

export interface Section53Props {
  data?: ISection53Data | string;
}

export const defaultDataSection53: ISection53Data = {
  eyebrow: 'Countries we serve',
  title: 'Choose the right study destination.',
  description: 'Explore countries based on tuition, scholarship options, post-study work rules, language requirements, and career opportunities.',
  destinations: [
    { code: 'UK', name: 'United Kingdom', description: 'Fast degrees, strong academic reputation, and wide course choices.' },
    { code: 'USA', name: 'United States', description: 'Flexible majors, research options, and global career exposure.' },
    { code: 'CAN', name: 'Canada', description: 'Quality education, multicultural cities, and practical work pathways.' },
    { code: 'AUS', name: 'Australia', description: 'Career-focused programs, welcoming campuses, and strong student support.' },
    { code: 'EU', name: 'Europe', description: 'Affordable programs, English-taught courses, and cultural diversity.' },
    { code: 'MY', name: 'Malaysia', description: 'Budget-friendly tuition with international branch campus options.' },
    { code: 'CN', name: 'China', description: 'Scholarship-friendly programs in medicine, engineering, and business.' },
    { code: 'SE', name: 'Sweden', description: 'Innovation-led education with strong research and sustainability programs.' },
  ],
  backgroundColor: '#ffffff',
  cardColor: '#ffffff',
  gradientStart: '#12233c',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
};
