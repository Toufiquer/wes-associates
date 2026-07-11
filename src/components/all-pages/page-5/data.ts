import type { PageTemplateData, PageTemplateProps } from '../shared/page-types';

export type ISection5Data = PageTemplateData;
export type Section5Props = PageTemplateProps<ISection5Data>;

export const defaultDataPage5: ISection5Data = {
  pageUid: 'page-uid-5',
  pageName: 'Terms & Conditions',
  eyebrow: 'Terms & Conditions',
  title: 'The rules, responsibilities, and expectations for using the website and services.',
  subtitle:
    'This Terms & Conditions page outlines service use, client responsibilities, payment expectations, intellectual property, and limitation of liability.',
  primaryAction: 'Read Terms',
  secondaryAction: 'Ask A Question',
  sections: [
    {
      eyebrow: 'Acceptance',
      title: 'Using the website',
      description: 'Explain that visitors agree to the terms when they browse the website, submit forms, or request services.',
      items: ['Use the website lawfully', 'Provide accurate information', 'Stop using the website if terms are not accepted'],
    },
    {
      eyebrow: 'Services',
      title: 'Project scope and delivery',
      description: 'Clarify that timelines, deliverables, revisions, and handover details should be confirmed in the project agreement.',
      items: ['Scope is agreed before work starts', 'Change requests may affect cost or timeline', 'Client feedback is required for progress'],
    },
    {
      eyebrow: 'Payments',
      title: 'Fees and billing',
      description: 'Set basic expectations around invoices, payment schedules, deposits, and work pauses caused by overdue payments.',
      items: ['Payment terms are shared in proposals', 'Deposits may be required', 'Late payments can delay delivery'],
    },
    {
      eyebrow: 'Ownership',
      title: 'Content and intellectual property',
      description: 'Explain ownership of client-provided content, delivered assets, third-party tools, and reusable development patterns.',
      items: ['Client owns provided brand assets', 'Final ownership follows payment and agreement', 'Third-party tools follow their own licenses'],
    },
  ],
};
