/*
|-----------------------------------------
| setting up PrimaryMenu for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import {
  Info,
  Menu,
  Phone,
  Users,
  Home,
  Settings,
  LucideIcon,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

type BrandFontSize = 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono';

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

const parseColorToRgba = (color: string, opacity: number) => {
  if (!color) return `rgba(15, 23, 42, ${opacity / 100})`;
  const alpha = opacity / 100;

  if (color.startsWith('rgba') || color.startsWith('rgb')) {
    const values = color.match(/\d+/g);
    if (values && values.length >= 3) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
    }
  }

  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
};

const IconMapper = ({ name, className, color }: { name?: string; className?: string; color?: string }) => {
  const iconMap: { [key: string]: LucideIcon } = {
    Info,
    FolderKanban,
    Menu,
    Phone,
    Settings,
    HelpCircle,
    Users,
    Home,
    ShoppingCart,
    LayoutDashboard,
  };
  const IconComponent = name ? iconMap[name] || HelpCircle : HelpCircle;
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
  const hasChildren = item.children && item.children.length > 0;
  const active = isActive(item.path);
  const isRoot = depth === 0;

  return (
    <div className="relative z-50 flex h-full items-center" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link
        href={item.path}
        className={`
          group flex items-center gap-2 px-5 py-2 transition-all duration-300 rounded-full
          ${config.menuFontSize} ${config.menuFontFamily}
          ${!isRoot && 'justify-between w-full rounded-xl h-auto px-4'}
          ${active ? ' underline ' : ''}
        `}
        style={
          {
            // color: active ? config.textColor : config.menuTextColor,
            // backgroundColor: isHovered ? parseColorToRgba(config.menuTextColor, 10) : 'transparent',
          }
        }
      >
        <div className="flex items-center gap-3">
          {item.imagePath && item.isImagePublish ? (
            <div className={`relative flex-shrink-0 overflow-hidden rounded-md ${isRoot ? 'h-5 w-8' : 'h-6 w-10'}`}>
              <Image src={item.imagePath} alt={item.name} fill className="object-cover" sizes="40px" />
            </div>
          ) : (
            item.iconName &&
            item.isIconPublish && <IconMapper name={item.iconName} className="h-4 w-4" color={active ? config.textColor : config.menuTextColor} />
          )}
          <span className="relative z-10 whitespace-nowrap font-semibold">{item.name}</span>
        </div>

        {hasChildren &&
          (isRoot ? (
            <ChevronDown size={14} style={{ color: config.menuTextColor }} className={`transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronRight size={14} style={{ color: config.menuTextColor }} />
          ))}
      </Link>

      <AnimatePresence>
        {isHovered && hasChildren && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'circOut' }}
            className="absolute min-w-[260px] rounded-2xl border p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl"
            style={{
              backgroundColor: parseColorToRgba(config.menuBackgroundColor, 98),
              borderColor: parseColorToRgba(config.menuTextColor, 15),
              top: isRoot ? '100%' : '0',
              left: isRoot ? '0' : '100%',
              marginTop: isRoot ? '0.75rem' : '0',
              marginLeft: isRoot ? '0' : '0.5rem',
            }}
          >
            <div className="relative z-10 flex flex-col gap-1">
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
        {renderLogoMark(mobileLogoOffsetStyle, 'lg:hidden')}
        {renderLogoMark(desktopLogoOffsetStyle, 'hidden lg:block')}
        <span className={`${config.fontSize} ${config.fontFamily} font-black tracking-tight`} style={{ color: config.textColor }}>
          {config.brandName}
        </span>
      </Link>

      <div className="hidden h-full items-center gap-2 lg:flex">
        {items.map(item => (
          <DesktopMenuItem key={item._id || item.id} item={item} isActive={path => pathname === path} config={config} />
        ))}
      </div>
    </>
  );
};

export default PrimaryMenu;
