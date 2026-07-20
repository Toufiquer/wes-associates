'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { CountryItem, defaultDataPage9, IPage9Data, PAGE9_REGIONS, Page9Props, Region } from './data';

const normalizeData = (value: unknown): IPage9Data => {
  if (!value || typeof value !== 'object') return defaultDataPage9;
  const data = value as Partial<IPage9Data>;
  if (!Array.isArray(data.countries)) return defaultDataPage9;

  return {
    ...defaultDataPage9,
    ...data,
    countries: data.countries.map((country, index) => ({
      id: country.id || `country-${index + 1}`,
      name: country.name || 'Unnamed Country',
      flag: country.flag || '🏳️',
      region: PAGE9_REGIONS.includes(country.region) ? country.region : 'Asia',
    })),
  };
};

const parseData = (data: Page9Props['data']): IPage9Data => {
  if (!data) return defaultDataPage9;
  if (typeof data !== 'string') return normalizeData(data);

  try {
    return normalizeData(JSON.parse(data));
  } catch {
    return defaultDataPage9;
  }
};

const RegionSection = ({
  region,
  countries,
  index,
  titlePrefix,
}: {
  region: Region;
  countries: CountryItem[];
  index: number;
  titlePrefix: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className="mb-16 last:mb-0"
  >
    <div className="mb-8 text-center">
      <span className="text-xs font-medium uppercase tracking-widest text-slate-400">{region}</span>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">
        {titlePrefix} <span className="text-blue-600">{region}</span>
      </h2>
    </div>
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {countries.map(country => (
        <div key={country.id} className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100">
          <span className="text-xl leading-none">{country.flag}</span>
          <span className="text-sm text-slate-700 transition-colors group-hover:text-blue-600">{country.name}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const QueryPage9 = ({ data }: Page9Props) => {
  const pageData = parseData(data);
  const [query, setQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<Region | 'All'>('All');

  const filteredByRegion = useMemo(
    () => (activeRegion === 'All' ? pageData.countries : pageData.countries.filter(country => country.region === activeRegion)),
    [activeRegion, pageData.countries],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return filteredByRegion;
    return filteredByRegion.filter(country => country.name.toLowerCase().includes(normalizedQuery));
  }, [filteredByRegion, query]);

  const groupedByRegion = useMemo(
    () =>
      PAGE9_REGIONS.map(region => ({
        region,
        countries: filtered.filter(country => country.region === region),
      })).filter(group => group.countries.length > 0),
    [filtered],
  );

  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={event => setQuery(event.target.value)} placeholder={pageData.searchPlaceholder} className="pl-9" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeRegion === 'All' ? 'default' : 'outline'}
            onClick={() => setActiveRegion('All')}
            className={cn(activeRegion === 'All' && 'bg-blue-700 hover:bg-blue-700/90')}
          >
            {pageData.viewAllLabel}
          </Button>
          {PAGE9_REGIONS.map(region => (
            <Button
              key={region}
              type="button"
              size="sm"
              variant={activeRegion === region ? 'default' : 'outline'}
              onClick={() => setActiveRegion(region)}
              className={cn(activeRegion === region && 'bg-blue-700 hover:bg-blue-700/90')}
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          {groupedByRegion.length > 0 ? (
            <motion.div
              key={`${activeRegion}-${query}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {groupedByRegion.map((group, index) => (
                <RegionSection
                  key={group.region}
                  region={group.region}
                  countries={group.countries}
                  index={index}
                  titlePrefix={pageData.sectionTitlePrefix}
                />
              ))}
            </motion.div>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center text-slate-400">
              {pageData.emptyMessage}{query.trim() ? <> &ldquo;{query}&rdquo;.</> : '.'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default QueryPage9;
