/*
|-----------------------------------------
| Animated About WES renderer for Section 51
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

import { defaultDataSection51, type ISection51Data, type Section51Props } from './data';

const getSectionData = (data?: ISection51Data | string): ISection51Data => {
  if (!data) return defaultDataSection51;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection51Data>;
      return { ...defaultDataSection51, ...parsed, highlights: parsed.highlights || defaultDataSection51.highlights };
    } catch {
      return defaultDataSection51;
    }
  }

  return { ...defaultDataSection51, ...data, highlights: data.highlights || defaultDataSection51.highlights };
};

const QuerySection51 = ({ data }: Section51Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div
        className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
      />
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.15),transparent_58%)]" />

      <div className="mx-auto grid w-full max-w-[850px] gap-12 md:grid-cols-[0.82fr_1.18fr] md:items-center lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -34 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full text-white shadow-lg" style={{ backgroundColor: sectionData.accentColor }}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>
              {sectionData.eyebrow}
            </p>
          </div>

          <h2 className="text-[clamp(2.25rem,5vw,3.45rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>
            {sectionData.title}
          </h2>

          <motion.div
            aria-hidden="true"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 h-1 w-24 origin-left rounded-full"
            style={{ backgroundColor: sectionData.accentColor }}
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 34 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.45)] backdrop-blur sm:rounded-3xl sm:p-7"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full opacity-10" style={{ backgroundColor: sectionData.accentColor }} />

          <p className="relative text-sm font-semibold leading-7 sm:text-[15px]" style={{ color: sectionData.textColor }}>
            {sectionData.description}
          </p>

          <ul className="relative mt-6 space-y-3">
            {sectionData.highlights.map((highlight, index) => (
              <motion.li
                key={`${highlight}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.24 + index * 0.1, ease: 'easeOut' }}
                whileHover={reduceMotion ? undefined : { x: 5 }}
                className="group flex items-start gap-3 rounded-xl border border-transparent p-2.5 transition-colors duration-300 hover:border-slate-200 hover:bg-white"
              >
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white shadow-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                  style={{ backgroundColor: sectionData.accentColor }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-sm font-extrabold leading-6" style={{ color: sectionData.headingColor }}>
                  {highlight}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default QuerySection51;
