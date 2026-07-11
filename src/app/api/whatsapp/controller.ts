/*
|-----------------------------------------
| setting up WhatsApp Settings Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

import WhatsAppSettings, { IWhatsAppSettings } from './model';

export const DEFAULT_WHATSAPP_SETTINGS = {
  whatsAppButtonIsPublished: true,
  whatsAppButtonShowOnDesktop: true,
  whatsAppButtonShowOnMobile: true,
  whatsAppButtonNumber: '',
  whatsAppButtonMessage: 'Hello, I need help.',
  whatsAppButtonLabel: 'WhatsApp',
  whatsAppButtonBackgroundColor: '#22c55e',
  whatsAppButtonTextColor: '#ffffff',
  whatsAppButtonFontFamily: 'font-sans',
  whatsAppButtonSize: 'md',
  whatsAppButtonPosition: 'bottom-right',
  whatsAppButtonDisabledUrls: [],
};

export const getWhatsAppSettings = async () => {
  try {
    const settings = await WhatsAppSettings.findOne().lean();
    if (!settings) return DEFAULT_WHATSAPP_SETTINGS;
    return {
      ...DEFAULT_WHATSAPP_SETTINGS,
      ...settings,
      whatsAppButtonDisabledUrls: Array.isArray(settings.whatsAppButtonDisabledUrls) ? settings.whatsAppButtonDisabledUrls : [],
    };
  } catch {
    throw new Error('Error fetching WhatsApp settings');
  }
};

export const updateWhatsAppSettings = async (data: Partial<IWhatsAppSettings>) => {
  try {
    const allowedData = {
      whatsAppButtonIsPublished: data.whatsAppButtonIsPublished,
      whatsAppButtonShowOnDesktop: data.whatsAppButtonShowOnDesktop,
      whatsAppButtonShowOnMobile: data.whatsAppButtonShowOnMobile,
      whatsAppButtonNumber: data.whatsAppButtonNumber,
      whatsAppButtonMessage: data.whatsAppButtonMessage,
      whatsAppButtonLabel: data.whatsAppButtonLabel,
      whatsAppButtonBackgroundColor: data.whatsAppButtonBackgroundColor,
      whatsAppButtonTextColor: data.whatsAppButtonTextColor,
      whatsAppButtonFontFamily: data.whatsAppButtonFontFamily,
      whatsAppButtonSize: data.whatsAppButtonSize,
      whatsAppButtonPosition: data.whatsAppButtonPosition,
      whatsAppButtonDisabledUrls: Array.isArray(data.whatsAppButtonDisabledUrls)
        ? data.whatsAppButtonDisabledUrls.filter((url): url is string => typeof url === 'string')
        : data.whatsAppButtonDisabledUrls,
    };
    const cleanData = Object.fromEntries(Object.entries(allowedData).filter(([, value]) => value !== undefined));
    return await WhatsAppSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Error updating WhatsApp settings');
  }
};
