'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, ImageIcon, Link2, Palette, Save, Type } from 'lucide-react';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection70, type ISection70Data } from './data';

export interface Section70FormProps {
  data?: ISection70Data;
  onSubmit: (values: ISection70Data) => void;
}

const imageFields: Array<{ field: 'onlineAppointmentImage' | 'physicalAppointmentImage'; label: string }> = [
  { field: 'onlineAppointmentImage', label: 'Online appointment image' },
  { field: 'physicalAppointmentImage', label: 'Physical appointment image' },
];

const colorFields: Array<{ field: 'backgroundColor' | 'headingColor' | 'accentColor' | 'textColor' | 'buttonColor'; label: string }> = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'headingColor', label: 'Heading' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'textColor', label: 'Description' },
  { field: 'buttonColor', label: 'Button' },
];

const MutationSection70 = ({ data, onSubmit }: Section70FormProps) => {
  const [formData, setFormData] = useState<ISection70Data>({ ...defaultDataSection70, paragraphs: [...defaultDataSection70.paragraphs] });

  useEffect(() => {
    setFormData({ ...defaultDataSection70, ...(data || {}), paragraphs: [...(data?.paragraphs || defaultDataSection70.paragraphs)] });
  }, [data]);

  const updateField = <K extends keyof ISection70Data>(field: K, value: ISection70Data[K]) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const updateParagraph = (index: number, value: string) => {
    setFormData(current => ({
      ...current,
      paragraphs: current.paragraphs.map((paragraph, paragraphIndex) => (paragraphIndex === index ? value : paragraph)),
    }));
  };

  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <CalendarDays className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Appointment Section</h2>
            <p className="text-sm text-zinc-400">Update the content, actions, images, and colors.</p>
          </div>
        </header>

        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-2">
          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <Type className="h-4 w-4" /> Content
              </h3>
              <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                <div className="space-y-2">
                  <Label>Eyebrow</Label>
                  <Input value={formData.eyebrow} onChange={event => updateField('eyebrow', event.target.value)} className={fieldClassName} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input value={formData.title} onChange={event => updateField('title', event.target.value)} className={fieldClassName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlighted heading</Label>
                    <Input value={formData.highlightedTitle} onChange={event => updateField('highlightedTitle', event.target.value)} className={fieldClassName} />
                  </div>
                </div>
                {formData.paragraphs.map((paragraph, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Paragraph {index + 1}</Label>
                    <Textarea value={paragraph} onChange={event => updateParagraph(index, event.target.value)} className={`${fieldClassName} min-h-28 resize-y`} />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <Link2 className="h-4 w-4" /> Actions
              </h3>
              <div className="grid gap-5 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary button</Label>
                    <Input value={formData.primaryButtonText} onChange={event => updateField('primaryButtonText', event.target.value)} className={fieldClassName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary URL</Label>
                    <Input value={formData.primaryButtonUrl} onChange={event => updateField('primaryButtonUrl', event.target.value)} className={fieldClassName} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Secondary button</Label>
                    <Input value={formData.secondaryButtonText} onChange={event => updateField('secondaryButtonText', event.target.value)} className={fieldClassName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary URL</Label>
                    <Input value={formData.secondaryButtonUrl} onChange={event => updateField('secondaryButtonUrl', event.target.value)} className={fieldClassName} />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <ImageIcon className="h-4 w-4" /> Appointment images
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

export default MutationSection70;
