'use client';

import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { defaultDataPage101, ISection101Data, ProductSocialIcon, ProductShowcaseSocial } from './data';

export interface SectionFormProps {
  data?: ISection101Data | string;
  onSubmit: (values: ISection101Data) => void;
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500';
const labelClass = 'text-xs font-bold uppercase tracking-wide text-slate-500';
const socialOptions: ProductSocialIcon[] = ['facebook', 'linkedin', 'pin', 'message-circle', 'mail'];

const nextId = (items: ProductShowcaseSocial[]) => Math.max(0, ...items.map(item => item.id)) + 1;

const parseSectionData = (data?: SectionFormProps['data']): Partial<ISection101Data> => {
  if (!data) return {};
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data) as Partial<ISection101Data>;
  } catch {
    return {};
  }
};

const MutationPage101 = ({ data, onSubmit }: SectionFormProps) => {
  const [settings, setSettings] = useState<ISection101Data>({ ...defaultDataPage101, ...parseSectionData(data) });

  const updateFeature = (index: number, value: string) => {
    setSettings(prev => ({ ...prev, features: prev.features.map((feature, featureIndex) => (featureIndex === index ? value : feature)) }));
  };

  const updateSocial = (id: number, field: keyof ProductShowcaseSocial, value: string) => {
    setSettings(prev => ({
      ...prev,
      socials: prev.socials.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <div className="space-y-6 rounded-xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Edit Page 5 Product Showcase</h2>
          <p className="text-sm text-slate-500">Matches page-5/design.tsx</p>
        </div>
        <button onClick={() => onSubmit(settings)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
          <Save size={16} /> Save
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Image URL</label>
            <input value={settings.imageUrl} onChange={e => setSettings(prev => ({ ...prev, imageUrl: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Image Alt</label>
            <input value={settings.imageAlt} onChange={e => setSettings(prev => ({ ...prev, imageAlt: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Category Title</label>
            <input value={settings.categoryTitle} onChange={e => setSettings(prev => ({ ...prev, categoryTitle: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Product Title</label>
            <input value={settings.productTitle} onChange={e => setSettings(prev => ({ ...prev, productTitle: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Price Label</label>
            <input value={settings.priceLabel} onChange={e => setSettings(prev => ({ ...prev, priceLabel: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Price</label>
            <input value={settings.price} onChange={e => setSettings(prev => ({ ...prev, price: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Buy Button</label>
            <input value={settings.buyButtonText} onChange={e => setSettings(prev => ({ ...prev, buyButtonText: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Membership Button</label>
            <input
              value={settings.membershipButtonText}
              onChange={e => setSettings(prev => ({ ...prev, membershipButtonText: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Tutorial Button</label>
            <input value={settings.tutorialButtonText} onChange={e => setSettings(prev => ({ ...prev, tutorialButtonText: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Live Demo URL</label>
            <input value={settings.liveDemoUrl} onChange={e => setSettings(prev => ({ ...prev, liveDemoUrl: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Video URL</label>
            <input value={settings.videoUrl} onChange={e => setSettings(prev => ({ ...prev, videoUrl: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Product Lookup Limit</label>
            <input
              type="number"
              min={1}
              value={settings.productLookupLimit}
              onChange={e => setSettings(prev => ({ ...prev, productLookupLimit: Math.max(1, Number(e.target.value) || defaultDataPage101.productLookupLimit) }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Product Descriptions</label>
            <textarea
              value={settings.productDescriptions}
              onChange={e => setSettings(prev => ({ ...prev, productDescriptions: e.target.value }))}
              className={`${inputClass} mt-1 min-h-48 resize-y leading-6`}
              placeholder="Write product description..."
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-bold text-slate-900">Countdown</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {(['hours', 'minutes', 'seconds'] as const).map(key => (
            <div key={key}>
              <label className={labelClass}>{key}</label>
              <input
                type="number"
                min={0}
                value={settings.timer[key]}
                onChange={e => setSettings(prev => ({ ...prev, timer: { ...prev.timer, [key]: Number(e.target.value) } }))}
                className={`${inputClass} mt-1`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Features</h3>
          <button
            onClick={() => setSettings(prev => ({ ...prev, features: [...prev.features, 'New feature'] }))}
            className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {settings.features.map((feature, index) => (
            <div key={`${feature}-${index}`} className="grid gap-2 md:grid-cols-[1fr_auto]">
              <input value={feature} onChange={e => updateFeature(index, e.target.value)} className={inputClass} />
              <button
                onClick={() => setSettings(prev => ({ ...prev, features: prev.features.filter((_, featureIndex) => featureIndex !== index) }))}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Social Links</h3>
          <button
            onClick={() => setSettings(prev => ({ ...prev, socials: [...prev.socials, { id: nextId(prev.socials), icon: 'facebook', link: '#' }] }))}
            className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {settings.socials.map(item => (
            <div key={item.id} className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 md:grid-cols-[220px_1fr_auto]">
              <select value={item.icon} onChange={e => updateSocial(item.id, 'icon', e.target.value)} className={inputClass}>
                {socialOptions.map(icon => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <input value={item.link} onChange={e => updateSocial(item.id, 'link', e.target.value)} className={inputClass} placeholder="https://..." />
              <button onClick={() => setSettings(prev => ({ ...prev, socials: prev.socials.filter(social => social.id !== item.id) }))} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MutationPage101;
