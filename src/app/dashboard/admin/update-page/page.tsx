'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3, FileText, Layers3, Loader2, RefreshCw, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetPagesQuery } from '@/redux/features/page-builder/pageBuilderSlice';

const COOLDOWN_MS = 2 * 60 * 1000;
const STORAGE_KEY = 'wes-last-revalidation-v1';

type RevalidationKind = 'component' | 'page';

interface RevalidationItem {
  id: string;
  name: string;
  displayPath: string;
  targetPath: string;
  targetType: 'page' | 'layout';
  kind: RevalidationKind;
}

interface PageRecord {
  _id?: unknown;
  pageName?: unknown;
  pageTitle?: unknown;
  path?: unknown;
  pagePath?: unknown;
  subPage?: unknown;
}

const componentItems: RevalidationItem[] = [
  { id: 'top-banner', name: 'Top Banner', displayPath: 'src/components/common/Menu/TopBanner.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'mobile-primary-menu', name: 'Menu - Mobile - Primary Menu', displayPath: 'src/components/common/Menu/PrimaryMenu.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'mobile-navigation', name: 'Menu - Mobile - Navigation', displayPath: 'src/components/common/Menu/MenuClient.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'tablet-primary-menu', name: 'Menu - Tablet - Primary Menu', displayPath: 'src/components/common/Menu/PrimaryMenu.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'tablet-navigation', name: 'Menu - Tablet - Navigation', displayPath: 'src/components/common/Menu/MenuClient.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'desktop-primary-menu', name: 'Menu - Desktop - Primary Menu', displayPath: 'src/components/common/Menu/PrimaryMenu.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'desktop-navigation', name: 'Menu - Desktop - Navigation', displayPath: 'src/components/common/Menu/MenuClient.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'admin-mobile-primary-menu', name: 'Menu - Mobile - Primary Menu Admin', displayPath: 'src/app/dashboard/layout.tsx', targetPath: '/dashboard', targetType: 'layout', kind: 'component' },
  { id: 'admin-mobile-navigation', name: 'Menu - Mobile - Navigation Admin', displayPath: 'src/app/dashboard/layout.tsx', targetPath: '/dashboard', targetType: 'layout', kind: 'component' },
  { id: 'footer', name: 'Footer', displayPath: 'src/components/common/Footer/FooterServer.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'install-popup', name: 'Install Popup', displayPath: 'src/components/common/PWAPopUp.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
  { id: 'whatsapp', name: 'WhatsApp', displayPath: 'src/components/common/WhatsAppButton.tsx', targetPath: '/', targetType: 'layout', kind: 'component' },
];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const normalizePath = (value: unknown) => {
  const path = typeof value === 'string' ? value.trim() : '';
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
};

const flattenPages = (value: unknown): RevalidationItem[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry, index) => {
    if (!isRecord(entry)) return [];
    const page = entry as PageRecord;
    const path = normalizePath(page.path || page.pagePath);
    const id = String(page._id || `${path}-${index}`);
    const current: RevalidationItem = {
      id: `page-${id}`,
      name: String(page.pageName || page.pageTitle || 'Untitled Page'),
      displayPath: path,
      targetPath: path,
      targetType: 'page',
      kind: 'page',
    };

    return [current, ...flattenPages(page.subPage)];
  });
};

const formatLastRevalidation = (timestamp?: number) => {
  if (!timestamp) return 'Never';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
};

export default function UpdatePage() {
  const { data: pagesData, isLoading, isError, refetch } = useGetPagesQuery({ page: 1, limit: 100 });
  const [lastRevalidations, setLastRevalidations] = useState<Record<string, number>>({});
  const [selectedItem, setSelectedItem] = useState<RevalidationItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLastRevalidations(JSON.parse(stored) as Record<string, number>);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const pageItems = useMemo(() => {
    if (!isRecord(pagesData) || !isRecord(pagesData.data)) return [];
    return flattenPages(pagesData.data.pages);
  }, [pagesData]);

  const matchesSearch = (item: RevalidationItem) => {
    const query = search.trim().toLowerCase();
    return !query || item.name.toLowerCase().includes(query) || item.displayPath.toLowerCase().includes(query);
  };

  const filteredComponents = componentItems.filter(matchesSearch);
  const filteredPages = pageItems.filter(matchesSearch);

  const remainingSeconds = (item: RevalidationItem) => Math.max(0, Math.ceil(((lastRevalidations[item.id] || 0) + COOLDOWN_MS - now) / 1000));

  const persistRevalidation = (id: string, timestamp: number) => {
    setLastRevalidations(current => {
      const next = { ...current, [id]: timestamp };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleRevalidate = async () => {
    if (!selectedItem || remainingSeconds(selectedItem) > 0) return;

    const item = selectedItem;
    setSelectedItem(null);
    setUpdatingId(item.id);

    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemKey: item.id, path: item.targetPath, type: item.targetType }),
      });
      const result = (await response.json()) as { message?: string; lastRevalidatedAt?: number; retryAfterMs?: number };

      if (!response.ok) {
        if (response.status === 429 && result.lastRevalidatedAt) persistRevalidation(item.id, result.lastRevalidatedAt);
        throw new Error(result.message || 'Revalidation failed');
      }

      persistRevalidation(item.id, result.lastRevalidatedAt || Date.now());
      toast.success(`${item.name} revalidated successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Revalidation failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const renderItem = (item: RevalidationItem, index: number) => {
    const seconds = remainingSeconds(item);
    const isUpdating = updatingId === item.id;
    const disabled = seconds > 0 || isUpdating;

    return (
      <motion.article
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.025, 0.3), duration: 0.28 }}
        whileHover={{ y: -2 }}
        className="group grid gap-2 rounded-sm border border-amber-200/80 bg-white/75 p-2.5 shadow-[0_8px_30px_rgba(120,86,30,0.07)] backdrop-blur-sm transition-shadow hover:shadow-[0_12px_35px_rgba(120,86,30,0.13)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
      >
        <div className="flex min-w-0 items-start gap-2.5">
          <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-sm border ${item.kind === 'page' ? 'border-violet-200 bg-violet-50 text-violet-600' : 'border-orange-200 bg-orange-50 text-orange-600'}`}>
            {item.kind === 'page' ? <FileText className="h-4 w-4" /> : <Layers3 className="h-4 w-4" />}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-stone-800">{item.name}</h3>
            <p className="mt-0.5 truncate font-mono text-[10px] text-stone-500" title={item.displayPath}>{item.displayPath}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-amber-100 pt-2 sm:justify-end sm:border-0 sm:pt-0">
          <div className="min-w-[118px] text-right">
            <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Last revalidation</p>
            <p className="mt-0.5 text-[10px] font-semibold text-stone-600">{formatLastRevalidation(lastRevalidations[item.id])}</p>
          </div>
          <Button
            size="sm"
            disabled={disabled}
            onClick={() => setSelectedItem(item)}
            className="h-8 min-w-[92px] rounded-sm bg-gradient-to-r from-orange-500 to-rose-500 px-3 text-xs font-bold text-white shadow-sm transition-all hover:from-orange-600 hover:to-rose-600 disabled:from-stone-300 disabled:to-stone-300"
          >
            {isUpdating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : seconds > 0 ? <Clock3 className="mr-1.5 h-3.5 w-3.5" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
            {isUpdating ? 'Updating' : seconds > 0 ? `${seconds}s` : 'Update'}
          </Button>
        </div>
      </motion.article>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf0] p-2 text-stone-800 sm:p-3">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 animate-pulse rounded-full bg-orange-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-52 h-72 w-72 animate-pulse rounded-full bg-violet-200/30 blur-3xl [animation-delay:700ms]" />

      <div className="relative mx-auto max-w-6xl space-y-3">
        <motion.header
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-hidden rounded-sm border border-orange-200 bg-white/80 p-3 shadow-[0_14px_45px_rgba(120,86,30,0.1)] backdrop-blur-xl sm:p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <motion.span animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200">
                <Sparkles className="h-5 w-5" />
              </motion.span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight sm:text-2xl">Revalidation Center</h1>
                  <span className="rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">On demand</span>
                </div>
                <p className="mt-0.5 max-w-xl text-xs text-stone-500">Refresh cached pages and shared components safely. Each item pauses for two minutes after an update.</p>
              </div>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
              <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name or path..." className="h-9 rounded-sm border-orange-200 bg-[#fffdf8] pl-8 text-xs focus-visible:ring-orange-300" />
            </div>
          </div>
        </motion.header>

        <section className="rounded-sm border border-orange-200/80 bg-[#fffdf8]/80 p-2.5 shadow-sm sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-black text-stone-800">Component items</h2>
              <p className="text-[10px] text-stone-500">Shared website and dashboard surfaces</p>
            </div>
            <span className="rounded-sm bg-orange-100 px-2 py-1 text-[10px] font-black text-orange-700">{filteredComponents.length}</span>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">{filteredComponents.map(renderItem)}</div>
        </section>

        <section className="rounded-sm border border-violet-200/80 bg-[#fffdf8]/80 p-2.5 shadow-sm sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-black text-stone-800">Pages</h2>
              <p className="text-[10px] text-stone-500">Live routes fetched from Page Builder</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading} className="h-7 rounded-sm border-violet-200 bg-white px-2 text-[10px] text-violet-700">
                <RefreshCw className={`mr-1 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} /> Refresh list
              </Button>
              <span className="rounded-sm bg-violet-100 px-2 py-1 text-[10px] font-black text-violet-700">{filteredPages.length}</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-28 items-center justify-center gap-2 rounded-sm border border-dashed border-violet-200 bg-violet-50/40 text-xs font-semibold text-violet-600"><Loader2 className="h-4 w-4 animate-spin" /> Loading Page Builder data...</div>
          ) : isError ? (
            <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-rose-200 bg-rose-50/50 text-center text-xs text-rose-700"><p className="font-bold">Page list could not be loaded.</p><Button size="sm" variant="outline" onClick={() => refetch()} className="h-7 rounded-sm border-rose-200 bg-white text-[10px]">Try again</Button></div>
          ) : filteredPages.length ? (
            <div className="grid gap-2 lg:grid-cols-2">{filteredPages.map(renderItem)}</div>
          ) : (
            <div className="flex min-h-28 items-center justify-center rounded-sm border border-dashed border-violet-200 bg-violet-50/40 text-xs text-stone-500">No matching Page Builder pages found.</div>
          )}
        </section>

        <div className="flex items-center justify-center gap-1.5 pb-1 text-[10px] font-medium text-stone-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Confirmation and server-side cooldown protection enabled</div>
      </div>

      <AlertDialog open={Boolean(selectedItem)} onOpenChange={open => !open && setSelectedItem(null)}>
        <AlertDialogContent className="rounded-sm border-orange-200 bg-[#fffaf0] p-4 shadow-2xl sm:max-w-md">
          <AlertDialogHeader className="gap-1.5 text-left">
            <div className="mb-1 grid h-9 w-9 place-items-center rounded-sm bg-orange-100 text-orange-600"><RefreshCw className="h-4 w-4" /></div>
            <AlertDialogTitle className="text-lg text-stone-900">Confirm revalidation</AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-5 text-stone-600">Update <strong className="text-stone-800">{selectedItem?.name}</strong>? Its cached output will be refreshed and this action will be unavailable for two minutes.</AlertDialogDescription>
            <code className="mt-1 overflow-hidden text-ellipsis rounded-sm border border-orange-200 bg-white px-2 py-1.5 text-[10px] text-stone-500">{selectedItem?.displayPath}</code>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 flex-row justify-end">
            <AlertDialogCancel className="h-8 rounded-sm border-stone-200 bg-white px-3 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevalidate} className="h-8 rounded-sm bg-gradient-to-r from-orange-500 to-rose-500 px-3 text-xs text-white hover:from-orange-600 hover:to-rose-600">Yes, update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
