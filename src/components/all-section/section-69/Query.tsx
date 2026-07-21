'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { defaultDataSection69, type ISection69Data, type Section69Props } from './data';

const getSectionData = (data?: ISection69Data | string): ISection69Data => {
  if (!data) return defaultDataSection69;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection69Data>;
      return { ...defaultDataSection69, ...parsed, logos: parsed.logos?.length ? parsed.logos : defaultDataSection69.logos };
    } catch {
      return defaultDataSection69;
    }
  }

  return { ...defaultDataSection69, ...data, logos: data.logos?.length ? data.logos : defaultDataSection69.logos };
};

const QuerySection69 = ({ data }: Section69Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();
  const displayedLogos = reduceMotion ? sectionData.logos : [...sectionData.logos, ...sectionData.logos];

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: sectionData.backgroundColor }}>
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -26 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="px-4 text-center sm:px-6"
      >
        <p className="text-base font-medium" style={{ color: sectionData.textColor }}>{sectionData.eyebrow}</p>
        <h2 className="mt-4 text-[clamp(2rem,4.3vw,3.2rem)] font-bold leading-tight tracking-[-0.035em]" style={{ color: sectionData.headingColor }}>
          {sectionData.title}
        </h2>
      </motion.header>

      <div className="relative mt-20 overflow-hidden sm:mt-24 lg:mt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-28"
          style={{ background: `linear-gradient(to right, ${sectionData.backgroundColor}, transparent)` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-28"
          style={{ background: `linear-gradient(to left, ${sectionData.backgroundColor}, transparent)` }}
        />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className={reduceMotion ? 'flex snap-x snap-mandatory gap-8 overflow-x-auto px-8 pb-3 sm:gap-14' : 'flex w-max items-center'}
          animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
          style={reduceMotion ? undefined : { willChange: 'transform' }}
          {...(!reduceMotion && { transition: { x: { duration: Math.max(22, sectionData.logos.length * 4.5), repeat: Infinity, ease: 'linear' } } })}
        >
          {displayedLogos.map((logo, index) => (
            <motion.div
              key={`${index}-${logo}`}
              className={`relative h-24 w-44 shrink-0 snap-center sm:h-28 sm:w-56 ${reduceMotion ? '' : 'mx-5 sm:mx-8'}`}
              whileHover={reduceMotion ? undefined : { y: -8, scale: 1.06 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Image src={logo} alt="" fill sizes="(max-width: 640px) 176px, 224px" className="object-contain" unoptimized />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default QuerySection69;
