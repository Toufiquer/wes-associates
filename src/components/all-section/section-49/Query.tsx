/*
|-----------------------------------------
| IELTS hero renderer for Section 49
|-----------------------------------------
*/

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { defaultDataSection49, type ISection49Data, type Section49Props } from './data';

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

      <div
        className="mx-auto w-full max-w-[1040px] text-center"
        style={{ fontFamily: "'Noto Sans Bengali', 'Hind Siliguri', 'Nirmala UI', sans-serif" }}
      >
        <h1 className="font-black leading-[0.98] tracking-[-0.045em]" style={{ color: sectionData.headingColor }}>
          <span className="block text-[clamp(3.1rem,6vw,5.25rem)]">{sectionData.titleLineOne}</span>
          <span className="mt-5 block text-[clamp(3rem,6.5vw,5.5rem)] sm:mt-6">
            <span className="font-sans tracking-[-0.055em]">{sectionData.titleEnglish}</span>
            <span className="text-slate-600">{sectionData.titleEnglishSuffix}</span>{' '}
            <span style={{ color: sectionData.accentColor }}>{sectionData.titleHighlight}</span>
          </span>
        </h1>

        <p
          className="mx-auto mt-12 max-w-[790px] text-[clamp(1rem,1.55vw,1.35rem)] font-medium leading-[1.55] sm:mt-14"
          style={{ color: sectionData.descriptionColor }}
        >
          <strong className="font-extrabold" style={{ color: sectionData.headingColor }}>
            {sectionData.descriptionLead}
          </strong>{' '}
          <strong className="font-extrabold" style={{ color: sectionData.accentColor }}>
            {sectionData.descriptionAccent}
          </strong>{' '}
          {sectionData.descriptionTail}
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href={sectionData.primaryButtonLink || '#'}
            className="group inline-flex min-h-16 w-full max-w-[238px] items-center justify-center gap-5 border-2 px-7 text-base font-extrabold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 sm:min-h-[70px]"
            style={{ backgroundColor: sectionData.accentColor, borderColor: sectionData.accentColor }}
          >
            {sectionData.primaryButtonText}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          <Link
            href={sectionData.secondaryButtonLink || '#'}
            className="inline-flex min-h-16 w-full max-w-[146px] items-center justify-center border-2 bg-transparent px-7 text-base font-extrabold transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 sm:min-h-[70px]"
            style={{ borderColor: sectionData.headingColor, color: sectionData.headingColor }}
          >
            {sectionData.secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuerySection49;
