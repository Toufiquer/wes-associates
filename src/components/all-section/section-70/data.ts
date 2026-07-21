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
  eyebrow: 'VISATHing! Appointment',
  title: 'Get VISATHing!',
  highlightedTitle: 'Free Appointment',
  paragraphs: [
    'Make your appointment with VISATHing through the appointment portal. Click on appointment, choose your visa type, and pick an available slot. Attend the VISATHing office on time with the required documents. Stay updated for smooth visa processing with VISATHing.',
    'You can start your visa application journey by contacting VISATHing. There is only one branch of VISATHing in Dhaka, Bangladesh. You can also apply to the VISATHing online portal to reduce your visa processing time.',
    "VISATHing Bangladesh's opening hour is 9:30 AM to 6:30 PM.",
  ],
  primaryButtonText: 'Book Appointment',
  primaryButtonUrl: '#',
  secondaryButtonText: 'Ask Question',
  secondaryButtonUrl: '#',
  onlineAppointmentImage: '/globe.svg',
  physicalAppointmentImage: '/globe.svg',
  backgroundColor: '#ffffff',
  headingColor: '#050505',
  accentColor: '#2477f2',
  textColor: '#5f6780',
  buttonColor: '#303374',
};
