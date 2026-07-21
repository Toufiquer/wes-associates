/*
|-----------------------------------------
| Appointment form editor for Section 61
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck2, FormInput, Palette, Plus, Save, Trash2, Type } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection61, type ISection61Data } from './data';

export interface Section61FormProps {
  data?: ISection61Data;
  onSubmit: (values: ISection61Data) => void;
}

const textFields: { field: keyof ISection61Data; label: string; placeholderField?: keyof ISection61Data }[] = [
  { field: 'studentNameLabel', label: 'Student name', placeholderField: 'studentNamePlaceholder' },
  { field: 'mobileLabel', label: 'Mobile number', placeholderField: 'mobilePlaceholder' },
  { field: 'countryLabel', label: 'Country choice', placeholderField: 'countryPlaceholder' },
  { field: 'proficiencyLabel', label: 'English proficiency', placeholderField: 'proficiencyPlaceholder' },
  { field: 'resultLabel', label: 'Proficiency result', placeholderField: 'resultPlaceholder' },
  { field: 'educationLabel', label: 'Education', placeholderField: 'educationPlaceholder' },
  { field: 'messageLabel', label: 'Message', placeholderField: 'messagePlaceholder' },
];

const colorFields: { field: keyof Pick<ISection61Data, 'backgroundColor' | 'formColor' | 'accentColor' | 'headingColor' | 'textColor' | 'borderColor'>; label: string }[] = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'formColor', label: 'Form' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'headingColor', label: 'Headings' },
  { field: 'textColor', label: 'Body text' },
  { field: 'borderColor', label: 'Borders' },
];

const MutationSection61 = ({ data, onSubmit }: Section61FormProps) => {
  const [formData, setFormData] = useState<ISection61Data>({ ...defaultDataSection61, benefits: [...defaultDataSection61.benefits], countries: [...defaultDataSection61.countries], proficiencyOptions: [...defaultDataSection61.proficiencyOptions] });

  useEffect(() => {
    setFormData({ ...defaultDataSection61, ...(data || {}), benefits: [...(data?.benefits || defaultDataSection61.benefits)], countries: [...(data?.countries || defaultDataSection61.countries)], proficiencyOptions: [...(data?.proficiencyOptions || defaultDataSection61.proficiencyOptions)] });
  }, [data]);

  const updateText = (field: keyof ISection61Data, value: string) => setFormData(current => ({ ...current, [field]: value }));
  const updateArray = (field: 'benefits' | 'countries' | 'proficiencyOptions', index: number, value: string) => setFormData(current => ({ ...current, [field]: current[field].map((item, itemIndex) => (itemIndex === index ? value : item)) }));
  const addArrayItem = (field: 'benefits' | 'countries' | 'proficiencyOptions', value: string) => setFormData(current => ({ ...current, [field]: [...current[field], value] }));
  const removeArrayItem = (field: 'benefits' | 'countries' | 'proficiencyOptions', index: number) => setFormData(current => ({ ...current, [field]: current[field].filter((_, itemIndex) => itemIndex !== index) }));
  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-600';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5"><CalendarCheck2 className="h-6 w-6 text-red-400" /></div>
          <div><h2 className="text-xl font-bold">Edit Appointment Form</h2><p className="text-sm text-zinc-400">Manage the counselling introduction, form copy, options, and visual theme.</p></div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Type className="h-4 w-4" /> Introduction</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Eyebrow</Label><Input value={formData.eyebrow} onChange={event => updateText('eyebrow', event.target.value)} className={fieldClassName} /></div>
              <div className="space-y-2"><Label>Heading</Label><Input value={formData.title} onChange={event => updateText('title', event.target.value)} className={fieldClassName} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={formData.description} onChange={event => updateText('description', event.target.value)} className={`${fieldClassName} min-h-24 resize-y`} /></div>
            </div>
          </section>

          {([
            { field: 'benefits' as const, title: 'Benefits', addLabel: 'Add benefit', addValue: 'New counselling benefit' },
            { field: 'countries' as const, title: 'Countries', addLabel: 'Add country', addValue: 'New country' },
            { field: 'proficiencyOptions' as const, title: 'English options', addLabel: 'Add option', addValue: 'New option' },
          ]).map(group => (
            <section key={group.field} className="space-y-4 border-t border-zinc-800 pt-8">
              <div className="flex items-center justify-between gap-4"><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">{group.title}</h3><Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(group.field, group.addValue)} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"><Plus className="mr-2 h-4 w-4" /> {group.addLabel}</Button></div>
              <div className="grid gap-3 md:grid-cols-2">
                {formData[group.field].map((item, index) => (
                  <div key={index} className="flex gap-2"><Input value={item} onChange={event => updateArray(group.field, index, event.target.value)} className={fieldClassName} /><Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(group.field, index)} disabled={formData[group.field].length === 1} className="shrink-0 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /><span className="sr-only">Remove {group.title.toLowerCase()} item {index + 1}</span></Button></div>
                ))}
              </div>
            </section>
          ))}

          <section className="space-y-4 border-t border-zinc-800 pt-8">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><FormInput className="h-4 w-4" /> Form labels and placeholders</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {textFields.map(({ field, label, placeholderField }) => (
                <div key={field} className="rounded-xl border border-zinc-800 bg-zinc-950/55 p-4"><div className="space-y-2"><Label>{label} label</Label><Input value={formData[field] as string} onChange={event => updateText(field, event.target.value)} className={fieldClassName} /></div>{placeholderField && <div className="mt-3 space-y-2"><Label>Placeholder</Label><Input value={formData[placeholderField] as string} onChange={event => updateText(placeholderField, event.target.value)} className={fieldClassName} /></div>}</div>
              ))}
              <div className="space-y-2 lg:col-span-2"><Label>Submit button text</Label><Input value={formData.buttonText} onChange={event => updateText('buttonText', event.target.value)} className={fieldClassName} /></div>
            </div>
          </section>

          <section className="space-y-4 border-t border-zinc-800 pt-8">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Palette className="h-4 w-4" /> Colors</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colorFields.map(({ field, label }) => (
                <div key={field} className="space-y-2"><Label>{label}</Label><div className="flex gap-2"><input type="color" value={formData[field]} onChange={event => updateText(field, event.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 p-1" aria-label={`${label} color`} /><Input value={formData[field]} onChange={event => updateText(field, event.target.value)} className={fieldClassName} /></div></div>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex justify-end border-t border-zinc-800 bg-zinc-900/90 p-6"><Button type="button" onClick={() => onSubmit(formData)} className="bg-red-700 text-white hover:bg-red-600"><Save className="mr-2 h-4 w-4" /> Save changes</Button></footer>
      </div>
    </div>
  );
};

export default MutationSection61;
