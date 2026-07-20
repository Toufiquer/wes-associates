/*
|-----------------------------------------
| setting up PrimaryMenu for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import {
  ChevronDown,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Noto_Sans } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

import { iconMap } from '@/components/all-icons/all-icons-jsx';

type BrandFontSize = 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono' | 'font-noto-sans';

const notoSans = Noto_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export interface PrimaryMenuConfig {
  brandName: string;
  logoUrl: string | null;
  logoIsPublished?: boolean;
  logoDesktopOffsetX?: number;
  logoDesktopOffsetY?: number;
  logoMobileOffsetX?: number;
  logoMobileOffsetY?: number;
  textColor: string;
  fontSize: BrandFontSize;
  fontFamily: BrandFontFamily;
  menuTextColor: string;
  menuFontSize: BrandFontSize;
  menuFontFamily: BrandFontFamily;
  desktopMenuFontSize?: BrandFontSize;
  desktopMenuFontFamily?: BrandFontFamily;
  menuBackgroundColor: string;
}

export interface PrimaryMenuItem {
  id: number;
  name: string;
  path: string;
  iconName?: string;
  imagePath?: string;
  isImagePublish?: boolean;
  isIconPublish?: boolean;
  _id?: string;
  children?: PrimaryMenuItem[];
}

interface PrimaryMenuProps {
  config: PrimaryMenuConfig;
  items: PrimaryMenuItem[];
  pathname: string | null;
}

const IconMapper = ({ name, className, color }: { name?: string; className?: string; color?: string }) => {
  const IconComponent = (name && iconMap[name]) || iconMap.HelpCircle;
  return <IconComponent className={className} style={{ color }} />;
};

const DesktopMenuItem = ({
  item,
  isActive,
  depth = 0,
  config,
}: {
  item: PrimaryMenuItem;
  isActive: (path: string) => boolean;
  depth?: number;
  config: PrimaryMenuConfig;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const active = isActive(item.path);
  const isRoot = depth === 0;
  const isExpanded = Boolean(hasChildren && (isHovered || isOpen));
  const desktopFontSize = config.desktopMenuFontSize || 'text-base';
  const desktopFontFamily = config.desktopMenuFontFamily || 'font-noto-sans';
  const desktopFontFamilyClass = desktopFontFamily === 'font-noto-sans' ? notoSans.className : desktopFontFamily;

  return (
    <div
      className={`${isRoot ? 'relative' : 'relative w-full'} z-50 flex h-full items-center`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={event => {
        if (event.key === 'Escape') setIsOpen(false);
      }}
    >
      <Link
        href={item.path}
        aria-haspopup={hasChildren ? 'menu' : undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
        onClick={event => {
          if (!hasChildren) return;
          event.preventDefault();
          setIsOpen(current => !current);
        }}
        className={`
          group flex items-center gap-2 px-2 py-2 transition-all duration-300 rounded-full lg:px-5
          ${desktopFontSize} ${desktopFontFamilyClass}
          ${depth === 1 && 'h-auto min-h-[84px] w-full justify-between rounded-xl px-5 py-4 text-slate-950 hover:bg-slate-100'}
          ${depth > 1 && 'h-auto w-full justify-between rounded-lg px-4 py-3 text-slate-950 hover:bg-slate-100'}
          ${active ? ' underline ' : ''}
        `}
        style={{ color: isRoot ? (active ? config.textColor : config.menuTextColor) : '#0f172a' }}
      >
        <div className="flex items-center gap-3">
          {item.imagePath && item.isImagePublish !== false && (
            <div className={`relative flex-shrink-0 overflow-hidden rounded-md ${isRoot ? 'h-5 w-8' : 'h-10 w-10'}`}>
              <Image src={item.imagePath} alt={item.name} fill className="object-cover" sizes="40px" />
            </div>
          )}
          {item.iconName && item.isIconPublish !== false && (
            <IconMapper
              name={item.iconName}
              className={isRoot ? 'h-4 w-4' : 'h-7 w-7'}
              color={isRoot ? (active ? config.textColor : config.menuTextColor) : '#475569'}
            />
          )}
          <span className="relative z-10 whitespace-nowrap font-semibold">{item.name}</span>
        </div>

        {hasChildren &&
          (isRoot ? (
            <ChevronDown size={14} style={{ color: config.menuTextColor }} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronRight size={14} className="text-slate-500" />
          ))}
      </Link>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, x: isRoot ? '-50%' : 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, x: isRoot ? '-50%' : 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: isRoot ? '-50%' : 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'circOut' }}
            className={`absolute w-max max-w-[calc(100vw-2rem)] border bg-white shadow-[0_20px_50px_rgba(15,23,42,0.2)] ${
              isRoot ? 'rounded-sm border-slate-200 p-1' : 'rounded-xl border-slate-200 p-1'
            }`}
            role="menu"
            style={{
              top: isRoot ? '100%' : '0',
              left: isRoot ? '50%' : '100%',
              marginTop: '0',
              marginLeft: '0',
            }}
          >
            {isRoot && (
              <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />
            )}
            <div className={`relative z-10 ${isRoot ? 'grid grid-cols-2 gap-4 lg:grid-cols-3' : 'flex flex-col gap-2'}`}>
              {item.children?.map(child => (
                <DesktopMenuItem key={child._id || child.id} item={child} isActive={isActive} depth={depth + 1} config={config} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PrimaryMenu = ({ config, items, pathname }: PrimaryMenuProps) => {
  const shouldShowLogo = config.logoIsPublished !== false;
  const mobileLogoOffsetStyle: React.CSSProperties = {
    marginLeft: `${config.logoMobileOffsetX || 0}px`,
    marginTop: `${config.logoMobileOffsetY || 0}px`,
  };
  const desktopLogoOffsetStyle: React.CSSProperties = {
    marginLeft: `${config.logoDesktopOffsetX || 0}px`,
    marginTop: `${config.logoDesktopOffsetY || 0}px`,
  };

  const renderLogoMark = (style: React.CSSProperties, className: string) =>
    shouldShowLogo && config.logoUrl ? (
      <div className={`relative h-10 w-auto transition-transform duration-300 group-hover:scale-105 lg:h-12 ${className}`} style={style}>
        <Image src={config.logoUrl} alt={config.brandName} width={160} height={50} className="h-full w-auto object-contain" priority />
      </div>
    ) : shouldShowLogo ? (
      <div
        className={`relative rounded-2xl p-2.5 shadow-xl transition-transform group-hover:rotate-6 ${className}`}
        style={{ ...style, backgroundColor: config.textColor }}
      >
        <GraduationCap style={{ color: config.menuBackgroundColor }} className="h-6 w-6 lg:h-8 lg:w-8" />
      </div>
    ) : null;

  return (
    <>
      <Link href="/" className="group z-50 flex items-center gap-4">
        {renderLogoMark(mobileLogoOffsetStyle, 'md:hidden')}
        {renderLogoMark(desktopLogoOffsetStyle, 'hidden md:block')}
        <span className={`${config.fontSize} ${config.fontFamily} font-black tracking-tight`} style={{ color: config.textColor }}>
          {config.brandName}
        </span>
      </Link>

      <div className="relative hidden h-full items-center gap-1 md:flex">
        {items.map(item => (
          <DesktopMenuItem key={item._id || item.id} item={item} isActive={path => pathname === path} config={config} />
        ))}
      </div>
    </>
  );
};

export default PrimaryMenu;
