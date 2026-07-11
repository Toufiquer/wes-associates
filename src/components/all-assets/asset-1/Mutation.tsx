'use client';

import { Eye, GripVertical, ImageOff, LayoutGrid, Loader2, PackagePlus, Save, Settings2, Smartphone, Sparkles, Star, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Switch } from '@/components/ui/switch';

import { AssetGridLayout, AssetMobileGridLayout, AssetSortMode, defaultDataAsset1, IAssetData, TemplateItem, templateImagePlaceholder } from './data';

export interface AssetFormProps {
  data?: IAssetData;
  onSubmit: (values: IAssetData) => void;
}

interface ProductItem {
  _id?: string;
  title?: string;
  productUID?: string;
  real_price?: number;
  discount_price?: number;
  primary_images?: {
    url?: string;
    name?: string;
  };
  star?: number;
  view?: string;
  liveUrl?: string;
}

interface ProductsResponse {
  data?: {
    products?: ProductItem[];
  };
}

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/30 transition-colors focus:border-amber-300/60 focus:bg-white/[0.09] focus:ring-2 focus:ring-amber-400/15';
const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45';
const panelClass =
  'rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-2xl';
const primaryButtonClass =
  'inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.98]';
const darkButtonClass =
  'inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/10';

const normalizeSettings = (data?: IAssetData): IAssetData => ({
  ...defaultDataAsset1,
  ...data,
  title: data?.title || data?.sectionTitle || defaultDataAsset1.title,
  sortMode: data?.sortMode || defaultDataAsset1.sortMode,
  gridLayout: data?.gridLayout || defaultDataAsset1.gridLayout,
  mobileGridLayout: data?.mobileGridLayout || defaultDataAsset1.mobileGridLayout,
  showSeeMore: data?.showSeeMore ?? defaultDataAsset1.showSeeMore,
  seeMore: {
    ...defaultDataAsset1.seeMore,
    ...(data?.seeMore || {}),
    name: data?.seeMore?.name || data?.viewMoreText || defaultDataAsset1.seeMore.name,
  },
  templates: data?.templates?.length ? data.templates : defaultDataAsset1.templates,
});

const nextId = (items: TemplateItem[]) => Math.max(0, ...items.map(item => Number(item.id) || 0)) + 1;

const getProductPrice = (product: ProductItem) => {
  const value = Number(product.discount_price || product.real_price || 0);
  return value ? `${value.toLocaleString()}৳` : '0৳';
};

const getProductImage = (product: ProductItem) => product.primary_images?.url || templateImagePlaceholder;

const getProductKey = (product: ProductItem) => product._id || product.productUID || product.title || '';

const productToTemplate = (product: ProductItem, id: number): TemplateItem => ({
  id,
  sourceProductId: product._id,
  productUID: product.productUID || '',
  title: product.title || 'Untitled Product',
  price: getProductPrice(product),
  views: product.view || '0',
  rating: Math.min(5, Math.max(0, Number(product.star) || 5)),
  image: getProductImage(product),
  url: product.liveUrl || (product._id ? `/template?id=${product._id}` : ''),
});

const sortTemplates = (templates: TemplateItem[], sortMode: AssetSortMode) => {
  if (sortMode === 'custom') return templates;
  return [...templates].sort((a, b) => {
    const result = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
    return sortMode === 'ascending' ? result : -result;
  });
};

const gridLayoutColumnCount: Record<AssetGridLayout, number> = {
  '1x1': 1,
  '1x2': 2,
  '1x3': 3,
};

const mobileLayoutColumnCount: Record<AssetMobileGridLayout, number> = {
  '1x1': 1,
  '1x2': 2,
};

const LayoutPreviewIcon = ({ columns, accent }: { columns: number; accent: boolean }) => (
  <span className="grid h-6 w-9 grid-flow-col gap-[3px]" aria-hidden="true">
    {Array.from({ length: columns }).map((_, index) => (
      <span key={index} className={`rounded-[3px] transition-colors ${accent ? 'bg-amber-300' : 'bg-white/30'}`} />
    ))}
  </span>
);

const mutationGridLayoutClasses: Record<AssetGridLayout, string> = {
  '1x1': 'grid-cols-1',
  '1x2': 'grid-cols-1 sm:grid-cols-2',
  '1x3': 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
};

const cardImageSizeClasses: Record<AssetGridLayout, string> = {
  '1x1': 'aspect-square w-24 shrink-0 sm:w-28',
  '1x2': 'aspect-[4/3] w-full',
  '1x3': 'aspect-[4/3] w-full',
};

const RatingStars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} size={11} className={index < Math.round(rating) ? 'fill-amber-300 text-amber-300' : 'fill-white/10 text-white/15'} />
    ))}
  </span>
);

const MutationAsset1 = ({ data, onSubmit }: AssetFormProps) => {
  const [settings, setSettings] = useState<IAssetData>(() => normalizeSettings(data));
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isRemoveAllOpen, setIsRemoveAllOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const sortedTemplates = useMemo(() => sortTemplates(settings.templates, settings.sortMode), [settings.sortMode, settings.templates]);
  const importedProductsGridClassName = mutationGridLayoutClasses[settings.gridLayout] || mutationGridLayoutClasses[defaultDataAsset1.gridLayout];
  const importedProductKeys = useMemo(() => {
    const keys = new Set<string>();
    settings.templates.forEach(item => {
      if (item.sourceProductId) keys.add(item.sourceProductId);
      if (item.productUID) keys.add(item.productUID);
      if (item.title) keys.add(item.title);
    });
    return keys;
  }, [settings.templates]);
  const isProductAlreadyAdded = useCallback(
    (product: ProductItem) =>
      Boolean(
        (product._id && importedProductKeys.has(product._id)) ||
          (product.productUID && importedProductKeys.has(product.productUID)) ||
          (product.title && importedProductKeys.has(product.title)),
      ),
    [importedProductKeys],
  );
  const productKeys = useMemo(() => products.map(getProductKey).filter(Boolean), [products]);
  const allProductsChecked = productKeys.length > 0 && productKeys.every(key => selectedProductIds.includes(key));
  const newSelectedProductCount = products.filter(product => {
    const key = getProductKey(product);
    return key && selectedProductIds.includes(key) && !isProductAlreadyAdded(product);
  }).length;

  useEffect(() => {
    if (!isImportOpen || products.length > 0) return;

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch('/api/products/v1?page=1&limit=1000');
        const result = (await response.json()) as ProductsResponse;
        setProducts(result?.data?.products || []);
      } catch {
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    void fetchProducts();
  }, [isImportOpen, products.length]);

  useEffect(() => {
    if (!isImportOpen) return;
    setSelectedProductIds(products.map(product => (isProductAlreadyAdded(product) ? getProductKey(product) : '')).filter(Boolean));
  }, [isImportOpen, isProductAlreadyAdded, products]);

  const updateSettings = (patch: Partial<IAssetData>) => setSettings(prev => ({ ...prev, ...patch }));

  const updateSortMode = (sortMode: AssetSortMode) => {
    setSettings(prev => ({
      ...prev,
      sortMode,
      templates: sortTemplates(prev.templates, sortMode),
    }));
  };

  const moveTemplate = (fromId: number, toId: number) => {
    if (fromId === toId) return;
    setSettings(prev => {
      const next = [...prev.templates];
      const fromIndex = next.findIndex(item => item.id === fromId);
      const toIndex = next.findIndex(item => item.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...prev, sortMode: 'custom', templates: next };
    });
  };

  const removeTemplate = (id: number) => {
    setSettings(prev => ({ ...prev, templates: prev.templates.filter(template => template.id !== id) }));
  };

  const removeAllTemplates = () => {
    setSettings(prev => ({ ...prev, templates: [] }));
    setIsRemoveAllOpen(false);
  };

  const toggleProductSelection = (id: string, checked: boolean) => {
    setSelectedProductIds(prev => (checked ? [...new Set([...prev, id])] : prev.filter(item => item !== id)));
  };

  const checkAllProducts = () => {
    setSelectedProductIds(productKeys);
  };

  const importSelectedProducts = () => {
    setSettings(prev => {
      const existingSourceIds = new Set(prev.templates.map(item => item.sourceProductId).filter(Boolean));
      const existingProductUids = new Set(prev.templates.map(item => item.productUID).filter(Boolean));
      const existingTitles = new Set(prev.templates.map(item => item.title).filter(Boolean));
      const selectedProducts = products.filter(product => {
        const key = getProductKey(product);
        if (!key || !selectedProductIds.includes(key)) return false;
        return !(
          (product._id && existingSourceIds.has(product._id)) ||
          (product.productUID && existingProductUids.has(product.productUID)) ||
          (product.title && existingTitles.has(product.title))
        );
      });
      let idSeed = nextId(prev.templates);
      const importedTemplates = selectedProducts.map(product => productToTemplate(product, idSeed++));
      return { ...prev, templates: [...prev.templates, ...importedTemplates] };
    });
    setSelectedProductIds([]);
    setIsImportOpen(false);
  };

  const submit = () => {
    onSubmit({
      ...settings,
      sectionTitle: settings.title,
      viewMoreText: settings.seeMore.name,
    });
  };

  return (
    <div className="rounded-2xl text-white">
      <div className={panelClass}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <label className={labelClass}>Title</label>
            <input
              value={settings.title}
              onChange={event => updateSettings({ title: event.target.value })}
              className={`${inputClass} mt-1.5`}
              placeholder="All Theme"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIsImportOpen(true)} className={darkButtonClass}>
              <PackagePlus size={16} /> Import Product
            </button>
            <button type="button" onClick={submit} className={primaryButtonClass}>
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-[1fr_1fr_auto_auto]">
          <div>
            <label className={labelClass}>See More Name</label>
            <input
              value={settings.seeMore.name}
              onChange={event => updateSettings({ seeMore: { ...settings.seeMore, name: event.target.value } })}
              className={`${inputClass} mt-1.5`}
              placeholder="See More"
            />
          </div>
          <div>
            <label className={labelClass}>See More URL</label>
            <input
              value={settings.seeMore.url}
              onChange={event => updateSettings({ seeMore: { ...settings.seeMore, url: event.target.value } })}
              className={`${inputClass} mt-1.5`}
              placeholder="/all-assets"
            />
          </div>
          <div className="flex items-end">
            <label className="flex h-[42px] w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3.5 text-sm font-bold text-white md:w-auto">
              <span className="whitespace-nowrap">Show See More</span>
              <Switch checked={settings.showSeeMore} onCheckedChange={checked => updateSettings({ showSeeMore: checked })} />
            </label>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={submit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Settings2 size={16} /> Update See More
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
              <Sparkles size={16} />
            </span>
            <div>
              <h3 className="font-bold leading-tight text-white">Imported Products</h3>
              <p className="text-xs text-white/50">
                {settings.templates.length} item{settings.templates.length === 1 ? '' : 's'} · drag to reorder in custom sort
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-stretch gap-2.5">
            <button
              type="button"
              onClick={() => setIsRemoveAllOpen(true)}
              disabled={settings.templates.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/25 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 transition-colors hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={15} /> Remove All
            </button>

            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 p-1.5">
              <LayoutGrid size={13} className="ml-1 text-white/35" />
              {(['1x1', '1x2', '1x3'] as AssetGridLayout[]).map(layout => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => updateSettings({ gridLayout: layout })}
                  title={`Grid: ${layout.replace('x', ' \u00d7 ')}`}
                  className={`flex h-9 w-11 items-center justify-center rounded-lg transition-all ${
                    settings.gridLayout === layout ? 'bg-amber-400/20 ring-1 ring-inset ring-amber-300/50' : 'hover:bg-white/[0.06]'
                  }`}
                  aria-label={`Set view grid ${layout.replace('x', ' by ')}`}
                  aria-pressed={settings.gridLayout === layout}
                >
                  <LayoutPreviewIcon columns={gridLayoutColumnCount[layout]} accent={settings.gridLayout === layout} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 p-1.5">
              <Smartphone size={13} className="ml-1 text-white/35" />
              {(['1x1', '1x2'] as AssetMobileGridLayout[]).map(layout => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => updateSettings({ mobileGridLayout: layout })}
                  title={`Mobile: ${layout.replace('x', ' \u00d7 ')}`}
                  className={`flex h-9 w-11 items-center justify-center rounded-lg transition-all ${
                    settings.mobileGridLayout === layout ? 'bg-amber-400/20 ring-1 ring-inset ring-amber-300/50' : 'hover:bg-white/[0.06]'
                  }`}
                  aria-label={`Set mobile view ${layout.replace('x', ' by ')}`}
                  aria-pressed={settings.mobileGridLayout === layout}
                >
                  <LayoutPreviewIcon columns={mobileLayoutColumnCount[layout]} accent={settings.mobileGridLayout === layout} />
                </button>
              ))}
            </div>

            <select
              value={settings.sortMode}
              onChange={event => updateSortMode(event.target.value as AssetSortMode)}
              className="rounded-xl border border-white/10 bg-black/20 px-3.5 py-2 text-sm font-medium text-white outline-none transition-colors focus:border-amber-300/60"
            >
              <option value="ascending">A → Z</option>
              <option value="descending">Z → A</option>
              <option value="custom">Custom order</option>
            </select>
          </div>
        </div>

        {sortedTemplates.length === 0 ? (
          <div className="mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-white/30">
              <ImageOff size={22} />
            </span>
            <div>
              <p className="font-semibold text-white/80">No products yet</p>
              <p className="mt-1 text-sm text-white/45">Import products to populate this section.</p>
            </div>
            <button type="button" onClick={() => setIsImportOpen(true)} className={`${darkButtonClass} mt-1`}>
              <PackagePlus size={16} /> Import Product
            </button>
          </div>
        ) : (
          <div className={`mt-5 grid gap-4 ${importedProductsGridClassName}`}>
            {sortedTemplates.map(item => {
              const isCustomSort = settings.sortMode === 'custom';
              const isDragging = draggedId === item.id;
              const isDragTarget = dragOverId === item.id && draggedId !== item.id;
              const isCompact = settings.gridLayout === '1x1';

              return (
                <div
                  key={item.id}
                  draggable={isCustomSort}
                  onDragStart={() => setDraggedId(item.id)}
                  onDragEnter={() => isCustomSort && setDragOverId(item.id)}
                  onDragOver={event => event.preventDefault()}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDragOverId(null);
                  }}
                  onDrop={() => {
                    if (draggedId) moveTemplate(draggedId, item.id);
                    setDraggedId(null);
                    setDragOverId(null);
                  }}
                  className={`group relative overflow-hidden rounded-xl border bg-white/[0.04] backdrop-blur-md transition-all duration-200 ${
                    isCompact ? 'flex items-center gap-3 p-2.5' : ''
                  } ${
                    isDragging
                      ? 'scale-[0.97] border-amber-300/40 opacity-50'
                      : isDragTarget
                        ? 'border-amber-300/60 ring-2 ring-amber-300/30'
                        : 'border-white/10 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/30'
                  }`}
                >
                  <div
                    className={`relative shrink-0 overflow-hidden bg-black/20 ${isCompact ? cardImageSizeClasses['1x1'] : cardImageSizeClasses[settings.gridLayout]}`}
                  >
                    <Image
                      src={item.image || templateImagePlaceholder}
                      alt={item.title || 'Product image'}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                    {!isCompact && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />}

                    {isCustomSort && (
                      <span
                        className={`absolute flex items-center justify-center rounded-md bg-black/50 text-white/80 backdrop-blur-sm active:cursor-grabbing ${
                          isCompact ? 'left-0.5 top-0.5 h-5 w-5 cursor-grab' : 'left-2 top-2 h-7 w-7 cursor-grab'
                        }`}
                      >
                        <GripVertical size={isCompact ? 11 : 14} />
                      </span>
                    )}

                    {!isCompact && (
                      <button
                        type="button"
                        onClick={() => removeTemplate(item.id)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-black/50 text-red-300 backdrop-blur-sm transition-colors hover:bg-red-500/80 hover:text-white"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {!isCompact && (
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="rounded-md bg-black/55 px-2 py-1 text-xs font-bold text-amber-300 backdrop-blur-sm">{item.price}</span>
                        <span className="flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                          <Eye size={11} /> {item.views}
                        </span>
                      </div>
                    )}
                  </div>

                  {isCompact ? (
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold leading-snug text-white">{item.title || 'Untitled Product'}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <RatingStars rating={item.rating} />
                          <span className="flex items-center gap-1 text-[11px] text-white/40">
                            <Eye size={11} /> {item.views}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-bold text-amber-300">{item.price}</span>
                        <button
                          type="button"
                          onClick={() => removeTemplate(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-300/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-200 transition-colors hover:bg-red-500/20 hover:text-white"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 p-3">
                      <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{item.title || 'Untitled Product'}</h4>
                      <div className="flex items-center justify-between">
                        <RatingStars rating={item.rating} />
                        <span className="truncate text-[11px] text-white/35">{item.productUID || 'N/A'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTemplate(item.id)}
                        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-300/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 transition-colors hover:bg-red-500/20 hover:text-white"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isRemoveAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-200/20 bg-slate-950/90 p-6 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-200">
                <Trash2 size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold">Remove all items?</h3>
                <p className="mt-1 text-sm text-white/55">
                  This will remove all {settings.templates.length} imported item{settings.templates.length === 1 ? '' : 's'} from this asset section.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRemoveAllOpen(false)}
                className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/[0.12]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={removeAllTemplates}
                className="rounded-xl bg-gradient-to-b from-red-500 to-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-700/30 transition-all hover:brightness-110 active:scale-[0.98]"
              >
                Yes, Remove All
              </button>
            </div>
          </div>
        </div>
      )}

      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/45 p-4 backdrop-blur-xl">
          <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-purple-200/20 bg-purple-950/65 text-white shadow-2xl shadow-purple-950/70 backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,180,254,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.22),transparent_40%)]" />
            <div className="relative flex items-start justify-between gap-4 border-b border-purple-200/15 bg-white/[0.04] p-5">
              <div>
                <h3 className="text-lg font-bold text-white">Import Product</h3>
                <p className="mt-0.5 text-sm text-purple-100/65">Select products to import into this asset section.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-200/15 bg-white/[0.05] text-purple-100/70 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto p-5">
              {isLoadingProducts ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-purple-100/65">
                  <Loader2 className="h-5 w-5 animate-spin text-fuchsia-300" />
                  <span className="text-sm">Loading products…</span>
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-purple-200/20 bg-white/[0.04] p-10 text-center text-purple-100/65">No products found.</div>
              ) : (
                <>
                  <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-purple-200/15 bg-white/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedProductIds.length} checked</p>
                      <p className="text-xs text-purple-100/55">{newSelectedProductCount} new product{newSelectedProductCount === 1 ? '' : 's'} ready to import</p>
                    </div>
                    <button
                      type="button"
                      onClick={checkAllProducts}
                      disabled={allProductsChecked}
                      className="inline-flex items-center justify-center rounded-xl border border-fuchsia-200/25 bg-fuchsia-400/15 px-4 py-2 text-sm font-bold text-fuchsia-50 shadow-lg shadow-fuchsia-950/20 transition-all hover:bg-fuchsia-400/25 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      Check All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {products.map(product => {
                      const productId = getProductKey(product);
                      const isSelected = selectedProductIds.includes(productId);
                      const isAlreadyAdded = isProductAlreadyAdded(product);
                      return (
                        <label
                          key={productId}
                          className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-2.5 transition-all ${
                            isSelected
                              ? 'border-fuchsia-300/50 bg-fuchsia-400/15 shadow-lg shadow-fuchsia-950/20'
                              : 'border-purple-200/15 bg-white/[0.04] hover:border-purple-200/25 hover:bg-white/[0.08]'
                          }`}
                        >
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden border border-purple-100/15 bg-white/5">
                            <Image src={getProductImage(product)} alt={product.title || 'Product image'} fill className="object-contain" unoptimized />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-white">{product.title || 'Untitled Product'}</span>
                            <span className="block text-xs text-purple-100/45">UID: {product.productUID || 'N/A'}</span>
                            {isAlreadyAdded && <span className="mt-1 inline-flex rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-200">Already added</span>}
                          </span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={event => toggleProductSelection(productId, event.target.checked)}
                            className="h-4 w-4 shrink-0 accent-fuchsia-400"
                          />
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="relative flex items-center justify-between gap-2 border-t border-purple-200/15 bg-white/[0.04] p-5">
              <span className="text-xs text-purple-100/55">{selectedProductIds.length} checked · {newSelectedProductCount} new</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportOpen(false)}
                  className="rounded-xl border border-purple-200/20 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/[0.12]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={importSelectedProducts}
                  disabled={newSelectedProductCount === 0}
                  className="rounded-xl bg-gradient-to-b from-fuchsia-400 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-700/35 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:active:scale-100"
                >
                  Import {newSelectedProductCount > 0 ? `(${newSelectedProductCount})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutationAsset1;
