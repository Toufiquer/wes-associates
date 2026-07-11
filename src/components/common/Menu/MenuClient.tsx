/*
|-----------------------------------------
| setting up MenuClient for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  X,
  Menu,
  Info,
  Phone,
  User,
  Users,
  Home,
  LogIn,
  Settings,
  LucideIcon,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useMemo, useRef } from 'react';

import { useSession } from '@/lib/auth-client';
import { ASSET_CART_UPDATED_EVENT, getAssetCart } from '@/lib/asset-cart';

import TopBanner, { TopBannerBrandConfig } from './TopBanner';
import CartLink from './CartLink';
import PrimaryMenu from './PrimaryMenu';
import MobileBottomMenu from './MobileBottomMenu';
import MobileMainMenu from './MobileMainMenu';
import SearchMenuButton from './SearchMenuButton';

type BrandFontSize = 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono';
type NavigationPosition = 'fixed' | 'sticky' | 'scroll';
type MenuButtonMode = 'auth' | 'contact' | 'account';
type MenuButtonRadius = 'none' | 'sm' | 'xl' | 'full';
type MenuButtonPadding = 'none' | 'sm' | 'xl' | '2xl';
type MobileMenuVariant = '4-icon' | '5-icon';
type MobileMenuViewStyle = 'grid' | 'flex';
type MobileMenuGridLayout = '2x2' | '2x3' | '3x2' | '3x3';

interface MobileMenuConfigItem {
  id: number;
  logo?: string;
  name: string;
  path: string;
}

interface MenuItem {
  id: number;
  name: string;
  path: string;
  iconName?: string;
  imagePath?: string;
  isImagePublish?: boolean;
  isIconPublish?: boolean;
  _id?: string;
  children?: MenuItem[];
}

interface BrandConfiguration extends TopBannerBrandConfig {
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
  backgroundTransparent: number;
  menuSticky: boolean;
  menuPosition?: NavigationPosition;
  menuButtonMode?: MenuButtonMode;
  menuButtonContactText?: string;
  menuButtonContactLink?: string;
  menuButtonBackgroundColor?: string;
  menuButtonTextColor?: string;
  menuButtonPaddingY?: MenuButtonPadding;
  menuButtonPaddingX?: MenuButtonPadding;
  menuButtonRadius?: MenuButtonRadius;
  menuButtonBackgroundTransparent?: boolean;
  topBannerPosition?: NavigationPosition;
  cartIconIsPublished?: boolean;
  cartIconBorderIsVisible?: boolean;
  cartIconPath?: string;
  cartIconBackgroundTransparent?: boolean;
  cartIconBackgroundColor?: string;
  cartIconTextColor?: string;
  searchIconIsPublished?: boolean;
  searchIconBorderIsVisible?: boolean;
  searchIconPlaceholder?: string;
  searchIconBackgroundTransparent?: boolean;
  searchIconBackgroundColor?: string;
  searchIconTextColor?: string;
  searchPanelBackgroundColor?: string;
  searchPanelTextColor?: string;
  mobileMenuIsPublished?: boolean;
  mobileMenuVariant?: MobileMenuVariant;
  mobileMenuViewStyle?: MobileMenuViewStyle;
  mobileMenuGridLayout?: MobileMenuGridLayout;
  mobileMainMenuItems?: MobileMenuConfigItem[];
  mobileMenuItems?: MobileMenuConfigItem[];
}

interface MenuClientProps {
  initialBrandConfig: BrandConfiguration;
  initialMenuItems: MenuItem[];
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

const MobileMenuItem = ({
  item,
  pathname,
  onNavigate,
  level = 0,
  config,
}: {
  item: MenuItem;
  pathname: string;
  onNavigate: () => void;
  level?: number;
  config: BrandConfiguration;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path;

  return (
    <div className="my-1">
      {hasChildren ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${config.menuFontSize} ${config.menuFontFamily}`}
          style={{
            paddingLeft: `${1 + level}rem`,
            color: config.menuTextColor,
            backgroundColor: isOpen ? parseColorToRgba(config.menuTextColor, 8) : 'transparent',
          }}
        >
          <div className="flex items-center gap-3">
            {item.imagePath && item.isImagePublish && (
              <div className="relative w-10 h-6 rounded overflow-hidden flex-shrink-0">
                <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
              </div>
            )}
            {item.iconName && item.isIconPublish && <IconMapper name={item.iconName} className="w-5 h-5" color={config.menuTextColor} />}
            <span className="font-semibold">{item.name}</span>
          </div>
          <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <Link href={item.path} onClick={onNavigate}>
          <div
            className={`flex items-center gap-3 px-4 py-4 my-1 rounded-2xl transition-all ${config.menuFontSize} ${config.menuFontFamily} ${isActive ? ' underline ' : ''}`}
            style={{
              paddingLeft: `${1 + level}rem`,
              // color: isActive ? config.textColor : config.menuTextColor,
              // backgroundColor: isActive ? parseColorToRgba(config.textColor, 12) : 'transparent',
            }}
          >
            {item.imagePath && item.isImagePublish && (
              <div className="relative w-10 h-6 rounded overflow-hidden flex-shrink-0">
                <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
              </div>
            )}
            {item.iconName && item.isIconPublish && (
              <IconMapper name={item.iconName} className="w-5 h-5" color={isActive ? config.textColor : config.menuTextColor} />
            )}
            <span className="font-semibold">{item.name}</span>
          </div>
        </Link>
      )}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="py-1 flex flex-col">
              {item.children?.map(child => (
                <MobileMenuItem key={child._id || child.id} item={child} pathname={pathname} onNavigate={onNavigate} level={level + 0.5} config={config} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MENU_SEARCH_STORAGE_KEY = 'menu-search-query';
const MENU_SEARCH_UPDATED_EVENT = 'menu-search-updated';

const getCartQuantity = () => getAssetCart().reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);

const getStoredSearchQuery = () => {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(MENU_SEARCH_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

const setStoredSearchQuery = (query: string) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MENU_SEARCH_STORAGE_KEY, query);
    window.dispatchEvent(new Event(MENU_SEARCH_UPDATED_EVENT));
  } catch {
    // Ignore localStorage failures so the menu remains usable in restricted browsers.
  }
};

const menuButtonRadiusClass: Record<MenuButtonRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const menuButtonPaddingYValues: Record<MenuButtonPadding, string> = {
  none: '0px',
  sm: '8px',
  xl: '12px',
  '2xl': '16px',
};

const menuButtonPaddingXValues: Record<MenuButtonPadding, string> = {
  none: '0px',
  sm: '16px',
  xl: '28px',
  '2xl': '40px',
};

const MenuActionButton = ({
  config,
  isLoggedIn,
  compact = false,
  onNavigate,
}: {
  config: BrandConfiguration;
  isLoggedIn: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}) => {
  const isContactMode = config.menuButtonMode === 'contact';
  const isAccountMode = config.menuButtonMode === 'account';
  const href = isAccountMode ? '/account' : isContactMode ? config.menuButtonContactLink || '/contact' : isLoggedIn ? '/dashboard' : '/login';
  const label = isAccountMode ? 'Account' : isContactMode ? config.menuButtonContactText || 'Contact Me' : isLoggedIn ? 'Dashboard' : 'Login';
  const Icon = isAccountMode ? User : isContactMode ? Phone : isLoggedIn ? LayoutDashboard : LogIn;
  const textColor = config.menuButtonTextColor || config.menuBackgroundColor;
  const backgroundColor = config.menuButtonBackgroundTransparent ? 'transparent' : config.menuButtonBackgroundColor || config.textColor;
  const radiusClass = menuButtonRadiusClass[config.menuButtonRadius || 'full'];
  const borderColor = config.menuButtonBackgroundTransparent ? textColor : 'transparent';

  return (
    <Link href={href} onClick={onNavigate}>
      <motion.button
        whileHover={{ scale: 1.05, y: compact ? 0 : -2 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center gap-2 border text-sm font-bold shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] transition-all ${
          compact ? `w-full ${radiusClass}` : radiusClass
        }`}
        style={{
          paddingBlock: menuButtonPaddingYValues[config.menuButtonPaddingY || 'xl'],
          paddingInline: menuButtonPaddingXValues[config.menuButtonPaddingX || '2xl'],
          color: textColor,
          backgroundColor,
          borderColor,
        }}
      >
        <Icon size={compact ? 22 : 18} />
        {label}
      </motion.button>
    </Link>
  );
};

const MenuClient: React.FC<MenuClientProps> = ({ initialBrandConfig, initialMenuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandConfig, setBrandConfig] = useState<BrandConfiguration>(initialBrandConfig);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [topBannerHeight, setTopBannerHeight] = useState(0);
  const topBannerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const session = useSession();
  const isLoggedIn = !!session?.data?.session;

  useEffect(() => {
    const fetchBrandSettings = async () => {
      try {
        const response = await fetch('/api/menu/primary-menu', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data) setBrandConfig(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Update fetch error', error);
      }
    };
    const handleUpdate = () => fetchBrandSettings();
    if (typeof window !== 'undefined') {
      window.addEventListener('brand-settings-updated', handleUpdate);
      fetchBrandSettings();
    }
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('brand-settings-updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const banner = topBannerRef.current;
    if (!banner || typeof ResizeObserver === 'undefined') return;

    const resizeObserver = new ResizeObserver(entries => {
      setTopBannerHeight(entries[0]?.target.getBoundingClientRect().height || 0);
    });
    resizeObserver.observe(banner);
    setTopBannerHeight(banner.getBoundingClientRect().height);

    return () => resizeObserver.disconnect();
  }, [brandConfig.topBannerIsPublished]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncCartQuantity = () => setCartQuantity(getCartQuantity());
    syncCartQuantity();

    window.addEventListener(ASSET_CART_UPDATED_EVENT, syncCartQuantity);
    window.addEventListener('storage', syncCartQuantity);

    return () => {
      window.removeEventListener(ASSET_CART_UPDATED_EVENT, syncCartQuantity);
      window.removeEventListener('storage', syncCartQuantity);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncSearchQuery = () => setSearchQuery(getStoredSearchQuery());
    syncSearchQuery();

    window.addEventListener(MENU_SEARCH_UPDATED_EVENT, syncSearchQuery);
    window.addEventListener('storage', syncSearchQuery);

    return () => {
      window.removeEventListener(MENU_SEARCH_UPDATED_EVENT, syncSearchQuery);
      window.removeEventListener('storage', syncSearchQuery);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProductQuantity = async () => {
      try {
        const response = await fetch('/api/products/v1?limit=1&status=active', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && typeof data?.data?.total === 'number') setProductQuantity(data.data.total);
      } catch (error) {
        console.error('Product quantity fetch error', error);
      }
    };

    fetchProductQuantity();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    setStoredSearchQuery(value);
  };

  const resolvePosition = (position: NavigationPosition | undefined, fallback: NavigationPosition): NavigationPosition => {
    if (position === 'fixed' || position === 'sticky' || position === 'scroll') return position;
    return fallback;
  };

  const menuPosition = resolvePosition(brandConfig.menuPosition, brandConfig.menuSticky ? 'fixed' : 'sticky');
  const topBannerPosition = resolvePosition(brandConfig.topBannerPosition, 'scroll');
  const menuCssPosition = menuPosition === 'scroll' ? 'relative' : menuPosition;
  const topBannerCssPosition = topBannerPosition === 'scroll' ? 'relative' : topBannerPosition;
  const shouldOffsetMenu = brandConfig.topBannerIsPublished !== false && topBannerPosition !== 'scroll' && menuPosition !== 'scroll';
  const shouldRenderCustomMobileMenu = brandConfig.mobileMenuIsPublished === true;

  const topBannerStyles = useMemo<React.CSSProperties>(
    () => ({
      position: topBannerCssPosition,
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 110,
    }),
    [topBannerCssPosition],
  );

  const navStyles = useMemo(() => {
    const bgColor = parseColorToRgba(brandConfig.menuBackgroundColor, brandConfig.backgroundTransparent);
    return {
      backgroundColor: bgColor,
      position: menuCssPosition,
      top: shouldOffsetMenu ? topBannerHeight : 0,
      backdropFilter: brandConfig.backgroundTransparent < 100 ? 'blur(24px)' : 'none',
      borderBottom: `1px solid ${parseColorToRgba(brandConfig.menuTextColor, 15)}`,
      boxShadow: `0 10px 40px -10px ${parseColorToRgba(brandConfig.menuBackgroundColor, 30)}`,
    } satisfies React.CSSProperties;
  }, [brandConfig, menuCssPosition, shouldOffsetMenu, topBannerHeight]);

  return (
    <>
      <div ref={topBannerRef} style={topBannerStyles}>
        <TopBanner config={brandConfig} />
      </div>
      <nav style={navStyles} className="left-0 w-full z-[100] transition-all duration-500 ease-in-out">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <PrimaryMenu config={brandConfig} items={initialMenuItems} pathname={pathname} />

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-1">
                <SearchMenuButton
                  config={brandConfig}
                  productQuantity={productQuantity}
                  searchQuery={searchQuery}
                  isOpen={isSearchOpen}
                  onToggle={() => setIsSearchOpen(prev => !prev)}
                  onClose={() => setIsSearchOpen(false)}
                  onQueryChange={handleSearchQueryChange}
                />
                <CartLink config={brandConfig} quantity={cartQuantity} />
                <MenuActionButton config={brandConfig} isLoggedIn={isLoggedIn} />
              </div>
              <div className="lg:hidden">
                <SearchMenuButton
                  config={brandConfig}
                  productQuantity={productQuantity}
                  searchQuery={searchQuery}
                  isOpen={isSearchOpen}
                  onToggle={() => {
                    setIsOpen(false);
                    setIsSearchOpen(prev => !prev);
                  }}
                  onClose={() => setIsSearchOpen(false)}
                  onQueryChange={handleSearchQueryChange}
                />
              </div>
              <button
                className="lg:hidden p-3 rounded-2xl transition-all active:scale-90"
                style={{ color: brandConfig.menuTextColor, backgroundColor: parseColorToRgba(brandConfig.menuTextColor, 12) }}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden border-t"
              style={{ backgroundColor: brandConfig.menuBackgroundColor, borderColor: parseColorToRgba(brandConfig.menuTextColor, 10) }}
            >
              <div className="flex flex-col p-6 space-y-2 max-h-[85vh] overflow-y-auto custom-scrollbar">
                {shouldRenderCustomMobileMenu ? (
                  <MobileMainMenu config={brandConfig} pathname={pathname || '/'} onNavigate={() => setIsOpen(false)} />
                ) : (
                  initialMenuItems.map(item => (
                    <MobileMenuItem key={item._id || item.id} item={item} pathname={pathname || '/'} onNavigate={() => setIsOpen(false)} config={brandConfig} />
                  ))
                )}
                <div className="pt-8 pb-4 space-y-4">
                  <MenuActionButton config={brandConfig} isLoggedIn={isLoggedIn} compact onNavigate={() => setIsOpen(false)} />
                  {brandConfig.menuButtonMode === 'auth' && !isLoggedIn && (
                    <>
                      <p className="text-center text-sm mt-6 text-black">
                        Don&apos;t have an account?{' '}
                        <motion.a href="/registration" whileHover={{ scale: 1.05 }} className="text-blue-600 hover:underline font-semibold transition-colors">
                          Sign Up
                        </motion.a>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <MobileBottomMenu config={brandConfig} pathname={pathname || '/'} cartQuantity={cartQuantity} />
    </>
  );
};

export default MenuClient;
