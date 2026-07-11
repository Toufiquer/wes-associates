/*
|-----------------------------------------
| setting up FooterServer for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import connectDB from '@/app/api/utils/mongoose';
import Footer from '@/app/api/footer-settings/v1/model';

import { unstable_cache } from 'next/cache';
import FooterClient from './FooterClient';
import { defaultFooterData } from '@/components/default-data';

export const revalidate = 60;

const getActiveFooter = unstable_cache(
  async () => {
    await connectDB();
    const footer = await Footer.findOne({ isEnabled: true }).lean();

    if (!footer) return null;

    return JSON.parse(JSON.stringify(footer));
  },
  ['active-footer'],
  { tags: ['footer-settings'] },
);

const FooterServer = async () => {
  const activeFooter = await getActiveFooter();
  const footerData = activeFooter ? activeFooter : { ...defaultFooterData };
  return <FooterClient initialFooter={footerData} />;
};

export default FooterServer;
