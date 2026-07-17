'use client';

import Image from 'next/image';
import { ArrowLeft, BookOpen, Building2, Eye, Loader2, MapPin, Pencil, Plus, RefreshCcw, Search, Trash2, Globe } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import ErrorMessageComponent from '@/components/common/Error';
import LoadingComponent from '@/components/common/Loading/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useAddServiceCountryMutation,
  useDeleteServiceCountryMutation,
  useGetServiceCountriesQuery,
  useUpdateServiceCountryMutation,
} from '@/redux/features/service/serviceSlice';

import CountryEditor from './CountryEditor';
import MutationSection8 from './Mutation';
import ClientSection8 from './Query';
import type { ISection8Data } from './data';
import type { ServiceCountryData, ServiceCountryRecord } from './types';

interface ServiceResponse {
  data?: {
    serviceCountries?: ServiceCountryRecord[];
    total?: number;
  };
}

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

const createEmptyCountry = (): ServiceCountryData => ({
  id: createId('COUNTRY'),
  country: '',
  city: [],
  universitys: [],
});

const hydrateCountry = (country: ServiceCountryRecord): ServiceCountryRecord => ({
  ...country,
  city: country.city || [],
  universitys: (country.universitys || []).map(university => ({
    ...university,
    courses: (university.courses || []).map(course => ({
      ...course,
      scholarship: course.scholarship || '',
      minimumRequirement: course.minimumRequirement || '',
      degreeLevelInfo: course.degreeLevelInfo || [],
      applyBtnParms: course.applyBtnParms || [],
      applyBtnParmsDegreeLevel: course.applyBtnParmsDegreeLevel || [],
    })),
  })),
});

const totalCourses = (country: ServiceCountryData) => country.universitys.reduce((sum, university) => sum + university.courses.length, 0);

const errorMessage = (error: unknown, fallback: string) => {
  const value = error as { data?: { message?: string }; error?: string };
  return value?.data?.message || value?.error || fallback;
};

const toServiceCountryData = (value: ISection8Data): ServiceCountryData => ({
  id: value.id,
  country: value.country,
  city: value.city,
  universitys: value.universitys.map(university => ({
    ...university,
    courses: university.courses.map(course => ({
      ...course,
      scholarship: course.scholarship || '',
      minimumRequirement: course.minimumRequirement || '',
    })),
  })),
});

const ServicePage = () => {
  const [q, setQ] = useState('');
  const [editorMode, setEditorMode] = useState<'add' | 'edit' | null>(null);
  const [draft, setDraft] = useState<ServiceCountryData>(createEmptyCountry);
  const [selected, setSelected] = useState<ServiceCountryRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceCountryRecord | null>(null);

  const { data, isLoading, isError, isFetching, error, refetch } = useGetServiceCountriesQuery({ page: 1, limit: 100, q }) as {
    data?: ServiceResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    error?: unknown;
    refetch: () => Promise<unknown>;
  };
  const [addCountry, { isLoading: isAdding }] = useAddServiceCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] = useUpdateServiceCountryMutation();
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteServiceCountryMutation();

  const countries = useMemo(() => (data?.data?.serviceCountries || []).map(hydrateCountry), [data]);

  const openAdd = () => {
    setDraft(createEmptyCountry());
    setEditorMode('add');
  };

  const openEdit = (country: ServiceCountryRecord) => {
    setDraft(hydrateCountry(country));
    setEditorMode('edit');
  };

  const saveCountry = async (values: ServiceCountryData) => {
    if (!values.country.trim()) {
      toast.error('Country name is required');
      return;
    }
    try {
      if (editorMode === 'edit' && '_id' in draft) {
        await updateCountry({ mongoId: (draft as ServiceCountryRecord)._id, ...values }).unwrap();
        toast.success('Country updated successfully');
      } else {
        await addCountry({ id: values.id, country: values.country, city: [], universitys: [] }).unwrap();
        toast.success('Country added successfully');
      }
      setEditorMode(null);
    } catch (mutationError) {
      toast.error(errorMessage(mutationError, `Unable to ${editorMode === 'edit' ? 'update' : 'add'} country`));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteCountry(deleteTarget._id).unwrap();
      toast.success('Country deleted successfully');
      if (selected?._id === deleteTarget._id) setSelected(null);
      setDeleteTarget(null);
    } catch (mutationError) {
      toast.error(errorMessage(mutationError, 'Unable to delete country'));
    }
  };

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={errorMessage(error, 'Unable to load service countries')} />;

  if (editorMode) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="border-b border-white/10 bg-zinc-950/95 p-4 backdrop-blur">
          <Button type="button" variant="outlineGlassy" onClick={() => setEditorMode(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to destinations
          </Button>
        </div>
        <div>
          {editorMode === 'add' && (
            <CountryEditor
              key={`${editorMode}-${'_id' in draft ? draft._id : draft.id}`}
              initialValue={draft}
              mode={editorMode}
              isSaving={isAdding || isUpdating}
              onCancel={() => setEditorMode(null)}
              onSubmit={values => void saveCountry(values)}
            />
          )}
          {editorMode === 'edit' && <MutationSection8 data={draft} onSubmit={values => void saveCountry(toServiceCountryData(values))} />}
        </div>
      </main>
    );
  }

  if (selected) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white/95 p-4 backdrop-blur">
          <Button type="button" variant="outline" onClick={() => setSelected(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to destinations
          </Button>
        </div>
        <div>
          <ClientSection8 data={selected} />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto space-y-6 pb-12 text-white p-4">
      {/* Header Panel */}
      <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-6 md:flex-row md:items-center md:justify-between bg-linear-to-r from-white/5 via-white/10 to-transparent">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)] border border-indigo-500/20">
            <Globe className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl bg-clip-text text-transparent bg-linear-to-r from-white via-white to-white/70">
              Study Destinations
            </h1>
            <p className="mt-1 text-sm text-white/50 leading-relaxed">Manage countries, cities, universities, courses, scholarships, and entry requirements.</p>
          </div>
        </div>
        <Button variant="outlineGarden" className="w-full md:w-auto shadow-md" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Country
        </Button>
      </header>

      {/* Toolbar Panel */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={q}
            onChange={event => setQ(event.target.value)}
            placeholder="Search country, city, or university..."
            className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-xl h-10"
          />
        </div>
        <Button variant="outlineWater" onClick={() => void refetch()} disabled={isFetching} className="shrink-0 h-10">
          {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />} Reload
        </Button>
      </div>

      {/* Destinations Grid or Empty state */}
      {countries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="rounded-2xl bg-white/5 p-4 mb-4 border border-white/10">
            <Globe className="h-12 w-12 text-white/20" />
          </div>
          <h2 className="text-lg font-semibold">No countries found</h2>
          <p className="mt-1.5 text-sm text-white/40 max-w-sm leading-relaxed">
            Add your first destination with its cities, universities, and courses to get started.
          </p>
          <Button variant="outlineGarden" className="mt-6" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Country
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map(country => {
            const coverImage = country.universitys.find(university => university.image)?.image;
            return (
              <Card
                key={country._id}
                className="group overflow-hidden border-white/10 bg-white/5 text-white shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)]"
              >
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-indigo-700/40 via-sky-700/30 to-violet-700/40">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={country.country}
                      fill
                      unoptimized
                      className="object-cover transition duration-750 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-950/80 via-slate-900 to-sky-950/80 flex items-center justify-center opacity-65">
                      <Globe className="h-16 w-16 text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  <Badge className="absolute left-4 top-4 border border-white/10 bg-black/40 text-white/90 backdrop-blur font-mono text-[9px] tracking-wider px-2 py-0.5 rounded-full">
                    {country.id}
                  </Badge>
                  <h2 className="absolute bottom-4 left-4 right-4 truncate text-2xl font-bold tracking-tight text-white drop-shadow-md">{country.country}</h2>
                </div>
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Destination Overview</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-1 space-y-5">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      {
                        label: 'Cities',
                        value: country.city.length,
                        icon: MapPin,
                        color: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
                      },
                      {
                        label: 'Universities',
                        value: country.universitys.length,
                        icon: Building2,
                        color: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
                      },
                      {
                        label: 'Courses',
                        value: totalCourses(country),
                        icon: BookOpen,
                        color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
                      },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className={`rounded-xl border p-2.5 ${color} transition-all duration-300 group-hover:bg-white/5`}>
                        <Icon className="mx-auto h-4 w-4 mb-1" />
                        <p className="text-xl font-bold">{value}</p>
                        <p className="truncate text-[9px] uppercase tracking-wider text-white/40 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <Button size="sm" variant="outlineGlassy" onClick={() => setSelected(country)} className="w-full">
                      <Eye className="mr-1 h-3.5 w-3.5" /> View
                    </Button>
                    <Button size="sm" variant="outlineWater" onClick={() => openEdit(country)} className="w-full">
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="outlineFire" onClick={() => setDeleteTarget(country)} className="w-full">
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Country Confirm Modal */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="border-white/10 bg-zinc-950 text-white rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              Delete {deleteTarget?.country}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/50 text-sm leading-relaxed mt-2">
              This permanently removes the country and all of its cities, universities, and courses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2">
            <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-500 rounded-xl"
              disabled={isDeleting}
              onClick={event => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Delete Country
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default ServicePage;
