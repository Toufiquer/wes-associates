'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Globe2, ImageIcon, Link2, Palette, Plus, Save, Sparkles, Trash2, Type } from 'lucide-react';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataPage10, type CountryFact, type CountryHighlight, type IPage10Data } from './data';

export interface Page10FormProps {
  data?: IPage10Data;
  onSubmit: (values: IPage10Data) => void;
}

const cloneData = (data: IPage10Data): IPage10Data => ({
  ...data,
  facts: data.facts.map(fact => ({ ...fact })),
  highlights: data.highlights.map(highlight => ({ ...highlight })),
});

const normalizeData = (data?: IPage10Data): IPage10Data => {
  if (!data) return cloneData(defaultDataPage10);

  return {
    ...defaultDataPage10,
    ...data,
    pageUid: 'page-uid-10',
    facts: Array.isArray(data.facts) ? data.facts.map(fact => ({ ...fact })) : defaultDataPage10.facts.map(fact => ({ ...fact })),
    highlights: Array.isArray(data.highlights)
      ? data.highlights.map(highlight => ({ ...highlight }))
      : defaultDataPage10.highlights.map(highlight => ({ ...highlight })),
  };
};

const colorFields: Array<{ field: 'backgroundColor' | 'surfaceColor' | 'headingColor' | 'textColor' | 'accentColor'; label: string }> = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'surfaceColor', label: 'Surface' },
  { field: 'headingColor', label: 'Heading' },
  { field: 'textColor', label: 'Body text' },
  { field: 'accentColor', label: 'Accent' },
];

const MutationPage10 = ({ data, onSubmit }: Page10FormProps) => {
  const [formData, setFormData] = useState<IPage10Data>(() => normalizeData(data));

  useEffect(() => {
    setFormData(normalizeData(data));
  }, [data]);

  const updateField = <K extends keyof IPage10Data>(field: K, value: IPage10Data[K]) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const updateFact = (id: string, field: keyof Omit<CountryFact, 'id'>, value: string) => {
    setFormData(current => ({ ...current, facts: current.facts.map(fact => (fact.id === id ? { ...fact, [field]: value } : fact)) }));
  };

  const updateHighlight = (id: string, field: keyof Omit<CountryHighlight, 'id'>, value: string) => {
    setFormData(current => ({
      ...current,
      highlights: current.highlights.map(highlight => (highlight.id === id ? { ...highlight, [field]: value } : highlight)),
    }));
  };

  const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <Globe2 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit About the Country Page</h2>
            <p className="text-sm text-zinc-400">Manage country information, images, highlights, actions, and colors.</p>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <Type className="h-4 w-4" /> Hero content
              </h3>
              <div className="space-y-2">
                <Label>Page name</Label>
                <Input value={formData.pageName} onChange={event => updateField('pageName', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <Input value={formData.eyebrow} onChange={event => updateField('eyebrow', event.target.value)} className={fieldClassName} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title prefix</Label>
                  <Input value={formData.titlePrefix} onChange={event => updateField('titlePrefix', event.target.value)} className={fieldClassName} />
                </div>
                <div className="space-y-2">
                  <Label>Country name</Label>
                  <Input value={formData.countryName} onChange={event => updateField('countryName', event.target.value)} className={fieldClassName} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hero description</Label>
                <Textarea value={formData.heroDescription} onChange={event => updateField('heroDescription', event.target.value)} className={`${fieldClassName} min-h-28 resize-y`} />
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <ImageIcon className="h-4 w-4" /> Images
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label className="mb-3 block">Hero image</Label>
                  <ImageUploadManagerSingle label="" value={formData.heroImage} onChange={url => updateField('heroImage', url)} />
                </div>
                <div>
                  <Label className="mb-3 block">Flag image</Label>
                  <ImageUploadManagerSingle label="" value={formData.flagImage} onChange={url => updateField('flagImage', url)} />
                </div>
                <div>
                  <Label className="mb-3 block">Map image</Label>
                  <ImageUploadManagerSingle label="" value={formData.mapImage} onChange={url => updateField('mapImage', url)} />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                <Globe2 className="h-4 w-4" /> Quick facts
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateField('facts', [...formData.facts, { id: createId('fact'), label: 'New fact', value: 'Value' }])}
                className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add fact
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {formData.facts.map(fact => (
                <div key={fact.id} className="relative space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => updateField('facts', formData.facts.filter(item => item.id !== fact.id))}
                    className="absolute right-2 top-2 h-8 w-8 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove fact</span>
                  </Button>
                  <div className="space-y-2 pr-8"><Label>Label</Label><Input value={fact.label} onChange={event => updateFact(fact.id, 'label', event.target.value)} className={fieldClassName} /></div>
                  <div className="space-y-2"><Label>Value</Label><Input value={fact.value} onChange={event => updateFact(fact.id, 'value', event.target.value)} className={fieldClassName} /></div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            {[
              { titleField: 'aboutTitle' as const, descriptionField: 'aboutDescription' as const, label: 'Country overview' },
              { titleField: 'cultureTitle' as const, descriptionField: 'cultureDescription' as const, label: 'Culture' },
              { titleField: 'studentLifeTitle' as const, descriptionField: 'studentLifeDescription' as const, label: 'Student life' },
            ].map(item => (
              <div key={item.titleField} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
                  <BookOpen className="h-4 w-4" /> {item.label}
                </h3>
                <div className="space-y-2"><Label>Title</Label><Input value={formData[item.titleField]} onChange={event => updateField(item.titleField, event.target.value)} className={fieldClassName} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={formData[item.descriptionField]} onChange={event => updateField(item.descriptionField, event.target.value)} className={`${fieldClassName} min-h-36 resize-y`} /></div>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Sparkles className="h-4 w-4" /> Highlights</h3>
                <Input value={formData.highlightsTitle} onChange={event => updateField('highlightsTitle', event.target.value)} className={`${fieldClassName} w-72`} />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateField('highlights', [...formData.highlights, { id: createId('highlight'), title: 'New highlight', description: 'Add a helpful description.' }])}
                className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add highlight
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {formData.highlights.map(highlight => (
                <div key={highlight.id} className="relative space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => updateField('highlights', formData.highlights.filter(item => item.id !== highlight.id))}
                    className="absolute right-2 top-2 h-8 w-8 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove highlight</span>
                  </Button>
                  <div className="space-y-2 pr-8"><Label>Title</Label><Input value={highlight.title} onChange={event => updateHighlight(highlight.id, 'title', event.target.value)} className={fieldClassName} /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={highlight.description} onChange={event => updateHighlight(highlight.id, 'description', event.target.value)} className={`${fieldClassName} min-h-24 resize-y`} /></div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Link2 className="h-4 w-4" /> Call to action</h3>
              <div className="space-y-2"><Label>Title</Label><Input value={formData.ctaTitle} onChange={event => updateField('ctaTitle', event.target.value)} className={fieldClassName} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={formData.ctaDescription} onChange={event => updateField('ctaDescription', event.target.value)} className={`${fieldClassName} min-h-24 resize-y`} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Primary button</Label><Input value={formData.primaryButtonText} onChange={event => updateField('primaryButtonText', event.target.value)} className={fieldClassName} /></div>
                <div className="space-y-2"><Label>Primary URL</Label><Input value={formData.primaryButtonUrl} onChange={event => updateField('primaryButtonUrl', event.target.value)} className={fieldClassName} /></div>
                <div className="space-y-2"><Label>Secondary button</Label><Input value={formData.secondaryButtonText} onChange={event => updateField('secondaryButtonText', event.target.value)} className={fieldClassName} /></div>
                <div className="space-y-2"><Label>Secondary URL</Label><Input value={formData.secondaryButtonUrl} onChange={event => updateField('secondaryButtonUrl', event.target.value)} className={fieldClassName} /></div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Palette className="h-4 w-4" /> Colors</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {colorFields.map(({ field, label }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex gap-2">
                      <input type="color" value={formData[field]} onChange={event => updateField(field, event.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 p-1" aria-label={`${label} color`} />
                      <Input value={formData[field]} onChange={event => updateField(field, event.target.value)} className={fieldClassName} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <footer className="flex justify-end border-t border-zinc-800 bg-zinc-900/90 p-6">
          <Button type="button" onClick={() => onSubmit({ ...formData, pageUid: 'page-uid-10' })} className="bg-blue-600 text-white hover:bg-blue-500">
            <Save className="mr-2 h-4 w-4" /> Save changes
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default MutationPage10;
