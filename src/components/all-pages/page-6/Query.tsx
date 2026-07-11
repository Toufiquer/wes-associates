import { ArrowRight, CheckCircle2, Clock3, HelpCircle, Mail, MapPin, PackageCheck, Route, Sparkles, Truck } from 'lucide-react';

import { defaultDataPage6, IPage6Data, Page6Props } from './data';

const parseData = (data: IPage6Data | string | undefined): IPage6Data => {
  if (!data) return defaultDataPage6;
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data) as IPage6Data;
  } catch {
    return defaultDataPage6;
  }
};

const renderBulletText = (item: string) => {
  const [label, ...detailParts] = item.split(':');
  const detail = detailParts.join(':').trim();

  if (!detail) return item;

  return (
    <>
      <strong>{label.trim()}:</strong> {detail}
    </>
  );
};

const sectionIcons = [MapPin, Clock3, Truck, Route];

const QueryPage6 = ({ data }: Page6Props) => {
  const pageData = parseData(data);
  const leadSection = pageData.sections[0];
  const detailSections = pageData.sections.slice(1);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(34,197,94,0.16),transparent_25%),linear-gradient(180deg,#ffffff_0%,#f0f9ff_58%,#ffffff_100%)]" />
        <div className="pointer-events-none absolute -left-16 top-28 h-56 w-56 rounded-full bg-blue-100/80 blur-3xl page6-drift" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-emerald-100/80 blur-3xl page6-drift-slow" />
        <div className="pointer-events-none absolute bottom-8 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full border border-sky-100 bg-white/70 shadow-[0_0_86px_rgba(59,130,246,0.24)] page6-float" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="page6-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-lg shadow-sky-100">
              <Sparkles className="h-4 w-4" />
              {pageData.pageName}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">{pageData.title}</h1>
            <p className="mt-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              {pageData.lastUpdatedLabel}
            </p>

            {leadSection && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {leadSection.description || 'Clear delivery details help customers understand shipping coverage, timing, tracking, and support before they order.'}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${pageData.supportEmail}`}
                className="group inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-sky-200 transition duration-300 hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-200"
              >
                Contact Support
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </a>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-slate-100 transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-700">
                <PackageCheck className="h-4 w-4" />
                Track Delivery
              </button>
            </div>
          </div>

          <div className="relative page6-rise-delayed">
            <div className="absolute inset-5 rounded-[2rem] bg-gradient-to-br from-sky-200 via-blue-100 to-emerald-100 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white bg-white/90 p-5 shadow-2xl shadow-slate-200 backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-600 via-blue-500 to-emerald-500 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-sky-50">Delivery Promise</p>
                    <h2 className="mt-2 text-2xl font-black">From checkout to doorstep, every step stays clear.</h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-600 page6-pulse">
                    <Truck className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {pageData.sections.slice(0, 4).map((section, index) => {
                    const Icon = sectionIcons[index] ?? CheckCircle2;

                    return (
                      <div key={`${section.title}-${index}`} className="group rounded-2xl border border-white/15 bg-white/12 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/18">
                        <Icon className="h-5 w-5 text-sky-100" />
                        <h3 className="mt-4 text-base font-black text-white">{section.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {leadSection && leadSection.items && leadSection.items.length > 0 && (
        <section className="px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
            {leadSection.items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/75 to-white p-5 text-sm font-bold text-slate-700 shadow-xl shadow-sky-100/80 transition duration-500 hover:-translate-y-2 hover:border-sky-200 page6-card"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-200">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {renderBulletText(item)}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {detailSections.map((section, index) => {
            const Icon = sectionIcons[index + 1] ?? CheckCircle2;

            return (
              <article
                key={`${section.title}-delivery-${index}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100 transition duration-500 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100 page6-card"
                style={{ animationDelay: `${(index + 1) * 120}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-2xl font-black text-slate-950">{section.title}</h2>
                {section.description && <p className="mt-4 text-sm leading-7 text-slate-600">{section.description}</p>}
                {!!section.items?.length && (
                  <div className="mt-6 grid gap-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={`${item}-${itemIndex}`} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                        <span>{renderBulletText(item)}</span>
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
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-2xl shadow-slate-100 sm:p-8 lg:p-10 page6-card">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-xl shadow-sky-200">
                <HelpCircle className="h-7 w-7" />
              </div>
              <p className="mt-6 text-xs font-black uppercase text-sky-700">Delivery Support</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">{pageData.helpTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{pageData.helpDescription}</p>
            </div>

            <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-xl shadow-slate-100">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">Support Email</p>
                  <a href={`mailto:${pageData.supportEmail}`} className="mt-2 block break-all text-2xl font-black text-sky-700 transition hover:text-emerald-600">
                    {pageData.supportEmail}
                  </a>
                  <p className="mt-4 text-sm leading-7 text-slate-600">Use this address for delivery updates, late arrivals, tracking questions, or address corrections.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes page6Rise {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes page6Float {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
          }
          50% {
            transform: translate(-50%, 16px) scale(1.05);
          }
        }

        @keyframes page6Drift {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(20px, -18px, 0);
          }
        }

        @keyframes page6Pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 0 14px rgba(255, 255, 255, 0);
          }
        }

        .page6-rise {
          animation: page6Rise 700ms ease-out both;
        }

        .page6-rise-delayed {
          animation: page6Rise 850ms ease-out 120ms both;
        }

        .page6-card {
          animation: page6Rise 650ms ease-out both;
        }

        .page6-float {
          animation: page6Float 8s ease-in-out infinite;
        }

        .page6-drift {
          animation: page6Drift 9s ease-in-out infinite;
        }

        .page6-drift-slow {
          animation: page6Drift 12s ease-in-out infinite reverse;
        }

        .page6-pulse {
          animation: page6Pulse 2.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .page6-rise,
          .page6-rise-delayed,
          .page6-card,
          .page6-float,
          .page6-drift,
          .page6-drift-slow,
          .page6-pulse {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
};

export default QueryPage6;
