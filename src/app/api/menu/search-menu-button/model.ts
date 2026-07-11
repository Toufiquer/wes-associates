/*
|-----------------------------------------
| setting up Search Menu Button Model for the App
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISearchMenuButtonSettings extends Document {
  searchIconIsPublished?: boolean;
  searchIconBorderIsVisible?: boolean;
  searchIconPlaceholder?: string;
  searchIconBackgroundTransparent?: boolean;
  searchIconBackgroundColor?: string;
  searchIconTextColor?: string;
  searchPanelBackgroundColor?: string;
  searchPanelTextColor?: string;
}

const SearchMenuButtonSettingsSchema = new Schema<ISearchMenuButtonSettings>({}, { strict: false, timestamps: true });

const SearchMenuButtonSettings: Model<ISearchMenuButtonSettings> =
  mongoose.models.BrandSettings || mongoose.model<ISearchMenuButtonSettings>('BrandSettings', SearchMenuButtonSettingsSchema);

export default SearchMenuButtonSettings;
