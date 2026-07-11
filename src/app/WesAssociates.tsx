'use client';

import React, { useState, useEffect } from 'react';

const WESAssociates = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <section className="relative min-h-[calc(100vh-124px)] flex items-center justify-center py-24 overflow-hidden bg-[#ffffff] [background-image:linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),radial-gradient(circle_at_50%_8%,rgba(224,31,38,0.08),transparent_28%)] [background-size:44px_44px,44px_44px,auto,auto]">
          <div className="relative z-10 w-[min(1120px,calc(100%-32px))] mx-auto text-center">
            <h1 className="text-[clamp(42px,6.4vw,98px)] font-[950] leading-[0.98] text-[#121927]">
              <span className="block opacity-0 animate-[heroRise_0.9s_cubic-bezier(0.2,0.8,0.2,1)_0.14s_forwards]">ভয়কে জয় করে</span>
              <span className="block mt-3 text-[clamp(40px,6.9vw,112px)] leading-[1.04] opacity-0 animate-[heroRise_0.9s_cubic-bezier(0.2,0.8,0.2,1)_0.34s_forwards]">
                <span className="whitespace-nowrap">
                  <span className="text-[#5b6373]">STUDY ABROAD</span>-এ
                </span>{' '}
                <span className="text-[#e01f26]">সফল হোন</span>
              </span>
            </h1>
            <p className="max-w-[720px] mx-auto mt-10 text-[clamp(18px,2.2vw,26px)] font-bold leading-[1.35] text-[#485263] opacity-0 animate-[heroRise_0.95s_cubic-bezier(0.2,0.8,0.2,1)_0.58s_forwards]">
              <strong>সঠিক গাইডলাইন</strong> নিয়ে বিদেশে পড়াশোনার স্বপ্ন পূরণ করুন - <span className="text-[#e01f26] font-extrabold">WES Associates</span>{' '}
              আপনাকে দেশ, বিশ্ববিদ্যালয়, স্কলারশিপ ও ভিসা প্রস্তুতিতে সহায়তা করবে।
            </p>
            <div className="flex justify-center gap-4 mt-10 opacity-0 animate-[heroRise_0.9s_cubic-bezier(0.2,0.8,0.2,1)_0.82s_forwards]">
              <a
                href="#appointment"
                className="flex items-center justify-center min-w-[188px] min-h-[58px] bg-[#e01f26] text-white font-extrabold text-[17px] hover:bg-[#bd1118] transition-all"
              >
                অ্যাডমিশন ওপেন
              </a>
              <a
                href="#countries"
                className="flex items-center justify-center min-w-[188px] min-h-[58px] bg-white/70 border-2 border-[#cfd5df] font-extrabold text-[17px] hover:text-[#e01f26] hover:border-[#e01f26] transition-all"
              >
                দেশ দেখুন
              </a>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-[#e8ebf0] rounded-lg shadow-[0_18px_45px_rgba(17,24,39,0.1)] overflow-hidden">
              {[
                { n: '12+', t: 'Popular study destinations' },
                { n: '100%', t: 'Transparent admission process' },
                { n: '1:1', t: 'Personalized counselling' },
                { n: '24h', t: 'Quick response for students' },
              ].map((stat, i) => (
                <div key={i} className="p-7 border-r border-[#e8ebf0] last:border-0 hover:bg-[#fff8f8] transition-all cursor-default">
                  <strong className="block text-[#e01f26] text-[34px] leading-none mb-2">{stat.n}</strong>
                  <span className="text-sm font-medium text-gray-600">{stat.t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Note: In a production app, the remaining sections would follow this component pattern */}
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
