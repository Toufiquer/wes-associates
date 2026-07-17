'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, FileCheck2, GraduationCap, Loader2, Send, Sparkles, UploadCloud, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { UploadButton } from '@/lib/uploadthing';
import { useSession } from '@/lib/auth-client';
import { useAddApplicationMutation } from '@/redux/features/application/applicationSlice';

interface UploadedDocument { kind: string; label: string; name: string; url: string; key: string; type: string; size: number }
interface Course { id: string; name: string; tutionFees: string; duration: string }
interface University { id: string; name: string; location: string; courses: Course[] }
interface Country { _id: string; country: string; city: string[]; universitys: University[] }
interface ServiceResponse { data?: { serviceCountries?: Country[] } }

const documentTypes = [
  { kind: 'passport', label: 'Passport', required: false },
  { kind: 'sscCertificate', label: 'SSC Certificate', required: true },
  { kind: 'hscCertificate', label: 'HSC Certificate', required: true },
  { kind: 'bscCertificate', label: 'B.Sc Certificate', required: false },
  { kind: 'mscCertificate', label: 'M.Sc Certificate', required: false },
];

const initialForm = {
  fullName: '', age: '', fatherName: '', motherName: '', englishProficiency: '', englishScore: '',
  otherCurriculum: '', selectedCountry: '', selectedCity: '', selectedUniversity: '', selectedCourseName: '', selectedCourseSubject: '',
};

const fieldClass = 'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 disabled:opacity-40';
const panel = 'rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8';

export default function StudentApplicationPage() {
  const session = useSession();
  const [form, setForm] = useState(initialForm);
  const [countries, setCountries] = useState<Country[]>([]);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [addApplication, { isLoading }] = useAddApplicationMutation();

  useEffect(() => {
    fetch('/api/service/v1?page=1&limit=100', { cache: 'no-store' })
      .then(response => response.json())
      .then((payload: ServiceResponse) => setCountries(payload.data?.serviceCountries || []))
      .catch(() => toast.error('Unable to load study destinations'))
      .finally(() => setLoadingCountries(false));
  }, []);

  const country = countries.find(item => item.country === form.selectedCountry);
  const universities = useMemo(
    () => (country?.universitys || []).filter(item => !form.selectedCity || item.location === form.selectedCity),
    [country, form.selectedCity],
  );
  const university = universities.find(item => item.name === form.selectedUniversity);
  const course = university?.courses.find(item => item.name === form.selectedCourseName);

  const update = (name: string, value: string) => {
    setForm(current => {
      if (name === 'selectedCountry') return { ...current, selectedCountry: value, selectedCity: '', selectedUniversity: '', selectedCourseName: '' };
      if (name === 'selectedCity') return { ...current, selectedCity: value, selectedUniversity: '', selectedCourseName: '' };
      if (name === 'selectedUniversity') return { ...current, selectedUniversity: value, selectedCourseName: '' };
      return { ...current, [name]: value };
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session.data?.user) return toast.error('Please sign in before submitting');
    const missing = documentTypes.filter(item => item.required && !documents.some(document => document.kind === item.kind));
    if (missing.length) return toast.error(`Upload ${missing.map(item => item.label).join(' and ')}`);
    try {
      await addApplication({ ...form, selectedCourseSubject: course?.id || '', documents }).unwrap();
      setSubmitted(true);
      toast.success('Application submitted successfully');
    } catch (error) {
      const value = error as { data?: { message?: string } };
      toast.error(value.data?.message || 'Application submission failed');
    }
  };

  if (submitted) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white"><motion.div initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-10 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" /><h1 className="mt-5 text-3xl font-black">Application received</h1><p className="mt-3 text-white/60">Track and update it from My Application in your dashboard.</p><button onClick={() => { setForm(initialForm); setDocuments([]); setSubmitted(false); }} className="mt-7 rounded-xl bg-white px-5 py-3 font-bold text-slate-950">Submit another</button></motion.div></main>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0"><div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" /><div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" /></div>
      <form onSubmit={submit} className="relative mx-auto max-w-6xl space-y-7">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-300"><Sparkles className="h-4 w-4" /> Your global future starts here</span>
          <h1 className="mt-5 bg-gradient-to-r from-white via-cyan-100 to-violet-300 bg-clip-text text-4xl font-black text-transparent sm:text-5xl lg:text-7xl">University application</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">Complete your profile, upload verified documents through UploadThing, and choose your destination.</p>
        </motion.header>

        {!session.isPending && !session.data?.user && <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-center text-sm text-amber-200">You must sign in before submitting this application.</div>}

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={panel}>
          <h2 className="mb-6 flex items-center gap-3 text-xl font-black"><UserRound className="text-cyan-300" /> Personal information</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['fullName','Full name','text'], ['age','Age','number'], ['fatherName',"Father's name",'text'], ['motherName',"Mother's name",'text'],
              ['englishScore','English test score','text'],
            ].map(([name,label,type]) => <label key={name} className="space-y-2"><span className="text-xs font-bold text-white/55">{label}</span><input required type={type} value={form[name as keyof typeof form]} onChange={e => update(name,e.target.value)} className={fieldClass} /></label>)}
            <label className="space-y-2"><span className="text-xs font-bold text-white/55">English test</span><select required value={form.englishProficiency} onChange={e => update('englishProficiency',e.target.value)} className={fieldClass}><option value="" className="bg-slate-900">Select</option>{['IELTS','PTE','TOEFL','Duolingo'].map(value => <option key={value} className="bg-slate-900">{value}</option>)}</select></label>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className={panel}>
          <h2 className="mb-6 flex items-center gap-3 text-xl font-black"><UploadCloud className="text-violet-300" /> UploadThing documents</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentTypes.map(item => {
              const uploaded = documents.find(document => document.kind === item.kind);
              return <div key={item.kind} className="rounded-2xl border border-white/10 bg-black/15 p-4"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold">{item.label}{item.required && <span className="text-rose-400"> *</span>}</p>{uploaded && <FileCheck2 className="h-5 w-5 text-emerald-400" />}</div>{uploaded ? <div><p className="truncate text-xs text-white/55">{uploaded.name}</p><button type="button" onClick={() => setDocuments(current => current.filter(document => document.kind !== item.kind))} className="mt-3 text-xs font-bold text-rose-300">Remove</button></div> : <UploadButton endpoint="documentUploader" appearance={{ button: 'ut-ready:bg-violet-600 h-9 rounded-lg px-3 text-xs font-bold', allowedContent: 'text-[10px] text-white/35' }} onBeforeUploadBegin={files => files.slice(0,1)} onClientUploadComplete={files => { const file = files[0]; if (!file) return; const data = file as unknown as { name:string; ufsUrl?:string; url?:string; key:string; type:string; size:number }; setDocuments(current => [...current.filter(document => document.kind !== item.kind), { kind:item.kind, label:item.label, name:data.name, url:data.ufsUrl || data.url || '', key:data.key, type:data.type, size:data.size }]); toast.success(`${item.label} uploaded`); }} onUploadError={error => { toast.error(error.message); }} />}</div>;
            })}
          </div>
          <label className="mt-5 block space-y-2"><span className="text-xs font-bold text-white/55">Other curriculum activities</span><textarea rows={4} value={form.otherCurriculum} onChange={e => update('otherCurriculum',e.target.value)} className={`${fieldClass} h-auto py-3`} /></label>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className={panel}>
          <h2 className="mb-6 flex items-center gap-3 text-xl font-black"><GraduationCap className="text-emerald-300" /> Study destination</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name:'selectedCountry', label:'Country', values:countries.map(i=>i.country), disabled:loadingCountries },
              { name:'selectedCity', label:'City', values:country?.city || [], disabled:!country },
              { name:'selectedUniversity', label:'University', values:universities.map(i=>i.name), disabled:!form.selectedCity },
              { name:'selectedCourseName', label:'Course', values:university?.courses.map(i=>i.name) || [], disabled:!university },
            ].map(item => <label key={item.name} className="relative space-y-2"><span className="text-xs font-bold text-white/55">{item.label}</span><select required disabled={item.disabled} value={form[item.name as keyof typeof form]} onChange={e => update(item.name,e.target.value)} className={`${fieldClass} appearance-none`}><option value="" className="bg-slate-900">Select {item.label.toLowerCase()}</option>{item.values.map(value => <option key={value} className="bg-slate-900">{value}</option>)}</select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-white/40" /></label>)}
          </div>
          {course && <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4 text-sm text-emerald-100">{course.duration || 'Duration pending'} · {course.tutionFees || 'Tuition pending'}</div>}
        </motion.section>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end pb-12"><button disabled={isLoading || !session.data?.user} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-7 py-4 font-black shadow-xl shadow-cyan-500/15 transition hover:scale-[1.02] disabled:opacity-50 sm:w-auto">{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Submit application</button></motion.div>
      </form>
    </main>
  );
}
