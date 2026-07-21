'use client';

import { useEffect, useState } from 'react';
import { ImageIcon, Palette, Save, Type } from 'lucide-react';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection65, type ISection65Data } from './data';

export interface Section65FormProps {
  data?: ISection65Data;
  onSubmit: (values: ISection65Data) => void;
}

const textFields: Array<{ field: 'eyebrow' | 'title' | 'highlightedTitle'; label: string }> = [
  { field: 'eyebrow', label: 'Eyebrow' },
  { field: 'title', label: 'Heading' },
  { field: 'highlightedTitle', label: 'Highlighted heading' },
];

const imageFields: Array<{ field: 'topImage' | 'bottomImage' | 'centerImage'; label: string }> = [
  { field: 'topImage', label: 'Top image' },
  { field: 'bottomImage', label: 'Bottom image' },
  { field: 'centerImage', label: 'Center image' },
];

const colorFields: Array<{ field: 'backgroundColor' | 'headingColor' | 'accentColor' | 'textColor'; label: string }> = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'headingColor', label: 'Heading' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'textColor', label: 'Description' },
];

const MutationSection65 = ({ data, onSubmit }: Section65FormProps) => {
  const [formData, setFormData] = useState<ISection65Data>({ ...defaultDataSection65 });

  useEffect(() => {
    setFormData({ ...defaultDataSection65, ...(data || {}) });
  }, [data]);

  const updateField = <K extends keyof ISection65Data>(field: K, value: ISection65Data[K]) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <ImageIcon className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit About Section</h2>
            <p className="text-sm text-zinc-400">Update the content, images, and colors.</p>
          </div>
        </header>

        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-2">
          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <Type className="h-4 w-4" /> Content
              </h3>
              <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                {textFields.map(({ field, label }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label}</Label>
                    <Input value={formData[field]} onChange={event => updateField(field, event.target.value)} className={fieldClassName} />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={event => updateField('description', event.target.value)}
                    className={`${fieldClassName} min-h-40 resize-y`}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <Palette className="h-4 w-4" /> Colors
              </h3>
              <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5 sm:grid-cols-2">
                {colorFields.map(({ field, label }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData[field]}
                        onChange={event => updateField(field, event.target.value)}
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 p-1"
                        aria-label={`${label} color`}
                      />
                      <Input value={formData[field]} onChange={event => updateField(field, event.target.value)} className={fieldClassName} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
              <ImageIcon className="h-4 w-4" /> Images
            </h3>
            <div className="space-y-5">
              {imageFields.map(({ field, label }) => (
                <div key={field} className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                  <Label className="mb-3 block">{label}</Label>
                  <ImageUploadManagerSingle label="" value={formData[field]} onChange={url => updateField(field, url)} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex justify-end border-t border-zinc-800 bg-zinc-900/90 p-6">
          <Button type="button" onClick={() => onSubmit(formData)} className="bg-blue-600 text-white hover:bg-blue-500">
            <Save className="mr-2 h-4 w-4" /> Save changes
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default MutationSection65;
