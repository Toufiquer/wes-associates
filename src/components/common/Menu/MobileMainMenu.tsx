/*
|-----------------------------------------
| setting up MobileMainMenu for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { Home, Phone, User, Heart, Search, LucideIcon, HelpCircle, ShoppingCart, FolderKanban } from 'lucide-react';

import { iconMap } from '@/components/all-icons/all-icons-jsx';

type MobileMenuViewStyle = 'grid' | 'flex';
type MobileMenuGridLayout = '2x2' | '2x3' | '3x2' | '3x3';

interface MobileMainMenuConfigItem {
  id: number;
  logo?: string;
  name: string;
  path: string;
}

interface MobileMainMenuConfig {
  textColor: string;
  menuTextColor: string;
  mobileMenuViewStyle?: MobileMenuViewStyle;
  mobileMenuGridLayout?: MobileMenuGridLayout;
  mobileMainMenuItems?: MobileMainMenuConfigItem[];
}

interface MobileMainMenuProps {
  config: MobileMainMenuConfig;
  pathname: string;
  onNavigate: () => void;
}

const fallbackItems: MobileMainMenuConfigItem[] = [
  { id: 1, logo: 'Home', name: 'Home', path: '/' },
  { id: 2, logo: 'FolderKanban', name: 'Assets', path: '/dashboard/assets/products' },
  { id: 3, logo: 'ShoppingCart', name: 'Cart', path: '/cart' },
  { id: 4, logo: 'Search', name: 'Search', path: '/search' },
  { id: 5, logo: 'Heart', name: 'Wishlist', path: '/wishlist' },
  { id: 6, logo: 'User', name: 'Account', path: '/dashboard' },
  { id: 7, logo: 'Phone', name: 'Contact', path: '/contact' },
  { id: 8, logo: 'HelpCircle', name: 'Support', path: '/support' },
  { id: 9, logo: 'Info', name: 'About', path: '/about' },
];

const iconFallbacks: LucideIcon[] = [Home, FolderKanban, ShoppingCart, Search, Heart, User, Phone, HelpCircle, HelpCircle];

const getGridShape = (layout: MobileMenuGridLayout = '2x2') => {
  const [rows, columns] = layout.split('x').map(Number);
  return { rows: rows || 2, columns: columns || 2 };
};

const getMobileMainMenuItems = (config: MobileMainMenuConfig) => {
  const gridShape = getGridShape(config.mobileMenuGridLayout);
  const limit = gridShape.rows * gridShape.columns;
  return fallbackItems.slice(0, limit).map((fallback, index) => ({
    ...fallback,
    ...(config.mobileMainMenuItems?.[index] || {}),
  }));
};

const MobileMainMenuLogo = ({ item, fallbackIcon, className }: { item: MobileMainMenuConfigItem; fallbackIcon: LucideIcon; className: string }) => {
  const logo = item.logo?.trim();
  if (logo) {
    const Icon = iconMap[logo];
    if (Icon) return <Icon className={className} />;
  }
  const Icon = fallbackIcon;
  return <Icon className={className} />;
};

const MobileMainMenu = ({ config, pathname, onNavigate }: MobileMainMenuProps) => {
  const gridShape = getGridShape(config.mobileMenuGridLayout);
  const items = getMobileMainMenuItems(config);
  const isGrid = config.mobileMenuViewStyle !== 'flex';

  return (
    <div className={isGrid ? 'grid gap-3' : 'flex flex-col gap-2'} style={isGrid ? { gridTemplateColumns: `repeat(${gridShape.columns}, minmax(0, 1fr))` } : undefined}>
      {items.map((item, index) => {
        const isActive = pathname === item.path;
        const fallbackIcon = iconFallbacks[index] || HelpCircle;

        return (
          <Link key={`${item.id}-${index}`} href={item.path} onClick={onNavigate} className="min-w-0">
            <div
              className={`flex min-w-0 rounded-2xl border transition-all ${
                isGrid ? 'min-h-24 flex-col items-center justify-center gap-2 p-3 text-center' : 'items-center gap-3 px-4 py-4'
              }`}
              style={{
                color: isActive ? config.textColor : config.menuTextColor,
                borderColor: isActive ? config.textColor : 'rgba(255,255,255,0.12)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
              }}
            >
              <MobileMainMenuLogo item={item} fallbackIcon={fallbackIcon} className="h-5 w-5 shrink-0" />
              <span className="max-w-full truncate text-sm font-bold">{item.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileMainMenu;
