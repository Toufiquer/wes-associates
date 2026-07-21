/*
|-----------------------------------------
| Animated student journey renderer for Section 54
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Flag, MapPin, Plane } from 'lucide-react';

import { defaultDataSection54, type ISection54Data, type Section54Props } from './data';

const getSectionData = (data?: ISection54Data | string): ISection54Data => {
  if (!data) return defaultDataSection54;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection54Data>;
      return { ...defaultDataSection54, ...parsed, steps: parsed.steps || defaultDataSection54.steps };
    } catch {
      return defaultDataSection54;
    }
  }

  return { ...defaultDataSection54, ...data, steps: data.steps || defaultDataSection54.steps };
};

const QuerySection54 = ({ data }: Section54Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="overflow-hidden px-4 py-14 sm:px-6 lg:py-20" style={{ backgroundColor: sectionData.sectionBackgroundColor }}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.98 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-[850px] overflow-hidden rounded-2xl p-6 text-white shadow-[0_30px_80px_-28px_rgba(15,23,42,0.65)] sm:rounded-3xl sm:p-9"
        style={{ backgroundImage: `linear-gradient(120deg, ${sectionData.gradientStart}, ${sectionData.gradientEnd})` }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { x: [0, 32, 0], y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl"
        />

        <div className="relative">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75"
          >
            {sectionData.eyebrow}
          </motion.p>
          <h2 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3rem)] font-black leading-[0.98] tracking-[-0.045em]">{sectionData.title}</h2>
          <p className="mt-4 max-w-xl text-xs font-semibold leading-6 text-white/75 sm:text-sm">{sectionData.description}</p>

          <div className="relative mt-9 grid gap-5 sm:grid-cols-[1fr_5rem_1fr] sm:items-center">
            <motion.article
              initial={reduceMotion ? false : { opacity: 0, x: -28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
              className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-colors duration-300 hover:bg-white/15"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white/65">
                <MapPin className="h-4 w-4" aria-hidden="true" /> {sectionData.originLabel}
              </div>
              <strong className="mt-2 block text-2xl tracking-[-0.03em] sm:text-3xl">{sectionData.originTitle}</strong>
              <p className="mt-3 text-xs font-semibold leading-5 text-white/80">{sectionData.originDescription}</p>
            </motion.article>

            <div className="relative grid min-h-16 place-items-center sm:min-h-28">
              <div className="absolute h-full border-l-2 border-dashed border-white/30 sm:h-auto sm:w-full sm:border-l-0 sm:border-t-2" />
              <motion.div
                animate={reduceMotion ? undefined : { x: [-9, 9, -9], y: [3, -5, 3], rotate: [43, 48, 43] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-white shadow-xl ring-8 ring-white/10"
                style={{ color: sectionData.accentColor }}
              >
                <Plane className="h-5 w-5 rotate-45" aria-hidden="true" />
              </motion.div>
            </div>

            <motion.article
              initial={reduceMotion ? false : { opacity: 0, x: 28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
              className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-colors duration-300 hover:bg-white/15"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white/65">
                <Flag className="h-4 w-4" aria-hidden="true" /> {sectionData.destinationLabel}
              </div>
              <strong className="mt-2 block text-2xl tracking-[-0.03em] sm:text-3xl">{sectionData.destinationTitle}</strong>
              <p className="mt-3 text-xs font-semibold leading-5 text-white/80">{sectionData.destinationDescription}</p>
            </motion.article>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sectionData.steps.map((step, index) => (
              <motion.article
                key={`${step.number}-${step.title}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.4 + index * 0.08, ease: 'easeOut' }}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                className="group relative min-h-28 overflow-hidden rounded-xl p-4 shadow-lg"
                style={{ backgroundColor: sectionData.stepCardColor, color: sectionData.stepTextColor }}
              >
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: sectionData.accentColor }}>Step {step.number}</span>
                <strong className="mt-2 block text-sm leading-5">{step.title}</strong>
                <span className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: sectionData.accentColor }} />
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default QuerySection54;
