/*
|-----------------------------------------
| setting up TopBannerEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import { X, Save, Plus, Loader2, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BrandSettings } from '@/redux/features/brand-settings/brandSettingsSlice';

type TopBannerConfig = Pick<
  BrandSettings,
  | 'topBannerIsPublished'
  | 'topBannerPosition'
  | 'topBannerMessage'
  | 'topBannerHighlightText'
  | 'topBannerCountdownEndAt'
  | 'topBannerButtonText'
  | 'topBannerButtonUrl'
  | 'topBannerBackgroundColor'
  | 'topBannerTextColor'
  | 'topBannerHighlightColor'
  | 'topBannerButtonBackgroundColor'
  | 'topBannerButtonTextColor'
  | 'topBannerDisabledUrls'
>;

const defaultConfig: TopBannerConfig = {
  topBannerIsPublished: true,
  topBannerPosition: 'scroll',
  topBannerMessage: 'Buy All - Lifetime Access',
  topBannerHighlightText: '৳9950 Only',
  topBannerCountdownEndAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  topBannerButtonText: 'Get Offer',
  topBannerButtonUrl: '/offers',
  topBannerBackgroundColor: '#2563eb',
  topBannerTextColor: '#ffffff',
  topBannerHighlightColor: '#fde047',
  topBannerButtonBackgroundColor: '#facc15',
  topBannerButtonTextColor: '#111827',
  topBannerDisabledUrls: [],
};

const positionOptions = [
  { label: 'Fixed', value: 'fixed', description: 'Always pinned to the viewport top' },
  { label: 'Sticky', value: 'sticky', description: 'Sticks after reaching the top' },
  { label: 'Scroll', value: 'scroll', description: 'Normal div flow' },
] as const;

const toDateTimeLocal = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const fromDateTimeLocal = (value: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{label}</Label>
    <div className="flex h-12 overflow-hidden rounded-sm border border-white/20 bg-white/5">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-full w-14 cursor-pointer border-0 bg-transparent p-1" />
      <Input value={value} onChange={e => onChange(e.target.value)} className="h-full rounded-none border-0 bg-transparent font-mono text-xs uppercase text-white" />
    </div>
  </div>
);

const TopBannerEditor = () => {
  const [config, setConfig] = useState<TopBannerConfig>(defaultConfig);
  const [disabledUrlInput, setDisabledUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/menu/top-banner');
        if (!response.ok) return;
        const brandSettings = await response.json();
      setConfig({
        topBannerIsPublished: brandSettings.topBannerIsPublished,
        topBannerPosition: brandSettings.topBannerPosition || 'scroll',
        topBannerMessage: brandSettings.topBannerMessage,
        topBannerHighlightText: brandSettings.topBannerHighlightText,
        topBannerCountdownEndAt: brandSettings.topBannerCountdownEndAt,
        topBannerButtonText: brandSettings.topBannerButtonText,
        topBannerButtonUrl: brandSettings.topBannerButtonUrl,
        topBannerBackgroundColor: brandSettings.topBannerBackgroundColor,
        topBannerTextColor: brandSettings.topBannerTextColor,
        topBannerHighlightColor: brandSettings.topBannerHighlightColor,
        topBannerButtonBackgroundColor: brandSettings.topBannerButtonBackgroundColor,
        topBannerButtonTextColor: brandSettings.topBannerButtonTextColor,
        topBannerDisabledUrls: brandSettings.topBannerDisabledUrls || [],
      });
      } catch {
        toast.error('Top banner sync failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleAddDisabledUrl = () => {
    const url = disabledUrlInput.trim();
    if (!url) return;
    if (config.topBannerDisabledUrls.includes(url)) {
      toast.info('URL already added');
      return;
    }
    setConfig(prev => ({ ...prev, topBannerDisabledUrls: [...prev.topBannerDisabledUrls, url] }));
    setDisabledUrlInput('');
  };

  const handleRemoveDisabledUrl = (url: string) => {
    setConfig(prev => ({ ...prev, topBannerDisabledUrls: prev.topBannerDisabledUrls.filter(item => item !== url) }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/menu/top-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      if (data?.data) {
        setConfig(prev => ({ ...prev, ...data.data }));
      }
      window.dispatchEvent(new Event('brand-settings-updated'));
      toast.success('Top banner updated successfully');
    } catch {
      toast.error('Top banner update failed');
    } finally {
      setIsSaving(false);
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
          <h2 className="text-xl font-black tracking-tight">Top Banner</h2>
          <p className="text-xs text-white/50">Manage the promotional banner shown above the main menu.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outlineGlassy" onClick={() => setConfig(defaultConfig)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving} variant="outlineGlassy">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Update
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-4">
        <div>
          <h3 className="text-sm font-bold">Publish Banner</h3>
          <p className="text-xs text-white/50">Turn this off to hide the banner from the client UI.</p>
        </div>
        <Switch checked={config.topBannerIsPublished} onCheckedChange={value => setConfig(prev => ({ ...prev, topBannerIsPublished: value }))} />
      </div>

      <div className="mb-6 rounded-sm border border-white/10 bg-white/5 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold">Banner Position</h3>
          <p className="text-xs text-white/50">Control how the top banner behaves while scrolling.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {positionOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, topBannerPosition: option.value }))}
              className={`rounded-sm border p-4 text-left transition-all ${
                config.topBannerPosition === option.value
                  ? 'border-white bg-white/20 text-white shadow-xl'
                  : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="block text-xs font-black uppercase tracking-widest">{option.label}</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider opacity-70">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-sm border border-white/10 bg-white/5 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold">Disabled URL</h3>
          <p className="text-xs text-white/50">Hide the top banner when the current page URL matches any URL in this list.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={disabledUrlInput}
            onChange={e => setDisabledUrlInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddDisabledUrl();
              }
            }}
            placeholder="/dashboard or /cart"
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
          <Button type="button" onClick={handleAddDisabledUrl} variant="outlineGlassy" className="h-12 shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add URL
          </Button>
        </div>
        {config.topBannerDisabledUrls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {config.topBannerDisabledUrls.map(url => (
              <span key={url} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white">
                {url}
                <button type="button" onClick={() => handleRemoveDisabledUrl(url)} className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label={`Remove ${url}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Message</Label>
          <Input
            value={config.topBannerMessage}
            onChange={e => setConfig(prev => ({ ...prev, topBannerMessage: e.target.value }))}
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Highlight Text</Label>
          <Input
            value={config.topBannerHighlightText}
            onChange={e => setConfig(prev => ({ ...prev, topBannerHighlightText: e.target.value }))}
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Countdown End</Label>
          <Input
            type="datetime-local"
            value={toDateTimeLocal(config.topBannerCountdownEndAt)}
            onChange={e => setConfig(prev => ({ ...prev, topBannerCountdownEndAt: fromDateTimeLocal(e.target.value) }))}
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Button URL</Label>
          <Input
            value={config.topBannerButtonUrl}
            onChange={e => setConfig(prev => ({ ...prev, topBannerButtonUrl: e.target.value }))}
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Button Text</Label>
          <Input
            value={config.topBannerButtonText}
            onChange={e => setConfig(prev => ({ ...prev, topBannerButtonText: e.target.value }))}
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        <ColorInput label="Background" value={config.topBannerBackgroundColor} onChange={value => setConfig(prev => ({ ...prev, topBannerBackgroundColor: value }))} />
        <ColorInput label="Text" value={config.topBannerTextColor} onChange={value => setConfig(prev => ({ ...prev, topBannerTextColor: value }))} />
        <ColorInput label="Highlight" value={config.topBannerHighlightColor} onChange={value => setConfig(prev => ({ ...prev, topBannerHighlightColor: value }))} />
        <ColorInput label="Button Bg" value={config.topBannerButtonBackgroundColor} onChange={value => setConfig(prev => ({ ...prev, topBannerButtonBackgroundColor: value }))} />
        <ColorInput label="Button Text" value={config.topBannerButtonTextColor} onChange={value => setConfig(prev => ({ ...prev, topBannerButtonTextColor: value }))} />
      </div>

      <div className="mt-6 rounded-sm border border-white/20 p-3">
        <div
          className="flex flex-wrap items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm"
          style={{ backgroundColor: config.topBannerBackgroundColor, color: config.topBannerTextColor }}
        >
          <strong style={{ color: config.topBannerHighlightColor }}>
            {config.topBannerMessage} - {config.topBannerHighlightText}
          </strong>
          <span className="rounded bg-white/20 px-3 py-0.5 text-xs font-bold tracking-widest">00d : 00h : 00m : 00s</span>
          <span className="rounded-md px-4 py-1.5 text-xs font-bold" style={{ backgroundColor: config.topBannerButtonBackgroundColor, color: config.topBannerButtonTextColor }}>
            {config.topBannerButtonText}
          </span>
        </div>
      </div>
    </section>
  );
};
export default TopBannerEditor;
