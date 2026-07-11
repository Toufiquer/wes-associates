/*
|-----------------------------------------
| setting up Top Banner Model for the App
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export type NavigationPosition = 'fixed' | 'sticky' | 'scroll';

export interface ITopBannerSettings extends Document {
  topBannerIsPublished?: boolean;
  topBannerPosition?: NavigationPosition;
  topBannerMessage?: string;
  topBannerHighlightText?: string;
  topBannerCountdownEndAt?: Date | string | null;
  topBannerButtonText?: string;
  topBannerButtonUrl?: string;
  topBannerBackgroundColor?: string;
  topBannerTextColor?: string;
  topBannerHighlightColor?: string;
  topBannerButtonBackgroundColor?: string;
  topBannerButtonTextColor?: string;
  topBannerDisabledUrls?: string[];
}

const TopBannerSettingsSchema = new Schema<ITopBannerSettings>({}, { strict: false, timestamps: true });

const TopBannerSettings: Model<ITopBannerSettings> =
  mongoose.models.BrandSettings || mongoose.model<ITopBannerSettings>('BrandSettings', TopBannerSettingsSchema);

export default TopBannerSettings;
