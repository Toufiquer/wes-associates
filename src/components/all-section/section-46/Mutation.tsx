'use client';

import { Save } from 'lucide-react';
import { useState } from 'react';

import { defaultDataSection46, ISection46Data } from './data';

export interface SectionFormProps {
  data?: ISection46Data;
  onSubmit: (values: ISection46Data) => void;
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500';
const labelClass = 'text-xs font-bold uppercase tracking-wide text-slate-500';

const MutationSection46 = ({ data, onSubmit }: SectionFormProps) => {
  const [settings, setSettings] = useState<ISection46Data>({ ...defaultDataSection46, ...data });

  return (
    <div className="space-y-6 rounded-xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Edit Section 46 Banner</h2>
          <p className="text-sm text-slate-500">Copied from page-3</p>
        </div>
        <button onClick={() => onSubmit(settings)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
          <Save size={16} /> Save
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Banner Text</label>
            <input value={settings.text} onChange={e => setSettings(prev => ({ ...prev, text: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Link</label>
            <input value={settings.link} onChange={e => setSettings(prev => ({ ...prev, link: e.target.value }))} className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Gradient From</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.gradientFrom}
                onChange={e => setSettings(prev => ({ ...prev, gradientFrom: e.target.value }))}
                className="h-10 w-12 rounded border border-slate-200"
              />
              <input value={settings.gradientFrom} onChange={e => setSettings(prev => ({ ...prev, gradientFrom: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Gradient To</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.gradientTo}
                onChange={e => setSettings(prev => ({ ...prev, gradientTo: e.target.value }))}
                className="h-10 w-12 rounded border border-slate-200"
              />
              <input value={settings.gradientTo} onChange={e => setSettings(prev => ({ ...prev, gradientTo: e.target.value }))} className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      <section
        className="cursor-pointer select-none rounded-xl px-4 py-5 text-center text-lg font-extrabold tracking-wide text-white transition-opacity hover:opacity-95 sm:text-xl"
        style={{ backgroundImage: `linear-gradient(to right, ${settings.gradientFrom}, ${settings.gradientTo})` }}
      >
        {settings.text}
      </section>
    </div>
  );
};

export default MutationSection46;

