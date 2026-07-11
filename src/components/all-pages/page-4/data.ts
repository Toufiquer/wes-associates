import type { PageTemplateData, PageTemplateProps } from '../shared/page-types';

export type ISection4Data = PageTemplateData;
export type Section4Props = PageTemplateProps<ISection4Data>;

export const defaultDataPage4: ISection4Data = {
  pageUid: 'page-uid-4',
  pageName: 'Privacy & Policy',
  eyebrow: 'Privacy Policy',
  title: 'How customer data is collected, used, protected, and respected.',
  subtitle:
    'This Privacy Policy page gives visitors a clear overview of data practices, cookies, information sharing, and user rights in plain language.',
  primaryAction: 'Review Policy',
  secondaryAction: 'Contact Support',
  sections: [
    {
      eyebrow: 'Data Collection',
      title: 'Information we may collect',
      description: 'Explain what personal and technical information may be collected when visitors use the website or contact the business.',
      items: ['Contact details submitted through forms', 'Basic website usage and device information', 'Project details shared by the visitor'],
    },
    {
      eyebrow: 'Use Of Data',
      title: 'Why information is used',
      description: 'Clarify that collected information supports communication, service delivery, website improvement, and security.',
      items: ['Reply to inquiries and support requests', 'Improve website experience', 'Protect services from misuse'],
    },
    {
      eyebrow: 'Protection',
      title: 'How information is protected',
      description: 'Describe practical safeguards and responsible handling without making unrealistic security promises.',
      items: ['Limited access to submitted information', 'Reasonable technical safeguards', 'Data kept only as long as needed'],
    },
    {
      eyebrow: 'Rights',
      title: 'User choices and requests',
      description: 'Let visitors know they can ask questions, request corrections, or ask for deletion where applicable.',
      items: ['Request a copy of submitted details', 'Ask for correction or deletion', 'Contact the team for privacy questions'],
    },
  ],
};
