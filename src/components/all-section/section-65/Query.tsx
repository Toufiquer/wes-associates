'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { defaultDataSection65, type ISection65Data, type Section65Props } from './data';

const getSectionData = (data?: ISection65Data | string): ISection65Data => {
  if (!data) return defaultDataSection65;

  if (typeof data === 'string') {
    try {
      return { ...defaultDataSection65, ...(JSON.parse(data) as Partial<ISection65Data>) };
    } catch {
      return defaultDataSection65;
    }
  }

  return { ...defaultDataSection65, ...data };
};

const QuerySection65 = ({ data }: Section65Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" style={{ backgroundColor: sectionData.backgroundColor }}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-0 -z-10 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
        animate={reduceMotion ? undefined : { x: [0, 36, 0], y: [0, 24, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -46, scale: 0.96 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[390px] w-full max-w-[560px] sm:h-[480px] lg:mx-0"
        >
          <motion.div
            className="absolute left-0 top-0 h-[48%] w-[72%] overflow-hidden rounded-[2.25rem_0.5rem_0.5rem_0.5rem] bg-slate-100 shadow-[0_24px_70px_rgba(30,64,175,0.12)]"
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src={sectionData.topImage} alt="" fill sizes="(max-width: 1024px) 70vw, 36vw" className="object-cover" unoptimized />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 h-[53%] w-[53%] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_24px_70px_rgba(30,64,175,0.12)]"
            animate={reduceMotion ? undefined : { y: [0, 9, 0] }}
            transition={{ duration: 6.25, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
          >
            <Image src={sectionData.bottomImage} alt="" fill sizes="(max-width: 1024px) 52vw, 27vw" className="object-cover" unoptimized />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.78, rotate: -5 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[2%] top-[28%] z-10 h-[47%] w-[55%] overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] sm:right-[3%]"
          >
            <Image src={sectionData.centerImage} alt="" fill sizes="(max-width: 1024px) 55vw, 28vw" className="object-contain p-7 sm:p-10" unoptimized />
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 46 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-2xl lg:mx-0"
        >
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="text-base font-medium"
            style={{ color: sectionData.textColor }}
          >
            {sectionData.eyebrow}
          </motion.p>

          <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.15rem)] font-bold leading-[1.08] tracking-[-0.035em]" style={{ color: sectionData.headingColor }}>
            {sectionData.title}{' '}
            <span style={{ color: sectionData.accentColor }}>{sectionData.highlightedTitle}</span>
          </h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.38 }}
            className="mt-7 text-base leading-8 sm:text-lg sm:leading-9"
            style={{ color: sectionData.textColor }}
          >
            {sectionData.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default QuerySection65;
