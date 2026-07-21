/*
|-----------------------------------------
| FAQ editor for Section 64
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { HelpCircle, Palette, Plus, Save, Trash2, Type } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection65, type ISection65Data } from './data';

export interface Section65FormProps {
  data?: ISection65Data;
  onSubmit: (values: ISection65Data) => void;
}

const colorFields: { field: Exclude<keyof ISection65Data, 'eyebrow' | 'title' | 'description' | 'faqs'>; label: string }[] = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'cardColor', label: 'Cards' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'headingColor', label: 'Headings' },
  { field: 'textColor', label: 'Answers' },
  { field: 'borderColor', label: 'Borders' },
];

const MutationSection65 = ({ data, onSubmit }: Section65FormProps) => {
  const [formData, setFormData] = useState<ISection65Data>({ ...defaultDataSection65, faqs: defaultDataSection65.faqs.map(faq => ({ ...faq })) });

  useEffect(() => {
    setFormData({ ...defaultDataSection65, ...(data || {}), faqs: (data?.faqs || defaultDataSection65.faqs).map(faq => ({ ...faq })) });
  }, [data]);

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) =>
    setFormData(current => ({ ...current, faqs: current.faqs.map((faq, faqIndex) => (faqIndex === index ? { ...faq, [field]: value } : faq)) }));
  const addFaq = () => setFormData(current => ({ ...current, faqs: [...current.faqs, { question: 'New student question?', answer: 'Add a clear and helpful answer.' }] }));
  const removeFaq = (index: number) => setFormData(current => ({ ...current, faqs: current.faqs.filter((_, faqIndex) => faqIndex !== index) }));
  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-600';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5"><HelpCircle className="h-6 w-6 text-red-400" /></div>
          <div><h2 className="text-xl font-bold">Edit FAQ</h2><p className="text-sm text-zinc-400">Manage the introduction, questions, answers, and accordion theme.</p></div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Type className="h-4 w-4" /> Section introduction</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Eyebrow</Label><Input value={formData.eyebrow} onChange={event => setFormData(current => ({ ...current, eyebrow: event.target.value }))} className={fieldClassName} /></div>
              <div className="space-y-2"><Label>Heading</Label><Input value={formData.title} onChange={event => setFormData(current => ({ ...current, title: event.target.value }))} className={fieldClassName} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={formData.description} onChange={event => setFormData(current => ({ ...current, description: event.target.value }))} className={`${fieldClassName} min-h-24 resize-y`} /></div>
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4"><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">Questions and answers</h3><Button type="button" variant="outline" size="sm" onClick={addFaq} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"><Plus className="mr-2 h-4 w-4" /> Add question</Button></div>
            <div className="grid gap-4 lg:grid-cols-2">
              {formData.faqs.map((faq, index) => (
                <article key={index} className="rounded-2xl border border-zinc-800 bg-zinc-950/55 p-5">
                  <div className="mb-4 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Question {index + 1}</span><Button type="button" variant="ghost" size="icon" onClick={() => removeFaq(index)} disabled={formData.faqs.length === 1} className="h-8 w-8 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /><span className="sr-only">Remove question {index + 1}</span></Button></div>
                  <div className="space-y-4"><div className="space-y-2"><Label>Question</Label><Input value={faq.question} onChange={event => updateFaq(index, 'question', event.target.value)} className={fieldClassName} /></div><div className="space-y-2"><Label>Answer</Label><Textarea value={faq.answer} onChange={event => updateFaq(index, 'answer', event.target.value)} className={`${fieldClassName} min-h-24 resize-y`} /></div></div>
                </article>
              ))}
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Palette className="h-4 w-4" /> Colors</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colorFields.map(({ field, label }) => (
                <div key={field} className="space-y-2"><Label>{label}</Label><div className="flex gap-2"><input type="color" value={formData[field]} onChange={event => setFormData(current => ({ ...current, [field]: event.target.value }))} className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 p-1" aria-label={`${label} color`} /><Input value={formData[field]} onChange={event => setFormData(current => ({ ...current, [field]: event.target.value }))} className={fieldClassName} /></div></div>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex justify-end border-t border-zinc-800 bg-zinc-900/90 p-6"><Button type="button" onClick={() => onSubmit(formData)} className="bg-red-700 text-white hover:bg-red-600"><Save className="mr-2 h-4 w-4" /> Save changes</Button></footer>
      </div>
    </div>
  );
};

export default MutationSection65;
