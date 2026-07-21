/*
|-----------------------------------------
| Animated statistics strip for Section 50
|-----------------------------------------
*/

'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { defaultDataSection50, type ISection50Data, type Section50Props } from './data';

const getSectionData = (data?: ISection50Data | string): ISection50Data => {
  if (!data) return defaultDataSection50;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection50Data>;
      return { ...defaultDataSection50, ...parsed, stats: parsed.stats || defaultDataSection50.stats };
    } catch {
      return defaultDataSection50;
    }
  }

  return { ...defaultDataSection50, ...data, stats: data.stats || defaultDataSection50.stats };
};

const QuerySection50 = ({ data }: Section50Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 mx-auto -mt-16 w-full max-w-[898px] px-4 sm:px-6" aria-label="WES Associates highlights">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 38, scale: 0.97 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl p-px shadow-[0_26px_70px_-24px_rgba(15,23,42,0.38)] sm:rounded-3xl"
        style={{ backgroundColor: sectionData.borderColor }}
      >
        <div className="pointer-events-none absolute -left-20 -top-24 h-52 w-52 rounded-full bg-red-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-52 w-52 rounded-full bg-sky-400/15 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-px overflow-hidden rounded-[calc(1rem-1px)] sm:grid-cols-2 sm:rounded-[calc(1.5rem-1px)] lg:grid-cols-4" style={{ backgroundColor: sectionData.borderColor }}>
          {sectionData.stats.map((stat, index) => (
            <motion.article
              key={`${stat.value}-${stat.label}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              className="group relative min-h-36 overflow-hidden p-5 sm:min-h-40 sm:p-6"
              style={{ backgroundColor: sectionData.backgroundColor }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 group-hover:opacity-100"
                animate={reduceMotion ? undefined : { left: ['-50%', '135%'] }}
                transition={{ duration: 1.15, delay: 0.45 + index * 0.12, ease: 'easeInOut' }}
              />

              <div className="relative flex h-full flex-col justify-between gap-5">
                <div className="flex items-center justify-between">
                  <span className="h-1.5 w-10 rounded-full transition-all duration-500 group-hover:w-16" style={{ backgroundColor: sectionData.accentColor }} />
                  <span className="text-[10px] font-black tabular-nums opacity-30" style={{ color: sectionData.textColor }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div>
                  <strong className="block text-[clamp(2rem,4vw,2.75rem)] font-black leading-none tracking-[-0.055em]" style={{ color: sectionData.accentColor }}>
                    {stat.value}
                  </strong>
                  <span className="mt-2 block max-w-40 text-xs font-extrabold leading-5 sm:text-[13px]" style={{ color: sectionData.textColor }}>
                    {stat.label}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default QuerySection50;
