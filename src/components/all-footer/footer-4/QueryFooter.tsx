'use client';

import Image from 'next/image';
import React, { useMemo } from 'react';
import { defaultDataFooter4, IFooter4Data } from './data';

interface QueryFooterProps {
  data?: string;
}

const safeParseData = (data?: string): IFooter4Data => {
  if (!data) return defaultDataFooter4;
  try {
    return { ...defaultDataFooter4, ...JSON.parse(data) };
  } catch {
    return defaultDataFooter4;
  }
};

const QueryFooter4 = ({ data }: QueryFooterProps) => {
  const settings = useMemo(() => safeParseData(data), [data]);

  return (
    <footer className="w-full bg-[#ffffff] text-stone-600" style={{ borderTop: '1px solid brown' }}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            {settings.logoIsPublished && settings.logoUrl && (
              <Image
                src={settings.logoUrl}
                alt={`${settings.brandName} logo`}
                width={settings.logoWidth}
                height={100}
                unoptimized
                className="h-auto max-h-24 object-contain object-left"
                style={{ width: `${settings.logoWidth}px`, maxWidth: '100%' }}
              />
            )}
            <h3 className="text-xl font-bold text-stone-950">{settings.brandName}</h3>
            <p className="leading-relaxed text-sm">
              {settings.tagline}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-stone-950">{settings.destinationsTitle}</h4>
            <ul className="space-y-2 text-sm">
              {settings.destinationsLinks.map(item => (
                <li key={item.id}>
                  {item.link !== '#' ? (
                    <a href={item.link} className="block cursor-pointer transition-colors hover:text-red-600">{item.title}</a>
                  ) : (
                    <span className="block cursor-pointer transition-colors hover:text-red-600">{item.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-stone-950">{settings.servicesTitle}</h4>
            <ul className="space-y-2 text-sm">
              {settings.servicesLinks.map(item => (
                <li key={item.id}>
                  {item.link !== '#' ? (
                    <a href={item.link} className="block cursor-pointer transition-colors hover:text-red-600">{item.title}</a>
                  ) : (
                    <span className="block cursor-pointer transition-colors hover:text-red-600">{item.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-stone-950">{settings.contactTitle}</h4>
            <div className="text-sm space-y-2">
              <p>{settings.contactEmail}</p>
              <p>{settings.contactPhone}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-black text-stone-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs md:flex-row md:px-12 lg:px-24">
          <p>{settings.copyrightText}</p>
          <p>{settings.bottomRightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default QueryFooter4;
