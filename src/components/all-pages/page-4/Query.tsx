import { ArrowRight, CheckCircle2, Cookie, Database, FileCheck2, Fingerprint, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';

import { defaultDataPage4, ISection4Data, Section4Props } from './data';

const parseData = (data: ISection4Data | string | undefined) => {
  if (!data) return defaultDataPage4;
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data) as ISection4Data;
  } catch {
    return defaultDataPage4;
  }
};

const sectionIcons = [Database, Cookie, ShieldCheck, Fingerprint];

const QueryPage4 = ({ data }: Section4Props) => {
  const pageData = parseData(data);
  const sections = pageData.sections ?? [];
  const firstSection = sections[0];
  const policySections = sections.slice(1);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(245,158,11,0.16),transparent_27%),radial-gradient(circle_at_84%_16%,rgba(20,184,166,0.16),transparent_26%),linear-gradient(180deg,#ffffff_0%,#f8fafc_74%,#ffffff_100%)]" />
        <div className="pointer-events-none absolute -left-16 top-28 h-56 w-56 rounded-full bg-amber-100/80 blur-3xl page4-drift" />
        <div className="pointer-events-none absolute right-0 top-12 h-72 w-72 rounded-full bg-teal-100/80 blur-3xl page4-drift-slow" />
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full border border-amber-100 bg-white/70 shadow-[0_0_80px_rgba(245,158,11,0.24)] page4-float" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="page4-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-700 shadow-lg shadow-amber-100">
              <Sparkles className="h-4 w-4" />
              {pageData.eyebrow}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">{pageData.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{pageData.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-amber-200 transition duration-300 hover:-translate-y-1 hover:bg-teal-600 hover:shadow-teal-200">
                {pageData.primaryAction}
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-slate-100 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:text-amber-700">
                {pageData.secondaryAction}
              </button>
            </div>
          </div>

          <div className="relative page4-rise-delayed">
            <div className="absolute inset-5 rounded-[2rem] bg-gradient-to-br from-amber-200 via-orange-100 to-teal-100 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white bg-white/90 p-5 shadow-2xl shadow-slate-200 backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-500 via-orange-400 to-teal-500 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-amber-50">{pageData.pageName}</p>
                    <h2 className="mt-2 text-2xl font-black">Transparent handling from collection to request.</h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 page4-pulse">
                    <LockKeyhole className="h-6 w-6" />
                  </div>
                </div>

                {firstSection && (
                  <div className="mt-8 rounded-2xl border border-white/20 bg-white/14 p-5 backdrop-blur">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-amber-50">{firstSection.eyebrow}</p>
                        <h3 className="mt-1 text-xl font-black text-white">{firstSection.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-amber-50">{firstSection.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {firstSection && firstSection.items && firstSection.items.length > 0 && (
        <section className="px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
            {firstSection.items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white via-amber-50/70 to-white p-5 text-sm font-bold text-slate-700 shadow-xl shadow-amber-100/70 transition duration-500 hover:-translate-y-2 hover:border-amber-200 page4-card"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {policySections.map((section, index) => {
            const Icon = sectionIcons[index + 1] ?? CheckCircle2;

            return (
              <article
                key={`${section.title}-policy-${index}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100 transition duration-500 hover:-translate-y-2 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100 page4-card"
                style={{ animationDelay: `${(index + 1) * 120}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition duration-300 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-6 text-xs font-black uppercase text-teal-700">{section.eyebrow}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{section.description}</p>
                {section.items && section.items.length > 0 && (
                  <div className="mt-6 grid gap-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={`${item}-${itemIndex}`} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-6 shadow-2xl shadow-slate-100 sm:p-8 lg:p-10 page4-card">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-xl shadow-teal-200">
                <FileCheck2 className="h-7 w-7" />
              </div>
              <p className="mt-6 text-xs font-black uppercase text-amber-700">Policy Summary</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Simple rules, readable terms, and clear user control.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Each section keeps the language practical so visitors understand what is collected, why it is used, and how they can ask questions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {sections.map((section, index) => {
                const Icon = sectionIcons[index] ?? CheckCircle2;

                return (
                  <div key={`${section.title}-summary-${index}`} className="rounded-2xl border border-white bg-white/85 p-5 shadow-lg shadow-slate-100 transition duration-300 hover:-translate-y-1">
                    <Icon className="h-5 w-5 text-amber-600" />
                    <p className="mt-4 text-xs font-black uppercase text-slate-500">{section.eyebrow}</p>
                    <h3 className="mt-1 text-base font-black text-slate-950">{section.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-400 to-teal-500 p-6 text-white shadow-2xl shadow-amber-200 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold text-amber-50">{pageData.pageName}</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Need help with a privacy request?</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-amber-50">
                Keep the next step visible, friendly, and direct for visitors who need clarification or support.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-amber-700 transition duration-300 hover:-translate-y-1 hover:bg-amber-50">
                {pageData.primaryAction}
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </button>
              <button className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white/10">
                {pageData.secondaryAction}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes page4Rise {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes page4Float {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
          }
          50% {
            transform: translate(-50%, 16px) scale(1.05);
          }
        }

        @keyframes page4Drift {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(20px, -18px, 0);
          }
        }

        @keyframes page4Pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 0 14px rgba(255, 255, 255, 0);
          }
        }

        .page4-rise {
          animation: page4Rise 700ms ease-out both;
        }

        .page4-rise-delayed {
          animation: page4Rise 850ms ease-out 120ms both;
        }

        .page4-card {
          animation: page4Rise 650ms ease-out both;
        }

        .page4-float {
          animation: page4Float 8s ease-in-out infinite;
        }

        .page4-drift {
          animation: page4Drift 9s ease-in-out infinite;
        }

        .page4-drift-slow {
          animation: page4Drift 12s ease-in-out infinite reverse;
        }

        .page4-pulse {
          animation: page4Pulse 2.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .page4-rise,
          .page4-rise-delayed,
          .page4-card,
          .page4-float,
          .page4-drift,
          .page4-drift-slow,
          .page4-pulse {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
};

export default QueryPage4;
