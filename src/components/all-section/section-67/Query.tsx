'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { defaultDataSection67, type ISection67Data, type Section67Props } from './data';

const getSectionData = (data?: ISection67Data | string): ISection67Data => {
  if (!data) return defaultDataSection67;

  if (typeof data === 'string') {
    try {
      return { ...defaultDataSection67, ...(JSON.parse(data) as Partial<ISection67Data>) };
    } catch {
      return defaultDataSection67;
    }
  }

  return { ...defaultDataSection67, ...data };
};

interface ImagePanelProps {
  src: string;
  className: string;
  delay: number;
  sizes: string;
  reduceMotion: boolean | null;
}

const ImagePanel = ({ src, className, delay, sizes, reduceMotion }: ImagePanelProps) => (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 24 }}
    whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
    className={`group relative isolate overflow-hidden bg-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.1)] ${className}`}
  >
    <Image src={src} alt="" fill sizes={sizes} className="object-cover transition duration-700 ease-out group-hover:scale-110" unoptimized />
    <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-blue-950/10 via-transparent to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  </motion.div>
);

const QuerySection67 = ({ data }: Section67Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24" style={{ backgroundColor: sectionData.backgroundColor }}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid w-full max-w-[1380px] gap-10 lg:grid-cols-2 lg:gap-11">
        <div className="flex flex-col">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -38 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-base font-medium" style={{ color: sectionData.textColor }}>{sectionData.missionEyebrow}</p>
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.15rem)] font-bold leading-[1.08] tracking-[-0.035em]" style={{ color: sectionData.headingColor }}>
              {sectionData.missionTitle}{' '}
              <span style={{ color: sectionData.accentColor }}>{sectionData.missionHighlightedTitle}</span>
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 sm:text-lg sm:leading-9" style={{ color: sectionData.textColor }}>{sectionData.missionDescription}</p>
          </motion.div>

          <div className="mt-8 grid h-[420px] grid-cols-[0.96fr_1fr] grid-rows-2 gap-5 sm:h-[510px]">
            <ImagePanel
              src={sectionData.missionPrimaryImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.08}
              reduceMotion={reduceMotion}
              className="row-span-2 rounded-[0.5rem_4rem_1.25rem_0.5rem]"
            />
            <ImagePanel src={sectionData.missionTopImage} sizes="(max-width: 1024px) 48vw, 24vw" delay={0.16} reduceMotion={reduceMotion} className="rounded-lg" />
            <ImagePanel
              src={sectionData.missionBottomImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.24}
              reduceMotion={reduceMotion}
              className="rounded-[4rem_0.5rem_0.5rem_0.5rem]"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid h-[420px] grid-cols-[0.96fr_1fr] grid-rows-2 gap-5 sm:h-[510px]">
            <ImagePanel
              src={sectionData.visionPrimaryImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.12}
              reduceMotion={reduceMotion}
              className="row-span-2 rounded-[4rem_1rem_1rem_1rem]"
            />
            <ImagePanel
              src={sectionData.visionTopImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.2}
              reduceMotion={reduceMotion}
              className="rounded-[0.5rem_0.5rem_0.5rem_4rem]"
            />
            <ImagePanel
              src={sectionData.visionBottomImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.28}
              reduceMotion={reduceMotion}
              className="rounded-[0.5rem_0.5rem_4rem_0.5rem]"
            />
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 38 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <p className="text-base font-medium" style={{ color: sectionData.textColor }}>{sectionData.visionEyebrow}</p>
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.15rem)] font-bold leading-[1.08] tracking-[-0.035em]" style={{ color: sectionData.headingColor }}>
              {sectionData.visionTitle}{' '}
              <span style={{ color: sectionData.accentColor }}>{sectionData.visionHighlightedTitle}</span>
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 sm:text-lg sm:leading-9" style={{ color: sectionData.textColor }}>{sectionData.visionDescription}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuerySection67;
