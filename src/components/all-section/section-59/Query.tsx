/*
|-----------------------------------------
| Animated visa support renderer for Section 59
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Check, FileCheck2, FileText, MessagesSquare, ScanSearch, ShieldCheck } from 'lucide-react';

import { defaultDataSection59, type ISection59Data, type Section59Props } from './data';

const supportIcons = [FileText, FileCheck2, MessagesSquare, ScanSearch];

const getSectionData = (data?: ISection59Data | string): ISection59Data => {
  if (!data) return defaultDataSection59;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection59Data>;
      return { ...defaultDataSection59, ...parsed, supportItems: parsed.supportItems || defaultDataSection59.supportItems };
    } catch {
      return defaultDataSection59;
    }
  }

  return { ...defaultDataSection59, ...data, supportItems: data.supportItems || defaultDataSection59.supportItems };
};

const QuerySection59 = ({ data }: Section59Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.13, 0.22, 0.13] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-36 top-1/4 -z-10 h-96 w-96 rounded-full blur-[100px]"
        style={{ backgroundColor: sectionData.accentColor }}
      />

      <div className="mx-auto grid w-full max-w-[850px] gap-11 md:grid-cols-[0.88fr_1.12fr] md:items-center lg:gap-14">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, x: -34 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            animate={reduceMotion ? undefined : { rotateY: [0, 12, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-5 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-xl"
            style={{ backgroundColor: sectionData.accentColor }}
          >
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </motion.span>
          <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>{sectionData.eyebrow}</p>
          <h2 className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>{sectionData.title}</h2>
          <p className="mt-6 text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>{sectionData.description}</p>
          <div className="mt-7 flex items-center gap-3 text-xs font-bold" style={{ color: sectionData.headingColor }}>
            <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ backgroundColor: sectionData.accentColor }}><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /></span>
            Guided review from preparation to submission
          </div>
        </motion.header>

        <div className="grid gap-4 sm:grid-cols-2">
          {sectionData.supportItems.map((item, index) => {
            const Icon = supportIcons[index % supportIcons.length];

            return (
              <motion.article
                key={`${item.title}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 32, rotateX: 7 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.58, delay: reduceMotion ? 0 : (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { y: -7 }}
                className="group relative min-h-56 overflow-hidden rounded-2xl border p-5 transition-shadow duration-500 hover:shadow-[0_26px_70px_-30px_rgba(0,0,0,0.85)]"
                style={{ backgroundColor: sectionData.cardColor, borderColor: sectionData.borderColor, transformPerspective: 900 }}
              >
                <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25" style={{ backgroundColor: sectionData.accentColor }} />
                <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ backgroundColor: sectionData.accentColor }} />
                <div className="relative flex h-full flex-col">
                  <span className="grid h-10 w-10 place-items-center rounded-xl transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ backgroundColor: `${sectionData.accentColor}20`, color: sectionData.accentColor }}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="mt-auto pt-7">
                    <h3 className="font-black tracking-[-0.02em]" style={{ color: sectionData.headingColor }}>{item.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6" style={{ color: sectionData.textColor }}>{item.description}</p>
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

export default QuerySection59;
