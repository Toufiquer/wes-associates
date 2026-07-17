/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Eye,
  Edit,
  Plus,
  Save,
  Type,
  Layers,
  Trash2,
  Search,
  FileStack,
  Package,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  LayoutGrid,
  FolderOpen,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useMemo } from 'react';

import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AllForms, AllFormsKeys } from '@/components/all-form/all-form-index/all-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetPagesQuery, useUpdatePageMutation } from '@/redux/features/page-builder/pageBuilderSlice';
import { AllSections, AllSectionsKeys, allSectionCagegory } from '@/components/all-section/all-section-index/all-sections';
import { AllPages, AllPagesKeys } from '@/components/all-pages/all-page-index/all-page';
import { AllAssets, AllAssetsKeys } from '@/components/all-assets/all-assets-index/all-page';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';

import { ItemType, PageContent } from '../utils';

interface SectionConfig {
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const TypedAllSections = AllSections as unknown as Record<string, SectionConfig>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any; color: string }> = {
  form: { collection: AllForms, keys: AllFormsKeys, label: 'Forms', icon: Type, color: 'text-blue-400 from-cyan-500 to-blue-500' },
  section: { collection: AllSections, keys: AllSectionsKeys, label: 'Sections', icon: Layers, color: 'text-purple-400 from-purple-500 to-pink-500' },
  pages: { collection: AllPages, keys: AllPagesKeys, label: 'Pages', icon: FileStack, color: 'text-emerald-400 from-emerald-500 to-teal-500' },
  assets: { collection: AllAssets, keys: AllAssetsKeys, label: 'Assets', icon: Package, color: 'text-amber-400 from-amber-500 to-orange-500' },
};

const getTypeStyles = (type: ItemType) => {
  switch (type) {
    case 'form':
      return {
        border: 'border-blue-500/30 hover:border-blue-400/60',
        bg: 'bg-slate-900/60',
        badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
        icon: 'text-blue-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
      };
    case 'pages':
      return {
        border: 'border-emerald-500/30 hover:border-emerald-400/60',
        bg: 'bg-slate-900/50',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        icon: 'text-emerald-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]',
      };
    case 'assets':
      return {
        border: 'border-amber-500/30 hover:border-amber-400/60',
        bg: 'bg-slate-900/50',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        icon: 'text-amber-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]',
      };
    default:
      return {
        border: 'border-purple-500/30 hover:border-purple-400/60',
        bg: 'bg-slate-900/40',
        badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        icon: 'text-purple-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
      };
  }
};

interface SortableItemProps {
  item: PageContent;
  onEdit: (item: PageContent) => void;
  onPreview: (item: PageContent) => void;
  onDelete: (item: PageContent) => void;
  onInlineUpdate: (item: PageContent, newData: unknown) => void;
  onOpenMoveDialog: (item: PageContent) => void;
}

const SortableItem = ({ item, onEdit, onPreview, onDelete, onInlineUpdate, onOpenMoveDialog }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const mapEntry = COMPONENT_MAP[item.type];
  const config = mapEntry ? mapEntry.collection[item.key] : null;

  if (!mapEntry || !config) {
    return (
      <div ref={setNodeRef} style={style} className="p-4 border border-red-500/30 bg-red-500/10 rounded-sm flex items-center justify-between">
        <div className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Unknown Component Type: {item.type || 'Undefined'}</span>
        </div>
        <Button onClick={() => onDelete(item)} size="sm" variant="outlineFire" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  let ComponentToRender;
  if (item.type === 'form') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).FormField;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).query;
  }

  const styles = getTypeStyles(item.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group animate-in fade-in-50 slide-in-from-bottom-6 duration-700 ${isDragging ? 'opacity-40 scale-95 z-50' : 'z-0'}`}
    >
      <div
        className={`relative backdrop-blur-3xl shadow-2xl transition-all duration-300 overflow-hidden rounded-sm border ${styles.border} ${styles.bg} ${styles.glow}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-20 border-b border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => onOpenMoveDialog(item)} className="md:hidden p-2 rounded-full hover:bg-white/10 text-yellow-400 transition-all">
                <ArrowUpDown className="h-4 w-4" />
              </button>
              <button
                {...attributes}
                {...listeners}
                className={`cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-white/10 transition-colors ${styles.icon}`}
              >
                <div className="w-full flex items-center justify-center">
                  <GripVertical className="h-5 w-5" />
                </div>
              </button>
              <div className="flex flex-col small text-slate-400">
                <span className="text-xs font-medium text-slate-200 tracking-wide truncate max-w-[150px]">{item.heading || item.key}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              {item.type !== 'form' ? (
                <Button onClick={() => onEdit(item)} size="sm" className="min-w-1" variant="outlineGlassy">
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => onPreview(item)} size="sm" className="min-w-1" variant="outlineGlassy">
                  <Eye className="h-4 w-4" />
                </Button>
              )}

              <Button onClick={() => onDelete(item)} size="sm" className="min-w-1" variant="outlineGlassy">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full h-auto hidden lg:block">
            <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
              <div className="z-10 pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity">
                {ComponentToRender &&
                  (item.type !== 'form' ? (
                    <ComponentToRender data={JSON.stringify(item.data)} />
                  ) : (
                    <div className="pointer-events-auto">
                      <ComponentToRender data={item.data} onSubmit={(newData: unknown) => onInlineUpdate(item, newData)} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full h-auto block lg:hidden">
            <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
              <div className="z-10 select-none opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="w-full h-[400px] max-w-[340px] overflow-scroll border border-gray-300">
                  {ComponentToRender &&
                    (item.type !== 'form' ? (
                      <ComponentToRender data={JSON.stringify(item.data)} />
                    ) : (
                      <div className="pointer-events-auto">
                        <ComponentToRender data={item.data} onSubmit={(newData: unknown) => onInlineUpdate(item, newData)} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NormalizedPage {
  _id: string;
  pageName: string;
  path: string;
  content: PageContent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function EditPageContent() {
  const searchParams = useSearchParams();
  const pathTitle = searchParams.get('pathTitle') || '/';

  const { data: pagesData, isLoading, error, refetch } = useGetPagesQuery({ page: 1, limit: 1000 });
  const [updatePage] = useUpdatePageMutation();

  const normalizedPages = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPages = pagesData?.data?.pages || (pagesData as any)?.pages || [];
    if (!rawPages.length) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flattenPages = (list: any[]): NormalizedPage[] => {
      let results: NormalizedPage[] = [];
      list.forEach(item => {
        const norm: NormalizedPage = {
          ...item,
          _id: item._id,
          pageName: item.pageName || item.pageTitle || 'Untitled',
          path: item.path || item.pagePath || '#',
          content: item.content || [],
        };
        results.push(norm);

        if (item.subPage && Array.isArray(item.subPage)) {
          results = [...results, ...flattenPages(item.subPage)];
        }
      });
      return results;
    };

    return flattenPages(rawPages);
  }, [pagesData]);

  const currentPage = useMemo(() => {
    return normalizedPages.find(p => p.path === pathTitle);
  }, [normalizedPages, pathTitle]);

  const [items, setItems] = useState<PageContent[]>([]);
  const [editingItem, setEditingItem] = useState<PageContent | null>(null);
  const [previewingItem, setPreviewingItem] = useState<PageContent | null>(null);
  const [deletingItem, setDeletingItem] = useState<PageContent | null>(null);
  const [movingItem, setMovingItem] = useState<PageContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeAddType, setActiveAddType] = useState<ItemType | null>(null);
  const [, setIsScrolled] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedSectionCategory, setSelectedSectionCategory] = useState<string>('All');
  const [sectionPreviewKey, setSectionPreviewKey] = useState<string | null>(null);
  const [paginationPage, setPaginationPage] = useState(1);
  const [previewGridSize, setPreviewGridSize] = useState<1 | 2 | 3>(3);
  const ITEMS_PER_PAGE = previewGridSize;
  const previewGridColumnsClass = previewGridSize === 1 ? 'grid-cols-1' : previewGridSize === 2 ? 'grid-cols-2' : 'grid-cols-3';

  useEffect(() => {
    if (currentPage?.content) {
      setItems(Array.isArray(currentPage.content) ? currentPage.content : []);
    }
  }, [currentPage]);

  useEffect(() => {
    setPaginationPage(1);
  }, [activeAddType, selectedSectionCategory, previewGridSize]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems(prevItems => {
        const oldIndex = prevItems.findIndex(item => item.id === active.id);
        const newIndex = prevItems.findIndex(item => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleMoveUp = () => {
    if (!movingItem) return;
    const index = items.findIndex(item => item.id === movingItem.id);
    if (index > 0) setItems(prevItems => arrayMove(prevItems, index, index - 1));
  };

  const handleMoveDown = () => {
    if (!movingItem) return;
    const index = items.findIndex(item => item.id === movingItem.id);
    if (index < items.length - 1) setItems(prevItems => arrayMove(prevItems, index, index + 1));
  };

  const handleAddItem = (type: ItemType, key: string) => {
    const mapEntry = COMPONENT_MAP[type];
    const config = mapEntry.collection[key];
    const newItem: PageContent = {
      id: `${type}-${key}-${Date.now()}`,
      key: key,
      name: config.name || `${mapEntry.label} ${key}`,
      type: type,
      heading: `${mapEntry.label} ${key}`,
      path: `/${key}`,
      data: config.data,
    };
    setItems([...items, newItem]);

    toast.success(`${key} added to page`);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);

    setSectionPreviewKey(null);
    if (type !== 'section') setActiveAddType(null);
  };

  const handleEdit = (item: PageContent) => setEditingItem(item);
  const handlePreview = (item: PageContent) => setPreviewingItem(item);
  const handleDeleteClick = (item: PageContent) => setDeletingItem(item);
  const handleOpenMoveDialog = (item: PageContent) => setMovingItem(item);
  const handlePreviewPage = (path: string) => {
    window.open(`/dashboard/page-builder/preview-page?pathTitle=${path}`, '_blank');
  };
  const handlePreviewLivePage = (path: string) => {
    window.open(`${path}`, '_blank');
  };
  const handleConfirmDelete = () => {
    if (deletingItem) {
      setItems(items.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(items.map(item => (item.id === editingItem.id ? { ...item, data: updatedData } : item)));
    setEditingItem(null);
  };

  const handleInlineUpdate = (targetItem: PageContent, updatedData: unknown) => {
    setItems(prevItems => prevItems.map(item => (item.id === targetItem.id ? { ...item, data: updatedData } : item)));
  };

  const handleSubmitAll = async () => {
    if (!currentPage?._id) {
      toast.error('Page context lost. Please refresh.');
      return;
    }

    setIsSaving(true);
    try {
      await updatePage({
        id: currentPage._id,
        content: items,
      }).unwrap();

      toast.success('Page saved successfully!');
    } catch (err) {
      toast.error('Failed to save page');
      console.error('Error saving page:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const topMenuButtons: ItemType[] = ['form', 'section', 'pages', 'assets'];

  const sectionCategories = useMemo(() => ['All', ...allSectionCagegory], []);

  const filteredSectionKeys = useMemo(() => {
    if (activeAddType !== 'section') return [];
    if (selectedSectionCategory === 'All') return AllSectionsKeys;

    return AllSectionsKeys.filter(key => {
      const section = TypedAllSections[key];
      return section?.category === selectedSectionCategory;
    });
  }, [activeAddType, selectedSectionCategory]);

  if (error) {
    const errorMessage =
      'status' in error ? `Error ${error.status}: ${JSON.stringify(error.data)}` : 'message' in error ? error.message : 'An unexpected error occurred';

    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-lg">
          <div className="relative">
            <div className="relative w-24 h-24 rounded-sm bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-2xl">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-white">Failed to Load Page Data</h2>
            <p className="text-slate-400 text-lg">We encountered an error while fetching the page data.</p>
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-left w-full overflow-hidden">
              <p className="text-red-400 text-xs font-mono break-all">{errorMessage}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button onClick={() => (window.location.href = '/page-builder')} variant="outlineGlassy" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              View All Pages
            </Button>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Layers className="h-10 w-10 text-blue-200 animate-pulse relative z-10" />
          </div>
          <div className="text-white text-lg font-black tracking-tight">Loading Page Editor...</div>
        </div>
      </main>
    );
  }

  if (!currentPage) {
    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-lg">
          <div className="relative">
            <div className="relative w-24 h-24 rounded-sm bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-2xl">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-white">Page Not Found</h2>
            <p className="text-slate-400 text-lg">The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been created yet.</p>
            <p className="text-red-400 text-sm font-mono bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 inline-block">Path: {pathTitle}</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button onClick={() => (window.location.href = '/page-builder')} variant="outlineGlassy" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              View All Pages
            </Button>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 overflow-x-hidden selection:bg-purple-500/30 text-slate-100">
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8 max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{currentPage.pageName}</h1>
          <p className="text-white/50 font-mono text-sm bg-white/5 inline-block px-3 py-1 rounded-sm border border-white/10">{currentPage.path}</p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-60 max-w-5xl">
        {items.length === 0 ? (
          <div className="animate-in zoom-in-95 duration-700 fade-in flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed border-white/10 rounded-sm bg-white/5 backdrop-blur-xl p-8">
            <div className="relative mb-6">
              <div className="relative w-20 h-20 mx-auto rounded-sm bg-white/10 border border-white/40 flex items-center justify-center shadow-2xl">
                <Layers className="h-10 w-10 text-blue-200" />
              </div>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white mb-2 text-center">Start Creating</h2>
            <p className="text-slate-400 text-center max-w-md mb-8 text-lg">Your canvas is empty. Use the dock below to add powerful components.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-8">
                {items.map(item => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onPreview={handlePreview}
                    onDelete={handleDeleteClick}
                    onInlineUpdate={handleInlineUpdate}
                    onOpenMoveDialog={handleOpenMoveDialog}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="backdrop-blur-xl shadow-2xl rounded-sm border border-blue-500/30 bg-white/10 p-4 flex items-center gap-4 transform scale-105 cursor-grabbing">
                  <GripVertical className="h-6 w-6 text-blue-400" />
                  <span className="text-white font-medium text-lg">Moving Item...</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-col items-center justify-end gap-4 pointer-events-none ">
        <button
          onClick={() => setIsDockExpanded(!isDockExpanded)}
          className={`
            bg-purple-900/70 pointer-events-auto flex items-center justify-center w-12 h-8 rounded-sm
             backdrop-blur-xl border border-white/20 shadow-lg
            text-slate-400 hover:text-white cursor-pointer transition-all duration-300
            ${!isDockExpanded ? 'animate-bounce ring-1 ring-blue-500/50 shadow-blue-500/20' : ''}
          `}
        >
          {isDockExpanded ? <ChevronDown className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        </button>

        <div
          className={`
             bg-purple-900/70 flex items-center gap-4 transition-all duration-500 ease-in-out origin-bottom rounded-sm backdrop-blur-2xl border border-white/40 shadow-2xl ring-1 ring-white/5 justify-between w-[95%] md:w-2xl lg:w-4xl
            ${isDockExpanded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none absolute bottom-0'}
          `}
        >
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 p-2.5">
            {topMenuButtons.map(type => {
              const meta = COMPONENT_MAP[type];
              const Icon = meta.icon;
              const isActive = activeAddType === type;

              return (
                <button
                  key={type}
                  onClick={() => {
                    setActiveAddType(type);
                    setSelectedSectionCategory('All');
                  }}
                  className={`
                      group relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-14 rounded-sm transition-all duration-300
                      ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                    `}
                >
                  <span
                    className={`
                       flex items-center justify-center w-8 h-8 rounded-full mb-1 transition-all duration-300 shadow-lg
                       bg-gradient-to-br ${meta.color} text-white
                       group-hover:scale-110 group-hover:shadow-lg
                    `}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-200/80 group-hover:text-white transition-colors">{meta.label}</span>
                  {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />}
                </button>
              );
            })}
          </div>
          <div className="w-full flex items-center justify-end gap-2 pointer-events-auto pr-4">
            <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handlePreviewPage(currentPage.path)} title="Preview Page">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handlePreviewLivePage(currentPage.path)} title="Preview Page">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <div
              className={`
              pointer-events-auto transition-all duration-500 
              ${items.length > 0 ? 'max-h-20 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}
              `}
            >
              <Button onClick={handleSubmitAll} variant="outlineGlassy" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!activeAddType} onOpenChange={() => setActiveAddType(null)}>
        <DialogContent
          className={`
            p-0 overflow-hidden bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 shadow-2xl text-white gap-0 flex flex-col max-w-[90vw] min-w-[90vw] h-[85vh] mt-10
        `}
        >
          {activeAddType &&
            (() => {
              const meta = COMPONENT_MAP[activeAddType];
              const isSectionMode = activeAddType === 'section';

              const dataSource = isSectionMode ? filteredSectionKeys : meta.keys;
              const totalItems = dataSource.length;
              const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
              const paginatedItems = dataSource.slice((paginationPage - 1) * ITEMS_PER_PAGE, paginationPage * ITEMS_PER_PAGE);

              return (
                <>
                  <div className="shrink-0 flex flex-col bg-white/10 border-b border-white/10">
                    <div className="flex items-center justify-between p-6 pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-sm bg-gradient-to-br ${meta.color} shadow-lg`}>
                          <meta.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                            Add {meta.label}
                            {isSectionMode && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-sm text-slate-300 font-mono">{totalItems} Total</span>}
                          </DialogTitle>
                          <p className="text-slate-200 text-sm mt-1">
                            {isSectionMode ? 'Browse and filter professional sections to build your page.' : 'Choose a component to add.'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map(size => (
                          <Button
                            key={size}
                            size="sm"
                            variant="outlineGlassy"
                            onClick={() => setPreviewGridSize(size as 1 | 2 | 3)}
                            className={previewGridSize === size ? 'bg-white/10' : ''}
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {isSectionMode && (
                      <div className="px-6 -mt-6 pb-0 flex overflow-x-auto no-scrollbar gap-2">
                        {sectionCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedSectionCategory(cat)}
                            className={`
                                relative px-4 py-3 text-sm font-bold transition-colors whitespace-nowrap
                                ${selectedSectionCategory === cat ? 'text-white' : 'text-slate-200 hover:text-slate-300'}
                              `}
                          >
                            {cat}
                            {selectedSectionCategory === cat && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.35)]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="">
                    {isSectionMode ? (
                      <div className={`grid ${previewGridColumnsClass} gap-2`}>
                        {paginatedItems.map(key => {
                          const config = TypedAllSections[key];
                          const PreviewComp = config.query;

                          return (
                            <div
                              key={key}
                              className="group relative bg-white/10 border border-white/20 rounded-sm overflow-hidden hover:border-white/40 hover:shadow-2xl transition-all duration-300 flex flex-col h-[calc(62vh)] min-h-100"
                            >
                              <ScrollArea className="flex-1 h-100 w-ful">
                                {PreviewComp ? <PreviewComp data={JSON.stringify(config.data)} /> : <div className="text-slate-600">No Preview</div>}
                              </ScrollArea>

                              <div className="absolute top-3 left-3">
                                <span className="bg-black/60 backdrop-blur text-[10px] text-white/80 px-2 py-1 rounded-sm border border-white/5">
                                  {config.category}
                                </span>
                              </div>

                              <div className="p-4 bg-white/5 border-t border-white/5 flex items-center jsutify-between w-full gap-3 z-10">
                                <div className="flex justify-between items-center w-full">
                                  <h4 className="text-sm font-black tracking-tight text-slate-200 truncate pr-2">{key}</h4>
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button onClick={() => setSectionPreviewKey(key)} size="sm" variant="outlineGlassy">
                                    <Eye className="mr-2 h-3.5 w-3.5" /> Preview
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleAddItem('section', key);
                                      setActiveAddType(null);
                                    }}
                                    size="sm"
                                    variant="outlineGlassy"
                                  >
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {paginatedItems.length === 0 && (
                          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
                            <Search className="h-10 w-10 mb-4 opacity-50" />
                            <p>No sections found in this category.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`grid ${previewGridColumnsClass} gap-6 pb-10`}>
                        {paginatedItems.map(key => {
                          const config = meta.collection[key];
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const DisplayComponent = activeAddType === 'form' ? (config as any).preview : (config as any).query;

                          return (
                            <div
                              key={key}
                              onClick={() => handleAddItem(activeAddType, key)}
                              className="group cursor-pointer rounded-sm border border-white/20 bg-black/20 overflow-hidden hover:border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-[calc(85vh-220px)]"
                            >
                              <div className="h-[calc(85vh-300px)] bg-slate-900/50 relative overflow-hidden p-4 flex items-center justify-center border-b border-white/5">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                <div className="scale-[0.6] w-full h-full origin-center flex items-center justify-center pointer-events-none">
                                  {DisplayComponent ? (
                                    activeAddType === 'form' ? (
                                      <DisplayComponent />
                                    ) : (
                                      <DisplayComponent data={JSON.stringify(config.data)} />
                                    )
                                  ) : (
                                    <span className="text-slate-500">Preview</span>
                                  )}
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                  <div className="bg-white text-black px-4 py-2 rounded-sm font-black flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <Plus className="h-4 w-4" /> Add This
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 bg-white/5 flex justify-between items-center">
                                <span className="font-black tracking-tight text-slate-200 text-sm">{key}</span>
                                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-sm text-slate-400 uppercase tracking-tight">{meta.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="shrink-0 p-4 border-t border-white/10 bg-white/10 backdrop-blur-md flex items-center justify-between z-20 py-2">
                      <div className="text-xs text-slate-300 font-mono hidden sm:block">
                        Showing {(paginationPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(paginationPage * ITEMS_PER_PAGE, totalItems)} of {totalItems}
                      </div>
                      <div className="flex items-center gap-2 mx-auto sm:mx-0">
                        <Button
                          variant="outlineGlassy"
                          size="sm"
                          onClick={() => setPaginationPage(p => Math.max(1, p - 1))}
                          disabled={paginationPage === 1}
                          className="w-10 h-10 p-0 rounded-full"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-slate-300 min-w-[3rem] text-center">
                          {paginationPage} / {totalPages}
                        </span>
                        <Button
                          variant="outlineGlassy"
                          size="sm"
                          onClick={() => setPaginationPage(p => Math.min(totalPages, p + 1))}
                          disabled={paginationPage === totalPages}
                          className="w-10 h-10 p-0 rounded-full"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
      <Dialog open={!!sectionPreviewKey} onOpenChange={() => setSectionPreviewKey(null)}>
        <DialogContent className="max-w-[90vw] p-0 bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 flex flex-col min-w-[90vw] h-[80vh] mt-10 text-white">
          {sectionPreviewKey &&
            (() => {
              const config = TypedAllSections[sectionPreviewKey];
              const QueryComp = config.query;

              return (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-black tracking-tight text-lg">{sectionPreviewKey}</h3>
                      <span className="text-xs px-2 py-1 rounded-sm bg-blue-500/20 text-blue-100 border border-blue-400/30">{config.category}</span>
                    </div>
                    <div className="flex items-center gap-3 mr-8">
                      <Button onClick={() => handleAddItem('section', sectionPreviewKey)} variant="outlineGlassy">
                        <Plus className="mr-2 h-4 w-4" /> Add Section
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[68vh] w-full bg-black -mt-4">
                    <div className="min-h-full flex flex-col">
                      {QueryComp ? (
                        <QueryComp data={JSON.stringify(config.data)} />
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500">Preview not available</div>
                      )}
                    </div>
                  </ScrollArea>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>

      <Dialog open={!!movingItem} onOpenChange={() => setMovingItem(null)}>
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle className="text-center font-black tracking-tight">Reorder {movingItem?.key}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button onClick={handleMoveUp} className="h-12 text-lg bg-white/10 hover:bg-white/20 border border-white/10">
              <ArrowUp className="mr-2 h-5 w-5" /> Move Up
            </Button>
            <Button onClick={handleMoveDown} className="h-12 text-lg bg-white/10 hover:bg-white/20 border border-white/10">
              <ArrowDown className="mr-2 h-5 w-5" /> Move Down
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white max-w-md">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="text-xl font-black tracking-tight mb-2">Delete Component?</span>
            </DialogTitle>
            <p className="text-slate-400 mb-6">
              Are you sure you want to remove <span className="text-white font-semibold">{deletingItem?.heading || 'this item'}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <Button onClick={() => setDeletingItem(null)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-4xl md:max-w-6xl h-[85vh] mt-10 p-0 bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white flex flex-col">
          <DialogHeader className="p-4 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
              <Edit className="h-5 w-5 text-blue-200" />
              Edit Component
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-0 w-full -mt-4">
            <div className="">
              {editingItem &&
                (() => {
                  const meta = COMPONENT_MAP[editingItem.type];
                  const config = meta.collection[editingItem.key];
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const Mutation = (config as any).mutation;
                  return Mutation ? (
                    <Mutation data={editingItem.data} onSubmit={onSubmitEdit} />
                  ) : (
                    <div className="p-4 text-center text-slate-500">No settings available</div>
                  );
                })()}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewingItem} onOpenChange={() => setPreviewingItem(null)}>
        <DialogContent className="max-w-4xl h-[85vh] mt-10 p-0 bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white flex flex-col">
          <DialogHeader className="p-6 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2 font-black tracking-tight">
              <Eye className="h-5 w-5 text-blue-200" /> Live Preview
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 h-[calc(80vh-80px)] w-full">
            <div className="p-6">
              <div className="p-4 bg-black/40 rounded-sm border border-white/10">
                {previewingItem &&
                  (() => {
                    const meta = COMPONENT_MAP[previewingItem.type];
                    const config = meta.collection[previewingItem.key];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Preview = (config as any).preview;
                    return Preview ? <Preview data={JSON.stringify(previewingItem.data)} /> : null;
                  })()}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <EditPageContent />
    </Suspense>
  );
}
