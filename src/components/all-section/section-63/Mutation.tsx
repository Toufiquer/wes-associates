/*
|-----------------------------------------
| News and blog editor for Section 63
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { Link2, Newspaper, Palette, Plus, Save, Trash2, Type } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataSection63, type ISection63Data } from './data';

export interface Section63FormProps {
  data?: ISection63Data;
  onSubmit: (values: ISection63Data) => void;
}

const colorFields: { field: Exclude<keyof ISection63Data, 'eyebrow' | 'title' | 'ctaText' | 'ctaLink' | 'articles'>; label: string }[] = [
  { field: 'backgroundColor', label: 'Background' },
  { field: 'cardColor', label: 'Cards' },
  { field: 'gradientStart', label: 'Gradient start' },
  { field: 'accentColor', label: 'Accent' },
  { field: 'headingColor', label: 'Headings' },
  { field: 'textColor', label: 'Body text' },
  { field: 'borderColor', label: 'Borders' },
];

const MutationSection63 = ({ data, onSubmit }: Section63FormProps) => {
  const [formData, setFormData] = useState<ISection63Data>({ ...defaultDataSection63, articles: defaultDataSection63.articles.map(article => ({ ...article })) });

  useEffect(() => {
    setFormData({ ...defaultDataSection63, ...(data || {}), articles: (data?.articles || defaultDataSection63.articles).map(article => ({ ...article })) });
  }, [data]);

  const updateArticle = (index: number, field: 'title' | 'description', value: string) =>
    setFormData(current => ({ ...current, articles: current.articles.map((article, articleIndex) => (articleIndex === index ? { ...article, [field]: value } : article)) }));
  const addArticle = () => setFormData(current => ({ ...current, articles: [...current.articles, { title: 'New study abroad article', description: 'Add a helpful article summary.' }] }));
  const removeArticle = (index: number) => setFormData(current => ({ ...current, articles: current.articles.filter((_, articleIndex) => articleIndex !== index) }));
  const fieldClassName = 'border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-600';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5"><Newspaper className="h-6 w-6 text-red-400" /></div>
          <div><h2 className="text-xl font-bold">Edit News and Blog</h2><p className="text-sm text-zinc-400">Manage the section heading, counsellor CTA, articles, and visual theme.</p></div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Type className="h-4 w-4" /> Section heading</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Eyebrow</Label><Input value={formData.eyebrow} onChange={event => setFormData(current => ({ ...current, eyebrow: event.target.value }))} className={fieldClassName} /></div>
              <div className="space-y-2"><Label>Heading</Label><Input value={formData.title} onChange={event => setFormData(current => ({ ...current, title: event.target.value }))} className={fieldClassName} /></div>
              <div className="space-y-2"><Label>CTA text</Label><Input value={formData.ctaText} onChange={event => setFormData(current => ({ ...current, ctaText: event.target.value }))} className={fieldClassName} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5" /> CTA link</Label><Input value={formData.ctaLink} onChange={event => setFormData(current => ({ ...current, ctaLink: event.target.value }))} className={fieldClassName} /></div>
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4"><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">Articles</h3><Button type="button" variant="outline" size="sm" onClick={addArticle} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"><Plus className="mr-2 h-4 w-4" /> Add article</Button></div>
            <div className="grid gap-4 lg:grid-cols-2">
              {formData.articles.map((article, index) => (
                <article key={index} className="rounded-2xl border border-zinc-800 bg-zinc-950/55 p-5">
                  <div className="mb-4 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Article {index + 1}</span><Button type="button" variant="ghost" size="icon" onClick={() => removeArticle(index)} disabled={formData.articles.length === 1} className="h-8 w-8 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /><span className="sr-only">Remove article {index + 1}</span></Button></div>
                  <div className="space-y-4"><div className="space-y-2"><Label>Title</Label><Input value={article.title} onChange={event => updateArticle(index, 'title', event.target.value)} className={fieldClassName} /></div><div className="space-y-2"><Label>Summary</Label><Textarea value={article.description} onChange={event => updateArticle(index, 'description', event.target.value)} className={`${fieldClassName} min-h-20 resize-y`} /></div></div>
                </article>
              ))}
            </div>
          </section>

          <div className="h-px bg-zinc-800" />

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400"><Palette className="h-4 w-4" /> Colors</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

export default MutationSection63;
