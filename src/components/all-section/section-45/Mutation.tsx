'use client';

import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { defaultDataSection45, ISection45Data, VideoReview } from './data';

export interface SectionFormProps {
  data?: ISection45Data;
  onSubmit: (values: ISection45Data) => void;
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500';
const labelClass = 'text-xs font-bold uppercase tracking-wide text-slate-500';
const nextId = (items: VideoReview[]) => Math.max(0, ...items.map(item => item.id)) + 1;

const MutationSection45 = ({ data, onSubmit }: SectionFormProps) => {
  const [settings, setSettings] = useState<ISection45Data>({ ...defaultDataSection45, ...data });

  const updateVideo = (id: number, field: keyof VideoReview, value: string) => {
    setSettings(prev => ({ ...prev, videos: prev.videos.map(item => (item.id === id ? { ...item, [field]: value } : item)) }));
  };

  return (
    <div className="space-y-6 rounded-xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Edit Section 45 Videos</h2>
          <p className="text-sm text-slate-500">Copied from page-2</p>
        </div>
        <button onClick={() => onSubmit(settings)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
          <Save size={16} /> Save
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Badge Text</label>
            <input value={settings.badgeText} onChange={e => setSettings(prev => ({ ...prev, badgeText: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input value={settings.title} onChange={e => setSettings(prev => ({ ...prev, title: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input value={settings.subtitle} onChange={e => setSettings(prev => ({ ...prev, subtitle: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Video Cards</h3>
          <button
            onClick={() =>
              setSettings(prev => ({
                ...prev,
                videos: [...prev.videos, { id: nextId(prev.videos), label: '', sub: '', backgroundColor: '#0f172a', link: '#' }],
              }))
            }
            className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {settings.videos.map(item => (
            <div key={item.id} className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 md:grid-cols-2">
              <input value={item.label} onChange={e => updateVideo(item.id, 'label', e.target.value)} className={inputClass} placeholder="Video title" />
              <input value={item.link} onChange={e => updateVideo(item.id, 'link', e.target.value)} className={inputClass} placeholder="Video link" />
              <input value={item.sub} onChange={e => updateVideo(item.id, 'sub', e.target.value)} className={inputClass} placeholder="Subtitle" />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={item.backgroundColor}
                  onChange={e => updateVideo(item.id, 'backgroundColor', e.target.value)}
                  className="h-10 w-12 rounded border border-slate-200"
                />
                <input value={item.backgroundColor} onChange={e => updateVideo(item.id, 'backgroundColor', e.target.value)} className={inputClass} />
                <button onClick={() => setSettings(prev => ({ ...prev, videos: prev.videos.filter(video => video.id !== item.id) }))} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MutationSection45;

