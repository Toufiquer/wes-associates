/*
|-----------------------------------------
| Animated FAQ accordion for Section 64
|-----------------------------------------
*/

'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircleQuestion } from 'lucide-react';

import { defaultDataSection64, type ISection64Data, type Section64Props } from './data';

const getSectionData = (data?: ISection64Data | string): ISection64Data => {
  if (!data) return defaultDataSection64;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection64Data>;
      return { ...defaultDataSection64, ...parsed, faqs: parsed.faqs || defaultDataSection64.faqs };
    } catch {
      return defaultDataSection64;
    }
  }

  return { ...defaultDataSection64, ...data, faqs: data.faqs || defaultDataSection64.faqs };
};

const QuerySection64 = ({ data }: Section64Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);
  const sectionId = useId();

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: sectionData.accentColor }} />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { rotate: [0, 8, -8, 0], y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-16 bottom-8 -z-10 opacity-[0.05]"
        style={{ color: sectionData.accentColor }}
      >
        <MessageCircleQuestion className="h-64 w-64" />
      </motion.div>

      <div className="mx-auto grid w-full max-w-[850px] gap-11 md:grid-cols-[0.8fr_1.2fr] md:items-start lg:gap-14">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, x: -34 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:sticky md:top-24"
        >
          <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: sectionData.accentColor }}><HelpCircle className="h-5 w-5" aria-hidden="true" /></span>
          <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>{sectionData.eyebrow}</p>
          <h2 className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>{sectionData.title}</h2>
          <p className="mt-5 text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>{sectionData.description}</p>
          <span className="mt-7 block h-1 w-20 rounded-full" style={{ backgroundColor: sectionData.accentColor }} />
        </motion.header>

        <div className="space-y-3">
          {sectionData.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const panelId = `${sectionId}-panel-${index}`;
            const buttonId = `${sectionId}-button-${index}`;

            return (
              <motion.article
                key={`${faq.question}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, x: 28 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.52, delay: reduceMotion ? 0 : index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-300 hover:shadow-lg"
                style={{ backgroundColor: sectionData.cardColor, borderColor: isOpen ? sectionData.accentColor : sectionData.borderColor }}
              >
                <span className="absolute inset-y-0 left-0 w-1 origin-bottom transition-transform duration-300" style={{ backgroundColor: sectionData.accentColor, transform: isOpen ? 'scaleY(1)' : 'scaleY(0)' }} />
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="text-[10px] font-black tabular-nums opacity-35" style={{ color: sectionData.headingColor }}>{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-black leading-5 sm:text-base" style={{ color: sectionData.headingColor }}>{faq.question}</span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: isOpen ? `${sectionData.accentColor}14` : `${sectionData.headingColor}0d`, color: isOpen ? sectionData.accentColor : sectionData.headingColor }}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pl-[3.75rem] text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuerySection64;
