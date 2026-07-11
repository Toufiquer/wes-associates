/*
|-----------------------------------------
| setting up WhatsApp Settings Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWhatsAppSettings extends Document {
  whatsAppButtonIsPublished: boolean;
  whatsAppButtonShowOnDesktop: boolean;
  whatsAppButtonShowOnMobile: boolean;
  whatsAppButtonNumber: string;
  whatsAppButtonMessage: string;
  whatsAppButtonLabel: string;
  whatsAppButtonBackgroundColor: string;
  whatsAppButtonTextColor: string;
  whatsAppButtonFontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  whatsAppButtonSize: 'sm' | 'md' | 'lg';
  whatsAppButtonPosition: 'bottom-right' | 'bottom-left';
  whatsAppButtonDisabledUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppSettingsSchema = new Schema<IWhatsAppSettings>(
  {
    whatsAppButtonIsPublished: { type: Boolean, default: true },
    whatsAppButtonShowOnDesktop: { type: Boolean, default: true },
    whatsAppButtonShowOnMobile: { type: Boolean, default: true },
    whatsAppButtonNumber: { type: String, default: '', trim: true },
    whatsAppButtonMessage: { type: String, default: 'Hello, I need help.', trim: true },
    whatsAppButtonLabel: { type: String, default: 'WhatsApp', trim: true },
    whatsAppButtonBackgroundColor: { type: String, default: '#22c55e' },
    whatsAppButtonTextColor: { type: String, default: '#ffffff' },
    whatsAppButtonFontFamily: { type: String, enum: ['font-sans', 'font-serif', 'font-mono'], default: 'font-sans' },
    whatsAppButtonSize: { type: String, enum: ['sm', 'md', 'lg'], default: 'md' },
    whatsAppButtonPosition: { type: String, enum: ['bottom-right', 'bottom-left'], default: 'bottom-right' },
    whatsAppButtonDisabledUrls: { type: [String], default: [] },
  },
  { timestamps: true },
);

const WhatsAppSettings: Model<IWhatsAppSettings> =
  mongoose.models.WhatsAppSettings || mongoose.model<IWhatsAppSettings>('WhatsAppSettings', WhatsAppSettingsSchema);

export default WhatsAppSettings;
