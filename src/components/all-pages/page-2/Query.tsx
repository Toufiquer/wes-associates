import { ArrowRight, CheckCircle2, Quote, Rocket, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';

import { defaultDataPage2, ISection2Data, Section2Props } from './data';

const parseData = (data: ISection2Data | string | undefined) => {
  if (!data) return defaultDataPage2;
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data) as ISection2Data;
  } catch {
    return defaultDataPage2;
  }
};

const sectionIcons = [Users, Target, Sparkles, Rocket, ShieldCheck];

const QueryPage2 = ({ data }: Section2Props) => {
  const pageData = parseData(data);
  const highlightedSections = pageData.sections?.slice(0, 3) ?? [];
  const timelineSections = pageData.sections?.slice(3) ?? [];

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_86%_8%,rgba(16,185,129,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8fafc_72%,#ffffff_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full border border-sky-200/80 bg-white/50 shadow-[0_0_90px_rgba(14,165,233,0.25)] page2-float" />
        <div className="pointer-events-none absolute -right-20 top-40 h-56 w-56 rounded-full bg-emerald-100/70 blur-3xl page2-drift" />
        <div className="pointer-events-none absolute -left-24 bottom-8 h-60 w-60 rounded-full bg-cyan-100/80 blur-3xl page2-drift-slow" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="page2-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-lg shadow-sky-100">
              <Sparkles className="h-4 w-4" />
              {pageData.eyebrow}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {pageData.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{pageData.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-sky-200 transition duration-300 hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-200">
                {pageData.primaryAction}
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-slate-100 transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-700">
                {pageData.secondaryAction}
              </button>
            </div>
          </div>

          <div className="relative page2-rise-delayed">
            <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-200 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white bg-white/90 p-5 shadow-2xl shadow-slate-200 backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-600 via-cyan-500 to-emerald-500 p-6 text-white shadow-inner shadow-white/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-sky-200">{pageData.pageName}</p>
                    <h2 className="mt-2 text-2xl font-black">Built around trust, clarity, and delivery.</h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-600 page2-pulse">
                    <Quote className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {highlightedSections.map((section, index) => {
                    const Icon = sectionIcons[index] ?? CheckCircle2;

                    return (
                      <div
                        key={`${section.title}-${index}`}
                        className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                      >
                        <Icon className="h-5 w-5 text-cyan-200" />
                        <p className="mt-4 text-xs font-bold uppercase text-cyan-100">{section.eyebrow}</p>
                        <h3 className="mt-1 text-lg font-black text-white">{section.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {highlightedSections.map((section, index) => {
              const Icon = sectionIcons[index] ?? CheckCircle2;

              return (
                <article
                  key={`${section.title}-feature-${index}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100 transition duration-500 hover:-translate-y-2 hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-100 page2-card"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition duration-300 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase text-sky-600">{section.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">{section.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{section.description}</p>
                  {section.items && section.items.length > 0 && (
                    <div className="mt-6 grid gap-3">
                      {section.items.map((item, itemIndex) => (
                        <div key={`${item}-${itemIndex}`} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {timelineSections.length > 0 && (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {timelineSections.map((section, index) => {
                const Icon = sectionIcons[index + highlightedSections.length] ?? CheckCircle2;

                return (
                  <article
                    key={`${section.title}-timeline-${index}`}
                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50/70 to-emerald-50/70 p-6 shadow-xl shadow-slate-100 page2-card"
                    style={{ animationDelay: `${(index + highlightedSections.length) * 120}ms` }}
                  >
                    <div className="absolute right-0 top-0 h-28 w-28 translate-x-8 -translate-y-8 rounded-full bg-sky-200/50 blur-2xl" />
                    <div className="relative flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-sky-700">{section.eyebrow}</p>
                        <h2 className="mt-2 text-2xl font-black text-slate-950">{section.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{section.description}</p>
                        {section.items && section.items.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {section.items.map((item, itemIndex) => (
                              <span
                                key={`${item}-${itemIndex}`}
                                className="rounded-full border border-white bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-600 via-cyan-500 to-emerald-500 p-6 text-white shadow-2xl shadow-sky-200 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold text-cyan-200">{pageData.pageName}</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Ready for a clearer digital partner?</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Start with a focused conversation and turn the strongest parts of your story into a page customers remember.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-cyan-100">
                {pageData.primaryAction}
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </button>
              <button className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:text-cyan-100">
                {pageData.secondaryAction}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes page2Rise {
          from {
            opacity: 0;
            transform: translateY(26px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes page2Float {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
          }
          50% {
            transform: translate(-50%, 18px) scale(1.04);
          }
        }

        @keyframes page2Drift {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(18px, -22px, 0);
          }
        }

        @keyframes page2Pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.3);
          }
          50% {
            box-shadow: 0 0 0 14px rgba(14, 165, 233, 0);
          }
        }

        .page2-rise {
          animation: page2Rise 700ms ease-out both;
        }

        .page2-rise-delayed {
          animation: page2Rise 850ms ease-out 120ms both;
        }

        .page2-card {
          animation: page2Rise 650ms ease-out both;
        }

        .page2-float {
          animation: page2Float 8s ease-in-out infinite;
        }

        .page2-drift {
          animation: page2Drift 9s ease-in-out infinite;
        }

        .page2-drift-slow {
          animation: page2Drift 12s ease-in-out infinite reverse;
        }

        .page2-pulse {
          animation: page2Pulse 2.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .page2-rise,
          .page2-rise-delayed,
          .page2-card,
          .page2-float,
          .page2-drift,
          .page2-drift-slow,
          .page2-pulse {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
};

export default QueryPage2;
