'use client';

import { motion } from 'framer-motion';
import { Download, FileText, Loader2, Save, Search, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useGetAllApplicationsQuery, useUpdateApplicationMutation } from '@/redux/features/application/applicationSlice';

interface DocumentItem { kind:string; label:string; name:string; url:string }
interface Application { _id:string; ownerEmail:string; fullName:string; age:number; englishProficiency:string; englishScore:string; selectedCountry:string; selectedCity:string; selectedUniversity:string; selectedCourseName:string; documents:DocumentItem[]; status:string; adminNote:string; createdAt:string; [key:string]:unknown }
interface Response { data?: { applications?:Application[]; total?:number } }

const downloadJson = (name:string, value:unknown) => { const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})); const link=document.createElement('a'); link.href=url; link.download=name; link.click(); URL.revokeObjectURL(url); };

export default function ApplicationAdminPage() {
  const [q,setQ]=useState('');
  const {data,isLoading,isError}=useGetAllApplicationsQuery(undefined) as {data?:Response;isLoading:boolean;isError:boolean};
  const [updateApplication,{isLoading:isSaving}]=useUpdateApplicationMutation();
  const applications=useMemo(() => data?.data?.applications || [], [data]);
  const filtered=useMemo(()=>applications.filter(item=>[item.fullName,item.ownerEmail,item.selectedCountry,item.selectedUniversity].some(value=>String(value).toLowerCase().includes(q.toLowerCase()))),[applications,q]);

  const save=async(application:Application, form:HTMLFormElement)=>{const values=new FormData(form);try{await updateApplication({id:application._id,scope:'all',status:values.get('status'),adminNote:values.get('adminNote')}).unwrap();toast.success('Application review updated');}catch{toast.error('Unable to update review');}};

  if(isLoading)return <div className="flex min-h-[60vh] items-center justify-center text-white"><Loader2 className="h-8 w-8 animate-spin text-violet-400"/></div>;

  return <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-10">
    <motion.header initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-gradient-to-r from-violet-500/15 via-cyan-500/10 to-emerald-500/10 p-6 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Admission command center</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">All applications</h1><p className="mt-2 text-white/50">{applications.length} applicant records with uploaded documents.</p></div><button onClick={()=>downloadJson('all-applications.json',applications)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-slate-950"><Download className="h-4 w-4"/>Download all data</button></div>
    </motion.header>
    <div className="mx-auto mt-6 max-w-7xl"><div className="relative"><Search className="absolute left-4 top-3.5 h-4 w-4 text-white/35"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, email, country or university" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 outline-none focus:border-violet-400/50"/></div></div>
    <div className="mx-auto mt-6 grid max-w-7xl gap-5 xl:grid-cols-2">
      {isError&&<p className="rounded-2xl bg-rose-500/10 p-5 text-rose-300">Unable to load applications. Confirm this role has Application read access.</p>}
      {filtered.map((application,index)=><motion.form key={application._id} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:index*.04}} onSubmit={event=>{event.preventDefault();void save(application,event.currentTarget);}} className="rounded-3xl border border-white/10 bg-white/[.055] p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="truncate text-xl font-black">{application.fullName}</h2><p className="truncate text-xs text-cyan-300">{application.ownerEmail}</p></div><button type="button" onClick={()=>downloadJson(`application-${application._id}.json`,application)} className="rounded-lg bg-white/10 p-2.5" title="Download application data"><Download className="h-4 w-4"/></button></div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-black/20 p-3"><p className="text-[10px] uppercase text-white/35">Destination</p><p className="mt-1 font-bold">{application.selectedCity}, {application.selectedCountry}</p></div><div className="rounded-xl bg-black/20 p-3"><p className="text-[10px] uppercase text-white/35">Course</p><p className="mt-1 font-bold">{application.selectedCourseName}</p></div><div className="col-span-2 rounded-xl bg-black/20 p-3"><p className="text-[10px] uppercase text-white/35">University</p><p className="mt-1 font-bold">{application.selectedUniversity}</p></div></div>
        <div className="mt-4 flex flex-wrap gap-2">{application.documents.map(doc=><a key={doc.kind} href={doc.url} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-1.5 rounded-lg bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-200"><FileText className="h-4 w-4"/>{doc.label}</a>)}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-[150px_1fr]"><select name="status" defaultValue={application.status} className="h-11 rounded-xl border border-white/10 bg-slate-900 px-3">{['submitted','in_review','approved','rejected'].map(status=><option key={status}>{status}</option>)}</select><textarea name="adminNote" defaultValue={application.adminNote} rows={2} placeholder="Internal/applicant note" className="rounded-xl border border-white/10 bg-black/20 p-3 outline-none focus:border-violet-400/50"/></div>
        <button disabled={isSaving} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 font-black"><Save className="h-4 w-4"/>Save review</button>
      </motion.form>)}
      {!isError&&filtered.length===0&&<div className="xl:col-span-2 rounded-3xl border border-dashed border-white/15 p-12 text-center text-white/45"><UsersRound className="mx-auto h-10 w-10"/><p className="mt-3">No applications found.</p></div>}
    </div>
  </main>;
}
