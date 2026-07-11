'use client';

import React, { useState, useEffect } from 'react';

const WESAssociates = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.16 },
    );

    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white">
      <main id="home">
        <section
          className="relative overflow-hidden min-h-[calc(100vh-124px)] grid place-items-center pt-[96px] pb-[108px] text-[#111827] bg-[#ffffff] [background-image:linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),radial-gradient(circle_at_50%_8%,rgba(224,31,38,0.08),transparent_28%)] [background-size:44px_44px,44px_44px,auto,auto]"
          aria-label="Study abroad counselling"
        >
          <div className="relative z-10 w-[min(1120px,calc(100%-32px))] mx-auto text-center">
            <h1 className="m-0 block font-sans font-[950] leading-[0.98] tracking-normal text-[#121927]">
              <span className="block text-[clamp(42px,6.4vw,98px)] translate-y-[88px] opacity-0 animate-[heroRise_0.9s_cubic-bezier(0.2,0.8,0.2,1)_0.14s_forwards]">
                ভয়কে জয় করে
              </span>
              <span className="block mt-[12px] text-[clamp(40px,6.9vw,112px)] leading-[1.04] translate-y-[88px] opacity-0 animate-[heroRise_0.9s_cubic-bezier(0.2,0.8,0.2,1)_0.34s_forwards]">
                <span className="whitespace-nowrap">
                  <span className="text-[#5b6373]">STUDY ABROAD</span>-এ
                </span>{' '}
                <span className="text-[#e01f26]">সফল হোন</span>
              </span>
            </h1>
            <p className="max-w-[720px] mx-auto mt-[42px] text-[#485263] text-[clamp(18px,2.2vw,26px)] leading-[1.35] font-bold translate-y-[72px] opacity-0 animate-[heroRise_0.95s_cubic-bezier(0.2,0.8,0.2,1)_0.58s_forwards]">
              <strong className="text-[#121927] font-[950]">সঠিক গাইডলাইন</strong> নিয়ে বিদেশে পড়াশোনার স্বপ্ন পূরণ করুন -{' '}
              <span className="text-[#e01f26] font-[950]">WES Associates</span> আপনাকে দেশ, বিশ্ববিদ্যালয়, স্কলারশিপ ও ভিসা প্রস্তুতিতে সহায়তা করবে।
            </p>
            <div className="flex justify-center gap-[16px] flex-wrap mt-[42px] translate-y-[64px] opacity-0 animate-[heroRise_0.9s_cubic-bezier(0.2,0.8,0.2,1)_0.82s_forwards]">
              <a
                href="#appointment"
                className="inline-flex items-center justify-center gap-[8px] min-w-[188px] min-h-[58px] p-[12px_18px] rounded-none border border-transparent bg-[#e01f26] text-white font-extrabold text-[17px] cursor-pointer transition-all duration-250 hover:bg-[#bd1118] hover:-translate-y-[2px] hover:shadow-[0_14px_26px_rgba(224,31,38,0.25)]"
              >
                অ্যাডমিশন ওপেন
              </a>
              <a
                href="#countries"
                className="inline-flex items-center justify-center gap-[8px] min-w-[188px] min-h-[58px] p-[12px_18px] rounded-none border-2 border-[#cfd5df] bg-white/72 text-[#111827] font-extrabold text-[17px] cursor-pointer transition-all duration-250 hover:text-[#e01f26] hover:border-[#e01f26] hover:-translate-y-[2px] hover:shadow-none hover:bg-white/72"
              >
                দেশ দেখুন
              </a>
            </div>
          </div>
        </section>

        <div className="relative z-10 -mt-[54px]">
          <div className="w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 bg-white border border-[#e8ebf0] rounded-[8px] shadow-[0_18px_45px_rgba(17,24,39,0.1)] overflow-hidden reveal reveal-scale animate-pop">
              {[
                { n: '12+', t: 'Popular study destinations' },
                { n: '100%', t: 'Transparent admission process' },
                { n: '1:1', t: 'Personalized counselling' },
                { n: '24h', t: 'Quick response for students' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-[28px] border-b sm:border-b-0 sm:border-r border-[#e8ebf0] last:border-r-0 hover:bg-[#fff8f8] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <strong className="block text-[#e01f26] text-[34px] leading-none mb-2 transition-transform duration-300 group-hover:scale-[1.08]">
                    {stat.n}
                  </strong>
                  <span className="text-[16px] font-medium text-[#667085]">{stat.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="about">
          <div className="max-w-[1160px] w-[calc(100%-32px)] mx-auto feature-band">
            <div className="reveal reveal-left">
              <p className="text-[#e01f26] font-black text-[13px] uppercase tracking-widest mb-2.5">About WES Associates</p>
              <h2>Experienced counselling for a smarter study abroad journey.</h2>
            </div>
            <div className="reveal reveal-right">
              <p className="text-[#667085] text-[17px] max-w-[650px] m-0">
                WES Associates is built for students who need practical direction, not confusing promises. We review your academic background, English
                proficiency, budget, career goals, and preferred destination before recommending the best admission route.
              </p>
              <ul className="grid gap-3 mt-4 list-none p-0">
                <li className="relative pl-7 text-[#667085] before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-[#e01f26] before:shadow-[0_0_0_5px_rgba(224,31,38,0.12)]">
                  Personalized guidance instead of one-size-fits-all advice.
                </li>
                <li className="relative pl-7 text-[#667085] before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-[#e01f26] before:shadow-[0_0_0_5px_rgba(224,31,38,0.12)]">
                  Transparent application, scholarship, and visa preparation support.
                </li>
                <li className="relative pl-7 text-[#667085] before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-[#e01f26] before:shadow-[0_0_0_5px_rgba(224,31,38,0.12)]">
                  Country-wise documentation checklist and timeline planning.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-[88px] scroll-mt-[110px]" id="why">
          <div className="w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-[28px] mb-[34px] reveal reveal-left animate-slide">
              <div>
                <p className="m-0 mb-2.5 text-[#e01f26] font-black text-[13px] uppercase tracking-[0.08em]">Why choose us</p>
                <h2 className="m-0 text-[clamp(30px,4vw,48px)] leading-[1.08] tracking-normal">Clear, responsive, and student-first.</h2>
              </div>
              <p className="m-0 max-w-[650px] text-[#667085] text-[17px]">
                From the first profile check to final visa guidance, every step is planned around the student’s real eligibility and timeline.
              </p>
            </div>
            <div className="grid gap-[22px] grid-cols-1 md:grid-cols-3">
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/24 reveal reveal-scale animate-pop">
                <div className="w-12 h-12 grid place-items-center rounded-lg mb-[18px] text-white bg-[#e01f26] font-black">C</div>
                <h3 className="m-0 mb-2.5 text-[21px] leading-[1.2]">Expert counsellors</h3>
                <p className="text-[#667085] m-0">Get destination, university, and subject recommendations based on your profile and goals.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/24 reveal reveal-scale animate-pop">
                <div className="w-12 h-12 grid place-items-center rounded-lg mb-[18px] text-white bg-[#e01f26] font-black">P</div>
                <h3 className="m-0 mb-2.5 text-[21px] leading-[1.2]">Personalized guidance</h3>
                <p className="text-[#667085] m-0">Every student receives a practical application plan with clear next actions.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/24 reveal reveal-scale animate-pop">
                <div className="w-12 h-12 grid place-items-center rounded-lg mb-[18px] text-white bg-[#e01f26] font-black">T</div>
                <h3 className="m-0 mb-2.5 text-[21px] leading-[1.2]">Transparent process</h3>
                <p className="text-[#667085] m-0">Know your required documents, expected timeline, fees, and admission stages before you apply.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/24 reveal reveal-scale animate-pop">
                <div className="w-12 h-12 grid place-items-center rounded-lg mb-[18px] text-white bg-[#e01f26] font-black">S</div>
                <h3 className="m-0 mb-2.5 text-[21px] leading-[1.2]">Scholarship support</h3>
                <p className="text-[#667085] m-0">Find merit-based, country-wise, and university-funded scholarship opportunities.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/24 reveal reveal-scale animate-pop">
                <div className="w-12 h-12 grid place-items-center rounded-lg mb-[18px] text-white bg-[#e01f26] font-black">R</div>
                <h3 className="m-0 mb-2.5 text-[21px] leading-[1.2]">Fast response</h3>
                <p className="text-[#667085] m-0">Students receive quick follow-up for document checks, offers, and visa updates.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/24 reveal reveal-scale animate-pop">
                <div className="w-12 h-12 grid place-items-center rounded-lg mb-[18px] text-white bg-[#e01f26] font-black">L</div>
                <h3 className="m-0 mb-2.5 text-[21px] leading-[1.2]">Local to global</h3>
                <p className="text-[#667085] m-0">Support from Bangladesh with global admission options across top destinations.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="countries" className="py-[88px]">
          <div className="w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="flex items-end justify-between gap-[28px] mb-[34px] flex-wrap reveal reveal-left animate-slide">
              <div>
                <p className="m-[0_0_10px] text-[#e01f26] font-[900] text-[13px] uppercase tracking-[0.08em]">Countries we serve</p>
                <h2 className="m-0 text-[clamp(30px,4vw,48px)] leading-[1.08] tracking-normal">Choose the right study destination.</h2>
              </div>
              <p className="max-w-[650px] m-0 text-[#485263] text-[clamp(17px,2vw,20px)] leading-[1.4] font-medium">
                Explore countries based on tuition, scholarship options, post-study work rules, language requirements, and career opportunities.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[22px]">
              {[
                { flag: 'UK', name: 'United Kingdom', desc: 'Fast degrees, strong academic reputation, and wide course choices.' },
                { flag: 'USA', name: 'United States', desc: 'Flexible majors, research options, and global career exposure.' },
                { flag: 'CAN', name: 'Canada', desc: 'Quality education, multicultural cities, and practical work pathways.' },
                { flag: 'AUS', name: 'Australia', desc: 'Career-focused programs, welcoming campuses, and strong student support.' },
                { flag: 'EU', name: 'Europe', desc: 'Affordable programs, English-taught courses, and cultural diversity.' },
                { flag: 'MY', name: 'Malaysia', desc: 'Budget-friendly tuition with international branch campus options.' },
                { flag: 'CN', name: 'China', desc: 'Scholarship-friendly programs in medicine, engineering, and business.' },
                { flag: 'SE', name: 'Sweden', desc: 'Innovation-led education with strong research and sustainability programs.' },
              ].map((c, i) => (
                <article
                  key={i}
                  className="bg-white border border-[#e8ebf0] rounded-[8px] p-0 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-[6px] hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 flex flex-col overflow-hidden reveal reveal-scale animate-pop"
                >
                  <div className="bg-[#f7f8fa] p-[32px_24px] flex items-center justify-between border-b border-[#e8ebf0]">
                    <small className="font-[800] uppercase tracking-[0.1em] text-[#8c97ac] text-[11px] m-0">Study in</small>
                    <div className="w-[48px] h-[32px] bg-white border border-[#e8ebf0] rounded-[4px] grid place-items-center font-[900] text-[12px] text-[#121927]">
                      {c.flag}
                    </div>
                  </div>
                  <div className="p-[24px]">
                    <h3 className="m-[0_0_8px] text-[clamp(20px,2.5vw,24px)] leading-[1.1] font-[800]">{c.name}</h3>
                    <p className="m-0 text-[#667085] text-[15.5px] leading-[1.45] font-medium">{c.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-[88px]" id="usa-journey">
          <div className="w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="bg-[#0f3557] [background-image:linear-gradient(135deg,rgba(15,53,87,0.95),rgba(224,31,38,0.82))] rounded-[8px] p-[54px] text-white relative overflow-hidden reveal reveal-scale">
              <div className="grid md:grid-cols-2 gap-[64px] relative z-10 items-center">
                <div>
                  <p className="m-[0_0_10px] text-[#e01f26] font-[900] text-[13px] uppercase tracking-[0.08em]">Visual student journey</p>
                  <h2 className="m-0 text-[clamp(30px,4vw,48px)] leading-[1.08] tracking-normal">From Bangladesh to the USA through WES Associates.</h2>
                  <p className="max-w-[650px] m-[20px_0_0] text-[#fff] opacity-90 text-[clamp(17px,2vw,20px)] leading-[1.4] font-medium">
                    See how a student can move from first counselling to a USA campus with a guided admission, scholarship, document, and visa process.
                  </p>
                  <div
                    className="flex flex-col sm:flex-row items-center gap-[24px] mt-[42px] bg-black/20 p-[24px] rounded-[12px] border border-white/10"
                    aria-label="Bangladesh to USA route"
                  >
                    <div className="flex-1 text-center sm:text-left">
                      <span className="block text-[11px] uppercase tracking-[0.1em] text-white/60 mb-[4px] font-[700]">Starting point</span>
                      <strong className="block text-[22px] font-[900] mb-[8px]">Bangladesh</strong>
                      <p className="text-[14px] leading-[1.4] text-white/80 m-0">Profile check, counselling, and destination planning.</p>
                    </div>
                    <div className="flex-[0_0_120px] relative h-[60px] grid place-items-center hidden sm:grid" aria-hidden="true">
                      <svg
                        viewBox="0 0 190 74"
                        role="img"
                        className="w-full h-full overflow-visible stroke-white/30 stroke-[2px] [stroke-dasharray:6_6] fill-none [stroke-linecap:round]"
                      >
                        <path d="M5 58 C55 6, 125 6, 185 32"></path>
                      </svg>
                      <div className="absolute text-[24px] leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] animate-[flyPlane_4s_ease-in-out_infinite] [offset-path:path('M5_58_C55_6,_125_6,_185_32')]">
                        ✈
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <span className="block text-[11px] uppercase tracking-[0.1em] text-white/60 mb-[4px] font-[700]">Destination</span>
                      <strong className="block text-[22px] font-[900] mb-[8px]">United States</strong>
                      <p className="text-[14px] leading-[1.4] text-white/80 m-0">Admission, visa guidance, and pre-departure support.</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-[16px]">
                  {[
                    { s: 'Step 01', t: 'Student consultation', d: 'WES reviews result, budget, English score, and preferred subject.' },
                    { s: 'Step 02', t: 'USA university shortlist', d: 'Choose suitable programs, intakes, tuition range, and scholarship options.' },
                    { s: 'Step 03', t: 'Application and offer', d: 'Prepare forms, documents, SOP, and follow up for admission decisions.' },
                    { s: 'Step 04', t: 'Visa and fly abroad', d: 'Organize visa file, practice interview, and prepare for departure.' },
                  ].map((step, i) => (
                    <article
                      key={i}
                      className="bg-white/95 p-[24px] rounded-[8px] text-[#121927] border border-white transition-transform duration-250 hover:translate-x-[8px]"
                    >
                      <small className="block text-[#e01f26] font-[900] text-[11px] uppercase tracking-[0.1em] mb-[6px] m-0">{step.s}</small>
                      <h3 className="m-[0_0_4px] text-[18px] font-[800] leading-[1.1]">{step.t}</h3>
                      <p className="m-0 text-[14px] text-[#485263] font-medium">{step.d}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#080b12] text-white py-[88px]" id="services">
          <div className="w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="flex items-end justify-between gap-[28px] mb-[34px] flex-wrap reveal">
              <div>
                <p className="m-[0_0_10px] text-[#e01f26] font-[900] text-[13px] uppercase tracking-[0.08em]">Our services</p>
                <h2 className="m-0 text-[clamp(30px,4vw,48px)] leading-[1.08] tracking-normal">Everything students need before applying abroad.</h2>
              </div>
              <p className="max-w-[650px] m-0 text-white/80 text-[clamp(17px,2vw,20px)] leading-[1.4] font-medium">
                A complete service flow from consultation to visa application guidance, built around the requirement notes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
              {[
                { icon: '01', t: 'Free consultation', d: 'Discuss academic background, target country, budget, English score, and career plans.' },
                { icon: '02', t: 'Profile evaluation', d: 'Review SSC, HSC, diploma, bachelor, IELTS, PTE, MOI, or other eligibility factors.' },
                { icon: '03', t: 'University selection', d: 'Shortlist universities that match your budget, subject, intake, and admission chances.' },
                { icon: '04', t: 'Application support', d: 'Prepare forms, submit applications, and follow up with admission offices.' },
                { icon: '05', t: 'Document legalization', d: 'Guide students through certificate, transcript, affidavit, and verification preparation.' },
                { icon: '06', t: 'Visa guidance', d: 'Support SOP, financial documents, interview readiness, and final visa submission.' },
              ].map((s, i) => (
                <article
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-[8px] p-[24px] shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-[6px] hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26] hover:bg-white/10 reveal"
                >
                  <div className="w-[48px] h-[48px] bg-[#e01f26]/10 text-[#e01f26] rounded-[8px] grid place-items-center font-[900] text-[18px] mb-[24px]">
                    {s.icon}
                  </div>
                  <h3 className="m-[0_0_8px] text-[clamp(20px,2.5vw,24px)] leading-[1.1] font-[800]">{s.t}</h3>
                  <p className="m-0 text-white/60 text-[15.5px] leading-[1.45] font-medium">{s.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="py-[88px]">
          <div className="w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="flex items-end justify-between gap-[28px] mb-[34px] flex-wrap reveal">
              <div>
                <p className="m-[0_0_10px] text-[#e01f26] font-[900] text-[13px] uppercase tracking-[0.08em]">Admission process</p>
                <h2 className="m-0 text-[clamp(30px,4vw,48px)] leading-[1.08] tracking-normal">Step-by-step route from counselling to fly abroad.</h2>
              </div>
              <p className="max-w-[650px] m-0 text-[#485263] text-[clamp(17px,2vw,20px)] leading-[1.4] font-medium">
                Students can follow a clear sequence so nothing important is missed.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px] mt-[42px]">
              {[
                { t: 'Free consultation', d: 'Share your goals, budget, academic history, and preferred country.' },
                { t: 'Profile evaluation', d: 'We check your eligibility and recommend realistic options.' },
                { t: 'University selection', d: 'Choose programs and institutions that match your profile.' },
                { t: 'Application and offer letter', d: 'Submit admission applications and manage offer letter follow-ups.' },
                { t: 'Tuition deposit and visa file', d: 'Prepare financials, SOP, documents, and final visa application guidance.' },
                { t: 'Fly abroad', d: 'Receive pre-departure guidance before your international study journey begins.' },
              ].map((p, i) => (
                <article key={i} className="relative pt-[32px] group reveal">
                  <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#e8ebf0] rounded-[2px]" />
                  <div className="absolute top-[-4px] left-0 w-[12px] h-[12px] bg-[#e01f26] rounded-full shadow-[0_0_0_4px_#fff] transition-transform duration-300 group-hover:scale-[1.3]" />
                  <div>
                    <h3 className="m-[0_0_8px] text-[clamp(20px,2.5vw,24px)] leading-[1.1] font-[800]">{p.t}</h3>
                    <p className="m-0 text-[#667085] text-[15.5px] leading-[1.45] font-medium">{p.d}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-[88px]" id="scholarships">
          <div className="w-[min(1160px,calc(100%-32px))] mx-auto bg-white p-[54px] rounded-[8px] border border-[#e8ebf0]">
            <div className="reveal">
              <p className="m-[0_0_10px] text-[#e01f26] font-[900] text-[13px] uppercase tracking-[0.08em]">Scholarships</p>
              <h2 className="m-0 text-[clamp(30px,4vw,48px)] leading-[1.08] tracking-normal">Find opportunities that can reduce your study cost.</h2>
              <p className="max-w-[650px] m-[20px_0_0] text-[#485263] text-[clamp(17px,2vw,20px)] leading-[1.4] font-medium">
                Scholarship availability depends on academic results, English proficiency, country, subject, intake, and university policy. We help students
                identify and apply to suitable options.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px] mt-[42px]">
              {[
                { t: 'Merit scholarships', d: 'For students with strong academic performance and competitive profiles.' },
                { t: 'Country-wise awards', d: 'Options for the UK, USA, Canada, Australia, Europe, Malaysia, China, and more.' },
                { t: 'University discounts', d: 'Tuition waivers and early-bird awards from selected institutions.' },
                { t: 'Application timing', d: 'Plan early so scholarship deadlines do not close before your file is ready.' },
              ].map((s, i) => (
                <article
                  key={i}
                  className="bg-white border border-[#e8ebf0] rounded-[8px] p-[24px] shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-[6px] hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 reveal"
                >
                  <h3 className="m-[0_0_8px] text-[clamp(20px,2.5vw,24px)] leading-[1.1] font-[800]">{s.t}</h3>
                  <p className="m-0 text-[#667085] text-[15.5px] leading-[1.45] font-medium">{s.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="language">
          <div className="max-w-[1160px] w-[calc(100%-32px)] mx-auto">
            <div className="flex items-end justify-between gap-7 mb-8 reveal">
              <div>
                <p className="text-[#e01f26] font-black text-[13px] uppercase tracking-widest mb-2.5">English proficiency</p>
                <h2>IELTS, PTE, MOI, and no-test pathway guidance.</h2>
              </div>
              <p className="text-[#667085] text-[17px] max-w-[650px] m-0">
                Different destinations and universities accept different English evidence. We help you decide which route is suitable for your profile.
              </p>
            </div>
            <div className="grid gap-[22px] grid gap-[22px]-cols-1 md:grid gap-[22px]-cols-2 lg:grid gap-[22px]-cols-4">
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 reveal">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-white bg-[#e01f26] font-black">I</div>
                <h3>IELTS</h3>
                <p className="text-[#667085] m-0">Band score planning and university matching.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 reveal">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-white bg-[#e01f26] font-black">P</div>
                <h3>PTE</h3>
                <p className="text-[#667085] m-0">Alternative English test support for selected destinations.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 reveal">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-white bg-[#e01f26] font-black">M</div>
                <h3>MOI</h3>
                <p className="text-[#667085] m-0">Medium of instruction guidance where accepted.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 reveal">
                <div className="w-12 h-12 flex items-center justify-center">
                  {' '}
                  <section className="bg-[#080b12] text-white py-20 md:py-28" id="visa">
                    <div className="max-w-[min(1160px,calc(100%-32px))] mx-auto">
                      <div className="reveal flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 md:gap-7 mb-12 md:mb-16">
                        <div className="max-w-[600px]">
                          <p className="text-[#e01f26] font-black text-xs md:text-[13px] uppercase tracking-widest mb-2.5">Visa support</p>
                          <h2 className="text-3xl md:text-4xl lg:text-[clamp(32px,4vw,44px)] font-extrabold leading-[1.1] m-0">
                            Prepare a stronger, cleaner visa file.
                          </h2>
                        </div>
                        <p className="text-[#a1a1aa] text-lg md:text-[19px] leading-[1.6] max-w-[500px] m-0">
                          We guide students through the documents and explanation needed for a confident visa application.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <article className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#e01f26]/30 reveal">
                          <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">SOP review</h3>
                          <p className="text-[#a1a1aa] leading-[1.6] m-0">Purpose, study plan, career logic, and country selection explained professionally.</p>
                        </article>
                        <article className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#e01f26]/30 reveal">
                          <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Document checklist</h3>
                          <p className="text-[#a1a1aa] leading-[1.6] m-0">
                            Academic, financial, identity, admission, and supporting paperwork organized clearly.
                          </p>
                        </article>
                        <article className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#e01f26]/30 reveal">
                          <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Interview guidance</h3>
                          <p className="text-[#a1a1aa] leading-[1.6] m-0">Practice common questions and build confidence for embassy interviews.</p>
                        </article>
                        <article className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#e01f26]/30 reveal">
                          <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Final review</h3>
                          <p className="text-[#a1a1aa] leading-[1.6] m-0">Check consistency before submission to reduce avoidable mistakes.</p>
                        </article>
                      </div>
                    </div>
                  </section>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="py-20 md:py-28" id="success">
          <div className="max-w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 md:gap-7 mb-12 md:mb-16 reveal">
              <div className="max-w-[600px]">
                <p className="text-[#e01f26] font-black text-xs md:text-[13px] uppercase tracking-widest mb-2.5">Student success</p>
                <h2 className="text-3xl md:text-4xl lg:text-[clamp(32px,4vw,44px)] font-extrabold leading-[1.1] m-0">
                  Guidance that makes the next step visible.
                </h2>
              </div>
              <p className="text-[#667085] text-lg md:text-[19px] leading-[1.6] max-w-[500px] m-0">
                WES Associates focuses on practical outcomes: admission readiness, document accuracy, scholarship potential, and visa preparation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              <article className="bg-[#f7f8fa] border-l-4 border-[#e01f26] p-6 rounded-r-lg reveal">
                <p className="text-lg md:text-xl font-medium leading-[1.5] text-[#111827] italic mb-4">
                  &quot;The team helped me understand which country and course fit my budget and result.&quot;
                </p>
                <strong className="text-sm font-bold text-[#e01f26] uppercase tracking-wide">Prospective student - UK pathway</strong>
              </article>
              <article className="bg-[#f7f8fa] border-l-4 border-[#e01f26] p-6 rounded-r-lg reveal">
                <p className="text-lg md:text-xl font-medium leading-[1.5] text-[#111827] italic mb-4">
                  &quot;My documents and SOP became much clearer after the counselling session.&quot;
                </p>
                <strong className="text-sm font-bold text-[#e01f26] uppercase tracking-wide">Prospective student - Canada pathway</strong>
              </article>
              <article className="bg-[#f7f8fa] border-l-4 border-[#e01f26] p-6 rounded-r-lg reveal">
                <p className="text-lg md:text-xl font-medium leading-[1.5] text-[#111827] italic mb-4">
                  &quot;I got a full checklist and knew exactly what to prepare for application.&quot;
                </p>
                <strong className="text-sm font-bold text-[#e01f26] uppercase tracking-wide">Prospective student - Europe pathway</strong>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-20 md:py-28" id="appointment">
          <div className="max-w-[min(1160px,calc(100%-32px))] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="reveal flex-1 lg:max-w-[45%]">
              <p className="text-[#e01f26] font-black text-xs md:text-[13px] uppercase tracking-widest mb-2.5">Book an appointment</p>
              <h2 className="text-3xl md:text-4xl lg:text-[clamp(32px,4vw,44px)] font-extrabold leading-[1.1] mb-5">
                Submit your details for student counselling.
              </h2>
              <p className="text-[#667085] text-lg md:text-[19px] leading-[1.6] m-0 mb-8">
                Fill out the short form and the WES Associates team can contact you for consultation. Required fields include name, mobile number, and country
                choice.
              </p>
              <ul className="grid gap-3 list-none p-0 m-0">
                <li className="relative pl-7 text-[#667085] leading-[1.6] before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-[#e01f26] before:shadow-[0_0_0_5px_rgba(224,31,38,0.12)]">
                  Free first counselling session.
                </li>
                <li className="relative pl-7 text-[#667085] leading-[1.6] before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-[#e01f26] before:shadow-[0_0_0_5px_rgba(224,31,38,0.12)]">
                  Country and university guidance.
                </li>
                <li className="relative pl-7 text-[#667085] leading-[1.6] before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-[#e01f26] before:shadow-[0_0_0_5px_rgba(224,31,38,0.12)]">
                  Profile, English proficiency, and result review.
                </li>
              </ul>
            </div>
            <form className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_20px_40px_rgba(17,24,39,0.06)] flex-1 reveal" id="appointmentForm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#111827] uppercase tracking-wide" htmlFor="name">
                    Student name
                  </label>
                  <input
                    className="min-h-[46px] px-3.5 py-2.5 rounded border border-[#cfd5df] bg-[#f7f8fa] text-[15px] transition-colors focus:outline-none focus:border-[#e01f26] focus:bg-white"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#111827] uppercase tracking-wide" htmlFor="mobile">
                    Mobile number
                  </label>
                  <input
                    className="min-h-[46px] px-3.5 py-2.5 rounded border border-[#cfd5df] bg-[#f7f8fa] text-[15px] transition-colors focus:outline-none focus:border-[#e01f26] focus:bg-white"
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="+880 1XXX XXXXXX"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#111827] uppercase tracking-wide" htmlFor="country">
                    Country choose
                  </label>
                  <select
                    className="min-h-[46px] px-3.5 py-2.5 rounded border border-[#cfd5df] bg-[#f7f8fa] text-[15px] transition-colors focus:outline-none focus:border-[#e01f26] focus:bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-no-repeat bg-[position:right_1rem_center]"
                    id="country"
                    name="country"
                    required
                  >
                    <option value="">Select country</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Europe</option>
                    <option>Malaysia</option>
                    <option>China</option>
                    <option>Sweden</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#111827] uppercase tracking-wide" htmlFor="english">
                    English proficiency
                  </label>
                  <select
                    className="min-h-[46px] px-3.5 py-2.5 rounded border border-[#cfd5df] bg-[#f7f8fa] text-[15px] transition-colors focus:outline-none focus:border-[#e01f26] focus:bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-no-repeat bg-[position:right_1rem_center]"
                    id="english"
                    name="english"
                  >
                    <option value="">Select option</option>
                    <option>IELTS</option>
                    <option>PTE</option>
                    <option>MOI</option>
                    <option>None</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#111827] uppercase tracking-wide" htmlFor="result">
                    English proficiency result
                  </label>
                  <input
                    className="min-h-[46px] px-3.5 py-2.5 rounded border border-[#cfd5df] bg-[#f7f8fa] text-[15px] transition-colors focus:outline-none focus:border-[#e01f26] focus:bg-white"
                    id="result"
                    name="result"
                    type="text"
                    placeholder="Example: IELTS 6.5 or PTE 58"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#111827] uppercase tracking-wide" htmlFor="education">
                    Educational background
                  </label>
                  <input
                    className="min-h-[46px] px-3.5 py-2.5 rounded border border-[#cfd5df] bg-[#f7f8fa] text-[15px] transition-colors focus:outline-none focus:border-[#e01f26] focus:bg-white"
                    id="education"
                    name="education"
                    type="text"
                    placeholder="Example: HSC, Diploma, Bachelor"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[13px] font-bold text-[#111827] uppercase tracking-wide" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="min-h-[100px] px-3.5 py-2.5 rounded border border-[#cfd5df] bg-[#f7f8fa] text-[15px] transition-colors focus:outline-none focus:border-[#e01f26] focus:bg-white resize-y"
                    id="message"
                    name="message"
                    placeholder="Tell us your preferred subject, intake, or budget"
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2 mt-2">
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-4 py-3 rounded-md bg-[#e01f26] text-white font-extrabold transition-all hover:bg-[#bd1118] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(224,31,38,0.3)]"
                    type="submit"
                  >
                    Submit Appointment Request
                  </button>
                  <div className="hidden mt-3 p-4 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 rounded font-medium text-[15px]" id="formNote">
                    Thank you. Your appointment request is ready. WES Associates will contact you soon.
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>

        <section className="py-20 md:py-28" id="documents">
          <div className="max-w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 md:gap-7 mb-12 md:mb-16 reveal">
              <div className="max-w-[600px]">
                <p className="text-[#e01f26] font-black text-xs md:text-[13px] uppercase tracking-widest mb-2.5">Document checklist</p>
                <h2 className="text-3xl md:text-4xl lg:text-[clamp(32px,4vw,44px)] font-extrabold leading-[1.1] m-0">Prepare your file before deadlines.</h2>
              </div>
              <p className="text-[#667085] text-lg md:text-[19px] leading-[1.6] max-w-[500px] m-0">
                A well-organized file helps universities and visa officers understand your academic and financial profile faster.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 reveal">
                <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Academic documents</h3>
                <p className="text-[#667085] leading-[1.6] m-0">Certificates, transcripts, grading scale, and institution information.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 reveal">
                <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Identity documents</h3>
                <p className="text-[#667085] leading-[1.6] m-0">Passport, photos, birth certificate, and national ID where needed.</p>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 reveal">
                <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Financial documents</h3>
                <p className="text-[#667085] leading-[1.6] m-0">Bank statements, sponsor documents, income evidence, and affidavits.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-20 md:py-28" id="news">
          <div className="max-w-[min(1160px,calc(100%-32px))] mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 md:gap-7 mb-12 md:mb-16 reveal">
              <div className="max-w-[600px]">
                <p className="text-[#e01f26] font-black text-xs md:text-[13px] uppercase tracking-widest mb-2.5">Latest news and blog</p>
                <h2 className="text-3xl md:text-4xl lg:text-[clamp(32px,4vw,44px)] font-extrabold leading-[1.1] m-0">
                  Helpful updates for study abroad planning.
                </h2>
              </div>
              <a
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-md border-2 border-[#cfd5df] text-[#111827] bg-white font-extrabold transition-all hover:border-[#e01f26] hover:text-[#e01f26]"
                href="#appointment"
              >
                Ask a counsellor
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              <article className="bg-white border border-[#e8ebf0] rounded-lg shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 flex flex-col overflow-hidden reveal">
                <div className="bg-[#e8ebf0] h-[160px] p-6 flex items-end">
                  <h3 className="text-xl md:text-2xl font-extrabold leading-[1.2] m-0 line-clamp-2">How to choose your study destination</h3>
                </div>
                <div className="p-6 pt-5">
                  <p className="text-[#667085] leading-[1.6] m-0">Compare tuition, work options, scholarships, and visa requirements before deciding.</p>
                </div>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 flex flex-col overflow-hidden reveal">
                <div className="bg-[#e8ebf0] h-[160px] p-6 flex items-end">
                  <h3 className="text-xl md:text-2xl font-extrabold leading-[1.2] m-0 line-clamp-2">Scholarship planning tips</h3>
                </div>
                <div className="p-6 pt-5">
                  <p className="text-[#667085] leading-[1.6] m-0">Start early, prepare documents, and target universities that match your profile.</p>
                </div>
              </article>
              <article className="bg-white border border-[#e8ebf0] rounded-lg shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20 flex flex-col overflow-hidden reveal">
                <div className="bg-[#e8ebf0] h-[160px] p-6 flex items-end">
                  <h3 className="text-xl md:text-2xl font-extrabold leading-[1.2] m-0 line-clamp-2">Visa file preparation guide</h3>
                </div>
                <div className="p-6 pt-5">
                  <p className="text-[#667085] leading-[1.6] m-0">Keep your SOP, financial documents, and admission evidence consistent.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28" id="faq">
          <div className="max-w-[min(1160px,calc(100%-32px))] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="reveal flex-1 lg:max-w-[45%]">
              <p className="text-[#e01f26] font-black text-xs md:text-[13px] uppercase tracking-widest mb-2.5">FAQ</p>
              <h2 className="text-3xl md:text-4xl lg:text-[clamp(32px,4vw,44px)] font-extrabold leading-[1.1] mb-5">Common student questions.</h2>
              <p className="text-[#667085] text-lg md:text-[19px] leading-[1.6] m-0">
                These quick answers help students understand what to expect before booking counselling.
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-4 reveal">
              <details className="group bg-white border border-[#cfd5df] rounded-lg p-5 [&_summary::-webkit-details-marker]:hidden" open>
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg text-[#111827] outline-none group-open:text-[#e01f26] group-open:mb-3 transition-colors">
                  Can I apply without IELTS?
                  <span className="relative flex-shrink-0 ml-4 w-6 h-6 flex items-center justify-center before:absolute before:w-3.5 before:h-[2px] before:bg-current before:transition-transform group-open:before:rotate-180 after:absolute after:w-[2px] after:h-3.5 after:bg-current after:transition-transform group-open:after:rotate-90"></span>
                </summary>
                <p className="text-[#667085] leading-[1.6] m-0">
                  Some universities may accept MOI, PTE, or no-test pathways depending on your country, institution, and academic background.
                </p>
              </details>
              <details className="group bg-white border border-[#cfd5df] rounded-lg p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg text-[#111827] outline-none group-open:text-[#e01f26] group-open:mb-3 transition-colors">
                  Which country is best for me?
                  <span className="relative flex-shrink-0 ml-4 w-6 h-6 flex items-center justify-center before:absolute before:w-3.5 before:h-[2px] before:bg-current before:transition-transform group-open:before:rotate-180 after:absolute after:w-[2px] after:h-3.5 after:bg-current after:transition-transform group-open:after:rotate-90"></span>
                </summary>
                <p className="text-[#667085] leading-[1.6] m-0">
                  The best country depends on budget, subject, result, English score, career goals, and long-term plans.
                </p>
              </details>
              <details className="group bg-white border border-[#cfd5df] rounded-lg p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg text-[#111827] outline-none group-open:text-[#e01f26] group-open:mb-3 transition-colors">
                  Do you help with scholarships?
                  <span className="relative flex-shrink-0 ml-4 w-6 h-6 flex items-center justify-center before:absolute before:w-3.5 before:h-[2px] before:bg-current before:transition-transform group-open:before:rotate-180 after:absolute after:w-[2px] after:h-3.5 after:bg-current after:transition-transform group-open:after:rotate-90"></span>
                </summary>
                <p className="text-[#667085] leading-[1.6] m-0">
                  Yes. WES Associates can guide students toward suitable scholarship and tuition discount options.
                </p>
              </details>
              <details className="group bg-white border border-[#cfd5df] rounded-lg p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg text-[#111827] outline-none group-open:text-[#e01f26] group-open:mb-3 transition-colors">
                  What should I bring for counselling?
                  <span className="relative flex-shrink-0 ml-4 w-6 h-6 flex items-center justify-center before:absolute before:w-3.5 before:h-[2px] before:bg-current before:transition-transform group-open:before:rotate-180 after:absolute after:w-[2px] after:h-3.5 after:bg-current after:transition-transform group-open:after:rotate-90"></span>
                </summary>
                <p className="text-[#667085] leading-[1.6] m-0">
                  Bring academic certificates, transcripts, passport copy if available, English score if available, and your preferred country list.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="bg-[#080b12] text-white py-20 md:py-28" id="contact">
          <div className="max-w-[min(1160px,calc(100%-32px))] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="reveal flex-1 lg:max-w-[45%]">
              <p className="text-[#e01f26] font-black text-xs md:text-[13px] uppercase tracking-widest mb-2.5">Contact</p>
              <h2 className="text-3xl md:text-4xl lg:text-[clamp(32px,4vw,44px)] font-extrabold leading-[1.1] mb-5">Talk to WES Associates today.</h2>
              <p className="text-[#a1a1aa] text-lg md:text-[19px] leading-[1.6] m-0">
                Book your consultation and receive a student-focused plan for admission, scholarship, and visa guidance.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 flex-1">
              <article className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#e01f26]/30 reveal">
                <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Email</h3>
                <p className="text-[#a1a1aa] leading-[1.6] m-0">info@wesassociates.com</p>
              </article>
              <article className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#e01f26]/30 reveal">
                <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Phone</h3>
                <p className="text-[#a1a1aa] leading-[1.6] m-0">+880 1303-537667</p>
              </article>
              <article className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#e01f26]/30 reveal">
                <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Office hours</h3>
                <p className="text-[#a1a1aa] leading-[1.6] m-0">Saturday to Thursday, 10:00 AM - 7:00 PM</p>
              </article>
              <article className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#e01f26]/30 reveal">
                <h3 className="text-xl md:text-2xl font-extrabold mb-2.5">Consultation</h3>
                <p className="text-[#a1a1aa] leading-[1.6] m-0">Online and in-person appointment support available.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes heroRise {
          0% {
            opacity: 0;
            transform: translateY(88px) scale(0.98);
            filter: blur(8px);
          }
          70% {
            opacity: 1;
            transform: translateY(-5px) scale(1.01);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.7s ease,
            transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default WESAssociates;
