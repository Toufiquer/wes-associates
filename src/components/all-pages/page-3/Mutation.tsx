'use client';

import { useEffect, useState } from 'react';
import { FileQuestion, Plus, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { ISection3Data, Page3FaqItem } from './data';
import { defaultDataPage3 } from './data';

export interface SectionFormProps {
  data?: ISection3Data;
  onSubmit: (values: ISection3Data) => void;
}

const createFaq = (): Page3FaqItem => ({
  question: 'নতুন প্রশ্ন',
  answer: 'প্রশ্নের উত্তর লিখুন।',
});

const MutationPage3 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection3Data>(defaultDataPage3);

  useEffect(() => {
    setFormData(data ? { ...data, faqs: [...(data.faqs ?? [])] } : defaultDataPage3);
  }, [data]);

  const updateField = (field: keyof Omit<ISection3Data, 'faqs'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateFaq = (index: number, field: keyof Page3FaqItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, faqIndex) => (faqIndex === index ? { ...faq, [field]: value } : faq)),
    }));
  };

  const addFaq = () => {
    setFormData(prev => ({ ...prev, faqs: [...prev.faqs, createFaq()] }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, faqIndex) => faqIndex !== index) }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/80 p-6">
          <div className="rounded-lg bg-emerald-500/10 p-2">
            <FileQuestion className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit WhatsApp FAQ Page</h2>
            <p className="text-sm text-zinc-400">Edit the WhatsApp call-to-action and FAQ accordion content.</p>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">WhatsApp Area</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Page Name</Label>
                <Input value={formData.pageName} onChange={e => updateField('pageName', e.target.value)} className="border-zinc-800 bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input value={formData.heading} onChange={e => updateField('heading', e.target.value)} className="border-zinc-800 bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Button Text</Label>
                <Input value={formData.whatsappLabel} onChange={e => updateField('whatsappLabel', e.target.value)} className="border-zinc-800 bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={formData.whatsappNumber} onChange={e => updateField('whatsappNumber', e.target.value)} className="border-zinc-800 bg-zinc-900" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Frequently Asked Questions</h3>
              <Button onClick={addFaq} variant="outlineGlassy" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </div>

            <div className="max-h-[650px] space-y-4 overflow-y-auto pr-1">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-zinc-300">Question {index + 1}</p>
                    <Button onClick={() => removeFaq(index)} variant="outlineFire" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Input value={faq.question} onChange={e => updateFaq(index, 'question', e.target.value)} className="border-zinc-800 bg-zinc-900" />
                    <Textarea
                      value={faq.answer}
                      onChange={e => updateFaq(index, 'answer', e.target.value)}
                      className="min-h-24 resize-none border-zinc-800 bg-zinc-900"
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

export default MutationPage3;
