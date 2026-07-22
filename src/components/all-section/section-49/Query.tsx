/*
|-----------------------------------------
| Study Abroad experience hero renderer for Section 49
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import localFont from 'next/font/local';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { defaultDataSection49, type ISection49Data, type Section49Props } from './data';

const liAlinurBanglaborno = localFont({
  src: './Li Alinur Banglaborno ANSI V2 Italic.ttf',
  display: 'swap',
});

const renderBanglaText = (text: string) =>
  text.split(/([A-Za-z0-9]+(?:[+./&'-][A-Za-z0-9]+)*)/g).map((part, index) =>
    /[A-Za-z0-9]/.test(part) ? (
      <span key={`${part}-${index}`} className="font-sans">
        {part}
      </span>
    ) : (
      part
    ),
  );

const getSectionData = (data?: ISection49Data | string): ISection49Data => {
  if (!data) return defaultDataSection49;

  if (typeof data === 'string') {
    try {
      return { ...defaultDataSection49, ...(JSON.parse(data) as Partial<ISection49Data>) };
    } catch {
      return defaultDataSection49;
    }
  }

  return { ...defaultDataSection49, ...data };
};

const QuerySection49 = ({ data }: Section49Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();
  const gridBackground = {
    backgroundColor: sectionData.backgroundColor,
    backgroundImage: `linear-gradient(${sectionData.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${sectionData.gridColor} 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  };

  return (
    <section
      className="relative isolate flex min-h-[620px] w-full items-center justify-center overflow-hidden px-4 py-16 sm:min-h-[680px] sm:px-6 lg:min-h-[720px] lg:py-20"
      style={gridBackground}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(250,250,249,0.2),rgba(250,250,249,0.58)_72%)]" />

      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 34, 0], y: [0, -22, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-28 top-10 -z-10 h-72 w-72 rounded-full opacity-[0.09] blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
      />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, -28, 0], y: [0, 18, 0], scale: [1.06, 1, 1.06] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-20 -right-24 -z-10 h-80 w-80 rounded-full bg-slate-400/[0.08] blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.72, rotate: -12 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-[8%] top-[16%] -z-10 h-20 w-20 rounded-full border border-slate-300/70 sm:h-28 sm:w-28"
      />
      <motion.div
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.72, rotate: 12 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute bottom-[18%] right-[8%] -z-10 h-16 w-16 rounded-full border border-slate-300/70 sm:h-24 sm:w-24"
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-[1040px] text-center"
      >
        <h1 className="font-black leading-[0.98] tracking-[-0.045em]" style={{ color: sectionData.headingColor }}>
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 28, filter: 'blur(8px)' }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`${liAlinurBanglaborno.className} block text-[clamp(3.1rem,6vw,5.25rem)]`}
          >
            {renderBanglaText(sectionData.titleLineOne)}
          </motion.span>
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 32, filter: 'blur(9px)' }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.78, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 block text-[clamp(3rem,6.5vw,5.5rem)] sm:mt-6"
          >
            <span className="font-sans tracking-[-0.055em]">{sectionData.titleEnglish}</span>
            <span className={`${liAlinurBanglaborno.className} text-slate-600`}>{renderBanglaText(sectionData.titleEnglishSuffix)}</span>{' '}
            <span className={`${liAlinurBanglaborno.className} relative inline-block`} style={{ color: sectionData.accentColor }}>
              {renderBanglaText(sectionData.titleHighlight)}
              <motion.span
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={reduceMotion ? undefined : { scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full opacity-70 sm:h-1.5"
                style={{ backgroundColor: sectionData.accentColor }}
              />
            </span>
          </motion.span>
        </h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.48, ease: 'easeOut' }}
          className="mx-auto mt-12 max-w-[790px] text-[clamp(1rem,1.55vw,1.35rem)] font-medium leading-[1.55] sm:mt-14"
          style={{ color: sectionData.descriptionColor }}
        >
          <strong className={`${liAlinurBanglaborno.className} font-extrabold`} style={{ color: sectionData.headingColor }}>
            {renderBanglaText(sectionData.descriptionLead)}
          </strong>{' '}
          <strong className="font-extrabold" style={{ color: sectionData.accentColor }}>
            {sectionData.descriptionAccent}
          </strong>{' '}
          <span className={liAlinurBanglaborno.className}>{renderBanglaText(sectionData.descriptionTail)}</span>
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.62, ease: 'easeOut' }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        >
          <motion.div
            whileHover={reduceMotion ? undefined : { y: -5, scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="w-full max-w-[238px]"
          >
            <Link
              href={sectionData.primaryButtonLink || '#'}
              className="group relative inline-flex min-h-16 w-full items-center justify-center gap-5 overflow-hidden border-2 px-7 text-base font-extrabold text-white shadow-[0_18px_40px_-18px_rgba(207,10,44,0.75)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 sm:min-h-[70px]"
              style={{ backgroundColor: sectionData.accentColor, borderColor: sectionData.accentColor }}
            >
              <motion.span
                aria-hidden="true"
                animate={reduceMotion ? undefined : { x: ['-160%', '260%'] }}
                transition={{ duration: 1.25, delay: 1, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-14 -skew-x-12 bg-white/20 blur-sm"
              />
              <span className="relative">{sectionData.primaryButtonText}</span>
              <ArrowRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={reduceMotion ? undefined : { y: -5, scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="w-full max-w-[146px]"
          >
            <Link
              href={sectionData.secondaryButtonLink || '#'}
              className="inline-flex min-h-16 w-full items-center justify-center border-2 bg-transparent px-7 text-base font-extrabold transition-colors duration-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 sm:min-h-[70px]"
              style={{ borderColor: sectionData.headingColor, color: sectionData.headingColor }}
            >
              {sectionData.secondaryButtonText}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default QuerySection49;
