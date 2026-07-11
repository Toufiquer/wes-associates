export type ProductSocialIcon = 'facebook' | 'linkedin' | 'pin' | 'message-circle' | 'mail';

export interface ProductShowcaseSocial {
  id: number;
  icon: ProductSocialIcon;
  link: string;
}

export interface ProductShowcaseTimer {
  days?: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type ProductStatus = 'active' | 'hide' | 'draft';
export type ImageValue = { url: string; name: string };

export interface ProductItem {
  _id?: string;
  title: string;
  real_price: number;
  discount_price: number;
  description: string;
  features: string[];
  star: number;
  view: string;
  discount: number;
  primary_images: ImageValue;
  product_images: ImageValue[];
  status: ProductStatus;
  offerEnds: string;
  shareButtonsVisible: boolean;
  uploadProduct?: ImageValue;
  liveUrl: string;
  VideoUrl: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export type Page101ProductItem = ProductItem;

export interface ISection101Data {
  pageUid: string;
  pageName: string;
  imageUrl: string;
  imageAlt: string;
  categoryTitle: string;
  priceLabel: string;
  price: string;
  productTitle: string;
  features: string[];
  timer: ProductShowcaseTimer;
  buyButtonText: string;
  membershipButtonText: string;
  tutorialButtonText: string;
  liveDemoUrl: string;
  videoUrl: string;
  productDescriptions: string;
  productLookupLimit: number;
  shareButtonsVisible: boolean;
  socials: ProductShowcaseSocial[];
}

export interface Section101Props {
  data?: ISection101Data | string;
}

export interface Page101GtmEventData {
  sectionData: ISection101Data;
  product?: Page101ProductItem;
  isReady: boolean;
}

export const defaultDataPage101: ISection101Data = {
  pageUid: 'page-uid-101',
  pageName: 'Product Showcase',
  imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  imageAlt: 'Product banner',
  categoryTitle: 'প্রোডাক্ট ক্যাটাগরি',
  priceLabel: 'Price',
  price: '1,750৳',
  productTitle: 'Khati Bhaii - Ecommerce Website Template',
  features: ['Lifetime updates', '6 months support', 'Commercial license', 'Instant download', 'Full Customizable'],
  productDescriptions: `Daraz-style WooCommerce Website Template, যা multi-category online shop,
general store, fashion, electronics, grocery, beauty, accessories এবং daily product selling
business-এর জন্য তৈরি করা হয়েছে।

এই template-টি modern, clean এবং conversion-focused design দিয়ে তৈরি করা, যাতে আপনার
online store দেখতে professional লাগে এবং customer সহজেই product browse করে order করতে পারে।
Home page-এ রয়েছে attractive hero banner, category section, flash sale area, product showcase,
big sale banner এবং user-friendly shopping layout।

ShopMart Template এর প্রধান ফিচারসমূহ:
WooCommerce ভিত্তিক সম্পূর্ণ E-commerce System
bKash, Nagad পেমেন্ট গেটওয়ে Integration
Fraud Checker System দিয়ে Order Verification
Incompleted Order Detection System
Steadfast Courier Entry System
Facebook Pixel & Conversion API Ready
WhatsApp Button Chat Integration
Order Telegram Notification System
Block Customer System
Phone Number Validation System
Product & Profit Analytics
Customer Dashboard + Order Tracking
সুন্দর Home Page, Product Page, Checkout Page
Multi-category Product Management
Elementor দিয়ে Easily Editable Design
SEO + Speed Optimization
100% Mobile Responsive Design
Orange & White Premium Theme Design
Product Category, Featured Product ও Discount Section
Clean, Fast ও User Friendly Shopping Experience
Best For:
Fashion Store, Electronics Shop, Grocery Shop, Beauty Product Store, Accessories Shop,
General E-commerce Store এবং Multi-category Online Shop-এর জন্য ShopMart একটি perfect ready
website solution।

Note:
এই template ব্যবহার করতে আপনার নিজের domain, hosting এবং WordPress install থাকা প্রয়োজন।
Template import করার পর Elementor দিয়ে সবকিছু সহজেই edit করতে পারবেন।`,
  timer: {
    hours: 21,
    minutes: 32,
    seconds: 2,
  },
  buyButtonText: 'Buy Now',
  membershipButtonText: 'Membership',
  tutorialButtonText: 'TUTORIAL',
  liveDemoUrl: '#',
  videoUrl: '',
  productLookupLimit: 20,
  shareButtonsVisible: true,
  socials: [
    { id: 1, icon: 'facebook', link: '#' },
    { id: 2, icon: 'linkedin', link: '#' },
    { id: 3, icon: 'pin', link: '#' },
    { id: 4, icon: 'message-circle', link: '#' },
    { id: 5, icon: 'mail', link: '#' },
  ],
};
