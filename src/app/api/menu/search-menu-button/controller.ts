/*
|-----------------------------------------
| setting up Search Menu Button Controller for the App
|-----------------------------------------
*/

import SearchMenuButtonSettings, { ISearchMenuButtonSettings } from './model';

export const DEFAULT_SEARCH_MENU_BUTTON = {
  searchIconIsPublished: true,
  searchIconBorderIsVisible: true,
  searchIconPlaceholder: 'Search products...',
  searchIconBackgroundTransparent: false,
  searchIconBackgroundColor: '#ffffff',
  searchIconTextColor: '#0f172a',
  searchPanelBackgroundColor: '#ffffff',
  searchPanelTextColor: '#0f172a',
};

const searchMenuButtonFields = [
  'searchIconIsPublished',
  'searchIconBorderIsVisible',
  'searchIconPlaceholder',
  'searchIconBackgroundTransparent',
  'searchIconBackgroundColor',
  'searchIconTextColor',
  'searchPanelBackgroundColor',
  'searchPanelTextColor',
] as const;

export const getSearchMenuButton = async () => {
  const settings = await SearchMenuButtonSettings.findOne().lean();
  return settings ? { ...DEFAULT_SEARCH_MENU_BUTTON, ...settings } : DEFAULT_SEARCH_MENU_BUTTON;
};

export const updateSearchMenuButton = (data: Partial<ISearchMenuButtonSettings>) => {
  const cleanData = Object.fromEntries(searchMenuButtonFields.map(field => [field, data[field]]).filter(([, value]) => value !== undefined));
  return SearchMenuButtonSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
};
