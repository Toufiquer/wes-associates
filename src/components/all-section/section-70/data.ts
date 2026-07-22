export interface ISection70Data {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  paragraphs: string[];
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  onlineAppointmentImage: string;
  physicalAppointmentImage: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  textColor: string;
  buttonColor: string;
}

export interface Section70Props {
  data?: ISection70Data | string;
}

export const defaultDataSection70: ISection70Data = {
  eyebrow: 'WES Associates Consultation',
  title: 'Get Your',
  highlightedTitle: 'Free Consultation',
  paragraphs: [
    'Book a free consultation with WES Associates to discuss your study-abroad goals. Our experienced counselors will help you understand suitable destinations, courses, universities, and the next steps for your application.',
    'WES Associates supports students across Bangladesh. Whether you live in Dhaka or anywhere else in the country, you can connect with our team through an online consultation and receive personalized guidance without unnecessary travel.',
    'Bring your academic information and questions to your consultation so our team can provide clear, relevant guidance for your international education journey.',
  ],
  primaryButtonText: 'Book Consultation',
  primaryButtonUrl: '#',
  secondaryButtonText: 'Ask Question',
  secondaryButtonUrl: '#',
  onlineAppointmentImage: 'https://placehold.co/720x520/dbeafe/1d4ed8?text=Online+Appointment',
  physicalAppointmentImage: 'https://placehold.co/720x520/e2e8f0/475569?text=In-Person+Consultation',
  backgroundColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  textColor: '#5f6780',
  buttonColor: '#303374',
};
