/*
|-----------------------------------------
| Animated Why choose us renderer for Section 52
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { defaultDataSection52, type ISection52Data, type Section52Props } from './data';

const getSectionData = (data?: ISection52Data | string): ISection52Data => {
  if (!data) return defaultDataSection52;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection52Data>;
      return { ...defaultDataSection52, ...parsed, reasons: parsed.reasons || defaultDataSection52.reasons };
    } catch {
      return defaultDataSection52;
    }
  }

  return { ...defaultDataSection52, ...data, reasons: data.reasons || defaultDataSection52.reasons };
};

const QuerySection52 = ({ data }: Section52Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 35, 0], y: [0, -18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
      />

      <div className="mx-auto w-full max-w-[850px]">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10" style={{ backgroundColor: sectionData.accentColor }} />
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>
                {sectionData.eyebrow}
              </p>
            </div>
            <h2 className="max-w-[690px] text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>
              {sectionData.title}
            </h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>
            {sectionData.description}
          </p>
        </motion.header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectionData.reasons.map((reason, index) => (
            <motion.article
              key={`${reason.title}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 34, rotateX: 7 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: reduceMotion ? 0 : (index % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -7 }}
              className="group relative min-h-64 overflow-hidden rounded-2xl border border-slate-200/90 p-5 shadow-sm transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)] sm:p-6"
              style={{ backgroundColor: sectionData.cardColor, transformPerspective: 900 }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ backgroundColor: sectionData.accentColor }}
              />
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10"
                style={{ backgroundColor: sectionData.accentColor }}
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <motion.span
                    whileHover={reduceMotion ? undefined : { rotate: -7, scale: 1.08 }}
                    className="grid h-11 w-11 place-items-center rounded-xl text-sm font-black text-white shadow-lg"
                    style={{ backgroundColor: sectionData.accentColor }}
                  >
                    {reason.marker}
                  </motion.span>
                  <ArrowUpRight className="h-5 w-5 -translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" style={{ color: sectionData.accentColor }} aria-hidden="true" />
                </div>

                <div className="mt-auto pt-8">
                  <h3 className="text-lg font-black tracking-[-0.02em]" style={{ color: sectionData.headingColor }}>
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-6" style={{ color: sectionData.textColor }}>
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuerySection52;
