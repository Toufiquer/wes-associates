'use client';

import { MessageCircle, ShieldQuestion } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { defaultDataPage3, ISection3Data, Section3Props } from './data';

const parseData = (data: ISection3Data | string | undefined) => {
  if (!data) return defaultDataPage3;
  if (typeof data !== 'string') return { ...defaultDataPage3, ...data, faqs: data.faqs ?? defaultDataPage3.faqs };

  try {
    const parsed = JSON.parse(data) as Partial<ISection3Data>;
    return { ...defaultDataPage3, ...parsed, faqs: parsed.faqs ?? defaultDataPage3.faqs };
  } catch {
    return defaultDataPage3;
  }
};

const getWhatsAppLink = (number: string, message: string) => {
  const cleanNumber = number.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

const QueryPage3 = ({ data }: Section3Props) => {
  const pageData = parseData(data);
  const faqs = pageData.faqs ?? [];
  const whatsappLink = getWhatsAppLink(pageData.whatsappNumber, pageData.heading);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">{pageData.heading}</h1>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-7 py-4 text-base font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <MessageCircle className="h-5 w-5" />
            {pageData.whatsappLabel}
          </a>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <ShieldQuestion className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black uppercase text-emerald-700">FAQ</p>
              <h2 className="text-2xl font-black text-slate-950">Frequently Asked Questions</h2>
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={`${faq.question}-${index}`} value={`faq-${index}`} className="overflow-hidden rounded-md border border-slate-200 bg-white px-5 shadow-sm">
                <AccordionTrigger className="py-5 text-base font-black text-slate-950 hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-slate-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
};

export default QueryPage3;
