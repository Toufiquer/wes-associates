'use client';

import { useEffect, useMemo, useState } from 'react';
import { Flag, Plus, Save, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { CountryItem, defaultDataPage9, IPage9Data, PAGE9_REGIONS, Region } from './data';

export interface Page9FormProps {
  data?: IPage9Data;
  onSubmit: (values: IPage9Data) => void;
}

const cloneData = (data: IPage9Data): IPage9Data => ({ ...data, countries: data.countries.map(country => ({ ...country })) });

const normalizeData = (data?: IPage9Data): IPage9Data => {
  if (!data || !Array.isArray(data.countries)) return cloneData(defaultDataPage9);
  return cloneData({
    ...defaultDataPage9,
    ...data,
    countries: data.countries.map((country, index) => ({
      id: country.id || `country-${index + 1}`,
      name: country.name || 'New Country',
      flag: country.flag || '🏳️',
      region: PAGE9_REGIONS.includes(country.region) ? country.region : 'Asia',
    })),
  });
};

const createCountry = (region: Region): CountryItem => ({
  id: `country-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: 'New Country',
  flag: '🏳️',
  region,
});

const MutationPage9 = ({ data, onSubmit }: Page9FormProps) => {
  const [formData, setFormData] = useState<IPage9Data>(() => normalizeData(data));
  const [activeRegion, setActiveRegion] = useState<Region>('Asia');
  const [countryQuery, setCountryQuery] = useState('');

  useEffect(() => {
    setFormData(normalizeData(data));
  }, [data]);

  const visibleCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase();
    return formData.countries.filter(country => country.region === activeRegion && (!query || country.name.toLowerCase().includes(query)));
  }, [activeRegion, countryQuery, formData.countries]);

  const updateField = (field: 'pageName' | 'searchPlaceholder' | 'viewAllLabel' | 'sectionTitlePrefix' | 'emptyMessage', value: string) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const updateCountry = (id: string, field: 'name' | 'flag' | 'region', value: string) => {
    setFormData(current => ({
      ...current,
      countries: current.countries.map(country => (country.id === id ? { ...country, [field]: value } as CountryItem : country)),
    }));
  };

  const removeCountry = (id: string) => {
    setFormData(current => ({ ...current, countries: current.countries.filter(country => country.id !== id) }));
  };

  const addCountry = () => {
    setFormData(current => ({ ...current, countries: [...current.countries, createCountry(activeRegion)] }));
    setCountryQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 p-6">
          <div className="rounded-lg bg-blue-500/10 p-2">
            <Flag className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Embassy Countries Page</h2>
            <p className="text-sm text-slate-400">Edit search text, region headings, flags, country names, and region assignments.</p>
          </div>
        </div>

        <section className="grid gap-4 border-b border-slate-800 p-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Page Name</Label>
            <Input value={formData.pageName} onChange={event => updateField('pageName', event.target.value)} className="border-slate-800 bg-slate-950" />
          </div>
          <div className="space-y-2">
            <Label>Search Placeholder</Label>
            <Input
              value={formData.searchPlaceholder}
              onChange={event => updateField('searchPlaceholder', event.target.value)}
              className="border-slate-800 bg-slate-950"
            />
          </div>
          <div className="space-y-2">
            <Label>View All Label</Label>
            <Input value={formData.viewAllLabel} onChange={event => updateField('viewAllLabel', event.target.value)} className="border-slate-800 bg-slate-950" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Region Heading Prefix</Label>
            <Input
              value={formData.sectionTitlePrefix}
              onChange={event => updateField('sectionTitlePrefix', event.target.value)}
              className="border-slate-800 bg-slate-950"
            />
          </div>
          <div className="space-y-2">
            <Label>Empty Result Message</Label>
            <Input value={formData.emptyMessage} onChange={event => updateField('emptyMessage', event.target.value)} className="border-slate-800 bg-slate-950" />
          </div>
        </section>

        <section className="space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white">Countries</h3>
              <p className="mt-1 text-xs text-slate-400">{formData.countries.length} countries across {PAGE9_REGIONS.length} regions.</p>
            </div>
            <Button type="button" onClick={addCountry} variant="outlineGlassy" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add to {activeRegion}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {PAGE9_REGIONS.map(region => {
              const count = formData.countries.filter(country => country.region === region).length;
              return (
                <Button
                  key={region}
                  type="button"
                  size="sm"
                  variant={activeRegion === region ? 'default' : 'outlineGlassy'}
                  onClick={() => { setActiveRegion(region); setCountryQuery(''); }}
                  className={activeRegion === region ? 'bg-blue-700 hover:bg-blue-600' : ''}
                >
                  {region} ({count})
                </Button>
              );
            })}
          </div>

          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={countryQuery}
              onChange={event => setCountryQuery(event.target.value)}
              placeholder={`Search ${activeRegion}`}
              className="border-slate-800 bg-slate-950 pl-9"
            />
          </div>

          <div className="grid gap-3">
            {visibleCountries.map(country => (
              <div key={country.id} className="grid items-end gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:grid-cols-[90px_1fr_180px_40px]">
                <div className="space-y-2">
                  <Label>Flag</Label>
                  <Input value={country.flag} onChange={event => updateCountry(country.id, 'flag', event.target.value)} className="border-slate-800 bg-slate-900 text-center text-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Country Name</Label>
                  <Input value={country.name} onChange={event => updateCountry(country.id, 'name', event.target.value)} className="border-slate-800 bg-slate-900" />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <select
                    value={country.region}
                    onChange={event => updateCountry(country.id, 'region', event.target.value)}
                    className="h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    {PAGE9_REGIONS.map(region => <option key={region}>{region}</option>)}
                  </select>
                </div>
                <Button type="button" onClick={() => removeCountry(country.id)} variant="outlineFire" size="sm" className="h-10 w-10 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {visibleCountries.length === 0 && <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">No countries found in this editor view.</p>}
        </section>

        <div className="flex justify-end border-t border-slate-800 bg-slate-900 p-6">
          <Button type="button" onClick={() => onSubmit(formData)} variant="outlineGlassy" size="sm">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationPage9;
