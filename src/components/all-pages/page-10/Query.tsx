'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, Globe2, GraduationCap, Landmark, MapPin, Sparkles, Users } from 'lucide-react';

import { defaultDataPage10, type IPage10Data, type Page10Props } from './data';

const getPageData = (data?: IPage10Data | string): IPage10Data => {
  if (!data) return defaultDataPage10;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<IPage10Data>;
      return {
        ...defaultDataPage10,
        ...parsed,
        pageUid: 'page-uid-10',
        facts: Array.isArray(parsed.facts) ? parsed.facts : defaultDataPage10.facts,
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : defaultDataPage10.highlights,
      };
    } catch {
      return defaultDataPage10;
    }
  }

  return {
    ...defaultDataPage10,
    ...data,
    pageUid: 'page-uid-10',
    facts: Array.isArray(data.facts) ? data.facts : defaultDataPage10.facts,
    highlights: Array.isArray(data.highlights) ? data.highlights : defaultDataPage10.highlights,
  };
};

const highlightIcons = [GraduationCap, Users, Sparkles];

const QueryPage10 = ({ data }: Page10Props) => {
  const pageData = getPageData(data);
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-hidden" style={{ backgroundColor: pageData.backgroundColor, color: pageData.textColor }}>
      <section className="relative isolate min-h-[640px] overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Image src={pageData.heroImage} alt="" fill priority sizes="100vw" className="-z-20 object-cover" unoptimized />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/25" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-12 -z-10 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: pageData.accentColor }}
          animate={reduceMotion ? undefined : { scale: [1, 1.16, 1], x: [0, -28, 0], y: [0, 22, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="mx-auto flex min-h-[480px] w-full max-w-7xl items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -46 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, rotate: -8, scale: 0.8 }}
                animate={reduceMotion ? undefined : { opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="relative h-14 w-20 overflow-hidden rounded-xl border border-white/30 bg-white/95 shadow-xl"
              >
                <Image src={pageData.flagImage} alt="" fill sizes="80px" className="object-contain p-1" unoptimized />
              </motion.div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">{pageData.eyebrow}</p>
            </div>
            <h1 className="mt-7 text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.92] tracking-[-0.065em] text-white">
              {pageData.titlePrefix}{' '}
              <span style={{ color: pageData.accentColor }}>{pageData.countryName}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl sm:leading-9">{pageData.heroDescription}</p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_30px_90px_rgba(15,23,42,0.14)] sm:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: pageData.surfaceColor }}>
          {pageData.facts.map((fact, index) => (
            <motion.article
              key={fact.id || index}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.08 }}
              className="border-b border-slate-200/80 p-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: pageData.accentColor }}>{fact.label}</p>
              <p className="mt-2 text-xl font-bold" style={{ color: pageData.headingColor }}>{fact.value}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -42 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]" style={{ color: pageData.accentColor }}>
              <Globe2 className="h-4 w-4" /> {pageData.pageName}
            </span>
            <h2 className="mt-5 text-[clamp(2.25rem,5vw,4.2rem)] font-black leading-[1.02] tracking-[-0.055em]" style={{ color: pageData.headingColor }}>{pageData.aboutTitle}</h2>
            <p className="mt-7 text-lg leading-9">{pageData.aboutDescription}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 p-5" style={{ backgroundColor: pageData.surfaceColor }}>
                <Landmark className="h-7 w-7" style={{ color: pageData.accentColor }} />
                <h3 className="mt-4 text-xl font-bold" style={{ color: pageData.headingColor }}>{pageData.cultureTitle}</h3>
                <p className="mt-3 text-sm leading-7">{pageData.cultureDescription}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 p-5" style={{ backgroundColor: pageData.surfaceColor }}>
                <BookOpen className="h-7 w-7" style={{ color: pageData.accentColor }} />
                <h3 className="mt-4 text-xl font-bold" style={{ color: pageData.headingColor }}>{pageData.studentLifeTitle}</h3>
                <p className="mt-3 text-sm leading-7">{pageData.studentLifeDescription}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 42, scale: 0.94 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-square w-full max-w-[560px]"
          >
            <div className="absolute inset-[8%] rounded-full opacity-10" style={{ backgroundColor: pageData.accentColor }} />
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 1.5, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-[12%] overflow-hidden rounded-[3rem] border border-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.14)]"
              style={{ backgroundColor: pageData.surfaceColor }}
            >
              <Image src={pageData.mapImage} alt="" fill sizes="(max-width: 1024px) 76vw, 38vw" className="object-contain p-10" unoptimized />
            </motion.div>
            <div className="absolute bottom-[7%] left-[7%] flex items-center gap-3 rounded-2xl border border-white/80 px-4 py-3 shadow-xl backdrop-blur" style={{ backgroundColor: `${pageData.surfaceColor}e8` }}>
              <MapPin className="h-5 w-5" style={{ color: pageData.accentColor }} />
              <span className="font-bold" style={{ color: pageData.headingColor }}>{pageData.countryName}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8" style={{ backgroundColor: pageData.surfaceColor }}>
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: pageData.accentColor }}>{pageData.countryName}</p>
            <h2 className="mt-4 text-[clamp(2.25rem,5vw,4rem)] font-black leading-tight tracking-[-0.05em]" style={{ color: pageData.headingColor }}>{pageData.highlightsTitle}</h2>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {pageData.highlights.map((highlight, index) => {
              const Icon = highlightIcons[index % highlightIcons.length];
              return (
                <motion.article
                  key={highlight.id || index}
                  initial={reduceMotion ? false : { opacity: 0, y: 34 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: reduceMotion ? 0 : index * 0.1 }}
                  whileHover={reduceMotion ? undefined : { y: -10 }}
                  className="group rounded-3xl border border-slate-200/80 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_28px_70px_rgba(15,23,42,0.11)]"
                  style={{ backgroundColor: pageData.backgroundColor }}
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" style={{ backgroundColor: pageData.accentColor }}>
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-7 text-2xl font-bold" style={{ color: pageData.headingColor }}>{highlight.title}</h3>
                  <p className="mt-4 leading-8">{highlight.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white shadow-[0_28px_80px_rgba(37,99,235,0.24)] sm:px-10 lg:py-20"
          style={{ backgroundColor: pageData.accentColor }}
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full border-[40px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full border-[50px] border-white/10" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-black leading-tight tracking-[-0.05em]">{pageData.ctaTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/85">{pageData.ctaDescription}</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <motion.a
                href={pageData.primaryButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.025 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-7 font-bold shadow-xl"
                style={{ color: pageData.accentColor }}
              >
                {pageData.primaryButtonText} <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={pageData.secondaryButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.025 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/50 bg-white/10 px-7 font-bold text-white backdrop-blur hover:bg-white/15"
              >
                {pageData.secondaryButtonText}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default QueryPage10;
