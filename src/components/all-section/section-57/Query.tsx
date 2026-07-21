/*
|-----------------------------------------
| Animated scholarships renderer for Section 57
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BadgePercent, Clock3, Globe2, GraduationCap, Trophy } from 'lucide-react';

import { defaultDataSection57, type ISection57Data, type Section57Props } from './data';

const opportunityIcons = [Trophy, Globe2, BadgePercent, Clock3];

const getSectionData = (data?: ISection57Data | string): ISection57Data => {
  if (!data) return defaultDataSection57;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection57Data>;
      return { ...defaultDataSection57, ...parsed, opportunities: parsed.opportunities || defaultDataSection57.opportunities };
    } catch {
      return defaultDataSection57;
    }
  }

  return { ...defaultDataSection57, ...data, opportunities: data.opportunities || defaultDataSection57.opportunities };
};

const QuerySection57 = ({ data }: Section57Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section id="scholarships" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute -right-28 -top-28 -z-10 h-80 w-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: sectionData.accentColor }} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_80%,rgba(148,163,184,0.16),transparent_32%)]" />

      <div className="mx-auto grid w-full max-w-[850px] gap-10 md:grid-cols-[0.92fr_1.08fr] md:items-center lg:gap-14">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, x: -34 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 flex items-center gap-3">
            <motion.span
              animate={reduceMotion ? undefined : { rotate: [0, -7, 7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-lg"
              style={{ backgroundColor: sectionData.accentColor }}
            >
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </motion.span>
            <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>{sectionData.eyebrow}</p>
          </div>
          <h2 className="text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>{sectionData.title}</h2>
          <p className="mt-6 text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>{sectionData.description}</p>
          <motion.div
            aria-hidden="true"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 h-1 w-24 origin-left rounded-full"
            style={{ backgroundColor: sectionData.accentColor }}
          />
        </motion.header>

        <div className="grid gap-4 sm:grid-cols-2">
          {sectionData.opportunities.map((opportunity, index) => {
            const Icon = opportunityIcons[index % opportunityIcons.length];

            return (
              <motion.article
                key={`${opportunity.title}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.96 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.58, delay: reduceMotion ? 0 : (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { y: -7 }}
                className="group relative min-h-52 overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow duration-500 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.5)]"
                style={{ backgroundColor: sectionData.cardColor, borderColor: sectionData.borderColor }}
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15" style={{ backgroundColor: sectionData.accentColor }} />
                <div className="relative flex h-full flex-col">
                  <span className="grid h-10 w-10 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ backgroundColor: `${sectionData.accentColor}14`, color: sectionData.accentColor }}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="mt-auto pt-7">
                    <h3 className="font-black tracking-[-0.02em]" style={{ color: sectionData.headingColor }}>{opportunity.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6" style={{ color: sectionData.textColor }}>{opportunity.description}</p>
                  </div>
                </div>
                <span className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: sectionData.accentColor }} />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuerySection57;
