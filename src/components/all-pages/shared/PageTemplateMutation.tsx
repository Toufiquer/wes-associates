'use client';

import { useEffect, useState } from 'react';
import { FileStack, Plus, Save, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { PageSectionBlock, PageTemplateData } from './page-types';

interface PageTemplateMutationProps<TData extends PageTemplateData> {
  data?: TData;
  fallbackData: TData;
  title: string;
  onSubmit: (values: TData) => void;
}

const createEmptySection = (): PageSectionBlock => ({
  eyebrow: 'New Section',
  title: 'Section title',
  description: 'Write a short description for this page section.',
  items: ['Key point'],
});

const PageTemplateMutation = <TData extends PageTemplateData>({ data, fallbackData, title, onSubmit }: PageTemplateMutationProps<TData>) => {
  const [formData, setFormData] = useState<TData>(fallbackData);

  useEffect(() => {
    setFormData(data ? { ...data, sections: [...data.sections] } : fallbackData);
  }, [data, fallbackData]);

  const updateField = (field: keyof TData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSection = (index: number, field: keyof PageSectionBlock, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sectionIndex) => (sectionIndex === index ? { ...section, [field]: value } : section)),
    }));
  };

  const addSection = () => {
    setFormData(prev => ({ ...prev, sections: [...prev.sections, createEmptySection()] }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({ ...prev, sections: prev.sections.filter((_, sectionIndex) => sectionIndex !== index) }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/80 p-6">
          <div className="rounded-lg bg-emerald-500/10 p-2">
            <FileStack className="text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-zinc-400">Edit the full page content and its sections.</p>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Page Hero</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Page Name</Label>
                <Input value={formData.pageName} onChange={e => updateField('pageName', e.target.value)} className="border-zinc-800 bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <Input value={formData.eyebrow} onChange={e => updateField('eyebrow', e.target.value)} className="border-zinc-800 bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => updateField('title', e.target.value)} className="border-zinc-800 bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea value={formData.subtitle} onChange={e => updateField('subtitle', e.target.value)} className="min-h-28 resize-none border-zinc-800 bg-zinc-900" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary Action</Label>
                  <Input value={formData.primaryAction} onChange={e => updateField('primaryAction', e.target.value)} className="border-zinc-800 bg-zinc-900" />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Action</Label>
                  <Input value={formData.secondaryAction} onChange={e => updateField('secondaryAction', e.target.value)} className="border-zinc-800 bg-zinc-900" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Sections</h3>
              <Button onClick={addSection} variant="outlineGlassy" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
            <div className="max-h-[650px] space-y-4 overflow-y-auto pr-1">
              {formData.sections.map((section, index) => (
                <div key={index} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-zinc-300">Section {index + 1}</p>
                    <Button onClick={() => removeSection(index)} variant="outlineFire" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <Input value={section.eyebrow} onChange={e => updateSection(index, 'eyebrow', e.target.value)} className="border-zinc-800 bg-zinc-900" />
                    <Input value={section.title} onChange={e => updateSection(index, 'title', e.target.value)} className="border-zinc-800 bg-zinc-900" />
                    <Textarea
                      value={section.description}
                      onChange={e => updateSection(index, 'description', e.target.value)}
                      className="min-h-24 resize-none border-zinc-800 bg-zinc-900"
                    />
                    <Textarea
                      value={section.items.join('\n')}
                      onChange={e =>
                        updateSection(
                          index,
                          'items',
                          e.target.value
                            .split('\n')
                            .map(item => item.trim())
                            .filter(Boolean),
                        )
                      }
                      className="min-h-24 resize-none border-zinc-800 bg-zinc-900"
                      placeholder="One bullet point per line"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-800 bg-zinc-900/80 p-6">
          <Button onClick={() => onSubmit(formData)} variant="outlineGlassy" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageTemplateMutation;
