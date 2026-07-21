/*
|-----------------------------------------
| Animated news and blog renderer for Section 63
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Newspaper } from 'lucide-react';

import { defaultDataSection63, type ISection63Data, type Section63Props } from './data';

const getSectionData = (data?: ISection63Data | string): ISection63Data => {
  if (!data) return defaultDataSection63;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection63Data>;
      return { ...defaultDataSection63, ...parsed, articles: parsed.articles || defaultDataSection63.articles };
    } catch {
      return defaultDataSection63;
    }
  }

  return { ...defaultDataSection63, ...data, articles: data.articles || defaultDataSection63.articles };
};

const QuerySection63 = ({ data }: Section63Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section id="blog" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-80 w-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: sectionData.accentColor }} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_90%,rgba(148,163,184,0.15),transparent_32%)]" />

      <div className="mx-auto w-full max-w-[850px]">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full text-white shadow-lg" style={{ backgroundColor: sectionData.accentColor }}><Newspaper className="h-4 w-4" aria-hidden="true" /></span>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>{sectionData.eyebrow}</p>
            </div>
            <h2 className="max-w-[640px] text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>{sectionData.title}</h2>
          </div>

          <motion.div whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} className="shrink-0 self-start">
            <Link href={sectionData.ctaLink || '#'} className="group inline-flex min-h-11 items-center gap-2 rounded-xl border px-5 text-xs font-black shadow-sm transition-shadow hover:shadow-lg" style={{ backgroundColor: sectionData.cardColor, borderColor: sectionData.borderColor, color: sectionData.headingColor }}>
              {sectionData.ctaText}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.header>

        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {sectionData.articles.map((article, index) => (
            <motion.article
              key={`${article.title}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.97 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.62, delay: reduceMotion ? 0 : index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              className="group relative overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-500 hover:shadow-[0_28px_65px_-30px_rgba(15,23,42,0.55)]"
              style={{ backgroundColor: sectionData.cardColor, borderColor: sectionData.borderColor }}
            >
              <div className="relative flex h-44 items-end overflow-hidden p-5 text-white" style={{ backgroundImage: `linear-gradient(125deg, ${sectionData.gradientStart}, ${sectionData.accentColor})` }}>
                <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:28px_28px]" />
                <motion.span
                  aria-hidden="true"
                  animate={reduceMotion ? undefined : { x: ['-150%', '280%'] }}
                  transition={{ duration: 1.4, delay: 0.35 + index * 0.12, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-14 -skew-x-12 bg-white/15 blur-sm"
                />
                <span className="absolute right-4 top-4 text-[10px] font-black tabular-nums text-white/55">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="relative text-xl font-black leading-6 tracking-[-0.03em]">{article.title}</h3>
              </div>
              <div className="relative min-h-40 p-5">
                <p className="text-sm font-semibold leading-6" style={{ color: sectionData.textColor }}>{article.description}</p>
                <ArrowUpRight className="absolute bottom-5 right-5 h-5 w-5 -translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" style={{ color: sectionData.accentColor }} aria-hidden="true" />
                <span className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: sectionData.accentColor }} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuerySection63;
