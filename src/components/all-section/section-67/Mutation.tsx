'use client';

import { useEffect, useState } from 'react';
import { ImageIcon, Palette, Save, Sparkles, Type } from 'lucide-react';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection67, type ISection67Data } from './data';

export interface Section67FormProps {
  data?: ISection67Data;
  onSubmit: (values: ISection67Data) => void;
}

const imageFields: Array<{
  field:
    | 'missionPrimaryImage'
    | 'missionTopImage'
    | 'missionBottomImage'
    | 'visionPrimaryImage'
    | 'visionTopImage'
    | 'visionBottomImage';
  label: string;
}> = [
  { field: 'missionPrimaryImage', label: 'Mission primary image' },
  { field: 'missionTopImage', label: 'Mission top image' },
  { field: 'missionBottomImage', label: 'Mission bottom image' },
  { field: 'visionPrimaryImage', label: 'Vision primary image' },
  { field: 'visionTopImage', label: 'Vision top image' },
  { field: 'visionBottomImage', label: 'Vision bottom image' },
];

const colorFields: Array<{ field: 'backgroundColor' | 'headingColor' | 'accentColor' | 'textColor'; label: string }> = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'headingColor', label: 'Heading' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'textColor', label: 'Description' },
];

const MutationSection67 = ({ data, onSubmit }: Section67FormProps) => {
  const [formData, setFormData] = useState<ISection67Data>({ ...defaultDataSection67 });

  useEffect(() => {
    setFormData({ ...defaultDataSection67, ...(data || {}) });
  }, [data]);

  const updateField = <K extends keyof ISection67Data>(field: K, value: ISection67Data[K]) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Mission and Vision</h2>
            <p className="text-sm text-zinc-400">Update the content, collage images, and colors.</p>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="grid gap-5 lg:grid-cols-2">
            {(['mission', 'vision'] as const).map(section => {
              const isMission = section === 'mission';
              const eyebrowField = isMission ? 'missionEyebrow' : 'visionEyebrow';
              const titleField = isMission ? 'missionTitle' : 'visionTitle';
              const highlightedField = isMission ? 'missionHighlightedTitle' : 'visionHighlightedTitle';
              const descriptionField = isMission ? 'missionDescription' : 'visionDescription';

              return (
                <div key={section} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                    <Type className="h-4 w-4" /> {isMission ? 'Mission' : 'Vision'} content
                  </h3>
                  <div className="space-y-2">
                    <Label>Eyebrow</Label>
                    <Input value={formData[eyebrowField]} onChange={event => updateField(eyebrowField, event.target.value)} className={fieldClassName} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Heading</Label>
                      <Input value={formData[titleField]} onChange={event => updateField(titleField, event.target.value)} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label>Highlighted heading</Label>
                      <Input value={formData[highlightedField]} onChange={event => updateField(highlightedField, event.target.value)} className={fieldClassName} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData[descriptionField]}
                      onChange={event => updateField(descriptionField, event.target.value)}
                      className={`${fieldClassName} min-h-36 resize-y`}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
              <ImageIcon className="h-4 w-4" /> Collage images
            </h3>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {imageFields.map(({ field, label }) => (
                <div key={field} className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                  <Label className="mb-3 block">{label}</Label>
                  <ImageUploadManagerSingle label="" value={formData[field]} onChange={url => updateField(field, url)} />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
              <Palette className="h-4 w-4" /> Colors
            </h3>
            <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5 sm:grid-cols-2 lg:grid-cols-4">
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

        <footer className="flex justify-end border-t border-zinc-800 bg-zinc-900/90 p-6">
          <Button type="button" onClick={() => onSubmit(formData)} className="bg-blue-600 text-white hover:bg-blue-500">
            <Save className="mr-2 h-4 w-4" /> Save changes
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default MutationSection67;
