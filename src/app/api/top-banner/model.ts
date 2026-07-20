/*
|-----------------------------------------
| setting up Top Banner Model for the App
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export type NavigationPosition = 'fixed' | 'sticky' | 'scroll';

export type TopBannerActionId = 'call' | 'email' | 'location' | 'messenger' | 'whatsapp';

export interface ITopBannerActionLink {
  id: TopBannerActionId;
  label: string;
  isPublished: boolean;
  fontColor: string;
  size: number;
  padding: number;
  url: string;
  openInNewTab: boolean;
}

export interface ITopBannerSocialLink {
  id: string;
  label: string;
  iconUrl: string;
  url: string;
  isPublished: boolean;
}

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
  contactEmail?: string;
  contactPhone?: string;
  contactHours?: string;
  topBannerSocialLinks?: ITopBannerSocialLink[];
  topBannerActionLinks?: ITopBannerActionLink[];
}

const TopBannerSettingsSchema = new Schema<ITopBannerSettings>({}, { strict: false, timestamps: true });

const TopBannerSettings: Model<ITopBannerSettings> =
  mongoose.models.BrandSettings || mongoose.model<ITopBannerSettings>('BrandSettings', TopBannerSettingsSchema);

export default TopBannerSettings;
