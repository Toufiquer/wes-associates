/*
|-----------------------------------------
| setting up FooterClient for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { AllFooter } from '@/components/all-footer/all-footer-index/all-footer';
import MobileNaviation from './MobileNaviation';

interface DisabledPath {
  path: string;
  isExcluded: boolean;
  _id?: string;
}

interface FooterData {
  templateKey: string;
  content: string;
}

interface FooterResponseItem {
  _id: string;
  name: string;
  isEnabled: boolean;
  disabledPaths: DisabledPath[];
  data?: FooterData;
}

interface FooterClientProps {
  initialFooter: FooterResponseItem | null;
}

const FooterClient: React.FC<FooterClientProps> = ({ initialFooter }) => {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  if (!initialFooter || !initialFooter.data) {
    return (
      <>
        <div className="w-full py-12 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center text-neutral-400">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle size={24} className="text-amber-500" />
            <p className="text-sm font-medium">Footer not configured</p>
          </div>
        </div>
        <MobileNaviation />
      </>
    );
  }

  const isPathDisabled = initialFooter.disabledPaths?.some(rule => rule.isExcluded && rule.path === pathname);

  if (isPathDisabled) {
    return <MobileNaviation />;
  }

  const { templateKey, content } = initialFooter.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TemplateConfig = (AllFooter as any)[templateKey];

  if (!TemplateConfig || !TemplateConfig.query) {
    return (
      <>
        <div className="w-full py-12 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center text-neutral-400">
          <p>
            Template <strong>{templateKey}</strong> not found.
          </p>
        </div>
        <MobileNaviation />
      </>
    );
  }

  const QueryComponent = TemplateConfig.query;

  return (
    <>
      <QueryComponent data={content} />
      <MobileNaviation />
    </>
  );
};

export default FooterClient;
