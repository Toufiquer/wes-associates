/*
|-----------------------------------------
| Animated admission process renderer for Section 56
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Check } from 'lucide-react';

import { defaultDataSection56, type ISection56Data, type Section56Props } from './data';

const getSectionData = (data?: ISection56Data | string): ISection56Data => {
  if (!data) return defaultDataSection56;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection56Data>;
      return { ...defaultDataSection56, ...parsed, steps: parsed.steps || defaultDataSection56.steps };
    } catch {
      return defaultDataSection56;
    }
  }

  return { ...defaultDataSection56, ...data, steps: data.steps || defaultDataSection56.steps };
};

const QuerySection56 = ({ data }: Section56Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section id="process" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-80 w-80 rounded-full bg-slate-200/45 blur-3xl" />

      <div className="mx-auto w-full max-w-[850px]">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10" style={{ backgroundColor: sectionData.accentColor }} />
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>{sectionData.eyebrow}</p>
            </div>
            <h2 className="max-w-[690px] text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>{sectionData.title}</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>{sectionData.description}</p>
        </motion.header>

        <div className="relative mt-11 pl-4 sm:pl-6">
          <div className="absolute bottom-6 left-[2.25rem] top-6 w-px bg-slate-200 sm:left-[2.75rem]" />
          <motion.div
            aria-hidden="true"
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-6 left-[2.25rem] top-6 w-px origin-top sm:left-[2.75rem]"
            style={{ backgroundColor: sectionData.accentColor }}
          />

          <div className="space-y-4">
            {sectionData.steps.map((step, index) => (
              <motion.article
                key={`${step.number}-${step.title}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, x: 34 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { x: 7 }}
                className="group relative flex gap-4 rounded-2xl border p-4 shadow-sm transition-shadow duration-500 hover:shadow-[0_20px_55px_-32px_rgba(15,23,42,0.55)] sm:gap-5 sm:p-5"
                style={{ backgroundColor: sectionData.cardColor, borderColor: sectionData.borderColor }}
              >
                <motion.span
                  whileHover={reduceMotion ? undefined : { rotate: -7, scale: 1.08 }}
                  className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-black text-white shadow-lg sm:h-12 sm:w-12"
                  style={{ backgroundColor: sectionData.markerColor }}
                >
                  {step.number}
                </motion.span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black tracking-[-0.02em] sm:text-lg" style={{ color: sectionData.headingColor }}>{step.title}</h3>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ borderColor: sectionData.accentColor, color: sectionData.accentColor }}>
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold leading-6" style={{ color: sectionData.textColor }}>{step.description}</p>
                </div>
                <span className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 rounded-l-2xl transition-transform duration-500 group-hover:scale-y-100" style={{ backgroundColor: sectionData.accentColor }} />
              </motion.article>
            ))}
          </div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mt-6 grid h-9 w-9 place-items-center rounded-full text-white shadow-lg"
            style={{ backgroundColor: sectionData.accentColor }}
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuerySection56;
