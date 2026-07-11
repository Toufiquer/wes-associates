'use client';

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
    <footer className="w-full bg-[#0a0a0a] text-gray-400 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl">{settings.brandName}</h3>
            <p className="leading-relaxed text-sm">
              {settings.tagline}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">{settings.destinationsTitle}</h4>
            <ul className="space-y-2 text-sm">
              {settings.destinationsLinks.map(item => (
                <li key={item.id}>
                  {item.link !== '#' ? (
                    <a href={item.link} className="hover:text-red-500 transition-colors cursor-pointer block">{item.title}</a>
                  ) : (
                    <span className="hover:text-red-500 transition-colors cursor-pointer block">{item.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">{settings.servicesTitle}</h4>
            <ul className="space-y-2 text-sm">
              {settings.servicesLinks.map(item => (
                <li key={item.id}>
                  {item.link !== '#' ? (
                    <a href={item.link} className="hover:text-red-500 transition-colors cursor-pointer block">{item.title}</a>
                  ) : (
                    <span className="hover:text-red-500 transition-colors cursor-pointer block">{item.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">{settings.contactTitle}</h4>
            <div className="text-sm space-y-2">
              <p>{settings.contactEmail}</p>
              <p>{settings.contactPhone}</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>{settings.copyrightText}</p>
          <p>{settings.bottomRightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default QueryFooter4;
