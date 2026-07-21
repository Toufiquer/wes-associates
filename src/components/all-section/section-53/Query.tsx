/*
|-----------------------------------------
| Animated study destinations renderer for Section 53
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Globe2 } from 'lucide-react';

import { defaultDataSection53, type ISection53Data, type Section53Props } from './data';

const getSectionData = (data?: ISection53Data | string): ISection53Data => {
  if (!data) return defaultDataSection53;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection53Data>;
      return { ...defaultDataSection53, ...parsed, destinations: parsed.destinations || defaultDataSection53.destinations };
    } catch {
      return defaultDataSection53;
    }
  }

  return { ...defaultDataSection53, ...data, destinations: data.destinations || defaultDataSection53.destinations };
};

const QuerySection53 = ({ data }: Section53Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section id="countries" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-slate-200/45 blur-3xl" />

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
              <motion.span
                animate={reduceMotion ? undefined : { rotate: [0, 8, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="grid h-9 w-9 place-items-center rounded-full text-white shadow-lg"
                style={{ backgroundColor: sectionData.accentColor }}
              >
                <Globe2 className="h-4 w-4" aria-hidden="true" />
              </motion.span>
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectionData.destinations.map((destination, index) => (
            <motion.article
              key={`${destination.code}-${destination.name}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.96 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.58, delay: reduceMotion ? 0 : (index % 4) * 0.075, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-shadow duration-500 hover:shadow-[0_26px_60px_-28px_rgba(15,23,42,0.5)]"
              style={{ backgroundColor: sectionData.cardColor }}
            >
              <div
                className="relative flex h-32 items-end justify-between overflow-hidden p-4 text-white"
                style={{ backgroundImage: `linear-gradient(125deg, ${sectionData.gradientStart}, ${sectionData.accentColor})` }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:24px_24px]" />
                <motion.div
                  aria-hidden="true"
                  animate={reduceMotion ? undefined : { x: ['-130%', '260%'] }}
                  transition={{ duration: 1.4, delay: 0.35 + index * 0.1, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-12 -skew-x-12 bg-white/15 blur-sm"
                />
                <span className="relative text-[10px] font-black uppercase tracking-[0.14em] text-white/75">Study in</span>
                <span className="relative rounded-lg bg-white px-3 py-2 text-xs font-black shadow-lg transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110" style={{ color: sectionData.headingColor }}>
                  {destination.code}
                </span>
              </div>

              <div className="relative min-h-44 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-black tracking-[-0.02em]" style={{ color: sectionData.headingColor }}>
                    {destination.name}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" style={{ color: sectionData.accentColor }} aria-hidden="true" />
                </div>
                <p className="mt-2 text-sm font-semibold leading-5" style={{ color: sectionData.textColor }}>
                  {destination.description}
                </p>
                <span className="absolute bottom-4 left-4 h-1 w-8 rounded-full transition-all duration-500 group-hover:w-16" style={{ backgroundColor: sectionData.accentColor }} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuerySection53;
