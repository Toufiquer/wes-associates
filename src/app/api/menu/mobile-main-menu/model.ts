/*
|-----------------------------------------
| setting up Mobile Main Menu Model for the App
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export type MobileMenuViewStyle = 'grid' | 'flex';
export type MobileMenuGridLayout = '2x2' | '2x3' | '3x2' | '3x3';

export interface IMobileMainMenuItem {
  id: number;
  logo?: string;
  name: string;
  path: string;
}

export interface IMobileMainMenuSettings extends Document {
  mobileMenuIsPublished?: boolean;
  mobileMenuViewStyle?: MobileMenuViewStyle;
  mobileMenuGridLayout?: MobileMenuGridLayout;
  mobileMainMenuItems?: IMobileMainMenuItem[];
}

const MobileMainMenuSettingsSchema = new Schema<IMobileMainMenuSettings>({}, { strict: false, timestamps: true });

const MobileMainMenuSettings: Model<IMobileMainMenuSettings> =
  mongoose.models.BrandSettings || mongoose.model<IMobileMainMenuSettings>('BrandSettings', MobileMainMenuSettingsSchema);

export default MobileMainMenuSettings;
