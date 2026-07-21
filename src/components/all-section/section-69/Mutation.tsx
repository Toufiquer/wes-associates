'use client';

import { useEffect, useState } from 'react';
import { Building2, ImageIcon, Palette, Plus, Save, Trash2, Type } from 'lucide-react';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { defaultDataSection69, type ISection69Data } from './data';

export interface Section69FormProps {
  data?: ISection69Data;
  onSubmit: (values: ISection69Data) => void;
}

const colorFields: Array<{ field: 'backgroundColor' | 'headingColor' | 'textColor'; label: string }> = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'headingColor', label: 'Heading' },
  { field: 'textColor', label: 'Eyebrow' },
];

const MutationSection69 = ({ data, onSubmit }: Section69FormProps) => {
  const [formData, setFormData] = useState<ISection69Data>({ ...defaultDataSection69, logos: [...defaultDataSection69.logos] });

  useEffect(() => {
    setFormData({ ...defaultDataSection69, ...(data || {}), logos: [...(data?.logos || defaultDataSection69.logos)] });
  }, [data]);

  const updateField = <K extends keyof ISection69Data>(field: K, value: ISection69Data[K]) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const updateLogo = (index: number, url: string) => {
    setFormData(current => ({ ...current, logos: current.logos.map((logo, logoIndex) => (logoIndex === index ? url : logo)) }));
  };

  const addLogo = () => {
    setFormData(current => ({ ...current, logos: [...current.logos, '/globe.svg'] }));
  };

  const removeLogo = (index: number) => {
    setFormData(current => ({ ...current, logos: current.logos.filter((_, logoIndex) => logoIndex !== index) }));
  };

  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <Building2 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Corporate Clients</h2>
            <p className="text-sm text-zinc-400">Update the heading, client logos, and colors.</p>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <Type className="h-4 w-4" /> Content
              </h3>
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <Input value={formData.eyebrow} onChange={event => updateField('eyebrow', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input value={formData.title} onChange={event => updateField('title', event.target.value)} className={fieldClassName} />
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <Palette className="h-4 w-4" /> Colors
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
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
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <ImageIcon className="h-4 w-4" /> Client logos
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={addLogo} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white">
                <Plus className="mr-2 h-4 w-4" /> Add logo
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {formData.logos.map((logo, index) => (
                <div key={index} className="relative rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Label>Logo {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLogo(index)}
                      disabled={formData.logos.length === 1}
                      className="h-8 w-8 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove logo {index + 1}</span>
                    </Button>
                  </div>
                  <ImageUploadManagerSingle label="" value={logo} onChange={url => updateLogo(index, url)} />
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

export default MutationSection69;
