export interface DeliveryPolicySection {
  title: string;
  description?: string;
  items?: string[];
}

export interface IPage6Data {
  pageUid: string;
  pageName: string;
  title: string;
  lastUpdatedLabel: string;
  sections: DeliveryPolicySection[];
  helpTitle: string;
  helpDescription: string;
  supportEmail: string;
}

export interface Page6Props {
  data?: IPage6Data | string;
}

export const defaultDataPage6: IPage6Data = {
  pageUid: 'page-uid-6',
  pageName: 'Delivery Policy',
  title: 'Delivery Policy',
  lastUpdatedLabel: 'Last updated: Today',
  sections: [
    {
      title: '1. Shipping Destinations',
      description: 'We currently deliver to [Region/Countries]. Please ensure your shipping address is correct at checkout to avoid delays.',
    },
    {
      title: '2. Processing & Delivery Time',
      items: ['Processing: Orders are typically processed within 1-2 business days.', 'Standard Shipping: 5-7 business days.', 'Express Shipping: 1-2 business days.'],
    },
    {
      title: '3. Shipping Rates',
      description:
        'Shipping costs are calculated at checkout based on your location and the weight of your order. Free shipping is available for orders over [Amount].',
    },
    {
      title: '4. Order Tracking',
      description: 'Once your order has shipped, you will receive a confirmation email with a tracking number to monitor your shipment status.',
    },
  ],
  helpTitle: 'Need Help?',
  helpDescription:
    "If you have any questions regarding your delivery or if your order hasn't arrived within the expected timeframe, please reach out to us at:",
  supportEmail: 'support@yourdomain.com',
};
