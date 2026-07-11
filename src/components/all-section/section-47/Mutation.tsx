'use client';

import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { CategoryIconKey, CategorySliderItem, defaultDataSection47, ISection47Data } from './data';

export interface SectionFormProps {
  data?: ISection47Data;
  onSubmit: (values: ISection47Data) => void;
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500';
const labelClass = 'text-xs font-bold uppercase tracking-wide text-slate-500';
const iconOptions: CategoryIconKey[] = ['shopping-basket', 'wheat', 'sparkles', 'laptop', 'plug', 'heart'];

const nextId = (items: CategorySliderItem[]) => Math.max(0, ...items.map(item => item.id)) + 1;

const MutationSection47 = ({ data, onSubmit }: SectionFormProps) => {
  const [settings, setSettings] = useState<ISection47Data>({ ...defaultDataSection47, ...data });

  const updateCategory = (id: number, field: keyof CategorySliderItem, value: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <div className="space-y-6 rounded-xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Edit Section 47 Category Slider</h2>
          <p className="text-sm text-slate-500">Copied from page-4</p>
        </div>
        <button onClick={() => onSubmit(settings)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
          <Save size={16} /> Save
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Card Background</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.cardBackgroundColor}
                onChange={e => setSettings(prev => ({ ...prev, cardBackgroundColor: e.target.value }))}
                className="h-10 w-12 rounded border border-slate-200"
              />
              <input value={settings.cardBackgroundColor} onChange={e => setSettings(prev => ({ ...prev, cardBackgroundColor: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Icon Background</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.iconBackgroundColor}
                onChange={e => setSettings(prev => ({ ...prev, iconBackgroundColor: e.target.value }))}
                className="h-10 w-12 rounded border border-slate-200"
              />
              <input value={settings.iconBackgroundColor} onChange={e => setSettings(prev => ({ ...prev, iconBackgroundColor: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Icon Hover Background</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.iconHoverBackgroundColor}
                onChange={e => setSettings(prev => ({ ...prev, iconHoverBackgroundColor: e.target.value }))}
                className="h-10 w-12 rounded border border-slate-200"
              />
              <input
                value={settings.iconHoverBackgroundColor}
                onChange={e => setSettings(prev => ({ ...prev, iconHoverBackgroundColor: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Categories</h3>
          <button
            onClick={() =>
              setSettings(prev => ({
                ...prev,
                categories: [...prev.categories, { id: nextId(prev.categories), name: 'New Category', icon: 'shopping-basket' }],
              }))
            }
            className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {settings.categories.map(item => (
            <div key={item.id} className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 md:grid-cols-[1fr_220px_auto]">
              <input value={item.name} onChange={e => updateCategory(item.id, 'name', e.target.value)} className={inputClass} placeholder="Category name" />
              <select value={item.icon} onChange={e => updateCategory(item.id, 'icon', e.target.value)} className={inputClass}>
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSettings(prev => ({ ...prev, categories: prev.categories.filter(category => category.id !== item.id) }))}
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

export default MutationSection47;

