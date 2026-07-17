/*
|-----------------------------------------
| Live service-country query for Section 48
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Award, BookOpen, Building2, Clock, DollarSign, GraduationCap, Loader2, MapPin } from 'lucide-react';

import type { ISection48Data } from './data';

type ServiceCourse = ISection48Data['universitys'][number]['courses'][number] & {
  scholarship?: string;
  minimumRequirement?: string;
};

interface ServiceUniversity extends Omit<ISection48Data['universitys'][number], 'courses'> {
  courses: ServiceCourse[];
}

interface ServiceCountry extends Omit<ISection48Data, 'universitys'> {
  _id: string;
  universitys: ServiceUniversity[];
}

interface ServiceCountriesResponse {
  data?: {
    serviceCountries?: ServiceCountry[];
    total?: number;
    page?: number;
    limit?: number;
  };
  message?: string;
  status?: number;
}

const getApplyUrl = (params: string[] = []) => {
  const [country, city, university, subject] = params;
  const query = new URLSearchParams();

  if (country) query.set('country', country);
  if (city) query.set('City', city);
  if (university) query.set('University', university);
  if (subject) query.set('Subject', subject);

  return `/application?${query.toString()}`;
};

const fetchCountryPage = async (page: number) => {
  const response = await fetch(`/api/service/v1?page=${page}&limit=100`, { cache: 'no-store' });
  const payload = (await response.json()) as ServiceCountriesResponse;

  if (!response.ok) {
    throw new Error(payload.message || 'Unable to load study destinations');
  }

  return payload;
};

const QuerySection48 = () => {
  const [countries, setCountries] = useState<ServiceCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadCountries = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const firstPage = await fetchCountryPage(1);
        const firstCountries = firstPage.data?.serviceCountries || [];
        const total = firstPage.data?.total || firstCountries.length;
        const limit = firstPage.data?.limit || 100;
        const totalPages = Math.ceil(total / limit);

        const remainingPages =
          totalPages > 1 ? await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => fetchCountryPage(index + 2))) : [];

        const allCountries = [
          ...firstCountries,
          ...remainingPages.flatMap(payload => payload.data?.serviceCountries || []),
        ];

        if (isActive) setCountries(allCountries);
      } catch (error) {
        if (isActive) setLoadError(error instanceof Error ? error.message : 'Unable to load study destinations');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadCountries();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-12 text-slate-900 sm:py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 bg-gradient-to-b from-indigo-100/70 to-transparent" />
        <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-sm">
            <GraduationCap className="h-4 w-4" /> Study abroad opportunities
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-6xl">Explore our study destinations</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            Compare countries, cities, universities, courses, scholarships, and application requirements.
          </p>
        </header>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white/70">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-sm font-semibold text-slate-600">Loading destinations...</span>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">{loadError}</div>
        ) : countries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
            <Building2 className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-4 text-lg font-bold">No study destinations found</h3>
            <p className="mt-1 text-sm text-slate-500">Countries will appear here after they are added.</p>
          </div>
        ) : (
          <div className="space-y-10 lg:space-y-14">
            {countries.map(country => {
              const totalCourses = country.universitys.reduce((total, university) => total + university.courses.length, 0);
              const coverImage = country.universitys.find(university => university.image)?.image;

              return (
                <article key={country._id || country.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                  <div className="relative isolate min-h-64 overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-900 px-5 py-8 text-white sm:px-8 lg:min-h-72 lg:px-12">
                    {coverImage && <Image src={coverImage} alt="" fill unoptimized className="-z-20 object-cover opacity-35" />}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-indigo-900/35" />

                    <div className="flex min-h-48 flex-col justify-end">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">Study destination</p>
                      <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{country.country}</h3>
                      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                        {[
                          { label: 'Cities', value: country.city.length, icon: MapPin },
                          { label: 'Universities', value: country.universitys.length, icon: Building2 },
                          { label: 'Courses', value: totalCourses, icon: BookOpen },
                        ].map(({ label, value, icon: Icon }) => (
                          <div key={label} className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                            <Icon className="h-5 w-5 text-indigo-200" />
                            <div>
                              <p className="text-xl font-black">{value}</p>
                              <p className="text-xs text-white/65">{label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 p-4 sm:p-7 lg:p-10">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Available cities</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {country.city.map(city => (
                          <span key={city} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                            <MapPin className="h-3.5 w-3.5" /> {city}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5">
                      {country.universitys.map(university => (
                        <details key={university.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 open:bg-white open:shadow-lg">
                          <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:gap-4 sm:p-5">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white sm:h-16 sm:w-16">
                              {university.image ? (
                                <Image src={university.image} alt={university.name} fill unoptimized className="object-cover" />
                              ) : (
                                <Building2 className="absolute inset-0 m-auto h-6 w-6 text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-base font-black sm:text-xl">{university.name}</h4>
                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 sm:text-sm">
                                <MapPin className="h-3.5 w-3.5" /> {university.location}
                              </p>
                            </div>
                            <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-bold text-indigo-700 sm:px-2.5 sm:text-xs">
                              {university.courses.length} courses
                            </span>
                          </summary>

                          <div className="border-t border-slate-200 p-4 sm:p-5">
                            {university.description && <p className="mb-5 text-sm leading-6 text-slate-600">{university.description}</p>}
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                              {university.courses.map(course => (
                                <div key={course.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                                  <h5 className="text-lg font-black">{course.name}</h5>
                                  {course.description && <p className="mt-2 text-sm leading-6 text-slate-600">{course.description}</p>}

                                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                                    {course.duration && (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-slate-700">
                                        <Clock className="h-3.5 w-3.5" /> {course.duration}
                                      </span>
                                    )}
                                    {course.tutionFees && (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-emerald-700">
                                        <DollarSign className="h-3.5 w-3.5" /> {course.tutionFees}
                                      </span>
                                    )}
                                  </div>

                                  {course.degreeLevelInfo?.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                      {course.degreeLevelInfo.map(level => (
                                        <div key={level.id} className="flex flex-col gap-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                                          <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                                            <Award className="h-3.5 w-3.5" /> {level.degreeLevel}
                                          </span>
                                          <span className="text-slate-600">{level.duration} · {level.tutionFees}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {(course.scholarship || course.minimumRequirement) && (
                                    <div className="mt-4 space-y-2 text-xs">
                                      {course.scholarship && <p className="rounded-lg bg-emerald-50 p-3 text-emerald-800"><strong>Scholarship:</strong> {course.scholarship}</p>}
                                      {course.minimumRequirement && <p className="rounded-lg bg-amber-50 p-3 text-amber-800"><strong>Minimum requirement:</strong> {course.minimumRequirement}</p>}
                                    </div>
                                  )}

                                  <Link href={getApplyUrl(course.applyBtnParms)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600">
                                    Apply now <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default QuerySection48;
