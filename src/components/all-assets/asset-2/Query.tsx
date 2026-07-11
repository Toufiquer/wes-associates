'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { assetGridItemWidth, assetMobileGridItemWidth, AssetProps, defaultDataAsset2, IAssetData, TemplateItem } from './data';
import RenderItem from './RenderItem';

const mobileItemsPerSlide: Record<IAssetData['mobileGridLayout'], number> = {
  '1x1': 1,
  '1x2': 2,
};

const desktopItemsPerSlide: Record<IAssetData['gridLayout'], number> = {
  '1x1': 1,
  '1x2': 2,
  '1x3': 3,
};

const sortTemplates = (templates: TemplateItem[], sortMode: IAssetData['sortMode']) => {
  if (sortMode === 'custom') return templates;
  return [...templates].sort((a, b) => {
    const result = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
    return sortMode === 'ascending' ? result : -result;
  });
};

const resolveData = (data?: IAssetData | string): IAssetData => {
  if (!data) return defaultDataAsset2;

  try {
    const parsedData = typeof data === 'string' ? (JSON.parse(data) as Partial<IAssetData>) : data;
    const settings = {
      ...defaultDataAsset2,
      ...parsedData,
      title: parsedData.title || parsedData.sectionTitle || defaultDataAsset2.title,
      sortMode: parsedData.sortMode || defaultDataAsset2.sortMode,
      gridLayout: parsedData.gridLayout || defaultDataAsset2.gridLayout,
      mobileGridLayout: parsedData.mobileGridLayout || defaultDataAsset2.mobileGridLayout,
      showSeeMore: parsedData.showSeeMore ?? defaultDataAsset2.showSeeMore,
      showBottomNavigation: parsedData.showBottomNavigation ?? defaultDataAsset2.showBottomNavigation,
      seeMore: {
        ...defaultDataAsset2.seeMore,
        ...(parsedData.seeMore || {}),
        name: parsedData.seeMore?.name || parsedData.viewMoreText || defaultDataAsset2.seeMore.name,
      },
      templates: parsedData.templates?.length ? parsedData.templates : defaultDataAsset2.templates,
    };

    return {
      ...settings,
      templates: sortTemplates(settings.templates, settings.sortMode),
    };
  } catch {
    return defaultDataAsset2;
  }
};

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);

    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isDesktop;
};

const QueryAsset2 = ({ data }: AssetProps) => {
  const settings = useMemo(() => resolveData(data), [data]);
  const isDesktop = useIsDesktop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleItems = isDesktop
    ? desktopItemsPerSlide[settings.gridLayout] || desktopItemsPerSlide[defaultDataAsset2.gridLayout]
    : mobileItemsPerSlide[settings.mobileGridLayout] || mobileItemsPerSlide[defaultDataAsset2.mobileGridLayout];
  const maxIndex = Math.max(0, settings.templates.length - visibleItems);
  const canSlide = settings.templates.length > visibleItems;
  const shouldShowBottomNavigation = settings.showBottomNavigation && canSlide;
  const itemWidth = isDesktop
    ? assetGridItemWidth[settings.gridLayout] || assetGridItemWidth[defaultDataAsset2.gridLayout]
    : assetMobileGridItemWidth[settings.mobileGridLayout] || assetMobileGridItemWidth[defaultDataAsset2.mobileGridLayout];

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    setCurrentIndex(prev => Math.min(prev, maxIndex));
  }, [maxIndex, visibleItems]);

  useEffect(() => {
    if (!canSlide || isPaused) return;

    const interval = window.setInterval(nextSlide, 3500);
    return () => window.clearInterval(interval);
  }, [canSlide, isPaused, nextSlide]);

  if (settings.templates.length === 0) return null;

  return (
    <section className="bg-white px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-blue-600 md:text-3xl">{settings.title}</h2>
          {settings.showSeeMore && (
            <Link
              href={settings.seeMore.url || '#'}
              className="rounded-sm bg-blue-600 px-2 py-1 text-sm font-semibold text-white hover:underline md:rounded-lg md:px-6 md:py-2"
            >
              {settings.seeMore.name}
            </Link>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          {canSlide && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute -left-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border border-blue-100 bg-white/90 text-blue-600 shadow-lg shadow-blue-100/60 backdrop-blur-md transition-colors hover:bg-blue-50 md:-left-5 min-w-1"
              aria-label="Previous template"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="overflow-hidden">
            <div
              className="flex items-stretch transition-transform duration-500 ease-in-out will-change-transform"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
            >
              {settings.templates.map(template => (
                <div key={template.id} className={cn('flex min-w-0 shrink-0 px-2 py-1')} style={{ flexBasis: itemWidth, maxWidth: itemWidth }}>
                  <div className="flex h-full w-full min-w-0">
                    <RenderItem item={template} settings={settings} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {canSlide && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute -right-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border border-blue-100 bg-white/90 text-blue-600 shadow-lg shadow-blue-100/60 backdrop-blur-md transition-colors hover:bg-blue-50 md:-right-5 min-w-1"
              aria-label="Next template"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {shouldShowBottomNavigation && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => {
                const isActive = index === currentIndex;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'h-2.5 rounded-full border border-blue-200 transition-all duration-200',
                      isActive ? 'w-8 bg-blue-600 shadow-sm shadow-blue-200' : 'w-2.5 bg-white hover:bg-blue-100',
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QueryAsset2;
