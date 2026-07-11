import type { PageTemplateData, PageTemplateProps } from '../shared/page-types';

export type ISection1Data = PageTemplateData;
export type Section1Props = PageTemplateProps<ISection1Data>;

export const defaultDataPage1: ISection1Data = {
  pageUid: 'page-uid-1',
  pageName: 'Home',
  eyebrow: 'Complete Business Website',
  title: 'Build trust, explain your service, and guide visitors to action.',
  subtitle:
    'A polished home page layout with strong hero messaging, service highlights, proof points, process, testimonials, and a final conversion section.',
  primaryAction: 'Start Your Project',
  secondaryAction: 'Explore Services',
  sections: [
    {
      eyebrow: 'Hero Value',
      title: 'Clear first impression',
      description: 'Introduce the business with a direct promise, a short value statement, and action buttons visitors can understand instantly.',
      items: ['Strong headline and supporting copy', 'Primary and secondary call-to-action', 'Trust-focused opening message'],
    },
    {
      eyebrow: 'Services',
      title: 'What you offer',
      description: 'Show the main service categories in a scannable way so visitors can quickly decide where to continue.',
      items: ['Website and app development', 'Brand-focused design systems', 'Automation and dashboard solutions'],
    },
    {
      eyebrow: 'Why Choose Us',
      title: 'Proof before persuasion',
      description: 'Build confidence with practical benefits that explain why the business is reliable, useful, and easy to work with.',
      items: ['Fast delivery workflow', 'Transparent communication', 'Responsive support after launch'],
    },
    {
      eyebrow: 'Process',
      title: 'Simple project journey',
      description: 'Explain the path from first discussion to launch with a process that feels organized and low-risk.',
      items: ['Discovery and scope planning', 'Design and content setup', 'Development, testing, and launch'],
    },
    {
      eyebrow: 'Testimonials',
      title: 'Customer confidence',
      description: 'Use client-focused outcomes to show the business can deliver real results across different project needs.',
      items: ['Cleaner online presence', 'Better lead capture', 'Easier content management'],
    },
    {
      eyebrow: 'Final CTA',
      title: 'Move visitors toward contact',
      description: 'Close the page with a focused next step that turns interest into a project inquiry or consultation.',
      items: ['Invite a consultation', 'Repeat the strongest offer', 'Make the next action obvious'],
    },
  ],
};
