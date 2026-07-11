/*
|-----------------------------------------
| setting up SearchMenuButton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import { X, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface SearchMenuButtonConfig {
  menuTextColor: string;
  menuBackgroundColor: string;
  searchIconIsPublished?: boolean;
  searchIconBorderIsVisible?: boolean;
  searchIconPlaceholder?: string;
  searchIconBackgroundTransparent?: boolean;
  searchIconBackgroundColor?: string;
  searchIconTextColor?: string;
  searchPanelBackgroundColor?: string;
  searchPanelTextColor?: string;
}

interface SearchMenuButtonProps {
  config: SearchMenuButtonConfig;
  productQuantity: number;
  searchQuery: string;
  isOpen: boolean;
  compact?: boolean;
  onToggle: () => void;
  onClose: () => void;
  onQueryChange: (value: string) => void;
}

interface SearchProductItem {
  _id?: string;
  title?: string;
  real_price?: number;
  discount_price?: number;
  primary_images?: {
    url?: string;
    name?: string;
  };
}

interface ProductsSearchResponse {
  data?: {
    products?: SearchProductItem[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

const SEARCH_PAGE_SIZE = 10;

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

const getTemplateTitleUrl = (title?: string) => {
  const slug = String(title || '')
    .trim()
    .replace(/\s+/g, '-');

  return slug ? `/template?title=${encodeURIComponent(slug)}` : '#';
};

const SearchMenuButton = ({ config, searchQuery, isOpen, compact = false, onToggle, onClose, onQueryChange }: SearchMenuButtonProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<SearchProductItem[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (wrapperRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const isBorderVisible = config.searchIconBorderIsVisible !== false;
  const placeholder = config.searchIconPlaceholder || 'Search products...';
  const iconBackgroundColor = config.searchIconBackgroundTransparent
    ? 'transparent'
    : config.searchIconBackgroundColor || parseColorToRgba(config.menuTextColor, 5);
  const iconTextColor = config.searchIconTextColor || config.menuTextColor;
  const panelBackgroundColor = config.searchPanelBackgroundColor || config.menuBackgroundColor;
  const panelTextColor = config.searchPanelTextColor || config.menuTextColor;
  const hasSearchTerm = searchQuery.trim().length >= 3;
  const totalPages = Math.max(1, Math.ceil(totalProducts / SEARCH_PAGE_SIZE));
  const hasPagination = totalProducts > SEARCH_PAGE_SIZE;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen || !hasSearchTerm) {
      setProducts([]);
      setTotalProducts(0);
      setSearchError('');
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsSearching(true);
      setSearchError('');

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(SEARCH_PAGE_SIZE),
          q: searchQuery.trim(),
          status: 'active',
        });
        const response = await fetch(`/api/products/v1?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Search request failed');

        const result = (await response.json()) as ProductsSearchResponse;
        if (!isMounted) return;

        setProducts(result.data?.products || []);
        setTotalProducts(result.data?.total || 0);
      } catch {
        if (!isMounted || controller.signal.aborted) return;
        setProducts([]);
        setTotalProducts(0);
        setSearchError('Products could not be loaded.');
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [hasSearchTerm, isOpen, page, searchQuery]);

  const paginationLabel = useMemo(() => `Page ${page} of ${totalPages}`, [page, totalPages]);

  if (config.searchIconIsPublished === false) return null;

  return (
    <div ref={wrapperRef} className={`relative ${compact ? 'w-full' : ''} md:-mr-6`}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05, y: compact ? 0 : -2 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center gap-0 border font-bold transition-all cursor-pointer ${
          compact ? 'w-full rounded-2xl px-4 py-4' : 'h-12 w-12 rounded-full'
        }`}
        style={{
          borderColor: isBorderVisible ? parseColorToRgba(iconTextColor, 30) : 'transparent',
          color: iconTextColor,
          backgroundColor: iconBackgroundColor,
        }}
        aria-label="Open product search"
        onClick={onToggle}
      >
        <span className="relative inline-flex">
          <SearchIcon size={compact ? 22 : 18} />
        </span>
        {compact && <span>Search</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`z-[140] mt-3 rounded-2xl border p-4 shadow-[0_20px_60px_rgba(15,23,42,0.28)] ${
              compact
                ? 'relative w-full'
                : 'fixed left-0 right-0 top-16 mx-auto w-screen max-w-none rounded-none lg:absolute lg:left-auto lg:right-0 lg:top-full lg:w-[min(90vw,380px)] lg:rounded-2xl'
            }`}
            style={{
              backgroundColor: panelBackgroundColor,
              borderColor: parseColorToRgba(panelTextColor, 20),
              color: panelTextColor,
            }}
          >
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <input
                value={searchQuery}
                onChange={event => onQueryChange(event.target.value)}
                placeholder={placeholder}
                className="h-11 w-full rounded-xl border bg-transparent pl-10 pr-12 text-sm font-semibold outline-none transition-all placeholder:opacity-55"
                style={{ borderColor: parseColorToRgba(panelTextColor, 20), color: panelTextColor }}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border transition-all hover:scale-105"
                  style={{
                    borderColor: parseColorToRgba(panelTextColor, 18),
                    color: panelTextColor,
                    backgroundColor: parseColorToRgba(panelTextColor, 8),
                  }}
                  aria-label="Clear product search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {hasSearchTerm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 max-h-[min(70vh,520px)] overflow-hidden rounded-xl border p-3 text-sm"
                  style={{ borderColor: parseColorToRgba(panelTextColor, 16), backgroundColor: parseColorToRgba(panelTextColor, 6) }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold">Products</div>
                    <div className="text-xs font-semibold opacity-70">{totalProducts} found</div>
                  </div>

                  <div className="mt-3 max-h-[340px] space-y-2 overflow-y-auto pr-1">
                    {isSearching && (
                      <div
                        className="rounded-lg border px-3 py-4 text-center text-xs font-semibold opacity-75"
                        style={{ borderColor: parseColorToRgba(panelTextColor, 16) }}
                      >
                        Loading products...
                      </div>
                    )}

                    {!isSearching && searchError && (
                      <div
                        className="rounded-lg border px-3 py-4 text-center text-xs font-semibold text-red-500"
                        style={{ borderColor: parseColorToRgba(panelTextColor, 16) }}
                      >
                        {searchError}
                      </div>
                    )}

                    {!isSearching && !searchError && products.length === 0 && (
                      <div
                        className="rounded-lg border px-3 py-4 text-center text-xs font-semibold opacity-75"
                        style={{ borderColor: parseColorToRgba(panelTextColor, 16) }}
                      >
                        No products found.
                      </div>
                    )}

                    {!isSearching &&
                      !searchError &&
                      products.map(product => (
                        <Link
                          key={product._id || product.title}
                          href={getTemplateTitleUrl(product.title)}
                          onClick={onClose}
                          className="grid grid-cols-[44px_1fr] items-center gap-3 rounded-xl border p-2 transition-all hover:scale-[1.01]"
                          style={{
                            borderColor: parseColorToRgba(panelTextColor, 14),
                            backgroundColor: parseColorToRgba(panelTextColor, 7),
                            color: panelTextColor,
                          }}
                        >
                          <div className="relative h-11 w-11 overflow-hidden rounded-lg border" style={{ borderColor: parseColorToRgba(panelTextColor, 12) }}>
                            {product.primary_images?.url ? (
                              <Image
                                src={product.primary_images.url}
                                alt={product.primary_images.name || product.title || 'Product'}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-black opacity-60">P</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-black">{product.title || 'Untitled product'}</div>
                            <div className="mt-0.5 text-xs font-semibold opacity-70">
                              ৳{Number(product.discount_price || product.real_price || 0).toLocaleString('en-US')}
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>

                  {hasPagination && (
                    <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: parseColorToRgba(panelTextColor, 14) }}>
                      <button
                        type="button"
                        disabled={page <= 1 || isSearching}
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        className="rounded-lg border px-3 py-2 text-xs font-black transition-all disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ borderColor: parseColorToRgba(panelTextColor, 18), backgroundColor: parseColorToRgba(panelTextColor, 8) }}
                      >
                        Prev
                      </button>
                      <span className="text-xs font-bold opacity-80">{paginationLabel}</span>
                      <button
                        type="button"
                        disabled={page >= totalPages || isSearching}
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        className="rounded-lg border px-3 py-2 text-xs font-black transition-all disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ borderColor: parseColorToRgba(panelTextColor, 18), backgroundColor: parseColorToRgba(panelTextColor, 8) }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchMenuButton;
