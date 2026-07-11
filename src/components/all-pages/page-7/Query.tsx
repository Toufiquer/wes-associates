import { ArrowRight, CheckCircle2, ClipboardCheck, CreditCard, HelpCircle, Mail, PackageX, ReceiptText, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

import { defaultDataPage7, IPage7Data, Page7Props } from './data';

const parseData = (data: IPage7Data | string | undefined): IPage7Data => {
  if (!data) return defaultDataPage7;
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data) as IPage7Data;
  } catch {
    return defaultDataPage7;
  }
};

const sectionIcons = [ShieldCheck, ClipboardCheck, CreditCard, PackageX];

const QueryPage7 = ({ data }: Page7Props) => {
  const pageData = parseData(data);
  const leadSection = pageData.sections[0];
  const detailSections = pageData.sections.slice(1);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(239,68,68,0.13),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(249,115,22,0.15),transparent_25%),linear-gradient(180deg,#ffffff_0%,#fff7ed_56%,#ffffff_100%)]" />
        <div className="pointer-events-none absolute -left-16 top-28 h-56 w-56 rounded-full bg-red-100/80 blur-3xl page7-drift" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-orange-100/80 blur-3xl page7-drift-slow" />
        <div className="pointer-events-none absolute bottom-8 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full border border-red-100 bg-white/70 shadow-[0_0_86px_rgba(239,68,68,0.22)] page7-float" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="page7-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 shadow-lg shadow-red-100">
              <Sparkles className="h-4 w-4" />
              {pageData.pageName}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">{pageData.title}</h1>
            <p className="mt-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              {pageData.lastUpdatedLabel}
            </p>

            {leadSection && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {leadSection.description || 'A clear refund policy helps customers understand return eligibility, inspection steps, refund timing, and support options.'}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${pageData.supportEmail}`}
                className="group inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-red-200 transition duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:shadow-orange-200"
              >
                Contact Support
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </a>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-slate-100 transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:text-red-700">
                <ReceiptText className="h-4 w-4" />
                Return Checklist
              </button>
            </div>
          </div>

          <div className="relative page7-rise-delayed">
            <div className="absolute inset-5 rounded-[2rem] bg-gradient-to-br from-red-200 via-orange-100 to-amber-100 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white bg-white/90 p-5 shadow-2xl shadow-slate-200 backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-red-50">Refund Path</p>
                    <h2 className="mt-2 text-2xl font-black">Clear expectations from return request to final decision.</h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 page7-pulse">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {pageData.sections.slice(0, 4).map((section, index) => {
                    const Icon = sectionIcons[index] ?? CheckCircle2;

                    return (
                      <div key={`${section.title}-${index}`} className="group rounded-2xl border border-white/15 bg-white/12 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/18">
                        <Icon className="h-5 w-5 text-red-100" />
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
                className="rounded-3xl border border-red-100 bg-gradient-to-br from-white via-red-50/75 to-white p-5 text-sm font-bold text-slate-700 shadow-xl shadow-red-100/80 transition duration-500 hover:-translate-y-2 hover:border-red-200 page7-card"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200">
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
          {detailSections.map((section, index) => {
            const Icon = sectionIcons[index + 1] ?? CheckCircle2;

            return (
              <article
                key={`${section.title}-refund-${index}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100 transition duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100 page7-card"
                style={{ animationDelay: `${(index + 1) * 120}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition duration-300 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-2xl font-black text-slate-950">{section.title}</h2>
                {section.description && <p className={`mt-4 text-sm leading-7 text-slate-600 ${section.items?.length ? 'mb-5' : ''}`}>{section.description}</p>}
                {!!section.items?.length && (
                  <div className="grid gap-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={`${item}-${itemIndex}`} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
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
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 p-6 shadow-2xl shadow-slate-100 sm:p-8 lg:p-10 page7-card">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-200">
                <HelpCircle className="h-7 w-7" />
              </div>
              <p className="mt-6 text-xs font-black uppercase text-red-700">Refund Support</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">{pageData.contactTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{pageData.contactDescription}</p>
            </div>

            <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-xl shadow-slate-100">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">Support Email</p>
                  <a href={`mailto:${pageData.supportEmail}`} className="mt-2 block break-all text-2xl font-black text-red-700 transition hover:text-orange-600">
                    {pageData.supportEmail}
                  </a>
                  <p className="mt-4 text-sm leading-7 text-slate-600">Use this address for return questions, eligibility checks, refund timing, or proof-of-purchase help.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes page7Rise {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes page7Float {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
          }
          50% {
            transform: translate(-50%, 16px) scale(1.05);
          }
        }

        @keyframes page7Drift {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(20px, -18px, 0);
          }
        }

        @keyframes page7Pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 0 14px rgba(255, 255, 255, 0);
          }
        }

        .page7-rise {
          animation: page7Rise 700ms ease-out both;
        }

        .page7-rise-delayed {
          animation: page7Rise 850ms ease-out 120ms both;
        }

        .page7-card {
          animation: page7Rise 650ms ease-out both;
        }

        .page7-float {
          animation: page7Float 8s ease-in-out infinite;
        }

        .page7-drift {
          animation: page7Drift 9s ease-in-out infinite;
        }

        .page7-drift-slow {
          animation: page7Drift 12s ease-in-out infinite reverse;
        }

        .page7-pulse {
          animation: page7Pulse 2.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .page7-rise,
          .page7-rise-delayed,
          .page7-card,
          .page7-float,
          .page7-drift,
          .page7-drift-slow,
          .page7-pulse {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
};

export default QueryPage7;
