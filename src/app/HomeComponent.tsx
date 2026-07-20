'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Facebook, Linkedin, Menu, Plane, X, Youtube } from 'lucide-react';
import { useState } from 'react';

const navItems = ['Home', 'Countries', 'Services', 'Process', 'Scholarships', 'Blog', 'Contact'];

const stats = [
  ['12+', 'Popular study destinations'],
  ['100%', 'Transparent admission process'],
  ['1:1', 'Personalized counselling'],
  ['24h', 'Quick response for students'],
];

const reasons = [
  ['C', 'Expert counsellors', 'Get destination, university, and subject recommendations based on your profile and goals.'],
  ['P', 'Personalized guidance', 'Every student receives a practical application plan with clear next actions.'],
  ['T', 'Transparent process', 'Know your required documents, expected timeline, fees, and admission stages before you apply.'],
  ['S', 'Scholarship support', 'Find merit-based, country-wise, and university-funded scholarship opportunities.'],
  ['R', 'Fast response', 'Students receive quick follow-up for document checks, offers, and visa updates.'],
  ['L', 'Local to global', 'Support from Bangladesh with global admission options across top destinations.'],
];

const countries = [
  ['UK', 'United Kingdom', 'Fast degrees, strong academic reputation, and wide course choices.'],
  ['USA', 'United States', 'Flexible majors, research options, and global career exposure.'],
  ['CAN', 'Canada', 'Quality education, multicultural cities, and practical work pathways.'],
  ['AUS', 'Australia', 'Career-focused programs, welcoming campuses, and strong student support.'],
  ['EU', 'Europe', 'Affordable programs, English-taught courses, and cultural diversity.'],
  ['MY', 'Malaysia', 'Budget-friendly tuition with international branch campus options.'],
  ['CN', 'China', 'Scholarship-friendly programs in medicine, engineering, and business.'],
  ['SE', 'Sweden', 'Innovation-led education with strong research and sustainability programs.'],
];

const services = [
  ['01', 'Free consultation', 'Discuss academic background, target country, budget, English score, and career plans.'],
  ['02', 'Profile evaluation', 'Review SSC, HSC, diploma, bachelor, IELTS, PTE, MOI, or other eligibility factors.'],
  ['03', 'University selection', 'Shortlist universities that match your budget, subject, intake, and admission chances.'],
  ['04', 'Application support', 'Prepare forms, submit applications, and follow up with admission offices.'],
  ['05', 'Document legalization', 'Guide students through certificate, transcript, affidavit, and verification preparation.'],
  ['06', 'Visa guidance', 'Support SOP, financial documents, interview readiness, and final visa submission.'],
];

const process = [
  ['01', 'Free consultation', 'Share your goals, budget, academic history, and preferred country.'],
  ['02', 'Profile evaluation', 'We check your eligibility and recommend realistic options.'],
  ['03', 'University selection', 'Choose programs and institutions that match your profile.'],
  ['04', 'Application and offer letter', 'Submit admission applications and manage offer letter follow-ups.'],
  ['05', 'Tuition deposit and visa file', 'Prepare financials, SOP, documents, and final visa application guidance.'],
  ['06', 'Fly abroad', 'Receive pre-departure guidance before your international study journey begins.'],
];

const tests = [
  ['I', 'IELTS', 'Band score planning and university matching.'],
  ['P', 'PTE', 'Alternative English test support for selected destinations.'],
  ['M', 'MOI', 'Medium of instruction guidance where accepted.'],
  ['N', 'No test', 'Eligibility check for institutions with flexible English rules.'],
];

const faqs = [
  ['Can I apply without IELTS?', 'Some universities may accept MOI, PTE, or no-test pathways depending on your country, institution, and academic background.'],
  ['Which country is best for me?', 'The right destination depends on your budget, subject, academic profile, career goal, and preferred post-study options.'],
  ['Do you help with scholarships?', 'Yes. We identify suitable merit-based, university-funded, and country-specific scholarship opportunities.'],
  [
    'What should I bring for counselling?',
    'Bring your academic documents, passport if available, English test result, and an idea of your preferred subject and budget.',
  ],
];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.58, ease: 'easeOut' as const },
};

function SectionTitle({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy?: string; light?: boolean }) {
  return (
    <motion.div {...reveal} className="grid gap-5 md:grid-cols-[1fr_.9fr] md:items-end">
      <div>
        <p className="mb-3 text-[11px] font-black uppercase tracking-[.08em] text-[#ed1c24]">{eyebrow}</p>
        <h2
          className={`max-w-[690px] text-3xl font-black leading-[.96] tracking-[-.04em] sm:text-4xl lg:text-[44px] ${light ? 'text-white' : 'text-[#0b1222]'}`}
        >
          {title}
        </h2>
      </div>
      {copy && <p className={`max-w-xl text-sm font-semibold leading-6 ${light ? 'text-slate-300' : 'text-slate-500'}`}>{copy}</p>}
    </motion.div>
  );
}

function Marker({ children }: { children: React.ReactNode }) {
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#ed1c24] text-xs font-black text-white">{children}</span>;
}

export default function HomeComponent() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="overflow-hidden bg-white font-sans text-[#0b1222] selection:bg-red-200">
      <main>
        {/* Section-50 */}
        <div className="relative z-10 mx-auto -mt-16 max-w-[850px] px-4 sm:px-6">
          <motion.div
            {...reveal}
            className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map(([value, label]) => (
              <div key={value} className="border-b border-r border-slate-100 p-5 sm:p-6">
                <strong className="block text-3xl font-black text-[#ed1c24]">{value}</strong>
                <span className="mt-1 block text-xs font-extrabold">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        {/* Section-51 */}
        <section className="mx-auto max-w-[850px] px-4 py-20 sm:px-6 lg:py-24">
          <motion.div {...reveal} className="grid gap-10 md:grid-cols-[.8fr_1.2fr] md:items-center">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase text-[#ed1c24]">About WES Associates</p>
              <h2 className="text-4xl font-black leading-[.96] tracking-[-.04em]">Experienced counselling for a smarter study abroad journey.</h2>
            </div>
            <div className="text-sm font-semibold leading-6 text-slate-500">
              <p>
                WES Associates is built for students who need practical direction, not confusing promises. We review your academic background, English
                proficiency, budget, career goals, and preferred destination before recommending the best admission route.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Personalized guidance instead of one-size-fits-all advice.',
                  'Transparent application, scholarship, and visa preparation support.',
                  'Country-wise documentation checklist and timeline planning.',
                ].map(x => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ed1c24] ring-4 ring-red-100" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>
        {/* Section-52 */}
        <section className="bg-[#f4f6f8] py-20 lg:py-24">
          <div className="mx-auto max-w-[850px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="Why choose us"
              title="Clear, responsive, and student-first."
              copy="From the first profile check to final visa guidance, every step is planned around the student’s real eligibility and timeline."
            />
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map(([letter, title, copy], i) => (
                <motion.article
                  {...reveal}
                  transition={{ ...reveal.transition, delay: (i % 3) * 0.08 }}
                  key={title}
                  className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Marker>{letter}</Marker>
                  <h3 className="mt-4 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        {/* Section-53 */}
        <section id="countries" className="py-20 lg:py-24">
          <div className="mx-auto max-w-[850px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="Countries we serve"
              title="Choose the right study destination."
              copy="Explore countries based on tuition, scholarship options, post-study work rules, language requirements, and career opportunities."
            />
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {countries.map(([code, name, copy], i) => (
                <motion.article
                  {...reveal}
                  transition={{ ...reveal.transition, delay: (i % 4) * 0.06 }}
                  key={name}
                  className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-28 items-end justify-between bg-[linear-gradient(125deg,#12233c,#ed1c24)] p-4 text-white">
                    <span className="text-[10px] font-black uppercase">Study in</span>
                    <span className="rounded bg-white px-4 py-2 text-xs font-black text-[#0b1222]">{code}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black">{name}</h3>
                    <p className="mt-2 text-sm font-semibold leading-5 text-slate-500">{copy}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        {/* Section-54 */}
        <section className="bg-[#f4f6f8] px-4 py-14 sm:px-6">
          <motion.div
            {...reveal}
            className="relative mx-auto max-w-[850px] overflow-hidden rounded-md bg-[linear-gradient(120deg,#132846,#ce1b2b)] p-6 text-white shadow-2xl sm:p-9"
          >
            <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="relative">
              <p className="text-[10px] font-black uppercase">Visual student journey</p>
              <h2 className="mt-2 max-w-3xl text-3xl font-black leading-none tracking-[-.04em] sm:text-4xl">
                From Bangladesh to the USA through WES Associates.
              </h2>
              <p className="mt-2 max-w-lg text-xs font-semibold text-white/80">
                See how a student can move from first counselling to a USA campus with a guided admission, scholarship, document, and visa process.
              </p>
              <div className="relative mt-7 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="rounded-md bg-white/15 p-5">
                  <span className="text-xs font-bold text-white/70">Starting point</span>
                  <strong className="mt-1 block text-2xl">Bangladesh</strong>
                  <p className="mt-3 text-xs font-semibold">Profile check, counselling, and destination planning.</p>
                </div>
                <motion.div
                  animate={{ x: [-8, 8, -8], y: [2, -4, 2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10 grid h-12 w-12 place-items-center justify-self-center rounded-full bg-white text-[#ed1c24]"
                >
                  <Plane size={20} className="rotate-45" />
                </motion.div>
                <div className="rounded-md bg-white/15 p-5">
                  <span className="text-xs font-bold text-white/70">Destination</span>
                  <strong className="mt-1 block text-2xl">United States</strong>
                  <p className="mt-3 text-xs font-semibold">Admission, visa guidance, and pre-departure support.</p>
                </div>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['01', 'Student consultation'],
                  ['02', 'USA university shortlist'],
                  ['03', 'Application and offer'],
                  ['04', 'Visa and fly abroad'],
                ].map(([n, t]) => (
                  <div key={n} className="rounded-md bg-white p-4 text-[#0b1222]">
                    <span className="text-[10px] font-black text-[#ed1c24]">STEP {n}</span>
                    <strong className="mt-1 block text-sm">{t}</strong>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
        {/* Section-55 */}
        <section id="services" className="bg-[#080c14] py-20 text-white lg:py-24">
          <div className="mx-auto max-w-[850px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="Our services"
              title="Everything students need before applying abroad."
              copy="A complete service flow from consultation to visa application guidance, built around the requirement notes."
              light
            />
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(([n, title, copy], i) => (
                <motion.article
                  {...reveal}
                  transition={{ ...reveal.transition, delay: (i % 3) * 0.07 }}
                  key={n}
                  className="rounded-md border border-white/10 bg-white/[.06] p-5 transition hover:-translate-y-1 hover:border-red-500/50 hover:bg-white/[.09]"
                >
                  <Marker>{n}</Marker>
                  <h3 className="mt-4 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        {/* Section-56 */}
        <section id="process" className="py-20 lg:py-24">
          <div className="mx-auto max-w-[850px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="Admission process"
              title="Step-by-step route from counselling to fly abroad."
              copy="Students can follow a clear sequence so nothing important is missed."
            />
            <div className="mt-9 space-y-3">
              {process.map(([n, title, copy], i) => (
                <motion.div
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.04 }}
                  key={n}
                  className="flex gap-4 rounded-md border border-slate-200 p-4 transition hover:border-red-200 hover:shadow-lg"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#0b1222] text-xs font-black text-white">{n}</span>
                  <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{copy}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Section-57 */}
        <section id="scholarships" className="bg-[#f4f6f8] py-20">
          <div className="mx-auto grid max-w-[850px] gap-8 px-4 sm:px-6 md:grid-cols-[1fr_1.15fr] md:items-center">
            <SectionTitle
              eyebrow="Scholarships"
              title="Find opportunities that can reduce your study cost."
              copy="Scholarship availability depends on academic results, English proficiency, country, subject, intake, and university policy. We help students identify and apply to suitable options."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Merit scholarships', 'For students with strong academic performance and competitive profiles.'],
                ['Country-wise awards', 'Options for the UK, USA, Canada, Australia, Europe, Malaysia, China, and more.'],
                ['University discounts', 'Tuition waivers and early-bird awards from selected institutions.'],
                ['Application timing', 'Plan early so scholarship deadlines do not close before your file is ready.'],
              ].map(([t, c]) => (
                <motion.article {...reveal} key={t} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-black">{t}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{c}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        {/* Section-58 */}
        <section className="py-20">
          <div className="mx-auto max-w-[850px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="English proficiency"
              title="IELTS, PTE, MOI, and no-test pathway guidance."
              copy="Different destinations and universities accept different English evidence. We help you decide which route is suitable for your profile."
            />
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tests.map(([l, t, c]) => (
                <motion.article
                  {...reveal}
                  key={t}
                  className="rounded-md border border-slate-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Marker>{l}</Marker>
                  <h3 className="mt-4 font-black">{t}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{c}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        {/* Section-59 */}
        <section className="bg-[#080c14] py-20 text-white">
          <div className="mx-auto grid max-w-[850px] gap-10 px-4 sm:px-6 md:grid-cols-[.9fr_1.1fr] md:items-center">
            <SectionTitle
              eyebrow="Visa support"
              title="Prepare a stronger, cleaner visa file."
              copy="We guide students through the documents and explanation needed for a confident visa application."
              light
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['SOP review', 'Purpose, study plan, career logic, and country selection explained professionally.'],
                ['Document checklist', 'Academic, financial, identity, admission, and supporting paperwork organized clearly.'],
                ['Interview guidance', 'Practice common questions and build confidence for embassy interviews.'],
                ['Final review', 'Check consistency before submission to reduce avoidable mistakes.'],
              ].map(([t, c]) => (
                <motion.article {...reveal} key={t} className="rounded-md border border-white/10 bg-white/[.06] p-5">
                  <h3 className="font-black">{t}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">{c}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        {/* Section-60 */}
        <section className="py-20">
          <div className="mx-auto max-w-[850px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="Student success"
              title="Guidance that makes the next step visible."
              copy="WES Associates focuses on practical outcomes: admission readiness, document accuracy, scholarship potential, and visa preparation."
            />
            <div className="mt-9 grid gap-8 md:grid-cols-3">
              {[
                ['The team helped me understand which country and course fit my budget and result.', 'Prospective student - UK pathway'],
                ['My documents and SOP became much clearer after the counselling session.', 'Prospective student - Canada pathway'],
                ['I got a full checklist and knew exactly what to prepare for application.', 'Prospective student - Europe pathway'],
              ].map(([q, a]) => (
                <motion.blockquote {...reveal} key={a} className="border-l-4 border-[#ed1c24] pl-5">
                  <p className="text-lg font-black leading-7">&ldquo;{q}&rdquo;</p>
                  <footer className="mt-6 text-xs font-extrabold">{a}</footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>
        {/* Section-61 */}
        <section id="appointment" className="bg-[#f4f6f8] py-20">
          <div className="mx-auto grid max-w-[850px] gap-10 px-4 sm:px-6 md:grid-cols-[.85fr_1.15fr] md:items-center">
            <motion.div {...reveal}>
              <p className="mb-3 text-[11px] font-black uppercase text-[#ed1c24]">Book an appointment</p>
              <h2 className="text-4xl font-black leading-[.96] tracking-[-.04em]">Submit your details for student counselling.</h2>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                Fill out the short form and the WES Associates team can contact you for consultation. Required fields include name, mobile number, and country
                choice.
              </p>
              <ul className="mt-5 space-y-3 text-sm font-bold text-slate-500">
                {['Free first counselling session.', 'Country and university guidance.', 'Profile, English proficiency, and result review.'].map(x => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#ed1c24] ring-4 ring-red-100" />
                    {x}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.form
              {...reveal}
              onSubmit={e => e.preventDefault()}
              className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-xl sm:grid-cols-2"
            >
              <label className="text-xs font-black">
                Student name
                <input
                  required
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-3 font-medium outline-none focus:border-[#ed1c24]"
                  placeholder="Enter your full name"
                />
              </label>
              <label className="text-xs font-black">
                Mobile number
                <input
                  required
                  type="tel"
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-3 font-medium outline-none focus:border-[#ed1c24]"
                  placeholder="+880 1XXX XXXXXXX"
                />
              </label>
              <label className="text-xs font-black">
                Country choice
                <select className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-3 font-medium outline-none focus:border-[#ed1c24]">
                  <option>Select country</option>
                  {countries.map(c => (
                    <option key={c[1]}>{c[1]}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-black">
                English proficiency
                <select className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-3 font-medium outline-none focus:border-[#ed1c24]">
                  <option>Select option</option>
                  <option>IELTS</option>
                  <option>PTE</option>
                  <option>MOI</option>
                  <option>No test</option>
                </select>
              </label>
              <label className="text-xs font-black">
                English proficiency result
                <input
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-3 font-medium outline-none focus:border-[#ed1c24]"
                  placeholder="Example: IELTS 6.5 or PTE 58"
                />
              </label>
              <label className="text-xs font-black">
                Educational background
                <input
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-3 font-medium outline-none focus:border-[#ed1c24]"
                  placeholder="Example: HSC, Diploma, Bachelor"
                />
              </label>
              <label className="text-xs font-black sm:col-span-2">
                Message
                <textarea
                  rows={4}
                  className="mt-2 w-full resize-none rounded border border-slate-300 px-3 py-3 font-medium outline-none focus:border-[#ed1c24]"
                  placeholder="Tell us your preferred subject, intake, or budget"
                />
              </label>
              <button className="rounded bg-[#ed1c24] py-3.5 text-xs font-black text-white transition hover:bg-red-700 sm:col-span-2">
                Submit Appointment Request
              </button>
            </motion.form>
          </div>
        </section>
        {/* Section-62 */}
        <section className="py-20">
          <div className="mx-auto max-w-[850px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="Document checklist"
              title="Prepare your file before deadlines."
              copy="A well-organized file helps universities and visa officers understand your academic and financial profile faster."
            />
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                ['Academic documents', 'Certificates, transcripts, grading scale, and institution information.'],
                ['Identity documents', 'Passport, photos, birth certificate, and national ID where needed.'],
                ['Financial documents', 'Bank statements, sponsor documents, income evidence, and affidavits.'],
              ].map(([t, c]) => (
                <motion.article {...reveal} key={t} className="rounded-md border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-black">{t}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{c}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        {/* Section-63 */}
        <section id="blog" className="bg-[#f4f6f8] py-20">
          <div className="mx-auto max-w-[850px] px-4 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionTitle eyebrow="Latest news and blog" title="Helpful updates for study abroad planning." />
              <a href="#contact" className="self-start rounded-md border border-slate-200 bg-white px-5 py-3 text-xs font-black shadow-sm">
                Ask a counsellor
              </a>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                ['How to choose your study destination', 'Compare tuition, work options, scholarships, and visa requirements before deciding.'],
                ['Scholarship planning tips', 'Start early, prepare documents, and target universities that match your profile.'],
                ['Visa file preparation guide', 'Keep your SOP, financial documents, and admission evidence consistent.'],
              ].map(([t, c]) => (
                <motion.article
                  {...reveal}
                  key={t}
                  className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-32 items-end bg-[linear-gradient(125deg,#12233c,#ed1c24)] p-5 text-xl font-black leading-5 text-white">{t}</div>
                  <p className="p-5 text-sm font-semibold leading-6 text-slate-500">{c}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        {/* Section-64 */}
        <section className="py-20">
          <div className="mx-auto grid max-w-[850px] gap-10 px-4 sm:px-6 md:grid-cols-[.8fr_1.2fr]">
            <SectionTitle
              eyebrow="FAQ"
              title="Common student questions."
              copy="These quick answers help students understand what to expect before booking counselling."
            />
            <div className="space-y-3">
              {faqs.map(([q, a], i) => (
                <motion.div {...reveal} key={q} className="rounded-md border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-black"
                  >
                    <span>{q}</span>
                    <ChevronDown size={17} className={`shrink-0 transition ${openFaq === i ? 'rotate-180 text-[#ed1c24]' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm font-semibold leading-6 text-slate-500">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
