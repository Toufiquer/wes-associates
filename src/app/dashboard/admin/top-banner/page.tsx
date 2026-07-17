/*
|-----------------------------------------
| setting up TopBannerPage for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, July, 2026
|-----------------------------------------
*/

'use client';

import { Clock, Loader2, Mail, Phone, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TopBannerConfig, TopBannerSocialLink, useGetTopBannerQuery, useUpdateTopBannerMutation } from '@/redux/features/top-banner/topBannerSlice';

const defaultSocialLinks: TopBannerSocialLink[] = [
  { id: 'facebook', label: 'Facebook', iconUrl: '', url: 'https://facebook.com', isPublished: true },
  { id: 'youtube', label: 'YouTube', iconUrl: '', url: 'https://youtube.com', isPublished: true },
  { id: 'linkedin', label: 'LinkedIn', iconUrl: '', url: 'https://linkedin.com', isPublished: true },
];

const defaultConfig: TopBannerConfig = {
  topBannerIsPublished: true,
  topBannerPosition: 'scroll',
  topBannerBackgroundColor: '#000000',
  topBannerTextColor: '#9ca3af',
  topBannerDisabledUrls: [],
  contactEmail: 'info@wesassociates.com',
  contactPhone: '+880 1300-111222',
  contactHours: 'Sat-Thu, 10:00 AM - 7:00 PM',
  topBannerSocialLinks: defaultSocialLinks,
};

const positionOptions = [
  { label: 'Fixed', value: 'fixed', description: 'Pinned to the viewport top' },
  { label: 'Sticky', value: 'sticky', description: 'Sticks after reaching the top' },
  { label: 'Scroll', value: 'scroll', description: 'Normal page flow' },
] as const;

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

  useEffect(() => {
    if (bannerSettings) {
      setConfig({
        ...defaultConfig,
        ...bannerSettings,
        topBannerSocialLinks: bannerSettings.topBannerSocialLinks ?? defaultSocialLinks,
      });
    }
  }, [bannerSettings]);

  useEffect(() => {
    if (isError) toast.error('Top banner sync failed');
  }, [isError]);

  const updateSocialLink = (id: string, changes: Partial<TopBannerSocialLink>) => {
    setConfig(prev => ({
      ...prev,
      topBannerSocialLinks: prev.topBannerSocialLinks.map(item => (item.id === id ? { ...item, ...changes } : item)),
    }));
  };

  const addSocialLink = () => {
    setConfig(prev => ({
      ...prev,
      topBannerSocialLinks: [...prev.topBannerSocialLinks, { id: `social-${Date.now()}`, label: 'Social', iconUrl: '', url: 'https://', isPublished: true }],
    }));
  };

  const removeSocialLink = (id: string) => {
    setConfig(prev => ({ ...prev, topBannerSocialLinks: prev.topBannerSocialLinks.filter(item => item.id !== id) }));
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
            <p className="text-xs text-white/50">Update contact details, social links, icons, colors, and banner behavior.</p>
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
          <h2 className="mb-4 text-sm font-bold">Contact Information</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                value={config.contactEmail}
                onChange={e => setConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="h-12 border-white/20 bg-white/5 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={config.contactPhone}
                onChange={e => setConfig(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="h-12 border-white/20 bg-white/5 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Office Hours</Label>
              <Input
                value={config.contactHours}
                onChange={e => setConfig(prev => ({ ...prev, contactHours: e.target.value }))}
                className="h-12 border-white/20 bg-white/5 text-white"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-sm border border-white/10 bg-white/5 p-4">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold">Social Media</h2>
              <p className="text-xs text-white/50">Upload an icon and set its social profile link.</p>
            </div>
            <Button type="button" variant="outlineGlassy" size="sm" onClick={addSocialLink} disabled={config.topBannerSocialLinks.length >= 12}>
              <Plus className="mr-2 h-4 w-4" /> Add Social
            </Button>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {config.topBannerSocialLinks.map(social => (
              <article key={social.id} className="space-y-4 rounded-sm border border-white/15 bg-black/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={social.isPublished} onCheckedChange={value => updateSocialLink(social.id, { isPublished: value })} />
                    <span className="text-xs font-bold">Visible</span>
                  </div>
                  <Button type="button" variant="outlineFire" size="sm" onClick={() => removeSocialLink(social.id)} aria-label={`Remove ${social.label}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ImageUploadManagerSingle
                  value={social.iconUrl}
                  onChange={iconUrl => updateSocialLink(social.id, { iconUrl })}
                  label={`${social.label || 'Social'} icon`}
                  maxSizeMB={0.25}
                  maxWidthOrHeight={256}
                />
                <div className="space-y-2">
                  <Label>Social Name</Label>
                  <Input
                    value={social.label}
                    onChange={e => updateSocialLink(social.id, { label: e.target.value })}
                    placeholder="Facebook"
                    className="h-11 border-white/20 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profile URL</Label>
                  <Input
                    value={social.url}
                    onChange={e => updateSocialLink(social.id, { url: e.target.value })}
                    placeholder="https://facebook.com/your-page"
                    className="h-11 border-white/20 bg-white/5 text-white"
                  />
                </div>
              </article>
            ))}
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
          <div
            className="flex flex-col items-center justify-between gap-4 px-4 py-2.5 text-xs md:flex-row md:text-sm"
            style={{ backgroundColor: config.topBannerBackgroundColor, color: config.topBannerTextColor }}
          >
            <div className="flex flex-wrap items-center justify-center gap-5 md:justify-start">
              <span className="flex items-center gap-2">
                <Mail size={14} /> {config.contactEmail}
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} /> {config.contactPhone}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} /> {config.contactHours}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {config.topBannerSocialLinks
                .filter(item => item.isPublished)
                .map(social => (
                  <span
                    key={social.id}
                    title={social.label}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-contain bg-center bg-no-repeat text-[10px] font-bold"
                    style={social.iconUrl ? { backgroundImage: `url(${JSON.stringify(social.iconUrl)})` } : undefined}
                  >
                    {!social.iconUrl && social.label.slice(0, 2).toUpperCase()}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
