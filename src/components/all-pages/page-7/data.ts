export interface RefundPolicySection {
  title: string;
  description?: string;
  items?: string[];
}

export interface IPage7Data {
  pageUid: string;
  pageName: string;
  title: string;
  lastUpdatedLabel: string;
  sections: RefundPolicySection[];
  contactTitle: string;
  contactDescription: string;
  supportEmail: string;
}

export interface Page7Props {
  data?: IPage7Data | string;
}

export const defaultDataPage7: IPage7Data = {
  pageUid: 'page-uid-7',
  pageName: 'Refund Policy',
  title: 'Refund Policy',
  lastUpdatedLabel: 'Last updated: Today',
  sections: [
    {
      title: '1. Overview',
      description: 'We want you to be completely satisfied with your purchase. If you are not entirely happy, we are here to help.',
    },
    {
      title: '2. Returns Eligibility',
      description: 'To be eligible for a return, please ensure that:',
      items: [
        'The product was purchased within the last 30 days.',
        'The product is in its original, unused, and undamaged condition.',
        'You have the receipt or proof of purchase.',
      ],
    },
    {
      title: '3. Refund Process',
      description:
        "Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.",
    },
    {
      title: '4. Shipping Costs',
      description: 'You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.',
    },
  ],
  contactTitle: 'Contact Us',
  contactDescription: 'If you have any questions on how to return your item to us, contact us at:',
  supportEmail: 'support@yourdomain.com',
};
