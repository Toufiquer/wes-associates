/*
|-----------------------------------------
| setting up Mobile Bottom Menu Model for the App
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export type MobileMenuVariant = '4-icon' | '5-icon';

export interface IMobileBottomMenuItem {
  id: number;
  logo?: string;
  name: string;
  path: string;
}

export interface IMobileBottomMenuSettings extends Document {
  mobileBottomMenuIsPublished?: boolean;
  mobileMenuVariant?: MobileMenuVariant;
  mobileMenuItems?: IMobileBottomMenuItem[];
}

// Keep using BrandSettings so menus saved through the previous endpoint remain available.
const MobileBottomMenuSettingsSchema = new Schema<IMobileBottomMenuSettings>({}, { strict: false, timestamps: true });

const MobileBottomMenuSettings: Model<IMobileBottomMenuSettings> =
  mongoose.models.BrandSettings || mongoose.model<IMobileBottomMenuSettings>('BrandSettings', MobileBottomMenuSettingsSchema);

export default MobileBottomMenuSettings;
