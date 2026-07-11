'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, ExternalLink, FolderOpen, Layout, X, AlertTriangle, RefreshCw, Database, MoreVertical } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useGetPagesQuery, useAddPageMutation, useUpdatePageMutation, useDeletePageMutation } from '@/redux/features/page-builder/pageBuilderSlice';

interface IPage {
  _id: string;
  pageName: string;
  path: string;
  isActive: boolean;
}

const isPageRecord = (item: unknown): item is Record<string, unknown> => typeof item === 'object' && item !== null;

const Page = () => {
  const router = useRouter();
  const { data: pagesData, isLoading, error, refetch } = useGetPagesQuery({ page: 1, limit: 100 });

  const [addPage, { isLoading: isAdding }] = useAddPageMutation();
  const [updatePage] = useUpdatePageMutation();
  const [deletePage] = useDeletePageMutation();

  const [pages, setPages] = useState<IPage[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<IPage | null>(null);
  const [formData, setFormData] = useState({ pageName: '', path: '' });

  useEffect(() => {
    const rawData = pagesData as unknown;
    if (isPageRecord(rawData) && isPageRecord(rawData.data) && Array.isArray(rawData.data.pages)) {
      const normalizedList: IPage[] = [];

      const extractPages = (list: unknown[]) => {
        list.forEach(item => {
          if (isPageRecord(item)) {
            const normalizedPage: IPage = {
              _id: String(item._id || ''),
              isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
              pageName: String(item.pageName || item.pageTitle || 'Untitled Page'),
              path: String(item.path || item.pagePath || '#'),
            };

            normalizedList.push(normalizedPage);

            if (Array.isArray(item.subPage)) {
              extractPages(item.subPage);
            }
          }
        });
      };

      extractPages(rawData.data.pages);
      setPages(normalizedList);
    }
  }, [pagesData]);

  const groupedPages = useMemo(() => {
    return pages.reduce((groups: Record<string, IPage[]>, page) => {
      if (!page.path) return groups;
      const parts = page.path.split('/').filter(Boolean);
      const groupKey = parts.length > 0 ? `/${parts[0]}` : 'Root Pages';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(page);
      return groups;
    }, {});
  }, [pages]);

  const handleSavePage = async () => {
    if (!formData.pageName || !formData.path) {
      toast.error('Please fill in all fields');
      return;
    }

    const formattedPath = formData.path.startsWith('/') ? formData.path : `/${formData.path}`;

    try {
      await addPage({
        pageName: formData.pageName,
        path: formattedPath,
        isActive: true,
        content: [],
      }).unwrap();

      toast.success('Page created successfully');
      setFormData({ pageName: '', path: '' });
      setIsAddDialogOpen(false);
    } catch {
      toast.error('Failed to create page');
    }
  };

  const navigateTo = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router],
  );

  const handleEdit = (path: string) => navigateTo(`/dashboard/admin/page-builder/edit-page?pathTitle=${path}`);
  const handlePreview = (path: string) => navigateTo(`/dashboard/admin/page-builder/preview-page?pathTitle=${path}`);
  const handleLiveLink = (path: string) => navigateTo(path);
  const handleFormDataPage = (path: string) => navigateTo(`/dashboard/admin/page-builder/form-data?pathTitle=${path}`);

  const confirmDelete = async () => {
    if (!pageToDelete?._id) return;
    try {
      await deletePage({ id: pageToDelete._id }).unwrap();
      toast.success('Page deleted successfully');
      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
    } catch {
      toast.error('Failed to delete page');
    }
  };

  const handleToggleActive = async (page: IPage) => {
    if (!page._id) return;
    const updatedStatus = !page.isActive;
    try {
      setPages(prev => prev.map(p => (p._id === page._id ? { ...p, isActive: updatedStatus } : p)));
      await updatePage({ id: page._id, isActive: updatedStatus }).unwrap();
      toast.success(`Page ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch {
      setPages(prev => prev.map(p => (p._id === page._id ? { ...p, isActive: !updatedStatus } : p)));
      toast.error('Failed to update page status');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 p-2 text-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="relative">
              <div className="relative w-20 h-20 rounded-sm bg-white/10 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-2xl">
                <Layout className="h-10 w-10 text-blue-200 animate-spin" />
              </div>
            </div>
            <div className="text-white text-xl font-black tracking-tight">Syncing Structure...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    const isRateLimit = (error as { status?: number }).status === 429;
    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 p-2 text-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <div className="relative">
              <div className="relative w-20 h-20 rounded-sm bg-rose-500/10 backdrop-blur-xl border border-rose-500/30 flex items-center justify-center shadow-2xl">
                <AlertTriangle className={`h-10 w-10 ${isRateLimit ? 'animate-bounce' : ''} text-red-500`} />
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">{isRateLimit ? 'Rate Limit Exceeded' : 'Connection Interrupted'}</h2>
            <p className="text-slate-400 text-sm">
              {isRateLimit ? 'Please wait a moment before trying again.' : 'We encountered an error while fetching your pages.'}
            </p>
            <Button onClick={() => refetch()} variant="outlineWater" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Now
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 p-2 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">Page Management</h1>
            <p className="text-white/50 mt-1 text-xs">Orchestrate your application nodes and visibility.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => refetch()} variant="outlineWater" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineWater" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
        </div>

        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-sm bg-white/5 backdrop-blur-xl p-12">
            <FolderOpen className="h-12 w-12 text-white/20 mb-4" />
            <h2 className="text-xl font-black tracking-tight text-white mb-2">Empty Repository</h2>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineWater">
              Initialize First Page
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedPages).map(([groupName, groupPages]) => (
              <section key={groupName} className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-6 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                  <h2 className="text-sm font-black uppercase tracking-tight text-blue-200">
                    {groupName === 'Root Pages' ? 'Primary Internal' : groupName.replace('/', '')}
                  </h2>
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm text-white/50">{groupPages.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupPages.map(page => (
                    <div
                      key={page._id}
                      className={`relative group rounded-sm border backdrop-blur-xl transition-all duration-300 shadow-2xl ${
                        page.isActive ? 'bg-white/10 border-white/40 hover:border-white/60' : 'bg-black/20 border-white/10 opacity-60'
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div
                              className={`p-2 rounded-sm border border-white/10 ${page.isActive ? 'bg-blue-500/10 text-blue-200' : 'bg-slate-500/10 text-slate-500'}`}
                            >
                              <Layout className="h-4 w-4" />
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="font-semibold text-slate-100 truncate text-sm uppercase tracking-tight">{page.pageName}</h3>
                              <p className="text-[10px] font-mono text-slate-200 truncate mt-0.5">{page.path}</p>
                            </div>
                          </div>
                          <Switch checked={page.isActive} onCheckedChange={() => handleToggleActive(page)} className="data-[state=checked]:bg-blue-500" />
                        </div>

                        <div className="hidden md:flex items-center gap-2">
                          <Button size="icon" variant="outlineWater" className="h-8 w-8 min-w-1" onClick={() => handleEdit(page.path)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="outlineWater" className="h-8 w-8 min-w-1" onClick={() => handlePreview(page.path)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="outlineWater" className="h-8 w-8 min-w-1" onClick={() => handleLiveLink(page.path)}>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="outlineWater" className="h-8 w-8 min-w-1" onClick={() => handleFormDataPage(page.path)}>
                            <Database className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outlineFire"
                            className="h-8 w-8 ml-auto min-w-1"
                            onClick={() => {
                              setPageToDelete(page);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <div className="md:hidden">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outlineWater" className="w-full h-9 gap-2">
                                <MoreVertical className="h-4 w-4" />
                                Manage Node
                              </Button>
                            </SheetTrigger>
                            <SheetContent
                              side="bottom"
                              className="bg-blue-400 rounded-t-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white p-6"
                            >
                              <SheetHeader className="mb-6">
                                <SheetTitle className="text-white text-left flex items-center gap-2">
                                  <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                  {page.pageName}
                                </SheetTitle>
                              </SheetHeader>
                              <div className="grid grid-cols-2 gap-3">
                                <Button variant="outlineWater" onClick={() => handleEdit(page.path)} className="justify-start gap-3 min-w-1">
                                  <Edit className="h-4 w-4" /> Edit
                                </Button>
                                <Button variant="outlineWater" onClick={() => handlePreview(page.path)} className="justify-start gap-3 min-w-1">
                                  <Eye className="h-4 w-4" /> Preview
                                </Button>
                                <Button variant="outlineWater" onClick={() => handleLiveLink(page.path)} className="justify-start gap-3 min-w-1">
                                  <ExternalLink className="h-4 w-4" /> Visit
                                </Button>
                                <Button variant="outlineWater" onClick={() => handleFormDataPage(page.path)} className="justify-start gap-3 min-w-1">
                                  <Database className="h-4 w-4" /> Data
                                </Button>
                                <Button
                                  variant="outlineFire"
                                  onClick={() => {
                                    setPageToDelete(page);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="col-span-2 justify-center gap-3"
                                >
                                  <Trash2 className="h-4 w-4" /> Terminate Node
                                </Button>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/20 p-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-md border border-purple-200/25 bg-purple-500/20 bg-clip-padding text-white shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-purple-100/10 bg-purple-200/10 p-6">
              <h2 className="text-xl font-black tracking-tight text-white">Add New Page</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsAddDialogOpen(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-5 p-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Page Name</Label>
                <Input
                  placeholder="e.g. System Overview"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-700"
                  value={formData.pageName}
                  onChange={e => setFormData({ ...formData, pageName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Path</Label>
                <Input
                  placeholder="/system/overview"
                  className="bg-white/5 border-white/10 text-white font-mono"
                  value={formData.path}
                  onChange={e => setFormData({ ...formData, path: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-2">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-slate-500">
                Cancel
              </Button>
              <Button onClick={handleSavePage} disabled={!formData.pageName || !formData.path || isAdding} variant="outlineGarden">
                {isAdding ? 'Processing...' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-red-500/30 text-white w-full max-w-md shadow-2xl">
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Confirm Termination</h2>
                <p className="text-slate-400 text-sm">
                  You are about to delete <span className="text-red-400 font-mono">{pageToDelete.pageName}</span>. This node and its associated data will be
                  purged.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={confirmDelete} variant="outlineFire" className="w-full">
                  Confirm Deletion
                </Button>
                <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-slate-500">
                  Abort Operation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
