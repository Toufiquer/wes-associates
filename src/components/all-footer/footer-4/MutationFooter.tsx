/*
|-----------------------------------------
| setting up MutationFooter for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { Plus, Save, Trash2, Loader2, RotateCcw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from 'react';

import { defaultDataFooter2, FeatureBadge, FooterLink, IFooter2Data } from './data';

interface MutationFooterProps {
  data?: string;
  onSave?: (settings: IFooter2Data) => Promise<void> | void;
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-400/60';
const labelClass = 'text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400';
const cardClass = 'rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl';

const safeParseData = (data?: string): IFooter2Data => {
  if (!data) return defaultDataFooter2;
  try {
    const parsed = { ...defaultDataFooter2, ...JSON.parse(data) } as IFooter2Data;
    const parsedSocialLinks = parsed.socialLinks || [];

    return {
      ...parsed,
      socialLinks: defaultDataFooter2.socialLinks.map(defaultItem => {
        const savedItem = parsedSocialLinks.find(item => item.id === defaultItem.id || item.platform === defaultItem.platform);
        return { ...defaultItem, link: savedItem?.link ?? defaultItem.link };
      }),
    };
  } catch {
    return defaultDataFooter2;
  }
};

const nextId = <T extends { id: number }>(items: T[]) => Math.max(0, ...items.map(item => item.id)) + 1;

const MutationFooter2 = ({ data, onSave }: MutationFooterProps) => {
  const [settings, setSettings] = useState<IFooter2Data>(defaultDataFooter2);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentBadgesText, setPaymentBadgesText] = useState(defaultDataFooter2.paymentBadges.join(', '));

  useEffect(() => {
    const parsed = safeParseData(data);
    setSettings(parsed);
    setPaymentBadgesText(parsed.paymentBadges.join(', '));
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...settings,
        paymentBadges: paymentBadgesText
          .split(',')
          .map(item => item.trim())
          .filter(Boolean),
      };
      await onSave?.(payload);
      setSettings(payload);
      toast.success('Footer settings updated successfully!');
    } catch {
      toast.error('Failed to update footer settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFeatureBadge = (id: number, field: keyof FeatureBadge, value: string) => {
    setSettings(prev => ({
      ...prev,
      featureBadges: prev.featureBadges.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const updateSocialUrl = (id: number, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(item => (item.id === id ? { ...item, link: value } : item)),
    }));
  };

  const updateFooterLink = (arrayName: 'menuLinks' | 'informationLinks', id: number, field: keyof FooterLink, value: string) => {
    setSettings(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map(item => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addFeatureBadge = () => {
    setSettings(prev => ({
      ...prev,
      featureBadges: [...prev.featureBadges, { id: nextId(prev.featureBadges), title: '', iconClass: 'ti ti-check' }],
    }));
  };

  const addFooterLink = (arrayName: 'menuLinks' | 'informationLinks') => {
    setSettings(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { id: nextId(prev[arrayName]), title: '', link: '#' }],
    }));
  };

  const removeById = (arrayName: 'featureBadges' | 'socialLinks' | 'menuLinks' | 'informationLinks', id: number) => {
    setSettings(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter(item => item.id !== id),
    }));
  };

  const renderSectionHeader = (title: string, onAdd?: () => void) => (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">{title}</h2>
      {onAdd && (
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500">
          <Plus size={14} /> Add
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200">
      <ToastContainer position="bottom-right" theme="dark" />

      <div className="mx-auto max-w-6xl space-y-6">
        <div className="sticky top-0 z-30 rounded-xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-black text-white">Footer 3 Editor</h1>
              <p className="text-xs text-slate-400">Edit the Wes Associates footer design content.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSettings(defaultDataFooter2);
                  setPaymentBadgesText(defaultDataFooter2.paymentBadges.join(', '));
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
              >
                <RotateCcw size={16} /> Reset
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className={cardClass}>
            {renderSectionHeader('Promo Bar')}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Promo Text</label>
                <textarea
                  value={settings.promoText}
                  onChange={e => setSettings(prev => ({ ...prev, promoText: e.target.value }))}
                  className={`${inputClass} mt-1 min-h-24`}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Button Text</label>
                  <input
                    value={settings.promoButtonText}
                    onChange={e => setSettings(prev => ({ ...prev, promoButtonText: e.target.value }))}
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Button Link</label>
                  <input
                    value={settings.promoButtonLink}
                    onChange={e => setSettings(prev => ({ ...prev, promoButtonLink: e.target.value }))}
                    className={`${inputClass} mt-1`}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            {renderSectionHeader('Brand')}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Brand Name</label>
                <input
                  value={settings.brandName}
                  onChange={e => setSettings(prev => ({ ...prev, brandName: e.target.value }))}
                  className={`${inputClass} mt-1`}
                />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <textarea
                  value={settings.tagline}
                  onChange={e => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                  className={`${inputClass} mt-1 min-h-24`}
                />
              </div>
            </div>
          </section>

          <section className={cardClass}>
            {renderSectionHeader('Feature Badges', addFeatureBadge)}
            <div className="space-y-3">
              {settings.featureBadges.map(item => (
                <div key={item.id} className="grid grid-cols-1 gap-2 rounded-lg bg-black/20 p-3 md:grid-cols-[1fr_1fr_auto]">
                  <input value={item.title} onChange={e => updateFeatureBadge(item.id, 'title', e.target.value)} className={inputClass} placeholder="Title" />
                  <input
                    value={item.iconClass}
                    onChange={e => updateFeatureBadge(item.id, 'iconClass', e.target.value)}
                    className={inputClass}
                    placeholder="ti ti-world"
                  />
                  <button onClick={() => removeById('featureBadges', item.id)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            {renderSectionHeader('Social Links')}
            <div className="space-y-3">
              {settings.socialLinks.map(item => (
                <div key={item.id} className="grid grid-cols-1 gap-2 rounded-lg bg-black/20 p-3 md:grid-cols-[150px_1fr] md:items-center">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ backgroundColor: item.backgroundColor }}>
                      <i className={`${item.iconClass} text-base`} />
                    </span>
                    <span className="text-sm font-bold capitalize text-white">{item.platform}</span>
                  </div>
                  <input
                    value={item.link}
                    onChange={e => updateSocialUrl(item.id, e.target.value)}
                    className={inputClass}
                    placeholder={`${item.platform} URL`}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            {renderSectionHeader(settings.menuTitle || 'Our Menu', () => addFooterLink('menuLinks'))}
            <label className={labelClass}>Column Title</label>
            <input
              value={settings.menuTitle}
              onChange={e => setSettings(prev => ({ ...prev, menuTitle: e.target.value }))}
              className={`${inputClass} mb-4 mt-1`}
            />
            <div className="space-y-3">
              {settings.menuLinks.map(item => (
                <div key={item.id} className="grid grid-cols-1 gap-2 rounded-lg bg-black/20 p-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={item.title}
                    onChange={e => updateFooterLink('menuLinks', item.id, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="Title"
                  />
                  <input
                    value={item.link}
                    onChange={e => updateFooterLink('menuLinks', item.id, 'link', e.target.value)}
                    className={inputClass}
                    placeholder="Link"
                  />
                  <button onClick={() => removeById('menuLinks', item.id)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            {renderSectionHeader(settings.informationTitle || 'Information', () => addFooterLink('informationLinks'))}
            <label className={labelClass}>Column Title</label>
            <input
              value={settings.informationTitle}
              onChange={e => setSettings(prev => ({ ...prev, informationTitle: e.target.value }))}
              className={`${inputClass} mb-4 mt-1`}
            />
            <div className="space-y-3">
              {settings.informationLinks.map(item => (
                <div key={item.id} className="grid grid-cols-1 gap-2 rounded-lg bg-black/20 p-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={item.title}
                    onChange={e => updateFooterLink('informationLinks', item.id, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="Title"
                  />
                  <input
                    value={item.link}
                    onChange={e => updateFooterLink('informationLinks', item.id, 'link', e.target.value)}
                    className={inputClass}
                    placeholder="Link"
                  />
                  <button onClick={() => removeById('informationLinks', item.id)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            {renderSectionHeader('Bottom Bar')}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Payment Badges, comma separated</label>
                <input value={paymentBadgesText} onChange={e => setPaymentBadgesText(e.target.value)} className={`${inputClass} mt-1`} />
              </div>
              <div>
                <label className={labelClass}>Copyright</label>
                <input
                  value={settings.copyrightText}
                  onChange={e => setSettings(prev => ({ ...prev, copyrightText: e.target.value }))}
                  className={`${inputClass} mt-1`}
                />
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/20 p-3">
                <span>
                  <span className="block text-sm font-bold text-white">Show StandWithPalestine Badge</span>
                  <span className="text-xs text-slate-400">Hide or show the green support badge in the footer bottom bar.</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.showSupportBadge}
                  onChange={e => setSettings(prev => ({ ...prev, showSupportBadge: e.target.checked }))}
                  className="h-5 w-5 accent-blue-600"
                />
              </label>
              <div>
                <label className={labelClass}>Support Badge</label>
                <input
                  value={settings.supportBadgeText}
                  onChange={e => setSettings(prev => ({ ...prev, supportBadgeText: e.target.value }))}
                  className={`${inputClass} mt-1`}
                />
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/20 p-3">
                <span>
                  <span className="block text-sm font-bold text-white">Show Ask AI Button</span>
                  <span className="text-xs text-slate-400">Hide or show the blue Ask AI button in the footer bottom bar.</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.showAskAiButton}
                  onChange={e => setSettings(prev => ({ ...prev, showAskAiButton: e.target.checked }))}
                  className="h-5 w-5 accent-blue-600"
                />
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Ask AI Text</label>
                  <input
                    value={settings.askAiText}
                    onChange={e => setSettings(prev => ({ ...prev, askAiText: e.target.value }))}
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ask AI Link</label>
                  <input
                    value={settings.askAiLink}
                    onChange={e => setSettings(prev => ({ ...prev, askAiLink: e.target.value }))}
                    className={`${inputClass} mt-1`}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MutationFooter2;
