/*
|-----------------------------------------
| Animated document checklist renderer for Section 62
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Check, FileText, FolderCheck, IdCard, WalletCards } from 'lucide-react';

import { defaultDataSection62, type ISection62Data, type Section62Props } from './data';

const documentIcons = [FileText, IdCard, WalletCards];

const getSectionData = (data?: ISection62Data | string): ISection62Data => {
  if (!data) return defaultDataSection62;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection62Data>;
      return { ...defaultDataSection62, ...parsed, documentGroups: parsed.documentGroups || defaultDataSection62.documentGroups };
    } catch {
      return defaultDataSection62;
    }
  }

  return { ...defaultDataSection62, ...data, documentGroups: data.documentGroups || defaultDataSection62.documentGroups };
};

const QuerySection62 = ({ data }: Section62Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl" />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { rotate: [0, 5, -5, 0], y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-16 bottom-8 -z-10 opacity-[0.06]"
        style={{ color: sectionData.accentColor }}
      >
        <FolderCheck className="h-64 w-64" />
      </motion.div>

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
              <span className="grid h-9 w-9 place-items-center rounded-full text-white shadow-lg" style={{ backgroundColor: sectionData.accentColor }}><FolderCheck className="h-4 w-4" aria-hidden="true" /></span>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>{sectionData.eyebrow}</p>
            </div>
            <h2 className="max-w-[690px] text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>{sectionData.title}</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>{sectionData.description}</p>
        </motion.header>

        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {sectionData.documentGroups.map((group, index) => {
            const Icon = documentIcons[index % documentIcons.length];

            return (
              <motion.article
                key={`${group.title}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 36, rotateZ: index === 0 ? -2 : index === 2 ? 2 : 0 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotateZ: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.62, delay: reduceMotion ? 0 : index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { y: -8 }}
                className="group relative min-h-64 overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow duration-500 hover:shadow-[0_26px_65px_-30px_rgba(15,23,42,0.5)] sm:p-6"
                style={{ backgroundColor: sectionData.cardColor, borderColor: sectionData.borderColor }}
              >
                <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-12" style={{ backgroundColor: sectionData.accentColor }} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ backgroundColor: `${sectionData.accentColor}14`, color: sectionData.accentColor }}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="grid h-7 w-7 place-items-center rounded-full border opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ borderColor: sectionData.accentColor, color: sectionData.accentColor }}><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /></span>
                  </div>
                  <div className="mt-auto pt-8">
                    <span className="mb-3 block h-1 w-8 rounded-full transition-all duration-500 group-hover:w-14" style={{ backgroundColor: sectionData.accentColor }} />
                    <h3 className="text-lg font-black tracking-[-0.02em]" style={{ color: sectionData.headingColor }}>{group.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6" style={{ color: sectionData.textColor }}>{group.description}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuerySection62;
