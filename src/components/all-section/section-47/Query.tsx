'use client';

import { ChevronLeft, ChevronRight, Heart, Laptop, Plug, ShoppingBasket, Sparkles, Wheat } from 'lucide-react';
import { useRef } from 'react';

import { CategoryIconKey, defaultDataSection47, ISection47Data, Section47Props } from './data';

const iconMap: Record<CategoryIconKey, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  wheat: Wheat,
  sparkles: Sparkles,
  laptop: Laptop,
  plug: Plug,
  heart: Heart,
};

const QuerySection47 = ({ data }: Section47Props) => {
  const settings: ISection47Data = { ...defaultDataSection47, ...data };
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative w-full bg-white px-3 py-1 sm:px-4 sm:py-2">
      <div className="relative mx-auto flex max-w-7xl items-center">
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Scroll categories left"
          className="absolute -left-2 z-10 rounded-full border border-gray-100 bg-white p-1.5 text-gray-600 shadow-lg transition-transform hover:scale-110 sm:-left-4 sm:p-2"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        <div ref={scrollRef} className="scrollbar-hide flex snap-x gap-3 overflow-x-auto px-1 py-2 sm:gap-6 sm:px-2 sm:py-4" style={{ scrollBehavior: 'smooth' }}>
          {settings.categories.map((cat, index) => {
            const Icon = iconMap[cat.icon] ?? ShoppingBasket;

            return (
              <div
                key={cat.id}
                className="group flex h-32 w-24 flex-shrink-0 snap-center cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-2 sm:h-48 sm:w-48 sm:gap-4 sm:rounded-3xl"
                style={{ backgroundColor: settings.cardBackgroundColor, transitionDelay: `${index * 25}ms` }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg shadow-blue-200 transition-colors sm:h-16 sm:w-16"
                  style={
                    {
                      backgroundColor: settings.iconBackgroundColor,
                      '--category-hover-bg': settings.iconHoverBackgroundColor,
                    } as React.CSSProperties
                  }
                >
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                </div>
                <span className="max-w-full px-1 text-center text-xs font-semibold text-gray-700 sm:text-base">{cat.name}</span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Scroll categories right"
          className="absolute -right-2 z-10 rounded-full border border-gray-100 bg-white p-1.5 text-gray-600 shadow-lg transition-transform hover:scale-110 sm:-right-4 sm:p-2"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .group:hover [style*='--category-hover-bg'] {
          background-color: var(--category-hover-bg) !important;
        }
      `}</style>
    </div>
  );
};

export default QuerySection47;

