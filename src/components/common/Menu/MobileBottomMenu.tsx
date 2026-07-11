/*
|-----------------------------------------
| setting up MobileBottomMenu for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { Home, Phone, LogIn, LucideIcon, HelpCircle, ShoppingCart, FolderKanban } from 'lucide-react';

import { iconMap } from '@/components/all-icons/all-icons-jsx';

type MobileMenuVariant = '4-icon' | '5-icon';

interface MobileMenuConfigItem {
  id: number;
  logo?: string;
  name: string;
  path: string;
}

interface MobileBottomMenuConfig {
  cartIconIsPublished?: boolean;
  cartIconPath?: string;
  mobileMenuVariant?: MobileMenuVariant;
  mobileMenuItems?: MobileMenuConfigItem[];
}

interface MobileBottomMenuProps {
  config: MobileBottomMenuConfig;
  pathname: string;
  cartQuantity: number;
}

const mobileMenuIconFallbacks: LucideIcon[] = [Home, FolderKanban, ShoppingCart, Phone, LogIn];

const formatCartQuantity = (quantity: number) => {
  if (quantity > 99) return '99+';
  return String(quantity);
};

const CartQuantityBadge = ({ quantity, className = '' }: { quantity: number; className?: string }) => {
  if (quantity <= 0) return null;
  return (
    <span
      className={`absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black leading-none text-white shadow-lg ring-2 ring-white/30 ${className}`}
    >
      {formatCartQuantity(quantity)}
    </span>
  );
};

const isCartMenuItem = (item: MobileMenuConfigItem, config: MobileBottomMenuConfig) => {
  const cartPath = config.cartIconPath || '/cart';
  return item.path === cartPath || item.path === '/cart' || item.name.toLowerCase() === 'cart';
};

const getMobileMenuItems = (config: MobileBottomMenuConfig) => {
  const fallbackItems: MobileMenuConfigItem[] =
    config.mobileMenuVariant === '5-icon'
      ? [
          { id: 1, logo: 'Home', name: 'Home', path: '/' },
          { id: 2, logo: 'FolderKanban', name: 'Assets', path: '/dashboard/assets/products' },
          { id: 3, logo: 'ShoppingCart', name: 'Cart', path: config.cartIconPath || '/cart' },
          { id: 4, logo: 'Phone', name: 'Contact', path: '/contact' },
          { id: 5, logo: 'LogIn', name: 'Login', path: '/login' },
        ]
      : [
          { id: 1, logo: 'Home', name: 'Home', path: '/' },
          { id: 2, logo: 'FolderKanban', name: 'Assets', path: '/dashboard/assets/products' },
          { id: 3, logo: 'ShoppingCart', name: 'Cart', path: config.cartIconPath || '/cart' },
          { id: 4, logo: 'LogIn', name: 'Login', path: '/login' },
        ];
  const limit = config.mobileMenuVariant === '5-icon' ? 5 : 4;
  return fallbackItems.slice(0, limit).map((fallback, index) => ({
    ...fallback,
    ...(config.mobileMenuItems?.[index] || {}),
  }));
};

const MobileMenuLogo = ({ item, fallbackIcon, className }: { item: MobileMenuConfigItem; fallbackIcon: LucideIcon; className: string }) => {
  const logo = item.logo?.trim();
  if (logo) {
    const Icon = iconMap[logo];
    if (Icon) return <Icon className={className} />;
    if (logo.startsWith('/') || /^https?:\/\//i.test(logo)) {
      return (
        <span
          role="img"
          aria-label={item.name}
          className={`${className} inline-block shrink-0 rounded-full bg-cover bg-center`}
          style={{ backgroundImage: `url("${logo}")` }}
        />
      );
    }
    return <span className="text-sm font-black uppercase">{logo.slice(0, 2)}</span>;
  }
  const Icon = fallbackIcon;
  return <Icon className={className} />;
};

const MobileBottomMenu = ({ config, pathname, cartQuantity }: MobileBottomMenuProps) => {
  if (pathname.toLowerCase().includes('dashboard')) return null;

  const columns = config.mobileMenuVariant === '5-icon' ? 5 : 4;
  const displayItems = getMobileMenuItems(config);
  const items = displayItems.filter(item => config.cartIconIsPublished !== false || !isCartMenuItem(item, config));
  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[130] block px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 lg:hidden">
      <div
        className={`mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-2 text-slate-700 shadow-[0_-10px_30px_rgba(15,23,42,0.16)] ${
          config.mobileMenuVariant === '5-icon' ? 'py-[5px]' : 'py-2'
        }`}
      >
        <div className="grid items-end gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {items.map((item, index) => {
            const fallbackIcon = mobileMenuIconFallbacks[index] || HelpCircle;
            const isActive = pathname === item.path;
            const isMiddleIcon = config.mobileMenuVariant === '5-icon' && index === 2;
            return (
              <Link key={`${item.id}-${item.path}`} href={item.path} className="group relative flex min-w-0 justify-center">
                <span
                  className={`flex min-w-0 items-center justify-center rounded-xl text-slate-700 transition-all group-hover:bg-slate-50 w-full flex-col px-1 py-2 ${
                    isActive ? 'bg-sky-50 text-sky-600' : ''
                  }`}
                >
                  <span
                    className={`relative inline-flex items-center justify-center ${
                      isMiddleIcon ? '-mt-5 h-12 w-12 rounded-full border border-slate-500/40 bg-white shadow-lg' : ''
                    }`}
                  >
                    <MobileMenuLogo item={item} fallbackIcon={fallbackIcon} className="h-5 w-5" />
                    {isCartMenuItem(item, config) && <CartQuantityBadge quantity={cartQuantity} className="h-4 min-w-4 px-1 text-[9px]" />}
                  </span>
                  <span className="mt-1 max-w-full truncate text-center text-[10px] uppercase font-normal">{item.name}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomMenu;
