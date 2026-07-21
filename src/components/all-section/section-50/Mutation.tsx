/*
|-----------------------------------------
| Statistics strip editor for Section 50
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Palette, Plus, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { defaultDataSection50, type ISection50Data } from './data';

export interface Section50FormProps {
  data?: ISection50Data;
  onSubmit: (values: ISection50Data) => void;
}

const colorFields: { field: Exclude<keyof ISection50Data, 'stats'>; label: string }[] = [
  { field: 'backgroundColor', label: 'Card background' },
  { field: 'accentColor', label: 'Accent and values' },
  { field: 'textColor', label: 'Label text' },
  { field: 'borderColor', label: 'Card dividers' },
];

const MutationSection50 = ({ data, onSubmit }: Section50FormProps) => {
  const [formData, setFormData] = useState<ISection50Data>({ ...defaultDataSection50, stats: defaultDataSection50.stats.map(stat => ({ ...stat })) });

  useEffect(() => {
    setFormData({
      ...defaultDataSection50,
      ...(data || {}),
      stats: (data?.stats || defaultDataSection50.stats).map(stat => ({ ...stat })),
    });
  }, [data]);

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    setFormData(current => ({
      ...current,
      stats: current.stats.map((stat, statIndex) => (statIndex === index ? { ...stat, [field]: value } : stat)),
    }));
  };

  const addStat = () => setFormData(current => ({ ...current, stats: [...current.stats, { value: 'New', label: 'New highlight' }] }));
  const removeStat = (index: number) => setFormData(current => ({ ...current, stats: current.stats.filter((_, statIndex) => statIndex !== index) }));
  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-600';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5">
            <BarChart3 className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit statistics strip</h2>
            <p className="text-sm text-zinc-400">Manage the values, labels, and visual theme for Section 50.</p>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">Statistics</h3>
              <Button type="button" variant="outline" size="sm" onClick={addStat} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white">
                <Plus className="mr-2 h-4 w-4" /> Add statistic
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {formData.stats.map((stat, index) => (
                <article key={index} className="relative rounded-2xl border border-zinc-800 bg-zinc-950/55 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Card {index + 1}</span>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(index)} disabled={formData.stats.length === 1} className="h-8 w-8 text-zinc-500 hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove card {index + 1}</span>
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input value={stat.value} onChange={event => updateStat(index, 'value', event.target.value)} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input value={stat.label} onChange={event => updateStat(index, 'label', event.target.value)} className={fieldClassName} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
              <Palette className="h-4 w-4" /> Colors
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {colorFields.map(({ field, label }) => (
                <div key={field} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData[field]}
                      onChange={event => setFormData(current => ({ ...current, [field]: event.target.value }))}
                      className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 p-1"
                      aria-label={`${label} color`}
                    />
                    <Input value={formData[field]} onChange={event => setFormData(current => ({ ...current, [field]: event.target.value }))} className={fieldClassName} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex justify-end border-t border-zinc-800 bg-zinc-900/90 p-6">
          <Button type="button" onClick={() => onSubmit(formData)} className="bg-red-700 text-white hover:bg-red-600">
            <Save className="mr-2 h-4 w-4" /> Save changes
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default MutationSection50;
