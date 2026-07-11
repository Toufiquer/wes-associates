/*
|-----------------------------------------
| setting up CartLink for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface CartLinkConfig {
  menuTextColor: string;
  cartIconIsPublished?: boolean;
  cartIconBorderIsVisible?: boolean;
  cartIconPath?: string;
  cartIconBackgroundTransparent?: boolean;
  cartIconBackgroundColor?: string;
  cartIconTextColor?: string;
}

interface CartLinkProps {
  config: CartLinkConfig;
  quantity: number;
  compact?: boolean;
  onNavigate?: () => void;
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

const formatCartQuantity = (quantity: number) => {
  if (quantity > 99) return '99+';
  return String(quantity);
};

const CartQuantityBadge = ({ quantity, className = '' }: { quantity: number; className?: string }) => {
  if (quantity <= 0) return null;
  return (
    <span
      className={`absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black leading-none text-white ${className}`}
    >
      {formatCartQuantity(quantity)}
    </span>
  );
};

const CartLink = ({ config, quantity, compact = false, onNavigate }: CartLinkProps) => {
  if (config.cartIconIsPublished === false) return null;
  const isBorderVisible = config.cartIconBorderIsVisible !== false;
  const iconBackgroundColor = config.cartIconBackgroundTransparent ? 'transparent' : config.cartIconBackgroundColor || parseColorToRgba(config.menuTextColor, 5);
  const iconTextColor = config.cartIconTextColor || config.menuTextColor;

  return (
    <Link href={config.cartIconPath || '/cart'} onClick={onNavigate}>
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center gap-2 rounded-full font-bold border transition-all cursor-pointer ${
          compact ? 'w-full rounded-2xl px-4 py-4' : 'px-5 py-3 text-sm'
        }`}
        style={{
          borderColor: isBorderVisible ? parseColorToRgba(iconTextColor, 30) : 'transparent',
          color: iconTextColor,
          backgroundColor: iconBackgroundColor,
        }}
      >
        <span className="relative inline-flex">
          <ShoppingCart size={compact ? 22 : 18} />
          <CartQuantityBadge quantity={quantity} className="absolute -top-4 -right-4 opacity-90" />
        </span>
        {compact && <span>Cart</span>}
      </motion.button>
    </Link>
  );
};

export default CartLink;
