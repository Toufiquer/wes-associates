'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, FileCheck2, GraduationCap, Loader2, Send, UploadCloud, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { UploadButton } from '@/lib/uploadthing';
import { useSession } from '@/lib/auth-client';
import { trackApplicationSubmission } from '@/lib/fbp-and-gtm';
import { TIKTOK_PIXEL_CURRENCY, trackTikTokEvent } from '@/lib/tiktok-pixel';
import { useAddApplicationMutation } from '@/redux/features/application/applicationSlice';

interface UploadedDocument { kind: string; label: string; name: string; url: string; key: string; type: string; size: number }

const documentTypes = [
  { kind: 'passport', label: 'Passport' },
  { kind: 'sscCertificate', label: 'SSC Certificate' },
  { kind: 'hscCertificate', label: 'HSC Certificate' },
  { kind: 'bscCertificate', label: 'B.Sc Certificate' },
  { kind: 'mscCertificate', label: 'M.Sc Certificate' },
];

const initialForm = {
  fullName: '', mobileWhatsApp: '', age: '', fatherName: '', motherName: '', englishProficiency: '', englishScore: '',
  otherCurriculum: '', selectedCountry: '', selectedUniversity: '', selectedCourseName: '',
};

const fieldClass = 'h-11 w-full rounded-sm border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 disabled:opacity-40';
const panel = 'rounded-sm border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8';

export default function StudentApplicationPage() {
  const session = useSession();
  const [form, setForm] = useState(initialForm);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [addApplication, { isLoading }] = useAddApplicationMutation();

  const update = (name: string, value: string) => {
    setForm(current => ({ ...current, [name]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session.data?.user) return toast.error('Please sign in before submitting');
    try {
      const response = (await addApplication({ ...form, documents }).unwrap()) as { data?: { _id?: string } };
      trackApplicationSubmission({
        applicationId: response.data?._id,
        selectedCountry: form.selectedCountry,
        selectedUniversity: form.selectedUniversity,
        selectedCourseName: form.selectedCourseName,
        documentCount: documents.length,
      });
      trackTikTokEvent('SubmitForm', {
        content_id: response.data?._id,
        content_type: 'application',
        content_name: 'Student Application',
        selected_country: form.selectedCountry || undefined,
        selected_university: form.selectedUniversity || undefined,
        selected_course: form.selectedCourseName || undefined,
        document_count: documents.length,
        value: 0,
        currency: TIKTOK_PIXEL_CURRENCY,
      });
      setSubmitted(true);
      toast.success('Application submitted successfully');
    } catch (error) {
      const value = error as { data?: { message?: string } };
      toast.error(value.data?.message || 'Application submission failed');
    }
  };

  if (submitted) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white"><motion.div initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg rounded-sm border border-emerald-400/20 bg-emerald-400/10 p-10 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" /><h1 className="mt-5 text-3xl font-black">Application received</h1><p className="mt-3 text-white/60">Track and update it from My Application in your dashboard.</p><button onClick={() => { setForm(initialForm); setDocuments([]); setSubmitted(false); }} className="mt-7 rounded-sm bg-white px-5 py-3 font-bold text-slate-950">Submit another</button></motion.div></main>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0"><div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" /><div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" /></div>
      <form onSubmit={submit} className="relative mx-auto max-w-6xl space-y-7">
        {!session.isPending && !session.data?.user && <div className="rounded-sm border border-amber-400/20 bg-amber-400/10 p-4 text-center text-sm text-amber-200">You must sign in before submitting this application.</div>}

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={panel}>
          <h2 className="mb-6 flex items-center gap-3 text-xl font-black"><UserRound className="text-cyan-300" /> Personal information</h2>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['fullName','Full name','text'], ['mobileWhatsApp','Mobile/WhatsApp number','tel'], ['age','Age','number'],
              ].map(([name,label,type]) => <label key={name} className="space-y-2"><span className="text-xs font-bold text-white/55">{label}{(name === 'fullName' || name === 'mobileWhatsApp') && <span className="text-rose-400"> *</span>}</span><input required={name === 'fullName' || name === 'mobileWhatsApp'} type={type} value={form[name as keyof typeof form]} onChange={e => update(name,e.target.value)} className={fieldClass} /></label>)}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['fatherName',"Father's name"], ['motherName',"Mother's name"],
              ].map(([name,label]) => <label key={name} className="space-y-2"><span className="text-xs font-bold text-white/55">{label}</span><input type="text" value={form[name as keyof typeof form]} onChange={e => update(name,e.target.value)} className={fieldClass} /></label>)}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2"><span className="text-xs font-bold text-white/55">English test</span><select value={form.englishProficiency} onChange={e => update('englishProficiency',e.target.value)} className={fieldClass}><option value="" className="bg-slate-900">Select</option>{['IELTS','PTE','TOEFL','Duolingo'].map(value => <option key={value} className="bg-slate-900">{value}</option>)}</select></label>
              <label className="space-y-2"><span className="text-xs font-bold text-white/55">English test score</span><input type="text" value={form.englishScore} onChange={e => update('englishScore',e.target.value)} className={fieldClass} /></label>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className={panel}>
          <h2 className="mb-6 flex items-center gap-3 text-xl font-black"><UploadCloud className="text-violet-300" /> UploadThing documents</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentTypes.map(item => {
              const uploaded = documents.find(document => document.kind === item.kind);
              const isImage = Boolean(uploaded && (uploaded.type.startsWith('image/') || /\.(avif|gif|jpe?g|png|webp)(?:\?.*)?$/i.test(uploaded.url)));

              return (
                <div key={item.kind} className="relative rounded-sm border border-white/10 bg-black/15 p-4">
                  <p className="pr-9 text-sm font-bold">{item.label}</p>
                  {uploaded ? (
                    <>
                      <button
                        type="button"
                        aria-label={`Remove ${item.label}`}
                        title={`Remove ${item.label}`}
                        onClick={() => setDocuments(current => current.filter(document => document.kind !== item.kind))}
                        className="absolute right-2 top-2 z-10 rounded-sm border border-rose-300/30 bg-slate-950/85 p-1.5 text-rose-300 transition hover:bg-rose-500 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {isImage ? (
                        <div className="mt-3 overflow-hidden rounded-sm border border-white/10 bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={uploaded.url} alt={`${item.label} preview`} className="h-40 w-full object-contain" />
                        </div>
                      ) : (
                        <div className="mt-3 flex h-40 items-center justify-center rounded-sm border border-white/10 bg-white/5">
                          <FileCheck2 className="h-10 w-10 text-emerald-400" />
                        </div>
                      )}
                      <p className="mt-2 truncate text-xs text-white/55">{uploaded.name}</p>
                    </>
                  ) : (
                    <div className="mt-3">
                      <UploadButton
                        endpoint="documentUploader"
                        appearance={{ button: 'ut-ready:bg-violet-600 h-9 rounded-sm px-3 text-xs font-bold', allowedContent: 'text-[10px] text-white/35' }}
                        onBeforeUploadBegin={files => files.slice(0,1)}
                        onClientUploadComplete={files => {
                          const file = files[0];
                          if (!file) return;
                          const data = file as unknown as { name:string; ufsUrl?:string; url?:string; key:string; type:string; size:number };
                          setDocuments(current => [
                            ...current.filter(document => document.kind !== item.kind),
                            { kind:item.kind, label:item.label, name:data.name, url:data.ufsUrl || data.url || '', key:data.key, type:data.type, size:data.size },
                          ]);
                          toast.success(`${item.label} uploaded`);
                        }}
                        onUploadError={error => { toast.error(error.message); }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <label className="mt-5 block space-y-2"><span className="text-xs font-bold text-white/55">Other curriculum activities</span><textarea rows={4} value={form.otherCurriculum} onChange={e => update('otherCurriculum',e.target.value)} className={`${fieldClass} h-auto py-3`} /></label>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className={panel}>
          <h2 className="mb-6 flex items-center gap-3 text-xl font-black"><GraduationCap className="text-emerald-300" /> Study destination</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name:'selectedCountry', label:'Country' },
              { name:'selectedUniversity', label:'University' },
              { name:'selectedCourseName', label:'Course/Subject' },
            ].map(item => <label key={item.name} className="space-y-2"><span className="text-xs font-bold text-white/55">{item.label}</span><input type="text" value={form[item.name as keyof typeof form]} onChange={e => update(item.name,e.target.value)} className={fieldClass} /></label>)}
          </div>
        </motion.section>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end pb-12"><button disabled={isLoading || !session.data?.user} className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-cyan-500 to-violet-600 px-7 py-4 font-black shadow-xl shadow-cyan-500/15 transition hover:scale-[1.02] disabled:opacity-50 sm:w-auto">{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Submit application</button></motion.div>
      </form>
    </main>
  );
}
