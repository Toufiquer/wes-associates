/*
|-----------------------------------------
| setting up WhatsAppButtonEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import { Loader2, MessageCircle, RotateCcw, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  WhatsAppFontFamily,
  WhatsAppSettings,
  WhatsAppButtonPosition,
  WhatsAppButtonSize,
  useGetWhatsAppSettingsQuery,
  useUpdateWhatsAppSettingsMutation,
} from '@/redux/features/whatsapp/whatsAppSlice';

type WhatsAppButtonConfig = Pick<
  WhatsAppSettings,
  | 'whatsAppButtonIsPublished'
  | 'whatsAppButtonShowOnDesktop'
  | 'whatsAppButtonShowOnMobile'
  | 'whatsAppButtonNumber'
  | 'whatsAppButtonMessage'
  | 'whatsAppButtonLabel'
  | 'whatsAppButtonBackgroundColor'
  | 'whatsAppButtonTextColor'
  | 'whatsAppButtonFontFamily'
  | 'whatsAppButtonSize'
  | 'whatsAppButtonPosition'
  | 'whatsAppButtonDisabledUrls'
>;

const defaultConfig: WhatsAppButtonConfig = {
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

const toDisabledUrls = (value: unknown) => (Array.isArray(value) ? value.filter((url): url is string => typeof url === 'string') : []);

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{label}</Label>
    <div className="flex h-12 overflow-hidden rounded-sm border border-white/20 bg-white/5">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-full w-14 cursor-pointer border-0 bg-transparent p-1" />
      <Input value={value} onChange={e => onChange(e.target.value)} className="h-full rounded-none border-0 bg-transparent font-mono text-xs uppercase text-white" />
    </div>
  </div>
);

const sizePreviewClasses = {
  sm: 'px-3 py-2 text-xs gap-2 [&_svg]:h-4 [&_svg]:w-4',
  md: 'px-4 py-3 text-sm gap-2.5 [&_svg]:h-5 [&_svg]:w-5',
  lg: 'px-5 py-4 text-base gap-3 [&_svg]:h-6 [&_svg]:w-6',
};

const WhatsAppButtonEditor = () => {
  const [config, setConfig] = useState<WhatsAppButtonConfig>(defaultConfig);
  const [disabledUrlsText, setDisabledUrlsText] = useState(defaultConfig.whatsAppButtonDisabledUrls.join('\n'));
  const { data: whatsAppSettings, isLoading } = useGetWhatsAppSettingsQuery();
  const [updateWhatsAppSettings, { isLoading: isSaving }] = useUpdateWhatsAppSettingsMutation();

  useEffect(() => {
    if (whatsAppSettings) {
      const disabledUrls = toDisabledUrls(whatsAppSettings.whatsAppButtonDisabledUrls);
      setConfig({
        whatsAppButtonIsPublished: true,
        whatsAppButtonShowOnDesktop: whatsAppSettings.whatsAppButtonShowOnDesktop ?? whatsAppSettings.whatsAppButtonIsPublished,
        whatsAppButtonShowOnMobile: whatsAppSettings.whatsAppButtonShowOnMobile ?? whatsAppSettings.whatsAppButtonIsPublished,
        whatsAppButtonNumber: whatsAppSettings.whatsAppButtonNumber || '',
        whatsAppButtonMessage: whatsAppSettings.whatsAppButtonMessage || defaultConfig.whatsAppButtonMessage,
        whatsAppButtonLabel: whatsAppSettings.whatsAppButtonLabel || defaultConfig.whatsAppButtonLabel,
        whatsAppButtonBackgroundColor: whatsAppSettings.whatsAppButtonBackgroundColor || defaultConfig.whatsAppButtonBackgroundColor,
        whatsAppButtonTextColor: whatsAppSettings.whatsAppButtonTextColor || defaultConfig.whatsAppButtonTextColor,
        whatsAppButtonFontFamily: whatsAppSettings.whatsAppButtonFontFamily || defaultConfig.whatsAppButtonFontFamily,
        whatsAppButtonSize: whatsAppSettings.whatsAppButtonSize || defaultConfig.whatsAppButtonSize,
        whatsAppButtonPosition: whatsAppSettings.whatsAppButtonPosition || defaultConfig.whatsAppButtonPosition,
        whatsAppButtonDisabledUrls: disabledUrls,
      });
      setDisabledUrlsText(disabledUrls.join('\n'));
    }
  }, [whatsAppSettings]);

  const handleDisabledUrlsChange = (value: string) => {
    setDisabledUrlsText(value);
    setConfig(prev => ({
      ...prev,
      whatsAppButtonDisabledUrls: value
        .split('\n')
        .map(url => url.trim())
        .filter(Boolean),
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...config,
        whatsAppButtonDisabledUrls: disabledUrlsText
          .split('\n')
          .map(url => url.trim())
          .filter(Boolean),
      };
      const data = await updateWhatsAppSettings(payload).unwrap();
      if (data?.data) setConfig(prev => ({ ...prev, ...data.data }));
      toast.success('WhatsApp button updated successfully');
    } catch {
      toast.error('WhatsApp button update failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-sm border border-white/20 bg-white/5">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-sm border border-white/40 bg-white/10 p-4 text-white backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">WhatsApp Button</h2>
          <p className="text-xs text-white/50">Manage the floating WhatsApp contact button shown across the site.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outlineGlassy"
            onClick={() => {
              setConfig(defaultConfig);
              setDisabledUrlsText(defaultConfig.whatsAppButtonDisabledUrls.join('\n'));
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving} variant="outlineGlassy">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Update
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-4">
          <div>
            <h3 className="text-sm font-bold">Show WhatsApp Button in Desktop</h3>
            <p className="text-xs text-white/50">Enable the floating WhatsApp button on desktop screens.</p>
          </div>
          <Switch checked={config.whatsAppButtonShowOnDesktop} onCheckedChange={value => setConfig(prev => ({ ...prev, whatsAppButtonShowOnDesktop: value }))} />
        </div>
        <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-4">
          <div>
            <h3 className="text-sm font-bold">Show WhatsApp Button in Mobile</h3>
            <p className="text-xs text-white/50">Enable the floating WhatsApp button on mobile screens.</p>
          </div>
          <Switch checked={config.whatsAppButtonShowOnMobile} onCheckedChange={value => setConfig(prev => ({ ...prev, whatsAppButtonShowOnMobile: value }))} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">WhatsApp Number</Label>
          <Input
            value={config.whatsAppButtonNumber}
            onChange={e => setConfig(prev => ({ ...prev, whatsAppButtonNumber: e.target.value }))}
            placeholder="8801XXXXXXXXX"
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Button Text</Label>
          <Input
            value={config.whatsAppButtonLabel}
            onChange={e => setConfig(prev => ({ ...prev, whatsAppButtonLabel: e.target.value }))}
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Default Message</Label>
          <textarea
            value={config.whatsAppButtonMessage}
            onChange={e => setConfig(prev => ({ ...prev, whatsAppButtonMessage: e.target.value }))}
            className="min-h-24 w-full rounded-sm border border-white/20 bg-white/5 p-3 text-sm text-white outline-none focus:border-white/40"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Font Family</Label>
          <select
            value={config.whatsAppButtonFontFamily}
            onChange={e => setConfig(prev => ({ ...prev, whatsAppButtonFontFamily: e.target.value as WhatsAppFontFamily }))}
            className="h-12 w-full rounded-sm border border-white/20 bg-slate-900 px-3 text-sm text-white outline-none"
          >
            <option value="font-sans">Sans</option>
            <option value="font-serif">Serif</option>
            <option value="font-mono">Mono</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Button Size</Label>
          <select
            value={config.whatsAppButtonSize}
            onChange={e => setConfig(prev => ({ ...prev, whatsAppButtonSize: e.target.value as WhatsAppButtonSize }))}
            className="h-12 w-full rounded-sm border border-white/20 bg-slate-900 px-3 text-sm text-white outline-none"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Position</Label>
          <select
            value={config.whatsAppButtonPosition}
            onChange={e => setConfig(prev => ({ ...prev, whatsAppButtonPosition: e.target.value as WhatsAppButtonPosition }))}
            className="h-12 w-full rounded-sm border border-white/20 bg-slate-900 px-3 text-sm text-white outline-none"
          >
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
          </select>
        </div>
        <div className="space-y-2 md:row-span-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Disabled URLs</Label>
          <textarea
            value={disabledUrlsText}
            onChange={e => handleDisabledUrlsChange(e.target.value)}
            placeholder={'/login\n/dashboard'}
            className="min-h-32 w-full rounded-sm border border-white/20 bg-white/5 p-3 font-mono text-sm text-white outline-none focus:border-white/40"
          />
          <p className="text-[10px] text-white/50">One URL/path per line. The button is hidden when the current path exactly matches.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <ColorInput
          label="Button Background"
          value={config.whatsAppButtonBackgroundColor}
          onChange={value => setConfig(prev => ({ ...prev, whatsAppButtonBackgroundColor: value }))}
        />
        <ColorInput label="Button Text" value={config.whatsAppButtonTextColor} onChange={value => setConfig(prev => ({ ...prev, whatsAppButtonTextColor: value }))} />
      </div>

      <div className="mt-6 rounded-sm border border-white/20 p-4">
        <div
          className={`inline-flex items-center rounded-full font-bold shadow-2xl ${config.whatsAppButtonFontFamily} ${sizePreviewClasses[config.whatsAppButtonSize]}`}
          style={{ backgroundColor: config.whatsAppButtonBackgroundColor, color: config.whatsAppButtonTextColor }}
        >
          <MessageCircle />
          <span>{config.whatsAppButtonLabel || 'WhatsApp'}</span>
        </div>
      </div>
    </section>
  );
};
export default WhatsAppButtonEditor;
