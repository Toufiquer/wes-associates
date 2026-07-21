'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { defaultDataSection66, type ISection66Data, type Section66Props } from './data';

const getSectionData = (data?: ISection66Data | string): ISection66Data => {
  if (!data) return defaultDataSection66;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection66Data>;
      return {
        ...defaultDataSection66,
        ...parsed,
        paragraphs: parsed.paragraphs || defaultDataSection66.paragraphs,
        stats: parsed.stats || defaultDataSection66.stats,
      };
    } catch {
      return defaultDataSection66;
    }
  }

  return {
    ...defaultDataSection66,
    ...data,
    paragraphs: data.paragraphs || defaultDataSection66.paragraphs,
    stats: data.stats || defaultDataSection66.stats,
  };
};

const QuerySection66 = ({ data }: Section66Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" style={{ backgroundColor: sectionData.backgroundColor }}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-0 -z-10 h-80 w-80 rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
        animate={reduceMotion ? undefined : { x: [0, -32, 0], y: [0, 28, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div className="order-2 space-y-5 lg:order-1">
          {sectionData.stats.map((stat, index) => (
            <motion.article
              key={`${stat.value}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, x: -42, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, delay: reduceMotion ? 0 : index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { x: 8, scale: 1.015 }}
              className="group relative isolate min-h-32 overflow-hidden rounded-lg px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:min-h-36 sm:px-10"
              style={{ backgroundColor: sectionData.cardColor }}
            >
              <Image
                src={sectionData.cardBackgroundImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="-z-10 object-cover opacity-[0.035] transition duration-700 group-hover:scale-110 group-hover:opacity-[0.07]"
                unoptimized
              />
              <div className="flex min-h-20 items-center gap-7 sm:gap-12">
                <motion.strong
                  animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                  transition={{ duration: 3.6 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="min-w-[8rem] text-center text-3xl font-bold tracking-[-0.035em] sm:text-4xl"
                  style={{ color: sectionData.statColor }}
                >
                  {stat.value}
                </motion.strong>
                <p className="max-w-[15rem] text-base leading-6" style={{ color: sectionData.textColor }}>
                  {stat.label}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 46 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2"
        >
          <p className="text-base font-medium" style={{ color: sectionData.textColor }}>
            {sectionData.eyebrow}
          </p>
          <h2 className="mt-4 text-[clamp(2.1rem,4.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.035em]" style={{ color: sectionData.headingColor }}>
            {sectionData.title}{' '}
            <span style={{ color: sectionData.accentColor }}>{sectionData.highlightedTitle}</span>
          </h2>

          <div className="mt-7 space-y-1 text-base leading-7 sm:text-lg sm:leading-8" style={{ color: sectionData.textColor }}>
            {sectionData.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.18 + index * 0.1 }}
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

export default QuerySection66;
