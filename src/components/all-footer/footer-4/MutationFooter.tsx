'use client';

import { Plus, Save, Trash2, Loader2, RotateCcw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from 'react';

import { defaultDataFooter4, FooterLink, IFooter4Data } from './data';

interface MutationFooterProps {
  data?: string;
  onSave?: (settings: IFooter4Data) => Promise<void> | void;
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-400/60';
const labelClass = 'text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400';
const cardClass = 'rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl';

const safeParseData = (data?: string): IFooter4Data => {
  if (!data) return defaultDataFooter4;
  try {
    return { ...defaultDataFooter4, ...JSON.parse(data) };
  } catch {
    return defaultDataFooter4;
  }
};

const nextId = <T extends { id: number }>(items: T[]) => (items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1);

const MutationFooter4 = ({ data, onSave }: MutationFooterProps) => {
  const [settings, setSettings] = useState<IFooter4Data>(defaultDataFooter4);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(safeParseData(data));
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(settings);
      toast.success('Footer settings updated successfully!');
    } catch {
      toast.error('Failed to update footer settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFooterLink = (arrayName: 'destinationsLinks' | 'servicesLinks', id: number, field: keyof FooterLink, value: string) => {
    setSettings(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map(item => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addFooterLink = (arrayName: 'destinationsLinks' | 'servicesLinks') => {
    setSettings(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { id: nextId(prev[arrayName]), title: '', link: '#' }],
    }));
  };

  const removeById = (arrayName: 'destinationsLinks' | 'servicesLinks', id: number) => {
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
              <h1 className="text-xl font-black text-white">Footer Editor</h1>
              <p className="text-xs text-slate-400">Edit the footer design content.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSettings(defaultDataFooter4)}
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
            {renderSectionHeader('Brand Info')}
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
            {renderSectionHeader('Contact Info')}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Column Title</label>
                <input
                  value={settings.contactTitle}
                  onChange={e => setSettings(prev => ({ ...prev, contactTitle: e.target.value }))}
                  className={`${inputClass} mt-1`}
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  value={settings.contactEmail}
                  onChange={e => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className={`${inputClass} mt-1`}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  value={settings.contactPhone}
                  onChange={e => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className={`${inputClass} mt-1`}
                />
              </div>
            </div>
          </section>

          <section className={cardClass}>
            {renderSectionHeader(settings.destinationsTitle || 'Destinations', () => addFooterLink('destinationsLinks'))}
            <label className={labelClass}>Column Title</label>
            <input
              value={settings.destinationsTitle}
              onChange={e => setSettings(prev => ({ ...prev, destinationsTitle: e.target.value }))}
              className={`${inputClass} mb-4 mt-1`}
            />
            <div className="space-y-3">
              {settings.destinationsLinks.map(item => (
                <div key={item.id} className="grid grid-cols-1 gap-2 rounded-lg bg-black/20 p-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={item.title}
                    onChange={e => updateFooterLink('destinationsLinks', item.id, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="Title"
                  />
                  <input
                    value={item.link}
                    onChange={e => updateFooterLink('destinationsLinks', item.id, 'link', e.target.value)}
                    className={inputClass}
                    placeholder="Link"
                  />
                  <button onClick={() => removeById('destinationsLinks', item.id)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            {renderSectionHeader(settings.servicesTitle || 'Services', () => addFooterLink('servicesLinks'))}
            <label className={labelClass}>Column Title</label>
            <input
              value={settings.servicesTitle}
              onChange={e => setSettings(prev => ({ ...prev, servicesTitle: e.target.value }))}
              className={`${inputClass} mb-4 mt-1`}
            />
            <div className="space-y-3">
              {settings.servicesLinks.map(item => (
                <div key={item.id} className="grid grid-cols-1 gap-2 rounded-lg bg-black/20 p-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={item.title}
                    onChange={e => updateFooterLink('servicesLinks', item.id, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="Title"
                  />
                  <input
                    value={item.link}
                    onChange={e => updateFooterLink('servicesLinks', item.id, 'link', e.target.value)}
                    className={inputClass}
                    placeholder="Link"
                  />
                  <button onClick={() => removeById('servicesLinks', item.id)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10">
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
                <label className={labelClass}>Copyright Text</label>
                <input
                  value={settings.copyrightText}
                  onChange={e => setSettings(prev => ({ ...prev, copyrightText: e.target.value }))}
                  className={`${inputClass} mt-1`}
                />
              </div>
              <div>
                <label className={labelClass}>Right Text</label>
                <input
                  value={settings.bottomRightText}
                  onChange={e => setSettings(prev => ({ ...prev, bottomRightText: e.target.value }))}
                  className={`${inputClass} mt-1`}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MutationFooter4;
