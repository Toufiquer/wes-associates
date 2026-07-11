import type { PageTemplateData, PageTemplateProps } from '../shared/page-types';

export type ISection2Data = PageTemplateData;
export type Section2Props = PageTemplateProps<ISection2Data>;

export const defaultDataPage2: ISection2Data = {
  pageUid: 'page-uid-2',
  pageName: 'About',
  eyebrow: 'About The Company',
  title: 'A practical team focused on clear strategy, clean design, and dependable delivery.',
  subtitle:
    'This About page explains who the business is, what it believes, how it works, and why customers can trust the team with important digital projects.',
  primaryAction: 'Meet The Team',
  secondaryAction: 'View Our Work',
  sections: [
    {
      eyebrow: 'Story',
      title: 'Who we are',
      description: 'Present the company background with a confident but human tone that helps visitors understand the team behind the work.',
      items: ['Focused digital delivery', 'Business-first design decisions', 'Long-term client relationships'],
    },
    {
      eyebrow: 'Mission',
      title: 'What we are building toward',
      description: 'Explain the company mission in a way that connects services to customer outcomes, not just internal ambition.',
      items: ['Make digital tools easier to use', 'Turn ideas into working products', 'Support growth with practical systems'],
    },
    {
      eyebrow: 'Values',
      title: 'How we make decisions',
      description: 'Show the principles that guide project planning, communication, quality, and client experience.',
      items: ['Clarity before complexity', 'Reliable timelines', 'Design that supports real workflows'],
    },
    {
      eyebrow: 'Experience',
      title: 'What clients can expect',
      description: 'Describe the working relationship so prospects know what happens after they start a conversation.',
      items: ['Structured discovery', 'Regular progress updates', 'Testing before handover'],
    },
    {
      eyebrow: 'Promise',
      title: 'A partner beyond launch',
      description: 'Close the page by positioning the company as a long-term partner for improvements, support, and future growth.',
      items: ['Post-launch fixes', 'Performance improvements', 'Feature expansion support'],
    },
  ],
};
