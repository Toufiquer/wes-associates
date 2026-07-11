'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import Image from 'next/image';
import { DateRange } from 'react-day-picker';
import * as XLSX from 'xlsx';
import {
  Activity,
  BarChart3,
  Calendar as CalendarIcon,
  CalendarDays,
  CheckCircle2,
  Cloud,
  DownloadIcon,
  EyeIcon,
  ExternalLink,
  FileArchive,
  FilePlus,
  Filter,
  Ghost,
  Loader2,
  MoreHorizontalIcon,
  PencilIcon,
  PieChart,
  PlusIcon,
  RefreshCcw,
  Search,
  TrashIcon,
  Upload,
  TrendingUp,
  X,
  XIcon,
  Zap,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ErrorMessageComponent from '@/components/common/Error';
import LoadingComponent from '@/components/common/Loading/Loading';
import ImageUploadManager from '@/components/dashboard-ui/imageBB/ImageUploadManager';
import ImageUploadManagerSingle from '@/components/dashboard-ui/imageBB/ImageUploadManagerSingle';
import RichTextEditorField, { RichTextPreview } from '@/components/dashboard-ui/RichTextEditorField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadButton } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import {
  useAddProductMutation,
  useBulkDeleteProductsMutation,
  useBulkUpdateProductsMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetProductsSummaryQuery,
  useUpdateProductMutation,
} from '@/redux/features/products/productsSlice';
import { useGetCategoriesQuery } from '@/redux/features/categories/categoriesSlice';
import { useAddMediaMutation, useGetMediasQuery } from '@/redux/features/media/mediaSlice';

type ProductStatus = 'active' | 'hide' | 'draft';
type ImageValue = { url: string; name: string };
type FilterPayload = { type: 'month'; value: { start: string; end: string } } | { type: 'range'; value: { start: string; end: string } };

interface ProductItem {
  _id?: string;
  title: string;
  category: string[];
  real_price: number;
  discount_price: number;
  description: string;
  features: string[];
  star: number;
  view: string;
  discount: number;
  primary_images: ImageValue;
  product_images: ImageValue[];
  status: ProductStatus;
  offerEnds: string;
  shareButtonsVisible: boolean;
  uploadProduct: ImageValue;
  liveUrl: string;
  VideoUrl: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

interface ProductsResponse {
  data?: {
    products?: ProductItem[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

interface CategoryItem {
  _id?: string;
  sl_no: number;
  name: string;
  children?: CategoryItem[];
}

interface CategoriesResponse {
  data?: {
    categories?: CategoryItem[];
  };
}

interface MediaItem {
  _id?: string;
  name: string;
  url: string;
  contentType?: string;
  createdAt?: string;
  uploaderPlace?: string;
}

interface MediaResponse {
  data?: MediaItem[];
  total?: number;
}

interface ProductsSummaryData {
  overall: {
    totalRecords: number;
    activeRecords?: number;
    draftRecords?: number;
    recordsLast24Hours: number;
  };
  monthlyTable?: Array<Record<string, string | number>>;
  tableSummary?: {
    totalMonths: number;
    [key: string]: number;
  };
  pagination?: {
    currentPage: number;
    limit: number;
    totalMonths: number;
    totalPages: number;
  };
}

type DisplayableProductKeys = 'title' | 'category' | 'real_price' | 'discount_price' | 'status' | 'star' | 'discount' | 'createdAt';
type ProductColumnVisibilityState = Record<DisplayableProductKeys, boolean>;

const emptyImage: ImageValue = { url: '', name: '' };
const statusOptions: ProductStatus[] = ['active', 'hide', 'draft'];
const pageLimits = [10, 20, 30, 50, 100];
const summaryColors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#ec4899', '#06b6d4'];
const tableHeaders: { key: DisplayableProductKeys; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'real_price', label: 'Real Price' },
  { key: 'discount_price', label: 'Discount Price' },
  { key: 'status', label: 'Status' },
  { key: 'star', label: 'Star' },
  { key: 'discount', label: 'Discount' },
  { key: 'createdAt', label: 'Created At' },
];

const emptyProduct = (): ProductItem => ({
  title: '',
  category: [],
  real_price: 0,
  discount_price: 0,
  description: '',
  features: [],
  star: 0,
  view: '',
  discount: 0,
  primary_images: emptyImage,
  product_images: [],
  status: 'draft',
  offerEnds: '',
  shareButtonsVisible: true,
  uploadProduct: emptyImage,
  liveUrl: '',
  VideoUrl: '',
});

const formatDate = (date?: unknown) => {
  if (!date) return 'N/A';
  const parsed = new Date(String(date));
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return format(parsed, 'PP');
};

const formatProductCellValue = (product: ProductItem, key: DisplayableProductKeys) => {
  if (key === 'createdAt') return formatDate(product.createdAt);
  const value = product[key];
  if (Array.isArray(value)) return value.join(', ');
  return String(value ?? '');
};

const downloadXlsx = (data: Record<string, unknown>[], fileName: string) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, fileName);
};

const sanitizeProductPayload = (product: ProductItem) => {
  const payload: Partial<ProductItem> = {
    ...product,
    real_price: Number(product.real_price) || 0,
    discount_price: Number(product.discount_price) || 0,
    star: Number(product.star) || 0,
    discount: Number(product.discount) || 0,
    category: (product.category || []).filter(Boolean),
    features: (product.features || []).filter(Boolean),
    shareButtonsVisible: product.shareButtonsVisible !== false,
    offerEnds: product.offerEnds || undefined,
  };

  delete payload._id;
  delete payload.createdAt;
  delete payload.updatedAt;

  return payload;
};

const handleSuccess = (message: string) => {
  toast.success(message, {
    toastId: (Math.random() * 1000).toFixed(0),
    position: 'top-center',
  });
};

const handleError = (message: string) => {
  toast.error(message, {
    toastId: (Math.random() * 1000).toFixed(0),
    position: 'top-center',
  });
};

const ProductSearchBox = ({ onSearch, placeholder = 'Search here ...' }: { onSearch: (query: string) => void; placeholder?: string }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => onSearch(query), 350);
    return () => window.clearTimeout(timer);
  }, [onSearch, query]);

  return (
    <div className="mb-4 w-full">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {query.length > 0 && (
          <button onClick={() => setQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="Clear search">
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

const ProductPagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalItems <= itemsPerPage) return null;

  const pageCount = Math.ceil(totalItems / itemsPerPage);
  return (
    <Pagination className="mt-4 text-white">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={event => {
              event.preventDefault();
              onPageChange(Math.max(1, currentPage - 1));
            }}
            className={cn(currentPage <= 1 && 'pointer-events-none opacity-40')}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>
            Page {currentPage} of {pageCount}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={event => {
              event.preventDefault();
              onPageChange(Math.min(pageCount, currentPage + 1));
            }}
            className={cn(currentPage >= pageCount && 'pointer-events-none opacity-40')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const ProductDescriptionView = ({ description }: { description?: string }) => {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 p-3">
      <h3 className="mb-3 font-semibold">Description</h3>
      <RichTextPreview
        value={description || '<p>N/A</p>'}
        className="border border-white/10 bg-white/5 px-4 py-3 text-white/90 [&_a]:text-sky-200 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h6]:text-white"
      />
    </div>
  );
};

const ProductCategoryPicker = ({
  categories,
  selectedCategories,
  onChange,
}: {
  categories: CategoryItem[];
  selectedCategories: string[];
  onChange: (next: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selectedSet = useMemo(() => new Set(selectedCategories), [selectedCategories]);

  const toggleCategory = (categoryName: string, checked: boolean) => {
    if (checked) {
      onChange(Array.from(new Set([...selectedCategories, categoryName])));
      return;
    }

    onChange(selectedCategories.filter(item => item !== categoryName));
  };

  const renderCategoryOption = (item: CategoryItem, isChild = false) => (
    <div key={`${item._id || item.sl_no}-${item.name}`} className={cn('space-y-2', isChild && 'ml-6 border-l border-white/10 pl-4')}>
      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
        <Checkbox checked={selectedSet.has(item.name)} onCheckedChange={checked => toggleCategory(item.name, !!checked)} />
        <span className="min-w-0 flex-1 truncate text-white">{item.name}</span>
      </label>
      {item.children?.length ? <div className="space-y-2">{item.children.map(child => renderCategoryOption(child, true))}</div> : null}
    </div>
  );

  return (
    <div className="space-y-3 rounded-md border border-white/10 bg-white/5 p-3 md:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <Label>Category</Label>
        <Button type="button" size="sm" variant="outlineWater" onClick={() => setOpen(true)}>
          Update Category
        </Button>
      </div>

      {selectedCategories.length ? (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(category => (
            <Badge key={category} variant="secondary" className="bg-white/10 text-white">
              {category}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/60">No category selected.</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:max-w-xl rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl text-white">
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
            <DialogDescription className="text-white/70">Select product categories and sub-categories.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[58vh] pr-3">
            <div className="space-y-2">
              {categories.length ? (
                categories.map(item => renderCategoryOption(item))
              ) : (
                <p className="rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white/70">No categories found.</p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outlineWater" size="sm" onClick={() => onChange([])} disabled={!selectedCategories.length}>
              Clear
            </Button>
            <Button type="button" variant="outlineGarden" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductZipUploadField = ({ value, onChange }: { value: ImageValue; onChange: (next: ImageValue) => void }) => {
  const [open, setOpen] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [isUploadingProduct, setIsUploadingProduct] = useState(false);
  const [addMedia] = useAddMediaMutation();
  const {
    data: zipMediaResponse,
    isLoading: isZipMediaLoading,
    isFetching: isZipMediaFetching,
  } = useGetMediasQuery(
    {
      page: 1,
      limit: 1000,
      q: mediaSearch,
      contentType: 'zip',
      status: 'active',
    },
    { skip: !open },
  ) as { data?: MediaResponse; isLoading: boolean; isFetching: boolean };

  const zipMediaItems = useMemo(() => zipMediaResponse?.data || [], [zipMediaResponse]);

  const chooseMediaZip = (item: MediaItem) => {
    onChange({ name: item.name || 'Product.zip', url: item.url });
    handleSuccess('Product zip selected from media');
    setOpen(false);
  };

  const handleUploadComplete = async (res: Array<{ url?: string; ufsUrl?: string; name?: string }>) => {
    const uploadedFile = res?.[0];
    const uploadedUrl = uploadedFile?.url || uploadedFile?.ufsUrl || '';
    if (!uploadedUrl) {
      setIsUploadingProduct(false);
      handleError('Product zip upload finished without a file URL.');
      return;
    }

    try {
      const nextValue = { name: uploadedFile.name || 'Product.zip', url: uploadedUrl };
      await addMedia({
        url: nextValue.url,
        name: nextValue.name,
        contentType: 'zip',
        uploaderPlace: 'uploadthing',
        status: 'active',
      }).unwrap();
      onChange(nextValue);
      handleSuccess('Product zip uploaded successfully');
      setOpen(false);
    } catch {
      handleError('Failed to save uploaded product zip.');
    } finally {
      setIsUploadingProduct(false);
    }
  };

  return (
    <div className="space-y-3 rounded-md border border-white/10 bg-white/5 p-3 md:col-span-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Label>Upload Product</Label>
          <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-white/70">
            <FileArchive className="h-4 w-4 shrink-0 text-white/60" />
            <span className="truncate">{value?.name || 'No zip file uploaded.'}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {value?.url ? (
            <Button type="button" size="sm" variant="outlineFire" onClick={() => onChange(emptyImage)}>
              <XIcon className="h-4 w-4" /> Remove
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="outlineWater" onClick={() => setOpen(true)}>
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>
      </div>
      {value?.url ? (
        <a href={value.url} target="_blank" rel="noreferrer" className="block truncate text-xs font-bold text-sky-200 hover:underline">
          {value.url}
        </a>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="mt-8 w-[95vw] max-w-5xl overflow-hidden border border-white/40 bg-black/30 p-0 text-white shadow-none backdrop-blur-3xl">
          <Tabs defaultValue="media" className="flex h-[86vh] flex-col overflow-hidden rounded-sm">
            <DialogHeader className="border-b border-white/20 bg-white/[0.03] p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-[0.18em] text-white">Upload Product</DialogTitle>
                  <DialogDescription className="mt-2 text-white/60">Choose an uploaded zip from Media or upload a new product zip.</DialogDescription>
                </div>
                <TabsList className="grid w-full grid-cols-2 border border-white/10 bg-white/10 md:w-[360px]">
                  <TabsTrigger value="media">Choose from Media</TabsTrigger>
                  <TabsTrigger value="upload">Upload Zip</TabsTrigger>
                </TabsList>
              </div>
            </DialogHeader>

            <TabsContent value="media" className="m-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
              <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.02] p-5 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search
                    className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                      isZipMediaFetching ? 'animate-pulse text-indigo-300' : 'text-white/25'
                    }`}
                  />
                  <Input
                    value={mediaSearch}
                    onChange={event => setMediaSearch(event.target.value)}
                    placeholder="Search zip vault..."
                    className="h-11 border-white/10 bg-white/5 pl-12 text-xs font-black uppercase tracking-[0.18em] text-white placeholder:text-white/25 focus:border-indigo-300/60"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/60">
                  <FileArchive className="h-4 w-4" />
                  {zipMediaItems.length} Files
                </div>
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full w-full p-6">
                  {isZipMediaLoading ? (
                    <div className="flex flex-col items-center justify-center gap-5 py-32">
                      <div className="relative">
                        <div className="h-20 w-20 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-300" />
                        <Zap className="absolute inset-0 m-auto h-8 w-8 text-indigo-300" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-200/60">Loading zip vault...</span>
                    </div>
                  ) : zipMediaItems.length ? (
                    <div className="grid grid-cols-1 content-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      <AnimatePresence>
                        {zipMediaItems.map((item, index) => {
                          const isSelected = value?.url === item.url;
                          return (
                            <motion.div
                              key={item._id || item.url}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ delay: index * 0.03 }}
                              className={cn(
                                'group relative flex flex-col overflow-hidden rounded-sm border bg-white/[0.03] shadow-xl backdrop-blur-3xl transition-all hover:border-white/30',
                                isSelected ? 'border-indigo-300 ring-2 ring-indigo-400/40 ring-offset-2 ring-offset-black' : 'border-white/10',
                              )}
                            >
                              <div className="relative aspect-video overflow-hidden bg-black/60">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <FileArchive className="h-12 w-12 text-indigo-300/50 transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                {isSelected ? (
                                  <div className="absolute right-3 top-3 rounded-sm bg-indigo-500 p-2 text-white shadow-2xl">
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                ) : null}
                                <div className="absolute inset-0 flex items-end gap-2 bg-gradient-to-t from-black opacity-0 transition-all group-hover:opacity-100 p-3">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={isSelected ? 'outlineGarden' : 'outlineGlassy'}
                                    className="h-8 w-3/4 text-[10px] font-black uppercase tracking-widest"
                                    onClick={() => chooseMediaZip(item)}
                                  >
                                    {isSelected ? <CheckCircle2 size={12} className="mr-2" /> : <FileArchive size={12} className="mr-2" />}
                                    {isSelected ? 'Selected' : 'Select'}
                                  </Button>
                                  <Button asChild size="sm" variant="outlineGlassy" className="h-8 min-w-1">
                                    <a href={item.url} target="_blank" rel="noreferrer" aria-label="Open zip file">
                                      <ExternalLink size={14} />
                                    </a>
                                  </Button>
                                </div>
                              </div>
                              <div className="flex-1 space-y-1 border-t border-white/5 bg-white/[0.02] p-4">
                                <div className="flex items-center gap-2">
                                  <Cloud size={12} className="text-indigo-400" />
                                  <p className="truncate text-[10px] font-black uppercase tracking-widest text-white/80">{item.name || 'Product.zip'}</p>
                                </div>
                                <div className="flex justify-between gap-3 text-[8px] font-mono uppercase text-white/20">
                                  <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'ZIP FILE'}</span>
                                  <span className="text-indigo-400/50">{item.contentType || 'zip'}</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-5 py-24 text-white/30">
                      <Ghost className="h-20 w-20" />
                      <div className="text-center">
                        <h3 className="text-xl font-black uppercase text-white/50">No Zip Found</h3>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/35">Upload a zip or adjust your search</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="m-0 flex min-h-0 flex-1 flex-col items-center justify-center p-8 data-[state=inactive]:hidden">
              <div className="flex w-full max-w-xl flex-col items-center justify-center gap-6 rounded-sm border border-white/10 bg-white/[0.03] p-10 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-white/10 bg-white/10">
                  <FilePlus className="h-10 w-10 text-white/50" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">Upload Zip</h3>
                  <p className="mt-2 text-sm text-white/55">Upload one product zip file up to 1GB.</p>
                </div>
                <UploadButton
                  endpoint="productZipUploader"
                  appearance={{
                    button:
                      'h-9 max-w-[140px] rounded-md border border-white/30 bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/20 ut-ready:bg-white/10 ut-uploading:cursor-not-allowed',
                    allowedContent: 'hidden',
                  }}
                  content={{
                    button({ ready }) {
                      if (isUploadingProduct) return <Loader2 className="h-4 w-4 animate-spin" />;
                      return (
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>{ready ? 'Upload' : 'Connecting...'}</span>
                        </div>
                      );
                    },
                  }}
                  onBeforeUploadBegin={files => {
                    const invalidFile = files.find(file => !file.name.toLowerCase().endsWith('.zip'));
                    if (invalidFile) {
                      handleError('Please upload a zip file.');
                      return [];
                    }
                    return files;
                  }}
                  onUploadBegin={() => setIsUploadingProduct(true)}
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={error => {
                    setIsUploadingProduct(false);
                    handleError(error.message || 'Product zip upload failed.');
                  }}
                />
              </div>
            </TabsContent>

            <DialogFooter className="border-t border-white/10 bg-white/[0.03] p-5">
              <Button type="button" variant="outlineWater" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductForm = ({ value, onChange, categories }: { value: ProductItem; onChange: (next: ProductItem) => void; categories: CategoryItem[] }) => {
  const setField = <K extends keyof ProductItem>(key: K, nextValue: ProductItem[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  const updateFeature = (index: number, nextValue: string) => {
    const next = [...value.features];
    next[index] = nextValue;
    setField('features', next);
  };

  return (
    <div className="space-y-5 px-6 py-4 text-white">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Title</Label>
          <Input value={value.title} onChange={e => setField('title', e.target.value)} placeholder="Product title" />
        </div>
        <div className="space-y-2">
          <Label>Real Price</Label>
          <Input type="number" value={value.real_price} onChange={e => setField('real_price', Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Discount Price</Label>
          <Input type="number" value={value.discount_price} onChange={e => setField('discount_price', Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Star</Label>
          <Input type="number" step="0.1" value={value.star} onChange={e => setField('star', Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Discount</Label>
          <Input type="number" step="0.1" value={value.discount} onChange={e => setField('discount', Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>View</Label>
          <Input value={value.view} onChange={e => setField('view', e.target.value)} placeholder="View label or count" />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={value.status} onValueChange={(next: ProductStatus) => setField('status', next)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ProductCategoryPicker categories={categories} selectedCategories={value.category || []} onChange={next => setField('category', next)} />
        <div className="space-y-2">
          <Label>Offer Ends</Label>
          <Input type="date" value={value.offerEnds ? value.offerEnds.slice(0, 10) : ''} onChange={e => setField('offerEnds', e.target.value)} />
        </div>
        <ProductZipUploadField value={value.uploadProduct || emptyImage} onChange={next => setField('uploadProduct', next)} />
        <div className="space-y-2 md:col-span-2">
          <Label>Live URL</Label>
          <Input value={value.liveUrl} onChange={e => setField('liveUrl', e.target.value)} placeholder="https://example.com" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Video URL</Label>
          <Input value={value.VideoUrl} onChange={e => setField('VideoUrl', e.target.value)} placeholder="https://youtube.com/..." />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <RichTextEditorField id="description" value={value.description} onChange={next => setField('description', next)} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ImageUploadManagerSingle value={value.primary_images || emptyImage} onChange={next => setField('primary_images', next)} label="Primary Image" />
        <ImageUploadManager value={value.product_images || []} onChange={next => setField('product_images', next)} label="Product Images" />
      </div>

      <div className="space-y-3 rounded-md border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between">
          <Label>Features</Label>
          <Button type="button" size="sm" variant="outlineWater" onClick={() => setField('features', [...value.features, ''])}>
            Add Feature
          </Button>
        </div>
        {value.features.length === 0 && <p className="text-sm text-white/60">No features added.</p>}
        {value.features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input value={feature} onChange={e => updateFeature(index, e.target.value)} placeholder="Feature" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() =>
                setField(
                  'features',
                  value.features.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-md border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="share-buttons-visible">Share Buttons</Label>
            <p className="mt-1 text-xs text-white/60">Hide or show share buttons on the product page.</p>
          </div>
          <Switch
            id="share-buttons-visible"
            checked={value.shareButtonsVisible !== false}
            onCheckedChange={checked => setField('shareButtonsVisible', checked)}
          />
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [summaryPage, setSummaryPage] = useState(1);
  const [summaryViewMode, setSummaryViewMode] = useState<'table' | 'bar' | 'pie'>('table');
  const summaryLimit = 10;
  const [q, setQ] = useState('');
  const [filterActiveTab, setFilterActiveTab] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>();
  const [draft, setDraft] = useState<ProductItem>(emptyProduct);
  const [selected, setSelected] = useState<ProductItem[]>([]);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: DisplayableProductKeys; direction: 'asc' | 'desc' } | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<ProductColumnVisibilityState>(() => {
    const initialState = {} as ProductColumnVisibilityState;
    tableHeaders.forEach((header, index) => {
      initialState[header.key] = index <= 4;
    });
    return initialState;
  });
  const [viewing, setViewing] = useState<ProductItem | null>(null);
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState<ProductItem | null>(null);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState<ProductStatus>('active');
  const [selectedExportColumns, setSelectedExportColumns] = useState<Record<string, boolean>>({});
  const [openDialog, setOpenDialog] = useState<'add' | 'filter' | 'summary' | 'export' | 'bulk-edit' | 'bulk-update' | 'bulk-delete' | null>(null);

  const { data, isLoading, isError, isFetching, error, refetch } = useGetProductsQuery({ page, limit, q }) as {
    data?: ProductsResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    error?: unknown;
    refetch: () => Promise<{ error?: unknown } | unknown>;
  };
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    isFetching: isSummaryFetching,
  } = useGetProductsSummaryQuery({ page: summaryPage, limit: summaryLimit }, { skip: openDialog !== 'summary' }) as {
    data?: { data?: ProductsSummaryData };
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };
  const { data: categoriesResponse } = useGetCategoriesQuery({ page: 1, limit: 100 }) as {
    data?: CategoriesResponse;
  };

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [bulkUpdateProducts, { isLoading: isBulkUpdating }] = useBulkUpdateProductsMutation();
  const [bulkDeleteProducts, { isLoading: isBulkDeleting }] = useBulkDeleteProductsMutation();

  const rows = useMemo(() => data?.data?.products || [], [data]);
  const categoryOptions = useMemo(() => categoriesResponse?.data?.categories || [], [categoriesResponse]);
  const total = data?.data?.total || 0;
  const activeFilter = q.startsWith('createdAt:range:') ? q.replace('createdAt:range:', '').replace('_', ' to ') : '';
  const visibleHeaders = useMemo(() => tableHeaders.filter(header => columnVisibility[header.key]), [columnVisibility]);
  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;
    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  const productsSummaryData = summaryResponse?.data;
  const summaryTableHeaders = productsSummaryData?.monthlyTable?.[0] ? Object.keys(productsSummaryData.monthlyTable[0]) : [];
  const summaryKeys = productsSummaryData?.tableSummary ? Object.keys(productsSummaryData.tableSummary).filter(key => key !== 'totalMonths') : [];
  const summaryBarChartData =
    productsSummaryData?.monthlyTable?.map(row => {
      const formattedRow: Record<string, number | string> = {};
      Object.keys(row).forEach(key => {
        formattedRow[key] = row[key];
      });
      return formattedRow;
    }) || [];
  const summaryPieChartData = productsSummaryData?.tableSummary
    ? summaryKeys.map(key => ({
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        value: productsSummaryData.tableSummary![key] as number,
      }))
    : [];
  const summaryOverallStatsData = [
    { name: 'Total Records', value: productsSummaryData?.overall.totalRecords || 0 },
    { name: 'Active', value: productsSummaryData?.overall.activeRecords || 0 },
    { name: 'Draft', value: productsSummaryData?.overall.draftRecords || 0 },
    { name: 'Last 24 Hours', value: productsSummaryData?.overall.recordsLast24Hours || 0 },
  ];

  const handleSearch = useCallback((query: string) => {
    setQ(query);
    setPage(1);
    setSelected([]);
  }, []);

  const handleReload = useCallback(async () => {
    try {
      const result = await refetch();
      if (typeof result === 'object' && result && 'error' in result && result.error) throw result.error;
      handleSuccess('Reloaded successfully!');
    } catch (reloadError) {
      console.error('Error reloading products:', reloadError);
      handleError('Failed to reload products.');
    }
  }, [refetch]);

  const initialFilter = useMemo<FilterPayload | undefined>(() => {
    if (!q.startsWith('createdAt:range:')) return undefined;
    const datePart = q.split(':')[2];
    const [start, end] = datePart.split('_');
    if (!start || !end) return undefined;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const isFullMonth =
      format(startOfMonth(startDate), 'yyyy-MM-dd') === start &&
      format(endOfMonth(startDate), 'yyyy-MM-dd') === end &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear();

    return {
      type: isFullMonth ? 'month' : 'range',
      value: { start, end },
    };
  }, [q]);

  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = subMonths(now, i);
      options.push({
        label: format(date, 'MMMM yyyy'),
        value: format(date, 'yyyy-MM'),
      });
    }
    return options;
  }, []);

  useEffect(() => {
    if (openDialog === 'export') {
      const allSelected = tableHeaders.reduce(
        (acc, header) => {
          acc[String(header.key)] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      setSelectedExportColumns(allSelected);
    }

    if (openDialog === 'bulk-update') {
      setBulkUpdateStatus('active');
    }
  }, [openDialog]);

  useEffect(() => {
    if (openDialog === 'filter') {
      if (initialFilter) {
        if (initialFilter.type === 'month') {
          setFilterActiveTab('month');
          setSelectedMonth(format(new Date(initialFilter.value.start), 'yyyy-MM'));
          setDateRange(undefined);
          setTempDateRange(undefined);
        } else {
          const nextRange = {
            from: new Date(initialFilter.value.start),
            to: new Date(initialFilter.value.end),
          };
          setFilterActiveTab('range');
          setDateRange(nextRange);
          setTempDateRange(nextRange);
          setSelectedMonth('');
        }
      } else {
        setSelectedMonth('');
        setDateRange(undefined);
        setTempDateRange(undefined);
      }
    }
  }, [initialFilter, openDialog]);

  useEffect(() => {
    if (isCalendarOpen) setTempDateRange(dateRange);
  }, [dateRange, isCalendarOpen]);

  const submitAdd = async () => {
    try {
      await addProduct(sanitizeProductPayload(draft)).unwrap();
      setDraft(emptyProduct());
      setOpenDialog(null);
      handleSuccess('Product added successfully');
    } catch (submitError) {
      handleError(submitError instanceof Error ? submitError.message : 'Failed to add product.');
    }
  };

  const submitEdit = async () => {
    if (!editing?._id) return;
    try {
      await updateProduct({ id: editing._id, ...sanitizeProductPayload(editing) }).unwrap();
      setEditing(null);
      handleSuccess('Product updated successfully');
    } catch (submitError) {
      handleError(submitError instanceof Error ? submitError.message : 'Failed to update product.');
    }
  };

  const submitDelete = async () => {
    if (!deleting?._id) return;
    try {
      await deleteProduct({ id: deleting._id }).unwrap();
      setDeleting(null);
      setSelected(prev => prev.filter(item => item._id !== deleting._id));
      handleSuccess('Product deleted successfully');
    } catch {
      handleError('Failed to delete product.');
    }
  };

  const handleBulkUpdateFieldChangeForAll = (status: string) => {
    setBulkUpdateStatus(status as ProductStatus);
  };

  const handleBulkEditFieldChange = (id: string, key: keyof ProductItem, value: string | number | boolean) => {
    setSelected(prev => prev.map(item => (item._id === id ? { ...item, [key]: value } : item)));
  };

  const submitBulkUpdateSelected = async () => {
    if (!selected.length) return;
    try {
      await bulkUpdateProducts(
        selected.map(item => ({
          id: item._id,
          updateData: sanitizeProductPayload({ ...item, status: bulkUpdateStatus }),
        })),
      ).unwrap();
      setSelected([]);
      setOpenDialog(null);
      handleSuccess('Bulk update completed');
    } catch {
      handleError('Failed to bulk update products.');
    }
  };

  const submitBulkEdit = async () => {
    if (!selected.length) return;
    try {
      await bulkUpdateProducts(
        selected.map(item => ({
          id: item._id,
          updateData: sanitizeProductPayload(item),
        })),
      ).unwrap();
      setSelected([]);
      setOpenDialog(null);
      handleSuccess('Bulk edit completed');
    } catch {
      handleError('Failed to bulk edit products.');
    }
  };

  const submitBulkDelete = async () => {
    try {
      await bulkDeleteProducts({ ids: selected.map(item => item._id).filter((id): id is string => Boolean(id)) }).unwrap();
      setSelected([]);
      setOpenDialog(null);
      handleSuccess('Bulk delete completed');
    } catch {
      handleError('Failed to bulk delete products.');
    }
  };

  const handleExportCheckedChange = (key: string, isChecked: boolean) => {
    const checkedCount = Object.values(selectedExportColumns).filter(Boolean).length;
    if (checkedCount === 1 && !isChecked) return;
    setSelectedExportColumns(prev => ({ ...prev, [key]: isChecked }));
  };

  const submitExport = () => {
    const activeHeaders = tableHeaders.filter(header => selectedExportColumns[String(header.key)]);
    const processedData = selected.map(row =>
      activeHeaders.reduce(
        (acc, header) => {
          acc[header.label] = formatProductCellValue(row, header.key);
          return acc;
        },
        {} as Record<string, unknown>,
      ),
    );

    downloadXlsx(processedData, `Exported_Products_${new Date().toISOString()}.xlsx`);
    setOpenDialog(null);
  };

  const applyFilter = () => {
    if (filterActiveTab === 'month' && selectedMonth) {
      const monthDate = new Date(selectedMonth);
      setQ(`createdAt:range:${format(startOfMonth(monthDate), 'yyyy-MM-dd')}_${format(endOfMonth(monthDate), 'yyyy-MM-dd')}`);
      setPage(1);
    } else if (filterActiveTab === 'range' && dateRange?.from && dateRange?.to) {
      setQ(`createdAt:range:${format(dateRange.from, 'yyyy-MM-dd')}_${format(dateRange.to, 'yyyy-MM-dd')}`);
      setPage(1);
    }
    setOpenDialog(null);
  };

  const clearFilter = () => {
    setQ('');
    setSelectedMonth('');
    setDateRange(undefined);
    setTempDateRange(undefined);
    setOpenDialog(null);
  };

  const updateCalendarRange = () => {
    setDateRange(tempDateRange);
    setIsCalendarOpen(false);
  };

  const closeCalendarRange = () => {
    setTempDateRange(dateRange);
    setIsCalendarOpen(false);
  };

  const handleSort = (key: DisplayableProductKeys) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const handleSelectAll = (isChecked: boolean) => setSelected(isChecked ? rows : []);
  const handleSelectRow = (isChecked: boolean, item: ProductItem) => {
    setSelected(prev => (isChecked ? [...prev.filter(row => row._id !== item._id), item] : prev.filter(row => row._id !== item._id)));
  };

  const handleSummaryPageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (productsSummaryData?.pagination?.totalPages || 1)) {
      setSummaryPage(newPage);
    }
  };

  const isFilterApplyDisabled = (filterActiveTab === 'month' && !selectedMonth) || (filterActiveTab === 'range' && (!dateRange?.from || !dateRange?.to));
  const isCalendarUpdateDisabled = !tempDateRange?.from || !tempDateRange?.to;

  const renderActions = (product: ProductItem) => (
    <div className="flex justify-end gap-2">
      <Button size="icon" variant="outlineWater" onClick={() => setViewing(product)} className="min-w-1">
        <EyeIcon className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outlineWater" onClick={() => setEditing(product)} className="min-w-1">
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive" onClick={() => setDeleting(product)} className="min-w-1">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );

  const ProductCard = ({ item }: { item: ProductItem }) => (
    <div className="rounded-md border border-white/10 bg-white/5 p-3">
      <div className="flex items-start gap-3">
        <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, item)} checked={selected.some(row => row._id === item._id)} />
        {item.primary_images?.url && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
            <Image src={item.primary_images.url} alt={item.primary_images.name || item.title} fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{item.title}</h3>
          <p className="text-sm text-white/70">৳{item.discount_price || 0}</p>
          <Badge variant="secondary" className="mt-2 capitalize">
            {item.status}
          </Badge>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">{renderActions(item)}</div>
    </div>
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={String(error || 'An error occurred')} />;

  return (
    <div className="container mx-auto text-white md:p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <h1 className="h2 text-xl">Products Management</h1>
          <Sheet open={headerMenuOpen} onOpenChange={setHeaderMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outlineWater" className="rounded-full backdrop-blur-md bg-white/10 border-white/20 min-w-10">
                <MoreHorizontalIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-64 sm:w-72 backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl rounded-l-2xl p-4 flex flex-col mt-16"
            >
              <SheetHeader className="px-0 pt-0 pb-2">
                <SheetTitle className="text-lg font-semibold text-white/90">Actions</SheetTitle>
              </SheetHeader>
              <Button
                size="sm"
                variant="outlineGlassy"
                onClick={() => {
                  setOpenDialog('summary');
                  setHeaderMenuOpen(false);
                }}
                className="justify-start"
              >
                <TrendingUp className="mr-2 h-4 w-4" /> Summary
              </Button>
              <Button
                size="sm"
                variant="outlineWater"
                onClick={() => {
                  setOpenDialog('filter');
                  setHeaderMenuOpen(false);
                }}
                className="justify-start"
              >
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button
                size="sm"
                variant="outlineWater"
                onClick={() => {
                  setHeaderMenuOpen(false);
                  void handleReload();
                }}
                disabled={isFetching}
                className="justify-start"
              >
                {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                Reload
              </Button>
              <Button
                size="sm"
                variant="outlineGarden"
                onClick={() => {
                  setOpenDialog('add');
                  setHeaderMenuOpen(false);
                }}
                className="justify-start"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex md:items-center md:justify-between">
          <h1 className="h2 w-full text-xl sm:text-2xl">
            Products Management <sup className="text-xs text-gray-300">(total:{total || '00'})</sup>
          </h1>
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="outlineGlassy" onClick={() => setOpenDialog('summary')} className="w-full sm:w-auto">
              <TrendingUp className="mr-2 h-4 w-4" /> Summary
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('filter')} className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button size="sm" variant="outlineWater" onClick={handleReload} disabled={isFetching} className="w-full sm:w-auto">
              {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
              Reload
            </Button>
            <Button size="sm" variant="outlineGarden" onClick={() => setOpenDialog('add')} className="w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>
      </div>

      <ProductSearchBox onSearch={handleSearch} placeholder="Search here ..." />

      {activeFilter && (
        <Badge variant="secondary" className="mb-4 gap-2 bg-white/10 text-white pr-0">
          Filtering from {activeFilter}
          <Button variant="ghost" size="icon" className="min-w-1" onClick={() => setQ('')}>
            <XIcon className="h-4 w-4" />
          </Button>
        </Badge>
      )}

      <div className="w-full flex flex-col">
        <div className="w-full my-4">
          <div className="w-full flex items-center justify-between gap-3 sm:gap-4 pb-2 border-b">
            <div className="flex items-center gap-2 justify-start shrink-0">
              <Label>Selected:</Label>
              <span className="text-sm text-slate-300">({selected.length})</span>
            </div>

            <div className="hidden md:flex items-center justify-end w-full gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outlineWater" size="sm">
                    <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {tableHeaders.map(header => (
                    <DropdownMenuCheckboxItem
                      key={header.key}
                      className="capitalize"
                      checked={columnVisibility[header.key]}
                      onCheckedChange={value => setColumnVisibility(prev => ({ ...prev, [header.key]: !!value }))}
                    >
                      {header.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('export')} disabled={selected.length === 0}>
                <DownloadIcon className="w-4 h-4 mr-1" /> Export
              </Button>
              <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-update')} disabled={selected.length === 0}>
                <PencilIcon className="w-4 h-4 mr-1" /> B.Update
              </Button>
              <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-edit')} disabled={selected.length === 0}>
                <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setOpenDialog('bulk-delete')} disabled={selected.length === 0}>
                <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
              </Button>
            </div>

            <div className="flex md:hidden justify-end shrink-0">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outlineWater" className="rounded-full backdrop-blur-md bg-white/10 border-white/20 min-w-[8px]">
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-64 sm:w-72 backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl rounded-l-2xl p-4 flex flex-col mt-16"
                >
                  <SheetHeader className="flex justify-between items-center">
                    <SheetTitle className="text-lg font-semibold text-white/90"></SheetTitle>
                  </SheetHeader>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outlineWater" size="sm" className="justify-start">
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {tableHeaders.map(header => (
                        <DropdownMenuCheckboxItem
                          key={header.key}
                          className="capitalize"
                          checked={columnVisibility[header.key]}
                          onCheckedChange={value => setColumnVisibility(prev => ({ ...prev, [header.key]: !!value }))}
                        >
                          {header.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('export')} disabled={selected.length === 0}>
                    <DownloadIcon className="w-4 h-4 mr-1" /> Export
                  </Button>
                  <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-update')} disabled={selected.length === 0}>
                    <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                  </Button>
                  <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-edit')} disabled={selected.length === 0}>
                    <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setOpenDialog('bulk-delete')} disabled={selected.length === 0}>
                    <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                  </Button>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="py-12 text-center text-xl sm:text-2xl text-slate-300">Ops! Nothing was found.</div>
        ) : (
          <>
            <div className="hidden sm:block w-full overflow-x-auto">
              <Table className="min-w-[920px] border">
                <TableHeader>
                  <TableRow className="bg-blue-300/40 text-white font-bold">
                    <TableHead>
                      <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={selected.length === rows.length && rows.length > 0} />
                    </TableHead>
                    <TableHead className="bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap">Image</TableHead>
                    {visibleHeaders.map(({ key, label }) => (
                      <TableHead
                        key={key}
                        className="cursor-pointer bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap"
                        onClick={() => handleSort(key)}
                      >
                        {label}
                        {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                    ))}
                    <TableHead className="sticky right-0 text-right bg-accent-100/80 text-slate-50 font-bold whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRows.map(item => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, item)} checked={selected.some(row => row._id === item._id)} />
                      </TableCell>
                      <TableCell>
                        {item.primary_images?.url ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-md border border-white/20">
                            <Image src={item.primary_images.url} alt={item.primary_images.name || item.title} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-white/10" />
                        )}
                      </TableCell>
                      {visibleHeaders.map(header => (
                        <TableCell key={header.key} className="max-w-[220px] truncate">
                          {formatProductCellValue(item, header.key)}
                        </TableCell>
                      ))}
                      <TableCell className="sticky right-0 text-right">{renderActions(item)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex sm:hidden flex-col gap-3">
              {sortedRows.map(item => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      <ProductPagination currentPage={page} totalItems={total} itemsPerPage={limit} onPageChange={setPage} />

      <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8 mb-12">
        <Label htmlFor="set-limit" className="text-right text-slate-50 font-normal pl-3">
          Products per page
        </Label>
        <Select
          value={String(limit)}
          onValueChange={next => {
            setLimit(Number(next));
            setPage(1);
          }}
        >
          <SelectTrigger className="border-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {pageLimits.map(item => (
              <SelectItem key={item} value={String(item)} className="cursor-pointer">
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={openDialog === 'add'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0">
          <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
            <DialogHeader className="p-6 pb-3">
              <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200 drop-shadow-md">
                Add New Product
              </DialogTitle>
            </DialogHeader>
            <ProductForm value={draft} onChange={setDraft} categories={categoryOptions} />
          </ScrollArea>
          <DialogFooter className="p-6 pt-4 gap-3">
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)} size="sm">
              Cancel
            </Button>
            <Button variant="outlineGarden" disabled={isAdding} onClick={submitAdd} size="sm">
              {isAdding ? 'Adding...' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0">
          <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
            <DialogHeader className="p-6 pb-3">
              <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200 drop-shadow-md">
                Edit Product
              </DialogTitle>
            </DialogHeader>
            {editing && <ProductForm value={editing} onChange={next => setEditing(next)} categories={categoryOptions} />}
          </ScrollArea>
          <DialogFooter className="p-6 pt-4 gap-3">
            <Button variant="outlineWater" onClick={() => setEditing(null)} size="sm">
              Cancel
            </Button>
            <Button variant="outlineGarden" disabled={isUpdating} onClick={submitEdit} size="sm">
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={open => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-3xl mt-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl text-white">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[76vh] pr-3">
            {viewing && (
              <div className="space-y-4">
                {viewing.primary_images?.url && (
                  <div className="relative h-56 w-full overflow-hidden rounded-lg border border-white/20">
                    <Image src={viewing.primary_images.url} alt={viewing.primary_images.name || viewing.title} fill className="object-cover" unoptimized />
                  </div>
                )}
                <h2 className="text-2xl font-bold">{viewing.title}</h2>
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <p>Real Price: ৳{viewing.real_price}</p>
                  <p>Discount Price: ৳{viewing.discount_price}</p>
                  <p>Discount: {viewing.discount}</p>
                  <p>Star: {viewing.star}</p>
                  <p>Status: {viewing.status}</p>
                  <p>Category: {viewing.category?.length ? viewing.category.join(', ') : 'N/A'}</p>
                  <p>Offer Ends: {formatDate(viewing.offerEnds)}</p>
                  <p>View: {viewing.view || 'N/A'}</p>
                  <p>Share Buttons: {viewing.shareButtonsVisible === false ? 'Hidden' : 'Visible'}</p>
                  <div className="min-w-0 md:col-span-2">
                    <p className="font-semibold">Upload Product</p>
                    {viewing.uploadProduct?.url ? (
                      <a href={viewing.uploadProduct.url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sky-200 hover:underline">
                        {viewing.uploadProduct.name || viewing.uploadProduct.url}
                      </a>
                    ) : (
                      <p className="mt-1 text-white/70">N/A</p>
                    )}
                  </div>
                </div>
                <ProductDescriptionView description={viewing.description} />
                <div>
                  <h3 className="mb-2 font-semibold">Features</h3>
                  <ul className="list-inside list-disc text-sm text-white/80">
                    {viewing.features?.length ? viewing.features.map((feature, index) => <li key={index}>{feature}</li>) : <li>N/A</li>}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {viewing.product_images?.map((image, index) => (
                    <div key={image.url + index} className="relative h-28 overflow-hidden rounded-md border border-white/20">
                      <Image src={image.url} alt={image.name || viewing.title} fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="hidden"></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={open => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-white/80">
            Are you sure you want to delete <strong>{deleting?.title || 'this product'}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={submitDelete}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'filter'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-blue-200">Filter Products</DialogTitle>
            <DialogDescription className="text-white/70">Select a filter option to narrow down data.</DialogDescription>
          </DialogHeader>

          <Tabs value={filterActiveTab} onValueChange={setFilterActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg rounded-lg text-white border border-white/20">
              <TabsTrigger value="month" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-none text-white">
                By Month
              </TabsTrigger>
              <TabsTrigger value="range" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-none text-white">
                By Date Range
              </TabsTrigger>
            </TabsList>

            <TabsContent value="month" className="py-4">
              <div className="grid gap-2">
                <Label htmlFor="month-select" className="text-white">
                  Select Month
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-select" className="text-white border border-white/20 bg-white/5">
                    <SelectValue placeholder="Choose a month" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/20 backdrop-blur-xl text-white border border-white/20">
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="focus:bg-white/30">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="range" className="py-4">
              <div className="grid gap-2">
                <Label className="text-white">Select Date Range</Label>
                <Button id="date" variant="outlineGlassy" onClick={() => setIsCalendarOpen(true)}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2 gap-2">
            <Button size="sm" variant="outlineFire" onClick={clearFilter}>
              Clear Filter
            </Button>
            <Button size="sm" variant="outlineGarden" disabled={isFilterApplyDisabled} onClick={applyFilter}>
              Apply Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCalendarOpen} onOpenChange={closeCalendarRange}>
        <DialogContent className="w-[95vw] sm:w-auto sm:min-w-[400px] md:min-w-[608px] md:max-w-[608px] max-h-[85vh] overflow-y-auto p-2 md:p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg text-white">
          <DialogTitle className="text-white">Select Date Range</DialogTitle>
          <Calendar mode="range" selected={tempDateRange} onSelect={setTempDateRange} numberOfMonths={1} className="md:hidden" />
          <Calendar mode="range" selected={tempDateRange} onSelect={setTempDateRange} numberOfMonths={2} className="hidden md:block" />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outlineWater" size="sm" onClick={closeCalendarRange}>
              Close
            </Button>
            <Button variant="outlineGarden" size="sm" disabled={isCalendarUpdateDisabled} onClick={updateCalendarRange}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'summary'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="w-[95vw] sm:max-w-7xl max-h-[88vh] mt-10 overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-3xl shadow-2xl text-white p-4 sm:p-6">
          <DialogHeader className="space-y-2 sm:space-y-3 pb-4 border-b border-white/10">
            <DialogTitle className="text-xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Products Analytics Dashboard
            </DialogTitle>
            <DialogDescription className="text-white/60 text-base">
              Comprehensive overview of your products data with interactive visualizations
            </DialogDescription>
          </DialogHeader>

          {isSummaryLoading && (
            <div className="flex items-center justify-center p-16">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto" />
                <p className="text-white/70">Loading analytics...</p>
              </div>
            </div>
          )}

          {isSummaryError && (
            <div className="text-center p-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                <Activity className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-300 text-lg">Failed to load summary data.</p>
            </div>
          )}

          {!isSummaryLoading && !isSummaryError && productsSummaryData && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-white/20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl shadow-lg text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Total Records</p>
                        <p className="text-3xl font-bold">{productsSummaryData.overall.totalRecords ?? 'N/A'}</p>
                      </div>
                      <CalendarDays className="h-6 w-6 text-blue-300" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-white/20 bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl shadow-lg text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Active</p>
                        <p className="text-3xl font-bold">{productsSummaryData.overall.activeRecords ?? 'N/A'}</p>
                      </div>
                      <Activity className="h-6 w-6 text-green-300" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-white/20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl shadow-lg text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Draft</p>
                        <p className="text-3xl font-bold">{productsSummaryData.overall.draftRecords ?? 'N/A'}</p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-purple-300" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-white/20 bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-xl shadow-lg text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Last 24 Hours</p>
                        <p className="text-3xl font-bold">{productsSummaryData.overall.recordsLast24Hours ?? 'N/A'}</p>
                      </div>
                      <CalendarDays className="h-6 w-6 text-amber-300" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      Overall Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={summaryOverallStatsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white' }}
                        />
                        <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {productsSummaryData.tableSummary && (
                  <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-purple-400" />
                        Grand Total Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-white/60 text-xs mb-1">Total Months</p>
                            <p className="text-2xl font-bold">{productsSummaryData.tableSummary.totalMonths}</p>
                          </div>
                          {summaryKeys.map((key, index) => (
                            <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-white/60 text-xs mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-xl font-bold" style={{ color: summaryColors[index % summaryColors.length] }}>
                                {productsSummaryData.tableSummary![key].toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                          <RechartsPieChart>
                            <Pie
                              data={summaryPieChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(props: PieLabelRenderProps) => `${(((props.percent as number) || 0) * 100).toFixed(0)}%`}
                              outerRadius={85}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {summaryPieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={summaryColors[index % summaryColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                color: 'white',
                              }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {productsSummaryData.monthlyTable && (
                <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <CardTitle className="text-xl">Monthly Data Breakdown</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={summaryViewMode === 'table' ? 'default' : 'ghost'}
                          onClick={() => setSummaryViewMode('table')}
                          className={cn(
                            'h-9 px-4',
                            summaryViewMode === 'table' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                          )}
                        >
                          Table
                        </Button>
                        <Button
                          size="sm"
                          variant={summaryViewMode === 'bar' ? 'default' : 'ghost'}
                          onClick={() => setSummaryViewMode('bar')}
                          className={cn(
                            'h-9 px-4',
                            summaryViewMode === 'bar' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                          )}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Bar
                        </Button>
                        <Button
                          size="sm"
                          variant={summaryViewMode === 'pie' ? 'default' : 'ghost'}
                          onClick={() => setSummaryViewMode('pie')}
                          className={cn(
                            'h-9 px-4',
                            summaryViewMode === 'pie' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                          )}
                        >
                          <PieChart className="h-4 w-4 mr-1" />
                          Pie
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`relative transition-opacity duration-200 ${isSummaryFetching ? 'opacity-50' : ''}`}>
                      {isSummaryFetching && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg backdrop-blur-sm z-10">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}

                      {summaryViewMode === 'table' && (
                        <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl overflow-hidden">
                          <Table className="text-white">
                            <TableHeader className="bg-linear-to-r from-blue-500/20 to-purple-500/20">
                              <TableRow className="border-white/10 hover:bg-transparent">
                                {summaryTableHeaders.map(header => (
                                  <TableHead key={header} className="text-white font-semibold whitespace-nowrap">
                                    {header.charAt(0).toUpperCase() +
                                      header
                                        .slice(1)
                                        .replace(/([A-Z])/g, ' $1')
                                        .trim()}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {productsSummaryData.monthlyTable.length > 0 ? (
                                productsSummaryData.monthlyTable.map((row, index) => (
                                  <TableRow key={index} className="hover:bg-white/10 transition-colors border-white/5">
                                    {summaryTableHeaders.map(header => (
                                      <TableCell key={header} className="text-white/90">
                                        {row[header]}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={summaryTableHeaders.length} className="h-32 text-center text-white/70">
                                    No monthly data to display.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {summaryViewMode === 'bar' && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={summaryBarChartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey={summaryTableHeaders[0]} stroke="rgba(255,255,255,0.7)" angle={-45} textAnchor="end" height={80} />
                              <YAxis stroke="rgba(255,255,255,0.7)" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(0,0,0,0.9)',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  borderRadius: '12px',
                                  color: 'white',
                                }}
                              />
                              <Legend />
                              {summaryTableHeaders.slice(1).map((header, index) => (
                                <Bar key={header} dataKey={header} fill={summaryColors[index % summaryColors.length]} radius={[8, 8, 0, 0]} />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {summaryViewMode === 'pie' && summaryBarChartData.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {summaryTableHeaders.slice(1).map((header, idx) => {
                            const chartData = summaryBarChartData
                              .map(row => ({ name: String(row[summaryTableHeaders[0]]), value: Number(row[header]) || 0 }))
                              .filter(item => item.value > 0);
                            return (
                              <div key={header} className="border border-white/20 rounded-xl p-5 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
                                <h3 className="text-base font-semibold mb-4 text-center text-white/90 pb-2 border-b border-white/10">
                                  {header.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                  <RechartsPieChart>
                                    <Pie
                                      data={chartData}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      label={(props: PieLabelRenderProps) => ((props.value as number) > 0 ? String(props.value) : '')}
                                      outerRadius={70}
                                      fill="#8884d8"
                                      dataKey="value"
                                    >
                                      {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={summaryColors[(index + idx) % summaryColors.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.9)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '12px',
                                        color: 'white',
                                      }}
                                    />
                                  </RechartsPieChart>
                                </ResponsiveContainer>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="border-t border-white/10 pt-4 mt-2">
            {productsSummaryData?.pagination && productsSummaryData.pagination.totalPages > 1 && (
              <Pagination className="text-white w-full justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        handleSummaryPageChange(summaryPage - 1);
                      }}
                      className={cn(
                        'border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20',
                        summaryPage <= 1 && 'pointer-events-none opacity-40',
                      )}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive className="border-white/30 bg-blue-500/30 backdrop-blur-xl text-white hover:bg-blue-500/40">
                      Page {summaryPage} of {productsSummaryData.pagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        handleSummaryPageChange(summaryPage + 1);
                      }}
                      className={cn(
                        'border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20',
                        summaryPage >= productsSummaryData.pagination.totalPages && 'pointer-events-none opacity-40',
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'export'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-2xl shadow-xl transition-all">
          <DialogHeader>
            <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Customize Your Export</DialogTitle>
            <DialogDescription className="text-white/70">Select the columns you want to include in your XLSX file.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-60 overflow-y-auto pr-2 backdrop-blur-md p-2">
            {tableHeaders.map(header => (
              <div key={String(header.key)} className="flex items-center space-x-2">
                <Checkbox
                  id={`col-${String(header.key)}`}
                  checked={!!selectedExportColumns[String(header.key)]}
                  onCheckedChange={checked => handleExportCheckedChange(String(header.key), !!checked)}
                  className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400"
                />
                <Label htmlFor={`col-${String(header.key)}`} className="font-normal text-white/90">
                  {header.label}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button onClick={() => setOpenDialog(null)} variant="outlineWater" size="sm">
              Cancel
            </Button>
            <Button onClick={submitExport} variant="outlineWater" size="sm">
              Export Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'bulk-delete'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
          <DialogHeader>
            <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-red-200">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-white/80 mt-2">
            You are deleting <strong>({selected.length})</strong> products.
          </p>
          <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
            <div className="flex flex-col gap-2">
              {selected.map((item, idx) => (
                <span key={`${item._id || 'product'}-${idx}`} className="text-sm text-white/90">
                  {idx + 1}. {String(item.title || '')}
                </span>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="gap-2 mt-3">
            <Button variant="outlineWater" size="sm" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button variant="outlineFire" size="sm" disabled={isBulkDeleting} onClick={submitBulkDelete}>
              {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'bulk-edit'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-xl rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
          <DialogHeader>
            <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Bulk Edit Products</DialogTitle>
          </DialogHeader>
          <p className="text-white/80">
            Editing <strong>{selected.length}</strong> selected products.
          </p>
          <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
            <div className="flex flex-col gap-3">
              {selected.map((item, idx) => (
                <div key={item._id || idx} className="p-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-lg flex flex-col gap-3">
                  <span className="font-medium text-white">
                    {idx + 1}. {String(item.title || '')}
                  </span>
                  <div className="flex items-center gap-3">
                    <Label className="min-w-[120px] text-white">Status</Label>
                    <Select onValueChange={value => handleBulkEditFieldChange(item._id as string, 'status', value)} defaultValue={String(item.status ?? '')}>
                      <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="min-w-[120px] text-white">Discount</Label>
                    <Input
                      className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white"
                      type="number"
                      value={Number(item.discount) || 0}
                      onChange={event => handleBulkEditFieldChange(item._id as string, 'discount', Number(event.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="gap-2">
            <Button variant="outlineWater" size="sm" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button disabled={isBulkUpdating} onClick={submitBulkEdit} variant="outlineWater" size="sm">
              {isBulkUpdating ? 'Updating...' : 'Update Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'bulk-update'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-lg rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
          <DialogHeader>
            <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Confirm Bulk Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="pt-2 text-white/80">
              You are about to update <span className="font-semibold text-white">({selected.length})</span> products.
            </p>
            <div className="flex items-center justify-between rounded-lg p-3 bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-white/90">
                Set all <span className="font-semibold text-blue-300">Status</span> to
              </p>
              <Select onValueChange={handleBulkUpdateFieldChangeForAll} defaultValue={statusOptions[0]}>
                <SelectTrigger className="w-[180px] border-white/20 bg-white/10 text-white backdrop-blur-md">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status} className="cursor-pointer hover:bg-white/20 text-white">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <ScrollArea className="h-[300px] w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mt-3">
            <div className="flex flex-col gap-2">
              {selected.map((item, idx) => (
                <div key={item._id || idx} className="flex justify-between items-center text-white/90 rounded-md p-2 bg-white/5 border border-white/10">
                  <span>
                    {idx + 1}. {String(item.title || '')}
                  </span>
                  <span className="text-blue-300 capitalize">{bulkUpdateStatus}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outlineWater" className="text-white hover:text-white" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button
              disabled={isBulkUpdating}
              onClick={submitBulkUpdateSelected}
              className="px-6 py-2 bg-green-600/80 hover:bg-green-600 border border-green-400 text-white hover:shadow-md backdrop-blur-xl"
            >
              {isBulkUpdating ? 'Updating...' : 'Update Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
