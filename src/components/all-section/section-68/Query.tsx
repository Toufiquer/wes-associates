'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { defaultDataSection68, type ISection68Data, type Section68Props } from './data';

const getSectionData = (data?: ISection68Data | string): ISection68Data => {
  if (!data) return defaultDataSection68;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection68Data>;
      return { ...defaultDataSection68, ...parsed, paragraphs: parsed.paragraphs || defaultDataSection68.paragraphs };
    } catch {
      return defaultDataSection68;
    }
  }

  return { ...defaultDataSection68, ...data, paragraphs: data.paragraphs || defaultDataSection68.paragraphs };
};

const QuerySection68 = ({ data }: Section68Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24" style={{ backgroundColor: sectionData.backgroundColor }}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-80 w-80 rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
        animate={reduceMotion ? undefined : { x: [0, 28, 0], y: [0, -22, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid w-full max-w-[1340px] items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -46, scale: 0.96 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[430px] w-full max-w-[520px] sm:h-[560px] lg:mx-0"
        >
          <motion.div
            className="group absolute left-0 top-0 h-[82%] w-[71%] overflow-hidden rounded-[4.5rem_0.75rem_0.75rem_0.75rem] bg-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.1)]"
            animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src={sectionData.primaryImage} alt="" fill sizes="(max-width: 1024px) 68vw, 29vw" className="object-contain p-3 transition duration-700 group-hover:scale-105" unoptimized />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28, scale: 0.88 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -7, scale: 1.02 }}
            className="group absolute right-0 top-[18%] h-[48%] w-[39%] overflow-hidden rounded-lg bg-indigo-50 shadow-[0_24px_65px_rgba(15,23,42,0.12)]"
          >
            <Image src={sectionData.topImage} alt="" fill sizes="(max-width: 1024px) 38vw, 16vw" className="object-contain p-3 transition duration-700 group-hover:scale-110" unoptimized />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.88 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -7, scale: 1.02 }}
            className="group absolute bottom-0 right-[1%] h-[34%] w-[47%] overflow-hidden rounded-lg bg-cyan-50 shadow-[0_24px_65px_rgba(15,23,42,0.12)]"
          >
            <Image src={sectionData.bottomImage} alt="" fill sizes="(max-width: 1024px) 46vw, 19vw" className="object-contain p-3 transition duration-700 group-hover:scale-110" unoptimized />
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 46 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[clamp(2rem,4vw,3.15rem)] font-bold leading-[1.22] tracking-[-0.035em]" style={{ color: sectionData.headingColor }}>
            {sectionData.titlePrefix}{' '}
            <span style={{ color: sectionData.accentColor }}>{sectionData.highlightedTitle}</span>{' '}
            {sectionData.titleSuffix}
          </h2>

          <div className="mt-8 space-y-6 text-base leading-7 sm:text-lg sm:leading-8" style={{ color: sectionData.textColor }}>
            {sectionData.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.58, delay: reduceMotion ? 0 : 0.24 + index * 0.12 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuerySection68;
