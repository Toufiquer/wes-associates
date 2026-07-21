/*
|-----------------------------------------
| About WES editor for Section 51
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { Info, Palette, Plus, Save, Trash2, Type } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection51, type ISection51Data } from './data';

export interface Section51FormProps {
  data?: ISection51Data;
  onSubmit: (values: ISection51Data) => void;
}

const colorFields: { field: Exclude<keyof ISection51Data, 'eyebrow' | 'title' | 'description' | 'highlights'>; label: string }[] = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'headingColor', label: 'Heading' },
  { field: 'textColor', label: 'Description' },
];

const MutationSection51 = ({ data, onSubmit }: Section51FormProps) => {
  const [formData, setFormData] = useState<ISection51Data>({
    ...defaultDataSection51,
    highlights: [...defaultDataSection51.highlights],
  });

  useEffect(() => {
    setFormData({
      ...defaultDataSection51,
      ...(data || {}),
      highlights: [...(data?.highlights || defaultDataSection51.highlights)],
    });
  }, [data]);

  const updateHighlight = (index: number, value: string) => {
    setFormData(current => ({
      ...current,
      highlights: current.highlights.map((highlight, highlightIndex) => (highlightIndex === index ? value : highlight)),
    }));
  };

  const addHighlight = () => setFormData(current => ({ ...current, highlights: [...current.highlights, 'New highlight'] }));
  const removeHighlight = (index: number) =>
    setFormData(current => ({ ...current, highlights: current.highlights.filter((_, highlightIndex) => highlightIndex !== index) }));
  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-600';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5">
            <Info className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit About WES</h2>
            <p className="text-sm text-zinc-400">Update the introduction, highlights, and visual theme for Section 51.</p>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
              <Type className="h-4 w-4" /> Main content
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Eyebrow</Label>
                <Input value={formData.eyebrow} onChange={event => setFormData(current => ({ ...current, eyebrow: event.target.value }))} className={fieldClassName} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Heading</Label>
                <Textarea value={formData.title} onChange={event => setFormData(current => ({ ...current, title: event.target.value }))} className={`${fieldClassName} min-h-24 resize-y`} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={event => setFormData(current => ({ ...current, description: event.target.value }))} className={`${fieldClassName} min-h-32 resize-y`} />
              </div>
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">Highlights</h3>
              <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white">
                <Plus className="mr-2 h-4 w-4" /> Add highlight
              </Button>
            </div>
            <div className="space-y-3">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/55 p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-red-500/10 text-xs font-black text-red-400">{index + 1}</span>
                  <Input value={highlight} onChange={event => updateHighlight(index, event.target.value)} className={fieldClassName} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(index)} disabled={formData.highlights.length === 1} className="shrink-0 text-zinc-500 hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove highlight {index + 1}</span>
                  </Button>
                </div>
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

export default MutationSection51;
