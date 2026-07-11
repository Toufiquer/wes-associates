'use client';

import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { defaultDataSection44, HeroFeature, HeroStat, ISection44Data } from './data';

export interface SectionFormProps {
  data?: ISection44Data;
  onSubmit: (values: ISection44Data) => void;
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500';
const labelClass = 'text-xs font-bold uppercase tracking-wide text-slate-500';

const nextId = <T extends { id: number }>(items: T[]) => Math.max(0, ...items.map(item => item.id)) + 1;

const MutationSection44 = ({ data, onSubmit }: SectionFormProps) => {
  const [settings, setSettings] = useState<ISection44Data>({ ...defaultDataSection44, ...data });

  const updateStat = (id: number, field: keyof HeroStat, value: string) => {
    setSettings(prev => ({ ...prev, stats: prev.stats.map(item => (item.id === id ? { ...item, [field]: value } : item)) }));
  };

  const updateFeature = (id: number, field: keyof HeroFeature, value: string) => {
    setSettings(prev => ({ ...prev, features: prev.features.map(item => (item.id === id ? { ...item, [field]: value } : item)) }));
  };

  return (
    <div className="space-y-6 rounded-xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Edit Section 44 Hero</h2>
          <p className="text-sm text-slate-500">Copied from page-1</p>
        </div>
        <button onClick={() => onSubmit(settings)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
          <Save size={16} /> Save
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Badge Text</label>
            <input value={settings.badgeText} onChange={e => setSettings(prev => ({ ...prev, badgeText: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input value={settings.subtitle} onChange={e => setSettings(prev => ({ ...prev, subtitle: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Title Line 1</label>
            <input value={settings.titleLine1} onChange={e => setSettings(prev => ({ ...prev, titleLine1: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Title Line 2</label>
            <input value={settings.titleLine2} onChange={e => setSettings(prev => ({ ...prev, titleLine2: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Stats</h3>
          <button
            onClick={() => setSettings(prev => ({ ...prev, stats: [...prev.stats, { id: nextId(prev.stats), value: '', label: '' }] }))}
            className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {settings.stats.map(item => (
            <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input value={item.value} onChange={e => updateStat(item.id, 'value', e.target.value)} className={inputClass} placeholder="500+" />
              <input value={item.label} onChange={e => updateStat(item.id, 'label', e.target.value)} className={inputClass} placeholder="Templates" />
              <button onClick={() => setSettings(prev => ({ ...prev, stats: prev.stats.filter(stat => stat.id !== item.id) }))} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Feature Chips</h3>
          <button
            onClick={() => setSettings(prev => ({ ...prev, features: [...prev.features, { id: nextId(prev.features), icon: 'ti-check', label: '' }] }))}
            className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {settings.features.map(item => (
            <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input value={item.icon} onChange={e => updateFeature(item.id, 'icon', e.target.value)} className={inputClass} placeholder="ti-world" />
              <input value={item.label} onChange={e => updateFeature(item.id, 'label', e.target.value)} className={inputClass} placeholder="Free Domain" />
              <button
                onClick={() => setSettings(prev => ({ ...prev, features: prev.features.filter(feature => feature.id !== item.id) }))}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MutationSection44;

