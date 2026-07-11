/*
|-----------------------------------------
| setting up Cart Link Model for the App
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICartLinkSettings extends Document {
  cartIconIsPublished?: boolean;
  cartIconBorderIsVisible?: boolean;
  cartIconPath?: string;
  cartIconBackgroundTransparent?: boolean;
  cartIconBackgroundColor?: string;
  cartIconTextColor?: string;
}

const CartLinkSettingsSchema = new Schema<ICartLinkSettings>({}, { strict: false, timestamps: true });

const CartLinkSettings: Model<ICartLinkSettings> =
  mongoose.models.BrandSettings || mongoose.model<ICartLinkSettings>('BrandSettings', CartLinkSettingsSchema);

export default CartLinkSettings;
