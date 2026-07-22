/*
|-----------------------------------------
| Study Abroad experience hero editor for Section 49
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { LayoutTemplate, Link2, Palette, Save, Type } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection58, type ISection58Data } from './data';

export interface Section58FormProps {
  data?: ISection58Data;
  onSubmit: (values: ISection58Data) => void;
}

const colorFields: { field: keyof ISection58Data; label: string }[] = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'gridColor', label: 'Grid lines' },
  { field: 'headingColor', label: 'Heading' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'descriptionColor', label: 'Description' },
];

const MutationSection58 = ({ data, onSubmit }: Section58FormProps) => {
  const [formData, setFormData] = useState<ISection58Data>({ ...defaultDataSection58 });

  useEffect(() => {
    setFormData({ ...defaultDataSection58, ...(data || {}) });
  }, [data]);

  const updateField = <Field extends keyof ISection58Data>(field: Field, value: ISection58Data[Field]) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-600';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5">
            <LayoutTemplate className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Study Abroad Hero</h2>
            <p className="text-sm text-zinc-400">Update the Bangla and English content, calls to action, and colors.</p>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
              <Type className="h-4 w-4" /> Heading and description
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Bangla experience heading</Label>
                <Input value={formData.titleLineOne} onChange={event => updateField('titleLineOne', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2">
                <Label>English service heading</Label>
                <Input value={formData.titleEnglish} onChange={event => updateField('titleEnglish', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2">
                <Label>Bangla heading suffix</Label>
                <Input value={formData.titleEnglishSuffix} onChange={event => updateField('titleEnglishSuffix', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Highlighted Bangla heading</Label>
                <Input value={formData.titleHighlight} onChange={event => updateField('titleHighlight', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Bangla description lead</Label>
                <Input value={formData.descriptionLead} onChange={event => updateField('descriptionLead', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Experience badge (start with a number)</Label>
                <Input value={formData.descriptionAccent} onChange={event => updateField('descriptionAccent', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Short description</Label>
                <Textarea
                  value={formData.descriptionTail}
                  onChange={event => updateField('descriptionTail', event.target.value)}
                  className={`${fieldClassName} min-h-28 resize-y`}
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
              <Link2 className="h-4 w-4" /> Calls to action
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary button text</Label>
                <Input value={formData.primaryButtonText} onChange={event => updateField('primaryButtonText', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2">
                <Label>Primary button link</Label>
                <Input value={formData.primaryButtonLink} onChange={event => updateField('primaryButtonLink', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2">
                <Label>Secondary button text</Label>
                <Input value={formData.secondaryButtonText} onChange={event => updateField('secondaryButtonText', event.target.value)} className={fieldClassName} />
              </div>
              <div className="space-y-2">
                <Label>Secondary button link</Label>
                <Input value={formData.secondaryButtonLink} onChange={event => updateField('secondaryButtonLink', event.target.value)} className={fieldClassName} />
              </div>
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
              <Palette className="h-4 w-4" /> Colors
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colorFields.map(({ field, label }) => (
                <div key={field} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData[field]}
                      onChange={event => updateField(field, event.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 p-1"
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
          <Button type="button" onClick={() => onSubmit(formData)} className="bg-red-700 text-white hover:bg-red-600">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default MutationSection58;
