/*
|-----------------------------------------
| setting up Mobile Main Menu Service for the App
|-----------------------------------------
*/

import MobileMainMenuSettings, { IMobileMainMenuSettings } from './model';

export const findMobileMainMenuSettings = () => {
  return MobileMainMenuSettings.findOne().lean();
};

export const updateMobileMainMenuSettings = (data: Partial<IMobileMainMenuSettings>) => {
  return MobileMainMenuSettings.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true, runValidators: true });
};
