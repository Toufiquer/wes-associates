'use client';

import { motion } from 'framer-motion';
import { Clock3, FileText, Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';

import { useSession } from '@/lib/auth-client';
import { useGetMyApplicationsQuery, useUpdateApplicationMutation } from '@/redux/features/application/applicationSlice';

interface DocumentItem { kind:string; label:string; name:string; url:string }
interface Application {
  _id:string; fullName:string; mobileWhatsApp:string; age?:number; fatherName:string; motherName:string; englishProficiency:string; englishScore:string;
  otherCurriculum:string; selectedCountry:string; selectedCity:string; selectedUniversity:string; selectedCourseName:string;
  selectedCourseSubject:string; documents:DocumentItem[]; status:string; adminNote:string; createdAt:string;
}
interface Response { data?: { applications?: Application[] } }

const statusColor: Record<string,string> = { submitted:'bg-cyan-400/10 text-cyan-300', in_review:'bg-amber-400/10 text-amber-300', approved:'bg-emerald-400/10 text-emerald-300', rejected:'bg-rose-400/10 text-rose-300' };

export default function MyApplicationPage() {
  const session = useSession();
  const { data, isLoading, isError } = useGetMyApplicationsQuery(undefined, { skip: !session.data?.user }) as { data?:Response; isLoading:boolean; isError:boolean };
  const [updateApplication, { isLoading:isSaving }] = useUpdateApplicationMutation();
  const applications = data?.data?.applications || [];

  const save = async (application:Application, form:HTMLFormElement) => {
    const values = new FormData(form);
    try {
      await updateApplication({ ...application, id:application._id, fullName:values.get('fullName'), mobileWhatsApp:values.get('mobileWhatsApp'), age:values.get('age'), fatherName:values.get('fatherName'), motherName:values.get('motherName'), englishScore:values.get('englishScore'), otherCurriculum:values.get('otherCurriculum') }).unwrap();
      toast.success('Your application was updated');
    } catch { toast.error('Unable to update your application'); }
  };

  if (session.isPending || isLoading) return <div className="flex min-h-[60vh] items-center justify-center text-white"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-10">
      <motion.header initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Private applicant workspace</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">My applications</h1><p className="mt-3 text-white/55">Only applications owned by {session.data?.user.email} are shown here.</p>
      </motion.header>
      <div className="mx-auto mt-7 max-w-6xl space-y-6">
        {isError && <p className="rounded-2xl bg-rose-500/10 p-5 text-rose-300">Unable to load your applications.</p>}
        {!isError && applications.length===0 && <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center text-white/50">You have not submitted an application yet.</div>}
        {applications.map((application,index) => (
          <motion.form key={application._id} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:index*.06}} onSubmit={event=>{event.preventDefault(); void save(application,event.currentTarget);}} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.055] shadow-2xl">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><h2 className="text-xl font-black">{application.selectedCourseName || 'Course/Subject not provided'}</h2><p className="mt-1 text-sm text-white/45">{[application.selectedUniversity, application.selectedCountry].filter(Boolean).join(' · ') || 'Study destination not provided'}</p></div><span className={`self-start rounded-full px-3 py-1.5 text-xs font-black uppercase ${statusColor[application.status] || statusColor.submitted}`}>{application.status.replace('_',' ')}</span></div>
            <div className="grid gap-5 p-5 md:grid-cols-2 sm:p-7">
              {[['fullName','Full name',application.fullName],['mobileWhatsApp','Mobile/WhatsApp number',application.mobileWhatsApp],['age','Age',application.age],['fatherName',"Father's name",application.fatherName],['motherName',"Mother's name",application.motherName],['englishScore','English test score',application.englishScore]].map(([name,label,value])=><label key={String(name)} className="space-y-2"><span className="text-xs font-bold text-white/45">{label}{(name === 'fullName' || name === 'mobileWhatsApp') && <span className="text-rose-400"> *</span>}</span><input required={name === 'fullName' || name === 'mobileWhatsApp'} name={String(name)} defaultValue={value == null ? '' : String(value)} className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-cyan-400/50" /></label>)}
              <label className="space-y-2 md:col-span-2"><span className="text-xs font-bold text-white/45">Other curriculum</span><textarea name="otherCurriculum" defaultValue={application.otherCurriculum} rows={3} className="w-full rounded-xl border border-white/10 bg-black/20 p-4 outline-none focus:border-cyan-400/50" /></label>
            </div>
            <div className="flex flex-col gap-4 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div className="flex flex-wrap gap-2">{application.documents.map(doc=><a key={doc.kind} href={doc.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-200"><FileText className="h-4 w-4" />{doc.label}</a>)}</div><button disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950"><Save className="h-4 w-4" />Save changes</button></div>
            {application.adminNote && <div className="m-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100 sm:m-7"><Clock3 className="mr-2 inline h-4 w-4" /><strong>Admission team:</strong> {application.adminNote}</div>}
          </motion.form>
        ))}
      </div>
    </main>
  );
}
