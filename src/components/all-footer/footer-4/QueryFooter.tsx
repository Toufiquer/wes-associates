/*
|-----------------------------------------
| setting up QueryFooter for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useMemo } from 'react';
import { FaFacebookF, FaLink, FaWhatsapp, FaYoutube } from 'react-icons/fa';

import { defaultDataFooter2, IFooter2Data, SocialLink } from './data';

interface QueryFooterProps {
  data?: string;
}

const safeParseData = (data?: string): IFooter2Data => {
  if (!data) return defaultDataFooter2;
  try {
    const parsed = { ...defaultDataFooter2, ...JSON.parse(data) } as IFooter2Data;
    const parsedSocialLinks = parsed.socialLinks || [];

    return {
      ...parsed,
      socialLinks: defaultDataFooter2.socialLinks.map(defaultItem => {
        const savedItem = parsedSocialLinks.find(item => item.id === defaultItem.id || item.platform === defaultItem.platform);
        return { ...defaultItem, link: savedItem?.link ?? defaultItem.link };
      }),
    };
  } catch {
    return defaultDataFooter2;
  }
};

const getSocialIcon = (item: SocialLink) => {
  const key = `${item.platform} ${item.iconClass}`.toLowerCase();
  if (key.includes('facebook')) return <FaFacebookF size={15} />;
  if (key.includes('youtube')) return <FaYoutube size={17} />;
  if (key.includes('whatsapp')) return <FaWhatsapp size={17} />;
  return <FaLink size={15} />;
};

const QueryFooter2 = ({ data }: QueryFooterProps) => {
  const settings = useMemo(() => safeParseData(data), [data]);
  const visibleSocialLinks = useMemo(() => settings.socialLinks.filter(item => item.link?.trim()), [settings.socialLinks]);

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="border-b border-slate-800 px-4 py-6">
        <div className="mx-auto max-w-2xl text-center text-sm text-slate-400">
          {settings.promoText}
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <a href={settings.promoButtonLink} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700">
              {settings.promoButtonText}
            </a>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            {settings.featureBadges.map(item => (
              <span key={item.id} className="flex items-center gap-1">
                <i className={`${item.iconClass} text-green-400`} /> {item.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 mb-12 sm:px-6">
        <div className="mb-10 grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3 text-2xl font-black text-white">{settings.brandName}</div>
            <p className="text-sm leading-relaxed text-slate-400">{settings.tagline}</p>
            <div className="mt-4 flex gap-2.5">
              {visibleSocialLinks.map(item => (
                <a
                  key={item.id}
                  href={item.link}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform hover:scale-110"
                  style={{ backgroundColor: item.backgroundColor }}
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={item.platform}
                >
                  {getSocialIcon(item)}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="mb-4 text-sm font-bold text-white">{settings.menuTitle}</h4>
            <ul className="space-y-2.5 text-sm">
              {settings.menuLinks.map(item => (
                <li key={item.id}>
                  <a href={item.link} className="text-slate-400 transition-colors hover:text-white">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="mb-4 text-sm font-bold text-white">{settings.informationTitle}</h4>
            <ul className="space-y-2.5 text-sm">
              {settings.informationLinks.map(item => (
                <li key={item.id}>
                  <a href={item.link} className="text-slate-400 transition-colors hover:text-white">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5 mb-12">
          <p className="text-xs text-slate-500">{settings.copyrightText}</p>
          <div className="flex flex-wrap items-center md:items-end justify-center md:justify-end gap-1.5">
            {settings.paymentBadges.map(item => (
              <span key={item} className="rounded bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                {item}
              </span>
            ))}
          </div>
          {settings.showSupportBadge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-900 bg-green-950 px-3 py-1 text-xs font-semibold text-green-400">
              {settings.supportBadgeText}
            </span>
          )}
          {settings.showAskAiButton && (
            <a
              href={settings.askAiLink}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <i className="ti ti-robot text-sm" /> {settings.askAiText}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default QueryFooter2;
