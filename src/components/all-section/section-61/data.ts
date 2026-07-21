/*
|-----------------------------------------
| Appointment form data for Section 61
|-----------------------------------------
*/

export interface ISection61Data {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  countries: string[];
  proficiencyOptions: string[];
  studentNameLabel: string;
  studentNamePlaceholder: string;
  mobileLabel: string;
  mobilePlaceholder: string;
  countryLabel: string;
  countryPlaceholder: string;
  proficiencyLabel: string;
  proficiencyPlaceholder: string;
  resultLabel: string;
  resultPlaceholder: string;
  educationLabel: string;
  educationPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  buttonText: string;
  backgroundColor: string;
  formColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
}

export interface Section61Props {
  data?: ISection61Data | string;
}

export const defaultDataSection61: ISection61Data = {
  eyebrow: 'Book an appointment',
  title: 'Submit your details for student counselling.',
  description: 'Fill out the short form and the WES Associates team can contact you for consultation. Required fields include name, mobile number, and country choice.',
  benefits: ['Free first counselling session.', 'Country and university guidance.', 'Profile, English proficiency, and result review.'],
  countries: ['United Kingdom', 'United States', 'Canada', 'Australia', 'Europe', 'Malaysia', 'China', 'Sweden'],
  proficiencyOptions: ['IELTS', 'PTE', 'MOI', 'No test'],
  studentNameLabel: 'Student name',
  studentNamePlaceholder: 'Enter your full name',
  mobileLabel: 'Mobile number',
  mobilePlaceholder: '+880 1XXX XXXXXXX',
  countryLabel: 'Country choice',
  countryPlaceholder: 'Select country',
  proficiencyLabel: 'English proficiency',
  proficiencyPlaceholder: 'Select option',
  resultLabel: 'English proficiency result',
  resultPlaceholder: 'Example: IELTS 6.5 or PTE 58',
  educationLabel: 'Educational background',
  educationPlaceholder: 'Example: HSC, Diploma, Bachelor',
  messageLabel: 'Message',
  messagePlaceholder: 'Tell us your preferred subject, intake, or budget',
  buttonText: 'Submit Appointment Request',
  backgroundColor: '#f4f6f8',
  formColor: '#ffffff',
  accentColor: '#ed1c24',
  headingColor: '#0b1222',
  textColor: '#64748b',
  borderColor: '#e2e8f0',
};
