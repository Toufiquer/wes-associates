/*
|-----------------------------------------
| setting up WhatsApp Admin Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import WhatsAppButtonEditor from './WhatsAppButtonEditor';

const Page = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 p-2 font-sans text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
          <h1 className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-2xl font-bold text-transparent">WhatsApp Button</h1>
          <p className="mt-1 text-xs text-white/50">Manage the floating WhatsApp contact button from its own admin route.</p>
        </div>
        <WhatsAppButtonEditor />
      </div>
    </main>
  );
};

export default Page;
