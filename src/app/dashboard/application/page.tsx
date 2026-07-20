'use client';

import { motion } from 'framer-motion';
import { Download, FileText, Loader2, Save, Search, Trash2, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteApplicationMutation, useGetAllApplicationsQuery, useUpdateApplicationMutation } from '@/redux/features/application/applicationSlice';

interface DocumentItem { kind:string; label:string; name:string; url:string }
interface Application { _id:string; ownerEmail:string; fullName:string; mobileWhatsApp:string; age?:number; englishProficiency:string; englishScore:string; selectedCountry:string; selectedCity:string; selectedUniversity:string; selectedCourseName:string; documents:DocumentItem[]; status:string; adminNote:string; createdAt:string; [key:string]:unknown }
interface Response { data?: { applications?:Application[]; total?:number } }

const downloadJson = (name:string, value:unknown) => { const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})); const link=document.createElement('a'); link.href=url; link.download=name; link.click(); URL.revokeObjectURL(url); };
const currentDateTime = () => {
  const now = new Date();
  const pad = (value:number) => String(value).padStart(2,'0');
  return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

export default function ApplicationAdminPage() {
  const [q,setQ]=useState('');
  const [isExporting,setIsExporting]=useState(false);
  const [deleteTarget,setDeleteTarget]=useState<Application|null>(null);
  const {data,isLoading,isError}=useGetAllApplicationsQuery(undefined) as {data?:Response;isLoading:boolean;isError:boolean};
  const [updateApplication,{isLoading:isSaving}]=useUpdateApplicationMutation();
  const [deleteApplication,{isLoading:isDeleting}]=useDeleteApplicationMutation();
  const applications=useMemo(() => data?.data?.applications || [], [data]);
  const filtered=useMemo(()=>applications.filter(item=>[item.fullName,item.mobileWhatsApp,item.ownerEmail,item.selectedCountry,item.selectedUniversity].some(value=>String(value || '').toLowerCase().includes(q.toLowerCase()))),[applications,q]);

  const save=async(application:Application, form:HTMLFormElement)=>{const values=new FormData(form);try{await updateApplication({id:application._id,scope:'all',status:values.get('status'),adminNote:values.get('adminNote')}).unwrap();toast.success('Application review updated');}catch{toast.error('Unable to update review');}};
  const confirmDelete=async()=>{if(!deleteTarget)return;try{await deleteApplication(deleteTarget._id).unwrap();toast.success('Application deleted successfully');setDeleteTarget(null);}catch{toast.error('Unable to delete application');}};
  const downloadAllData=async()=>{
    setIsExporting(true);
    try{
      const response=await fetch('/api/applicaton/v1/export',{cache:'no-store'});
      if(!response.ok){const error=await response.json().catch(()=>null) as {message?:string}|null;throw new Error(error?.message||'Unable to generate ZIP export');}
      const url=URL.createObjectURL(await response.blob());
      const link=document.createElement('a');
      link.href=url;
      link.download=`Applications-${currentDateTime()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Application ZIP downloaded');
    }catch(error){toast.error((error as Error).message||'Unable to download application data');}
    finally{setIsExporting(false);}
  };

  if(isLoading)return <div className="flex min-h-[60vh] items-center justify-center text-white"><Loader2 className="h-8 w-8 animate-spin text-violet-400"/></div>;

  return <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-10">
    <motion.header initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} className="mx-auto max-w-7xl rounded-sm border border-white/10 bg-gradient-to-r from-violet-500/15 via-cyan-500/10 to-emerald-500/10 p-6 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Admission command center</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">All applications</h1><p className="mt-2 text-white/50">{applications.length} applicant records with uploaded documents.</p></div><button type="button" disabled={isExporting} onClick={()=>void downloadAllData()} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-white px-5 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">{isExporting?<Loader2 className="h-4 w-4 animate-spin"/>:<Download className="h-4 w-4"/>}{isExporting?'Preparing ZIP...':'Download all data'}</button></div>
    </motion.header>
    <div className="mx-auto mt-6 max-w-7xl"><div className="relative"><Search className="absolute left-4 top-3.5 h-4 w-4 text-white/35"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, WhatsApp, email, country or university" className="h-11 w-full rounded-sm border border-white/10 bg-white/5 pl-11 pr-4 outline-none focus:border-violet-400/50"/></div></div>
    <div className="mx-auto mt-6 grid max-w-7xl gap-5 xl:grid-cols-2">
      {isError&&<p className="rounded-sm bg-rose-500/10 p-5 text-rose-300">Unable to load applications. Confirm this role has Application read access.</p>}
      {filtered.map((application,index)=><motion.form key={application._id} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:index*.04}} onSubmit={event=>{event.preventDefault();void save(application,event.currentTarget);}} className="rounded-sm border border-white/10 bg-white/[.055] p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="truncate text-xl font-black">{application.fullName}</h2><p className="truncate text-xs text-cyan-300">{application.ownerEmail}</p><p className="mt-1 truncate text-xs text-emerald-300">{application.mobileWhatsApp || 'No WhatsApp number'}</p></div><button type="button" onClick={()=>downloadJson(`application-${application._id}.json`,application)} className="cursor-pointer rounded-sm bg-white/10 p-2.5" title="Download application data"><Download className="h-4 w-4"/></button></div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-sm bg-black/20 p-3"><p className="text-[10px] uppercase text-white/35">Country</p><p className="mt-1 font-bold">{application.selectedCountry || 'Not provided'}</p></div><div className="rounded-sm bg-black/20 p-3"><p className="text-[10px] uppercase text-white/35">Course/Subject</p><p className="mt-1 font-bold">{application.selectedCourseName || 'Not provided'}</p></div><div className="col-span-2 rounded-sm bg-black/20 p-3"><p className="text-[10px] uppercase text-white/35">University</p><p className="mt-1 font-bold">{application.selectedUniversity || 'Not provided'}</p></div></div>
        <div className="mt-4 flex flex-wrap gap-2">{application.documents.map(doc=><a key={doc.kind} href={doc.url} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-1.5 rounded-sm bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-200"><FileText className="h-4 w-4"/>{doc.label}</a>)}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-[150px_1fr]"><select name="status" defaultValue={application.status} className="h-11 rounded-sm border border-white/10 bg-slate-900 px-3">{['submitted','in_review','approved','rejected'].map(status=><option key={status}>{status}</option>)}</select><textarea name="adminNote" defaultValue={application.adminNote} rows={2} placeholder="Internal/applicant note" className="rounded-sm border border-white/10 bg-black/20 p-3 outline-none focus:border-violet-400/50"/></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button disabled={isSaving} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 font-black disabled:cursor-not-allowed"><Save className="h-4 w-4"/>Save review</button>
          <button type="button" onClick={()=>setDeleteTarget(application)} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-rose-600 px-4 py-3 font-black transition hover:bg-rose-500"><Trash2 className="h-4 w-4"/>Delete</button>
        </div>
      </motion.form>)}
      {!isError&&filtered.length===0&&<div className="xl:col-span-2 rounded-sm border border-dashed border-white/15 p-12 text-center text-white/45"><UsersRound className="mx-auto h-10 w-10"/><p className="mt-3">No applications found.</p></div>}
    </div>
    <AlertDialog open={Boolean(deleteTarget)} onOpenChange={open=>!open&&setDeleteTarget(null)}>
      <AlertDialogContent className="max-w-md rounded-sm border-white/10 bg-zinc-950 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold"><Trash2 className="h-5 w-5 text-rose-400"/>Delete application?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-white/50">
            This will permanently delete the application from <strong className="text-white">{deleteTarget?.fullName}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="cursor-pointer rounded-sm border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={event=>{event.preventDefault();void confirmDelete();}}
            className="cursor-pointer rounded-sm bg-rose-600 text-white hover:bg-rose-500 disabled:cursor-not-allowed"
          >
            {isDeleting?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<Trash2 className="mr-2 h-4 w-4"/>}Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </main>;
}
