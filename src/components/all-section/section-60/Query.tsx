/*
|-----------------------------------------
| Animated student success renderer for Section 60
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

import { defaultDataSection60, type ISection60Data, type Section60Props } from './data';

const getSectionData = (data?: ISection60Data | string): ISection60Data => {
  if (!data) return defaultDataSection60;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection60Data>;
      return { ...defaultDataSection60, ...parsed, testimonials: parsed.testimonials || defaultDataSection60.testimonials };
    } catch {
      return defaultDataSection60;
    }
  }

  return { ...defaultDataSection60, ...data, testimonials: data.testimonials || defaultDataSection60.testimonials };
};

const QuerySection60 = ({ data }: Section60Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl" />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
      />

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
              <span className="grid h-9 w-9 place-items-center rounded-full text-white shadow-lg" style={{ backgroundColor: sectionData.accentColor }}><Sparkles className="h-4 w-4" aria-hidden="true" /></span>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>{sectionData.eyebrow}</p>
            </div>
            <h2 className="max-w-[690px] text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>{sectionData.title}</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>{sectionData.description}</p>
        </motion.header>

        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {sectionData.testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={`${testimonial.attribution}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 36, rotateY: index === 0 ? -7 : index === 2 ? 7 : 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.62, delay: reduceMotion ? 0 : index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              className="group relative min-h-72 overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow duration-500 hover:shadow-[0_26px_65px_-30px_rgba(15,23,42,0.5)] sm:p-6"
              style={{ backgroundColor: sectionData.cardColor, borderColor: sectionData.borderColor, transformPerspective: 900 }}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-12" style={{ backgroundColor: sectionData.accentColor }} />
              <span className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 transition-transform duration-500 group-hover:scale-y-100" style={{ backgroundColor: sectionData.accentColor }} />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ backgroundColor: `${sectionData.accentColor}14`, color: sectionData.accentColor }}>
                    <Quote className="h-5 w-5 fill-current" aria-hidden="true" />
                  </span>
                  <span className="text-[10px] font-black tabular-nums opacity-30" style={{ color: sectionData.headingColor }}>{String(index + 1).padStart(2, '0')}</span>
                </div>

                <p className="mt-7 text-lg font-black leading-7 tracking-[-0.02em]" style={{ color: sectionData.headingColor }}>&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-auto pt-7">
                  <span className="mb-3 block h-1 w-9 rounded-full transition-all duration-500 group-hover:w-16" style={{ backgroundColor: sectionData.accentColor }} />
                  <p className="text-xs font-extrabold leading-5" style={{ color: sectionData.textColor }}>{testimonial.attribution}</p>
                </footer>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuerySection60;
