/*
|-----------------------------------------
| Animated appointment form for Section 61
|-----------------------------------------
*/

'use client';

import { type FormEvent, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarCheck2, Check, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

import { useSession } from '@/lib/auth-client';
import { trackApplicationSubmission } from '@/lib/fbp-and-gtm';
import { TIKTOK_PIXEL_CURRENCY, trackTikTokEvent } from '@/lib/tiktok-pixel';
import { useAddApplicationMutation } from '@/redux/features/application/applicationSlice';
import { defaultDataSection61, type ISection61Data, type Section61Props } from './data';

const getSectionData = (data?: ISection61Data | string): ISection61Data => {
  if (!data) return defaultDataSection61;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as Partial<ISection61Data>;
      return {
        ...defaultDataSection61,
        ...parsed,
        benefits: parsed.benefits || defaultDataSection61.benefits,
        countries: parsed.countries || defaultDataSection61.countries,
        proficiencyOptions: parsed.proficiencyOptions || defaultDataSection61.proficiencyOptions,
      };
    } catch {
      return defaultDataSection61;
    }
  }

  return {
    ...defaultDataSection61,
    ...data,
    benefits: data.benefits || defaultDataSection61.benefits,
    countries: data.countries || defaultDataSection61.countries,
    proficiencyOptions: data.proficiencyOptions || defaultDataSection61.proficiencyOptions,
  };
};

const QuerySection61 = ({ data }: Section61Props) => {
  const sectionData = getSectionData(data);
  const reduceMotion = useReducedMotion();
  const session = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [addApplication, { isLoading }] = useAddApplicationMutation();
  const inputClassName =
    'mt-2 w-full rounded-xl border bg-white px-3.5 py-3 text-sm font-semibold text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:ring-4';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session.data?.user) {
      toast.error('Please sign in before submitting');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const value = (field: string) => String(formData.get(field) || '').trim();
    const educationalBackground = value('education');
    const message = value('message');
    const otherCurriculum = [educationalBackground && `Educational background: ${educationalBackground}`, message && `Message: ${message}`]
      .filter(Boolean)
      .join('\n');

    const application = {
      fullName: value('studentName'),
      mobileWhatsApp: value('mobile'),
      age: '',
      fatherName: '',
      motherName: '',
      englishProficiency: value('proficiency'),
      englishScore: value('result'),
      otherCurriculum,
      selectedCountry: value('country'),
      selectedUniversity: '',
      selectedCourseName: '',
      documents: [],
    };

    try {
      const response = (await addApplication(application).unwrap()) as { data?: { _id?: string } };
      trackApplicationSubmission({
        applicationId: response.data?._id,
        selectedCountry: application.selectedCountry,
        selectedUniversity: application.selectedUniversity,
        selectedCourseName: application.selectedCourseName,
        documentCount: 0,
      });
      trackTikTokEvent('SubmitForm', {
        content_id: response.data?._id,
        content_type: 'application',
        content_name: 'Student Application',
        selected_country: application.selectedCountry || undefined,
        document_count: 0,
        value: 0,
        currency: TIKTOK_PIXEL_CURRENCY,
      });
      setSubmitted(true);
      toast.success('Application submitted successfully');
    } catch (error) {
      const result = error as { data?: { message?: string } };
      toast.error(result.data?.message || 'Application submission failed');
    }
  };

  return (
    <section id="appointment" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28" style={{ backgroundColor: sectionData.backgroundColor }}>
      <div
        className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
      />
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.18),transparent_60%)]" />

      <div className="mx-auto grid w-full max-w-[850px] gap-11 md:grid-cols-[0.85fr_1.15fr] md:items-center lg:gap-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -34 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: sectionData.accentColor }}>
            <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionData.accentColor }}>
            {sectionData.eyebrow}
          </p>
          <h2 className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-[0.96] tracking-[-0.05em]" style={{ color: sectionData.headingColor }}>
            {sectionData.title}
          </h2>
          <p className="mt-5 text-sm font-semibold leading-7" style={{ color: sectionData.textColor }}>
            {sectionData.description}
          </p>

          <ul className="mt-6 space-y-3">
            {sectionData.benefits.map((benefit, index) => (
              <motion.li
                key={`${benefit}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.2 + index * 0.08 }}
                className="flex items-start gap-3 text-sm font-bold"
                style={{ color: sectionData.textColor }}
              >
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white shadow-md"
                  style={{ backgroundColor: sectionData.accentColor }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {benefit}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          initial={reduceMotion ? false : { opacity: 0, y: 38, scale: 0.98 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          className="relative grid gap-4 overflow-hidden rounded-2xl border p-5 shadow-[0_28px_75px_-35px_rgba(15,23,42,0.5)] sm:grid-cols-2 sm:rounded-3xl sm:p-6"
          style={{ backgroundColor: sectionData.formColor, borderColor: sectionData.borderColor }}
        >
          <div
            className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full opacity-10 blur-2xl"
            style={{ backgroundColor: sectionData.accentColor }}
          />

          {submitted ? (
            <div className="relative py-10 text-center sm:col-span-2">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" aria-hidden="true" />
              <h3 className="mt-5 text-2xl font-black" style={{ color: sectionData.headingColor }}>
                Application received
              </h3>
              <p className="mt-3 text-sm font-semibold leading-6" style={{ color: sectionData.textColor }}>
                Track and update it from My Application in your dashboard.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl px-5 py-3 text-xs font-black text-white"
                style={{ backgroundColor: sectionData.accentColor }}
              >
                Submit another
              </button>
            </div>
          ) : (
            <>
              {!session.isPending && !session.data?.user && (
                <div className="relative rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-xs font-bold text-amber-800 sm:col-span-2">
                  You must sign in before submitting this application.
                </div>
              )}

              <label className="relative text-xs font-black" style={{ color: sectionData.headingColor }}>
                {sectionData.studentNameLabel}
                <input
                  required
                  name="studentName"
                  autoComplete="name"
                  className={inputClassName}
                  style={{ borderColor: sectionData.borderColor, '--tw-ring-color': `${sectionData.accentColor}22` } as React.CSSProperties}
                  placeholder={sectionData.studentNamePlaceholder}
                />
              </label>
              <label className="relative text-xs font-black" style={{ color: sectionData.headingColor }}>
                {sectionData.mobileLabel}
                <input
                  required
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  className={inputClassName}
                  style={{ borderColor: sectionData.borderColor, '--tw-ring-color': `${sectionData.accentColor}22` } as React.CSSProperties}
                  placeholder={sectionData.mobilePlaceholder}
                />
              </label>
              <label className="relative text-xs font-black" style={{ color: sectionData.headingColor }}>
                {sectionData.countryLabel}
                <select
                  name="country"
                  defaultValue=""
                  className={inputClassName}
                  style={{ borderColor: sectionData.borderColor, '--tw-ring-color': `${sectionData.accentColor}22` } as React.CSSProperties}
                >
                  <option value="" disabled>
                    {sectionData.countryPlaceholder}
                  </option>
                  {sectionData.countries.map((country, index) => (
                    <option key={`${country}-${index}`} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </label>
              <label className="relative text-xs font-black" style={{ color: sectionData.headingColor }}>
                {sectionData.proficiencyLabel}
                <select
                  name="proficiency"
                  defaultValue=""
                  className={inputClassName}
                  style={{ borderColor: sectionData.borderColor, '--tw-ring-color': `${sectionData.accentColor}22` } as React.CSSProperties}
                >
                  <option value="" disabled>
                    {sectionData.proficiencyPlaceholder}
                  </option>
                  {sectionData.proficiencyOptions.map((option, index) => (
                    <option key={`${option}-${index}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="relative text-xs font-black" style={{ color: sectionData.headingColor }}>
                {sectionData.resultLabel}
                <input
                  name="result"
                  className={inputClassName}
                  style={{ borderColor: sectionData.borderColor, '--tw-ring-color': `${sectionData.accentColor}22` } as React.CSSProperties}
                  placeholder={sectionData.resultPlaceholder}
                />
              </label>
              <label className="relative text-xs font-black" style={{ color: sectionData.headingColor }}>
                {sectionData.educationLabel}
                <input
                  name="education"
                  className={inputClassName}
                  style={{ borderColor: sectionData.borderColor, '--tw-ring-color': `${sectionData.accentColor}22` } as React.CSSProperties}
                  placeholder={sectionData.educationPlaceholder}
                />
              </label>
              <label className="relative text-xs font-black sm:col-span-2" style={{ color: sectionData.headingColor }}>
                {sectionData.messageLabel}
                <textarea
                  name="message"
                  rows={4}
                  className={`${inputClassName} resize-none`}
                  style={{ borderColor: sectionData.borderColor, '--tw-ring-color': `${sectionData.accentColor}22` } as React.CSSProperties}
                  placeholder={sectionData.messagePlaceholder}
                />
              </label>
              <motion.button
                type="submit"
                disabled={isLoading || !session.data?.user}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-5 text-xs font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
                style={{ backgroundColor: sectionData.accentColor }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                )}
                {isLoading ? 'Submitting...' : sectionData.buttonText}
              </motion.button>
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default QuerySection61;
