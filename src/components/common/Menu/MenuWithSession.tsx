/*
|-----------------------------------------
| setting up MenuWithSession for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';

import connectDB from '@/app/api/utils/mongoose';
import { getMenuData } from '@/app/api/menu/primary-menu/controller';
import { getPrimaryMenu } from '@/app/api/menu/primary-menu/controller';

import MenuClient from './MenuClient';
import { defaultMenuData } from '@/components/default-data';

const MenuComponentWithSession = async () => {
  await connectDB();
  const rawSettings = await getPrimaryMenu();
  const rawMenuData = await getMenuData('main-menu');
  const menuItems = rawMenuData?.items?.length > 0 ? rawMenuData?.items : [...defaultMenuData];
  const brandSettings = JSON.parse(JSON.stringify(rawSettings));
  const serializedMenuItems = JSON.parse(JSON.stringify(menuItems));
  return <MenuClient initialBrandConfig={brandSettings} initialMenuItems={serializedMenuItems} />;
};

export default MenuComponentWithSession;
