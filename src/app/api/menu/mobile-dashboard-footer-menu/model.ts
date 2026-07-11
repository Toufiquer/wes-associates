/*
|-----------------------------------------
| setting up Mobile Dashboard Footer Menu Model for the App
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export type DashboardFooterMenuAction = 'link' | 'menu';

export interface IDashboardFooterMenuItem {
  id: number;
  logo?: string;
  name: string;
  path?: string;
  action: DashboardFooterMenuAction;
}

export interface IMobileDashboardFooterMenuSettings extends Document {
  dashboardFooterMenuItems?: IDashboardFooterMenuItem[];
}

const MobileDashboardFooterMenuSettingsSchema = new Schema<IMobileDashboardFooterMenuSettings>({}, { strict: false, timestamps: true });

const MobileDashboardFooterMenuSettings: Model<IMobileDashboardFooterMenuSettings> =
  mongoose.models.BrandSettings || mongoose.model<IMobileDashboardFooterMenuSettings>('BrandSettings', MobileDashboardFooterMenuSettingsSchema);

export default MobileDashboardFooterMenuSettings;
