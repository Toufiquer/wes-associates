/*
|-----------------------------------------
| setting up Primary Menu Model for the App
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export type NavigationPosition = 'fixed' | 'sticky' | 'scroll';
export type MenuButtonMode = 'auth' | 'contact' | 'account';
export type MenuButtonRadius = 'none' | 'sm' | 'xl' | 'full';
export type MenuButtonPadding = 'none' | 'sm' | 'xl' | '2xl';

export interface IMenuItem {
  id: number;
  name: string;
  path: string;
  iconName?: string;
  imagePath?: string;
  isImagePublish?: boolean;
  isIconPublish?: boolean;
  children?: IMenuItem[];
}

export interface IMenu extends Document {
  type: string;
  items: IMenuItem[];
}

export interface IPrimaryMenuSettings extends Document {
  brandName?: string;
  logoUrl?: string | null;
  logoIsPublished?: boolean;
  logoDesktopOffsetX?: number;
  logoDesktopOffsetY?: number;
  logoMobileOffsetX?: number;
  logoMobileOffsetY?: number;
  textColor?: string;
  fontSize?: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
  fontFamily?: 'font-sans' | 'font-serif' | 'font-mono';
  menuTextColor?: string;
  menuFontSize?: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
  menuFontFamily?: 'font-sans' | 'font-serif' | 'font-mono';
  menuBackgroundColor?: string;
  backgroundTransparent?: number;
  menuSticky?: boolean;
  menuPosition?: NavigationPosition;
  menuButtonMode?: MenuButtonMode;
  menuButtonIconName?: string;
  menuButtonContactText?: string;
  menuButtonContactLink?: string;
  menuButtonBackgroundColor?: string;
  menuButtonTextColor?: string;
  menuButtonPaddingY?: MenuButtonPadding;
  menuButtonPaddingX?: MenuButtonPadding;
  menuButtonRadius?: MenuButtonRadius;
  menuButtonBackgroundTransparent?: boolean;
}

const MenuItemSchema = new Schema<IMenuItem>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  path: { type: String, required: true },
  imagePath: { type: String, required: true },
  isImagePublish: { type: Boolean, default: false },
  isIconPublish: { type: Boolean, default: false },
  iconName: { type: String },
});

MenuItemSchema.add({
  children: [MenuItemSchema],
});

const MenuSchema = new Schema<IMenu>(
  {
    type: { type: String, required: true, unique: true },
    items: [MenuItemSchema],
  },
  { timestamps: true },
);

const BrandSettingsSchema = new Schema<IPrimaryMenuSettings>({}, { strict: false, timestamps: true });

export const BrandSettings: Model<IPrimaryMenuSettings> =
  mongoose.models.BrandSettings || mongoose.model<IPrimaryMenuSettings>('BrandSettings', BrandSettingsSchema);

const Menu: Model<IMenu> = mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);

export default Menu;
