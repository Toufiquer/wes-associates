/*
|-----------------------------------------
| Student journey editor for Section 54
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { MapPinned, Palette, Plus, Save, Trash2, Type } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection54, type ISection54Data } from './data';

export interface Section54FormProps {
  data?: ISection54Data;
  onSubmit: (values: ISection54Data) => void;
}

const colorFields: { field: keyof Pick<ISection54Data, 'sectionBackgroundColor' | 'gradientStart' | 'gradientEnd' | 'accentColor' | 'stepCardColor' | 'stepTextColor'>; label: string }[] = [
  { field: 'sectionBackgroundColor', label: 'Section background' },
  { field: 'gradientStart', label: 'Gradient start' },
  { field: 'gradientEnd', label: 'Gradient end' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'stepCardColor', label: 'Step cards' },
  { field: 'stepTextColor', label: 'Step text' },
];

const MutationSection54 = ({ data, onSubmit }: Section54FormProps) => {
  const [formData, setFormData] = useState<ISection54Data>({ ...defaultDataSection54, steps: defaultDataSection54.steps.map(step => ({ ...step })) });

  useEffect(() => {
    setFormData({ ...defaultDataSection54, ...(data || {}), steps: (data?.steps || defaultDataSection54.steps).map(step => ({ ...step })) });
  }, [data]);

  const updateText = (field: keyof ISection54Data, value: string) => setFormData(current => ({ ...current, [field]: value }));
  const updateStep = (index: number, field: 'number' | 'title', value: string) =>
    setFormData(current => ({ ...current, steps: current.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, [field]: value } : step)) }));
  const addStep = () => setFormData(current => ({ ...current, steps: [...current.steps, { number: String(current.steps.length + 1).padStart(2, '0'), title: 'New journey step' }] }));
  const removeStep = (index: number) => setFormData(current => ({ ...current, steps: current.steps.filter((_, stepIndex) => stepIndex !== index) }));
  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-600';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5"><MapPinned className="h-6 w-6 text-red-400" /></div>
          <div>
            <h2 className="text-xl font-bold">Edit Student Journey</h2>
            <p className="text-sm text-zinc-400">Update the journey story, locations, steps, and visual theme.</p>
          </div>
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

          <div className="h-px bg-zinc-800" />

          <section className="grid gap-5 lg:grid-cols-2">
            {(['origin', 'destination'] as const).map(point => (
              <article key={point} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/55 p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">{point}</h3>
                <div className="space-y-2"><Label>Label</Label><Input value={formData[`${point}Label`]} onChange={event => updateText(`${point}Label`, event.target.value)} className={fieldClassName} /></div>
                <div className="space-y-2"><Label>Location</Label><Input value={formData[`${point}Title`]} onChange={event => updateText(`${point}Title`, event.target.value)} className={fieldClassName} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={formData[`${point}Description`]} onChange={event => updateText(`${point}Description`, event.target.value)} className={`${fieldClassName} min-h-20 resize-y`} /></div>
              </article>
            ))}
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">Journey steps</h3>
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"><Plus className="mr-2 h-4 w-4" /> Add step</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-end gap-3 rounded-xl border border-zinc-800 bg-zinc-950/55 p-4">
                  <div className="w-20 shrink-0 space-y-2"><Label>Number</Label><Input value={step.number} maxLength={3} onChange={event => updateStep(index, 'number', event.target.value)} className={fieldClassName} /></div>
                  <div className="flex-1 space-y-2"><Label>Title</Label><Input value={step.title} onChange={event => updateStep(index, 'title', event.target.value)} className={fieldClassName} /></div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)} disabled={formData.steps.length === 1} className="shrink-0 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /><span className="sr-only">Remove step {index + 1}</span></Button>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Palette className="h-4 w-4" /> Colors</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colorFields.map(({ field, label }) => (
                <div key={field} className="space-y-2"><Label>{label}</Label><div className="flex gap-2">
                  <input type="color" value={formData[field]} onChange={event => updateText(field, event.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 p-1" aria-label={`${label} color`} />
                  <Input value={formData[field]} onChange={event => updateText(field, event.target.value)} className={fieldClassName} />
                </div></div>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex justify-end border-t border-zinc-800 bg-zinc-900/90 p-6">
          <Button type="button" onClick={() => onSubmit(formData)} className="bg-red-700 text-white hover:bg-red-600"><Save className="mr-2 h-4 w-4" /> Save changes</Button>
        </footer>
      </div>
    </div>
  );
};

export default MutationSection54;
