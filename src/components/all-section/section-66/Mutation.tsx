'use client';

import { useEffect, useState } from 'react';
import { BarChart3, ImageIcon, Palette, Save, Type } from 'lucide-react';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection66, type ISection66Data, type ISection66Stat } from './data';

export interface Section66FormProps {
  data?: ISection66Data;
  onSubmit: (values: ISection66Data) => void;
}

const colorFields: Array<{ field: 'backgroundColor' | 'cardColor' | 'headingColor' | 'accentColor' | 'statColor' | 'textColor'; label: string }> = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'cardColor', label: 'Cards' },
  { field: 'headingColor', label: 'Heading' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'statColor', label: 'Statistics' },
  { field: 'textColor', label: 'Description' },
];

const MutationSection66 = ({ data, onSubmit }: Section66FormProps) => {
  const [formData, setFormData] = useState<ISection66Data>({
    ...defaultDataSection66,
    paragraphs: [...defaultDataSection66.paragraphs],
    stats: defaultDataSection66.stats.map(stat => ({ ...stat })),
  });

  useEffect(() => {
    setFormData({
      ...defaultDataSection66,
      ...(data || {}),
      paragraphs: [...(data?.paragraphs || defaultDataSection66.paragraphs)],
      stats: (data?.stats || defaultDataSection66.stats).map(stat => ({ ...stat })),
    });
  }, [data]);

  const updateField = <K extends keyof ISection66Data>(field: K, value: ISection66Data[K]) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const updateStat = (index: number, field: keyof ISection66Stat, value: string) => {
    setFormData(current => ({
      ...current,
      stats: current.stats.map((stat, statIndex) => (statIndex === index ? { ...stat, [field]: value } : stat)),
    }));
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
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-2.5">
            <BarChart3 className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit History Section</h2>
            <p className="text-sm text-zinc-400">Update the history, statistics, background image, and colors.</p>
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

          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <BarChart3 className="h-4 w-4" /> Statistics
              </h3>
              <div className="space-y-4">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5 sm:grid-cols-[0.38fr_1fr]">
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input value={stat.value} onChange={event => updateStat(index, 'value', event.target.value)} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input value={stat.label} onChange={event => updateStat(index, 'label', event.target.value)} className={fieldClassName} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <ImageIcon className="h-4 w-4" /> Card background image
              </h3>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                <ImageUploadManagerSingle label="" value={formData.cardBackgroundImage} onChange={url => updateField('cardBackgroundImage', url)} />
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

export default MutationSection66;
