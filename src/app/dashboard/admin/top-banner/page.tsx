/*
|-----------------------------------------
| setting up TopBannerPage for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, July, 2026
|-----------------------------------------
*/

'use client';

import { LayoutDashboard, Loader2, LogIn, Mail, MapPin, Phone, Plus, RotateCcw, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSession } from '@/lib/auth-client';
import { TopBannerActionLink, TopBannerConfig, useGetTopBannerQuery, useUpdateTopBannerMutation } from '@/redux/features/top-banner/topBannerSlice';

const defaultActionLinks: TopBannerActionLink[] = [
  { id: 'call', label: 'Call', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'tel:+8801303537667', openInNewTab: false },
  { id: 'email', label: 'Email', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'mailto:info@wesassociates.com', openInNewTab: false },
  { id: 'location', label: 'Location', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://maps.google.com', openInNewTab: true },
  { id: 'messenger', label: 'Messager', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://m.me/', openInNewTab: true },
  { id: 'whatsapp', label: 'WhatsApp', isPublished: true, fontColor: '#ffffff', size: 14, padding: 6, url: 'https://wa.me/8801303537667', openInNewTab: true },
];

const defaultConfig: TopBannerConfig = {
  topBannerIsPublished: true,
  topBannerPosition: 'scroll',
  topBannerBackgroundColor: '#080c14',
  topBannerTextColor: '#ffffff',
  topBannerDisabledUrls: [],
  topBannerActionLinks: defaultActionLinks,
};

const positionOptions = [
  { label: 'Fixed', value: 'fixed', description: 'Pinned to the viewport top' },
  { label: 'Sticky', value: 'sticky', description: 'Sticks after reaching the top' },
  { label: 'Scroll', value: 'scroll', description: 'Normal page flow' },
] as const;

const actionIcons = {
  call: Phone,
  email: Mail,
  location: MapPin,
  messenger: FaFacebookMessenger,
  whatsapp: FaWhatsapp,
};

const getActionDisplayValue = (action: TopBannerActionLink) => {
  const value = action.url.trim();
  if (action.id === 'call') return value.replace(/^tel:/i, '');
  if (action.id === 'email') return value.replace(/^mailto:/i, '');
  if (action.id === 'whatsapp') return value.replace(/^https?:\/\/(?:www\.)?wa\.me\//i, '+');
  return value || 'No data added';
};

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{label}</Label>
    <div className="flex h-12 overflow-hidden rounded-sm border border-white/20 bg-white/5">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-full w-14 cursor-pointer border-0 bg-transparent p-1" />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-full rounded-none border-0 bg-transparent font-mono text-xs uppercase text-white"
      />
    </div>
  </div>
);

export default function TopBannerPage() {
  const { data: bannerSettings, isLoading, isError } = useGetTopBannerQuery();
  const [updateTopBanner, { isLoading: isSaving }] = useUpdateTopBannerMutation();
  const [config, setConfig] = useState<TopBannerConfig>(defaultConfig);
  const [disabledUrlInput, setDisabledUrlInput] = useState('');
  const session = useSession();
  const isLoggedIn = !!session?.data?.session;

  useEffect(() => {
    if (bannerSettings) {
      setConfig({
        ...defaultConfig,
        ...bannerSettings,
        topBannerActionLinks: bannerSettings.topBannerActionLinks ?? defaultActionLinks,
      });
    }
  }, [bannerSettings]);

  useEffect(() => {
    if (isError) toast.error('Top banner sync failed');
  }, [isError]);

  const updateActionLink = (id: TopBannerActionLink['id'], changes: Partial<TopBannerActionLink>) => {
    setConfig(prev => ({
      ...prev,
      topBannerActionLinks: prev.topBannerActionLinks.map(item => (item.id === id ? { ...item, ...changes } : item)),
    }));
  };

  const addDisabledUrl = () => {
    const url = disabledUrlInput.trim();
    if (!url) return;
    if (config.topBannerDisabledUrls.includes(url)) {
      toast.info('URL already added');
      return;
    }
    setConfig(prev => ({ ...prev, topBannerDisabledUrls: [...prev.topBannerDisabledUrls, url] }));
    setDisabledUrlInput('');
  };

  const handleSave = async () => {
    try {
      const data = await updateTopBanner(config).unwrap();
      if (data.data) setConfig(prev => ({ ...prev, ...data.data }));
      window.dispatchEvent(new Event('brand-settings-updated'));
      toast.success('Top banner updated successfully');
    } catch {
      toast.error('Top banner update failed');
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
    <main className="min-h-screen p-3 text-white md:p-8">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-sm border border-white/40 bg-white/10 p-4 backdrop-blur-xl md:p-6">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Top Banner</h1>
            <p className="text-xs text-white/50">Update action buttons, colors, links, and banner behavior.</p>
          </div>
          <div className="flex gap-3">
            <Button size="sm" variant="outlineGlassy" onClick={() => setConfig(defaultConfig)}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button onClick={handleSave} disabled={isSaving} variant="outlineGlassy">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Update
            </Button>
          </div>
        </header>

        <div className="mb-6 flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-4">
          <div>
            <h2 className="text-sm font-bold">Publish Banner</h2>
            <p className="text-xs text-white/50">Show or hide the banner on the website.</p>
          </div>
          <Switch checked={config.topBannerIsPublished} onCheckedChange={value => setConfig(prev => ({ ...prev, topBannerIsPublished: value }))} />
        </div>

        <div className="mb-6 rounded-sm border border-white/10 bg-white/5 p-4">
          <div className="mb-5">
            <h2 className="text-sm font-bold">Action Buttons</h2>
            <p className="text-xs text-white/50">Configure the Call, Email, Location, Messager, and WhatsApp Lucide buttons.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {config.topBannerActionLinks.map(action => {
              const Icon = actionIcons[action.id];

              return (
                <article key={action.id} className="space-y-4 rounded-sm border border-white/15 bg-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10" style={{ color: action.fontColor }}>
                        <Icon size={Math.min(action.size, 22)} />
                      </span>
                      <span className="text-sm font-bold">{action.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${action.id}-public`} className="text-xs font-bold">Public</Label>
                      <Switch id={`${action.id}-public`} checked={action.isPublished} onCheckedChange={value => updateActionLink(action.id, { isPublished: value })} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Font Color</Label>
                      <div className="flex h-11 overflow-hidden rounded-sm border border-white/20 bg-white/5">
                        <input
                          type="color"
                          value={action.fontColor}
                          onChange={e => updateActionLink(action.id, { fontColor: e.target.value })}
                          className="h-full w-11 cursor-pointer border-0 bg-transparent p-1"
                        />
                        <Input
                          value={action.fontColor}
                          onChange={e => updateActionLink(action.id, { fontColor: e.target.value })}
                          className="h-full rounded-none border-0 bg-transparent px-2 font-mono text-[10px] uppercase text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${action.id}-size`}>Size</Label>
                      <Input
                        id={`${action.id}-size`}
                        type="number"
                        min={8}
                        max={48}
                        value={action.size}
                        onChange={e => updateActionLink(action.id, { size: Number(e.target.value) })}
                        className="h-11 border-white/20 bg-white/5 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${action.id}-padding`}>Padding</Label>
                      <Input
                        id={`${action.id}-padding`}
                        type="number"
                        min={0}
                        max={24}
                        value={action.padding}
                        onChange={e => updateActionLink(action.id, { padding: Number(e.target.value) })}
                        className="h-11 border-white/20 bg-white/5 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${action.id}-url`}>URL</Label>
                    <Input
                      id={`${action.id}-url`}
                      value={action.url}
                      onChange={e => updateActionLink(action.id, { url: e.target.value })}
                      placeholder="https://example.com"
                      className="h-11 border-white/20 bg-white/5 text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-3">
                    <Label htmlFor={`${action.id}-new-tab`} className="text-xs font-bold">Open In New Tab</Label>
                    <Switch id={`${action.id}-new-tab`} checked={action.openInNewTab} onCheckedChange={value => updateActionLink(action.id, { openInNewTab: value })} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mb-6 rounded-sm border border-white/10 bg-white/5 p-4">
          <h2 className="mb-4 text-sm font-bold">Banner Position</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {positionOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, topBannerPosition: option.value }))}
                className={`rounded-sm border p-4 text-left transition-all ${config.topBannerPosition === option.value ? 'border-white bg-white/20' : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <span className="block text-xs font-black uppercase tracking-widest">{option.label}</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider opacity-70">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 grid gap-5 md:grid-cols-2">
          <ColorInput
            label="Background Color"
            value={config.topBannerBackgroundColor}
            onChange={value => setConfig(prev => ({ ...prev, topBannerBackgroundColor: value }))}
          />
          <ColorInput label="Text Color" value={config.topBannerTextColor} onChange={value => setConfig(prev => ({ ...prev, topBannerTextColor: value }))} />
        </div>

        <div className="mb-6 rounded-sm border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 text-sm font-bold">Disabled URLs</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={disabledUrlInput}
              onChange={e => setDisabledUrlInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDisabledUrl();
                }
              }}
              placeholder="/dashboard or /cart"
              className="h-12 border-white/20 bg-white/5 text-white"
            />
            <Button type="button" onClick={addDisabledUrl} variant="outlineGlassy" className="h-12 shrink-0">
              <Plus className="mr-2 h-4 w-4" /> Add URL
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {config.topBannerDisabledUrls.map(url => (
              <span key={url} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold">
                {url}
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, topBannerDisabledUrls: prev.topBannerDisabledUrls.filter(item => item !== url) }))}
                  aria-label={`Remove ${url}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-white/20 p-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Live Preview</p>
          <div className="text-[10px] font-semibold" style={{ backgroundColor: config.topBannerBackgroundColor, color: config.topBannerTextColor }}>
            <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
              <div className="flex items-center gap-2">
                {config.topBannerActionLinks
                  .filter(action => action.isPublished)
                  .map(action => {
                    const Icon = actionIcons[action.id];

                    return (
                      <span
                        key={action.id}
                        title={action.label}
                        className="group relative grid place-items-center rounded-full bg-white/10 transition hover:bg-[#ed1c24]"
                        style={{ color: action.fontColor, padding: `${action.padding}px` }}
                      >
                        <Icon aria-hidden="true" size={action.size} />
                        <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-lg group-hover:block">
                          <span className="font-bold">{action.label}:</span> {getActionDisplayValue(action)}
                        </span>
                      </span>
                    );
                  })}
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-[#ed1c24] px-3 py-1.5 font-bold text-white">
                {isLoggedIn ? <LayoutDashboard aria-hidden="true" size={12} /> : <LogIn aria-hidden="true" size={12} />}
                {isLoggedIn ? 'Dashboard' : 'Login'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
