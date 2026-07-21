/*
|-----------------------------------------
| Animated student services renderer for Section 55
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

import { defaultDataSection55, type ISection55Data, type Section55Props } from './data';

const getSectionData = (data?: ISection55Data | string): ISection55Data => {
  if (!data) return defaultDataSection55;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection55Data>;
      return { ...defaultDataSection55, ...parsed, services: parsed.services || defaultDataSection55.services };
    } catch {
      return defaultDataSection55;
    }
  }

  return { ...defaultDataSection55, ...data, services: data.services || defaultDataSection55.services };
};

const QuerySection55 = ({ data }: Section55Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(circle_at_center,#fff_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 45, 0], y: [0, -24, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-32 top-12 -z-10 h-96 w-96 rounded-full opacity-20 blur-[90px]"
        style={{ backgroundColor: sectionData.accentColor }}
      />

      <div className="mx-auto w-full max-w-[850px]">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full text-white shadow-lg" style={{ backgroundColor: sectionData.accentColor }}>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>{sectionData.eyebrow}</p>
            </div>
            <h2 className="max-w-[690px] text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>{sectionData.title}</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>{sectionData.description}</p>
        </motion.header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectionData.services.map((service, index) => (
            <motion.article
              key={`${service.number}-${service.title}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.97 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.58, delay: reduceMotion ? 0 : (index % 3) * 0.085, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              className="group relative min-h-64 overflow-hidden rounded-2xl border p-5 transition-shadow duration-500 hover:shadow-[0_24px_65px_-28px_rgba(0,0,0,0.8)] sm:p-6"
              style={{ backgroundColor: sectionData.cardColor, borderColor: sectionData.borderColor }}
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" style={{ backgroundColor: sectionData.accentColor }} />
              <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ backgroundColor: sectionData.accentColor }} />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <motion.span
                    whileHover={reduceMotion ? undefined : { rotate: -8, scale: 1.08 }}
                    className="grid h-11 w-11 place-items-center rounded-xl text-xs font-black text-white shadow-lg"
                    style={{ backgroundColor: sectionData.accentColor }}
                  >
                    {service.number}
                  </motion.span>
                  <ArrowUpRight className="h-5 w-5 -translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" style={{ color: sectionData.accentColor }} aria-hidden="true" />
                </div>

                <div className="mt-auto pt-9">
                  <h3 className="text-lg font-black tracking-[-0.02em]" style={{ color: sectionData.headingColor }}>{service.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6" style={{ color: sectionData.textColor }}>{service.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuerySection55;
