'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import * as XLSX from 'xlsx';
import {
  Activity,
  BarChart3,
  Calendar as CalendarIcon,
  CalendarDays,
  DownloadIcon,
  EyeIcon,
  Filter,
  Loader2,
  MoreHorizontalIcon,
  PencilIcon,
  PieChart,
  PlusIcon,
  RefreshCcw,
  Search,
  TrashIcon,
  TrendingUp,
  X,
  XIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  useAddOrderMutation,
  useBulkDeleteOrdersMutation,
  useBulkUpdateOrdersMutation,
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useGetOrdersSummaryQuery,
  useUpdateOrderMutation,
} from '@/redux/features/orders/ordersSlice';

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
type DeliveryStatus = 'pending' | 'packed' | 'shipped' | 'delivered' | 'returned';
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
type FilterPayload = { type: 'month'; value: { start: string; end: string } } | { type: 'range'; value: { start: string; end: string } };

interface OrderItemValue {
  productId?: string;
  title: string;
  quantity: number;
  price: number;
}

interface OrderItem {
  _id?: string;
  orderNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItemValue[];
  subtotal: number;
  shippingCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  orderStatus: OrderStatus;
  shippingAddress: string;
  note: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

interface OrdersResponse {
  data?: {
    orders?: OrderItem[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

interface OrdersSummaryData {
  overall: {
    totalRecords: number;
    paidRecords?: number;
    pendingRecords?: number;
    deliveredRecords?: number;
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

type DisplayableOrderKeys =
  | 'orderNo'
  | 'customerName'
  | 'customerEmail'
  | 'customerPhone'
  | 'totalAmount'
  | 'paymentStatus'
  | 'deliveryStatus'
  | 'orderStatus'
  | 'createdAt';
type OrderColumnVisibilityState = Record<DisplayableOrderKeys, boolean>;

const paymentStatusOptions: PaymentStatus[] = ['pending', 'paid', 'failed', 'cancelled', 'refunded'];
const deliveryStatusOptions: DeliveryStatus[] = ['pending', 'packed', 'shipped', 'delivered', 'returned'];
const orderStatusOptions: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'];
const pageLimits = [10, 20, 30, 50, 100];
const summaryColors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#ec4899', '#06b6d4'];
const tableHeaders: { key: DisplayableOrderKeys; label: string }[] = [
  { key: 'orderNo', label: 'Order No' },
  { key: 'customerName', label: 'Customer' },
  { key: 'customerEmail', label: 'Email' },
  { key: 'customerPhone', label: 'Phone' },
  { key: 'totalAmount', label: 'Total' },
  { key: 'paymentStatus', label: 'Payment' },
  { key: 'deliveryStatus', label: 'Delivery' },
  { key: 'orderStatus', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
];

const emptyOrder = (): OrderItem => ({
  orderNo: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  items: [],
  subtotal: 0,
  shippingCharge: 0,
  discount: 0,
  totalAmount: 0,
  paymentMethod: '',
  paymentStatus: 'pending',
  deliveryStatus: 'pending',
  orderStatus: 'pending',
  shippingAddress: '',
  note: '',
});

const formatDate = (date?: unknown) => {
  if (!date) return 'N/A';
  const parsed = new Date(String(date));
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return format(parsed, 'PP');
};

const formatCurrency = (value?: unknown) => `৳${(Number(value) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const titleCase = (value: string) => value.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase());

const downloadXlsx = (data: Record<string, unknown>[], fileName: string) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, fileName);
};

const calculateTotals = (order: OrderItem) => {
  const subtotal = order.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
  const finalSubtotal = subtotal || Number(order.subtotal) || 0;
  const totalAmount = finalSubtotal + (Number(order.shippingCharge) || 0) - (Number(order.discount) || 0);

  return {
    subtotal: finalSubtotal,
    totalAmount: Math.max(totalAmount, 0),
  };
};

const sanitizeOrderPayload = (order: OrderItem) => {
  const totals = calculateTotals(order);
  const payload: Partial<OrderItem> = {
    ...order,
    items: (order.items || []).filter(item => item.title || item.productId),
    subtotal: totals.subtotal,
    shippingCharge: Number(order.shippingCharge) || 0,
    discount: Number(order.discount) || 0,
    totalAmount: totals.totalAmount,
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

const getStatusBadgeClass = (value: string) => {
  const status = value.toLowerCase();
  if (['paid', 'completed', 'delivered'].includes(status)) return 'bg-emerald-500/20 text-emerald-100 border-emerald-400/40';
  if (['failed', 'cancelled', 'returned'].includes(status)) return 'bg-red-500/20 text-red-100 border-red-400/40';
  if (['processing', 'packed', 'shipped'].includes(status)) return 'bg-blue-500/20 text-blue-100 border-blue-400/40';
  return 'bg-amber-500/20 text-amber-100 border-amber-400/40';
};

const OrderSearchBox = ({ onSearch, placeholder = 'Search here ...' }: { onSearch: (query: string) => void; placeholder?: string }) => {
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

const OrderPagination = ({
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

const OrderForm = ({ value, onChange }: { value: OrderItem; onChange: (next: OrderItem) => void }) => {
  const setField = <K extends keyof OrderItem>(key: K, nextValue: OrderItem[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  const updateItem = (index: number, key: keyof OrderItemValue, nextValue: string | number) => {
    const nextItems = [...value.items];
    nextItems[index] = { ...nextItems[index], [key]: nextValue };
    const nextOrder = { ...value, items: nextItems };
    onChange({ ...nextOrder, ...calculateTotals(nextOrder) });
  };

  const setMoneyField = (key: 'subtotal' | 'shippingCharge' | 'discount', nextValue: number) => {
    const nextOrder = { ...value, [key]: Number(nextValue) || 0 };
    onChange({ ...nextOrder, ...calculateTotals(nextOrder) });
  };

  return (
    <div className="space-y-5 px-6 py-4 text-white">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Order No</Label>
          <Input value={value.orderNo} onChange={e => setField('orderNo', e.target.value)} placeholder="Auto generated if empty" />
        </div>
        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input value={value.customerName} onChange={e => setField('customerName', e.target.value)} placeholder="Customer name" />
        </div>
        <div className="space-y-2">
          <Label>Customer Email</Label>
          <Input value={value.customerEmail} onChange={e => setField('customerEmail', e.target.value)} placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label>Customer Phone</Label>
          <Input value={value.customerPhone} onChange={e => setField('customerPhone', e.target.value)} placeholder="+880..." />
        </div>
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Input value={value.paymentMethod} onChange={e => setField('paymentMethod', e.target.value)} placeholder="Cash, card, bkash" />
        </div>
        <div className="space-y-2">
          <Label>Payment Status</Label>
          <Select value={value.paymentStatus} onValueChange={(next: PaymentStatus) => setField('paymentStatus', next)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {titleCase(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Delivery Status</Label>
          <Select value={value.deliveryStatus} onValueChange={(next: DeliveryStatus) => setField('deliveryStatus', next)}>
            <SelectTrigger>
              <SelectValue placeholder="Select delivery status" />
            </SelectTrigger>
            <SelectContent>
              {deliveryStatusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {titleCase(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Order Status</Label>
          <Select value={value.orderStatus} onValueChange={(next: OrderStatus) => setField('orderStatus', next)}>
            <SelectTrigger>
              <SelectValue placeholder="Select order status" />
            </SelectTrigger>
            <SelectContent>
              {orderStatusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {titleCase(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 rounded-md border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between">
          <Label>Order Items</Label>
          <Button type="button" size="sm" variant="outlineWater" onClick={() => setField('items', [...value.items, { title: '', quantity: 1, price: 0 }])}>
            Add Item
          </Button>
        </div>
        {value.items.length === 0 && <p className="text-sm text-white/60">No items added.</p>}
        {value.items.map((item, index) => (
          <div key={index} className="grid gap-2 md:grid-cols-[1fr_110px_130px_auto]">
            <Input value={item.title} onChange={e => updateItem(index, 'title', e.target.value)} placeholder="Item title" />
            <Input type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', Number(e.target.value))} placeholder="Qty" />
            <Input type="number" value={item.price} onChange={e => updateItem(index, 'price', Number(e.target.value))} placeholder="Price" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => {
                const nextOrder = { ...value, items: value.items.filter((_, itemIndex) => itemIndex !== index) };
                onChange({ ...nextOrder, ...calculateTotals(nextOrder) });
              }}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Subtotal</Label>
          <Input type="number" value={value.subtotal} onChange={e => setMoneyField('subtotal', Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Shipping Charge</Label>
          <Input type="number" value={value.shippingCharge} onChange={e => setMoneyField('shippingCharge', Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Discount</Label>
          <Input type="number" value={value.discount} onChange={e => setMoneyField('discount', Number(e.target.value))} />
        </div>
      </div>

      <div className="rounded-md border border-white/10 bg-white/5 p-3">
        <p className="text-sm text-white/60">Total Amount</p>
        <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(value.totalAmount)}</p>
      </div>

      <div className="space-y-2">
        <Label>Shipping Address</Label>
        <textarea
          value={value.shippingAddress}
          onChange={e => setField('shippingAddress', e.target.value)}
          className="min-h-24 w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm outline-none"
          placeholder="Full delivery address"
        />
      </div>

      <div className="space-y-2">
        <Label>Note</Label>
        <textarea
          value={value.note}
          onChange={e => setField('note', e.target.value)}
          className="min-h-24 w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm outline-none"
          placeholder="Internal note"
        />
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [summaryPage, setSummaryPage] = useState(1);
  const [summaryViewMode, setSummaryViewMode] = useState<'table' | 'bar' | 'pie'>('table');
  const summaryLimit = 10;
  const [q, setQ] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<'all' | DeliveryStatus>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [filterActiveTab, setFilterActiveTab] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>();
  const [draft, setDraft] = useState<OrderItem>(emptyOrder);
  const [selected, setSelected] = useState<OrderItem[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: DisplayableOrderKeys; direction: 'asc' | 'desc' } | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<OrderColumnVisibilityState>(() => {
    const initialState = {} as OrderColumnVisibilityState;
    tableHeaders.forEach((header, index) => {
      initialState[header.key] = index <= 6;
    });
    return initialState;
  });
  const [viewing, setViewing] = useState<OrderItem | null>(null);
  const [editing, setEditing] = useState<OrderItem | null>(null);
  const [deleting, setDeleting] = useState<OrderItem | null>(null);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState<OrderStatus>('processing');
  const [selectedExportColumns, setSelectedExportColumns] = useState<Record<string, boolean>>({});
  const [openDialog, setOpenDialog] = useState<'add' | 'filter' | 'summary' | 'export' | 'bulk-edit' | 'bulk-update' | 'bulk-delete' | null>(null);

  const { data, isLoading, isError, isFetching, error, refetch } = useGetOrdersQuery({
    page,
    limit,
    q,
    paymentStatus: paymentStatusFilter === 'all' ? undefined : paymentStatusFilter,
    deliveryStatus: deliveryStatusFilter === 'all' ? undefined : deliveryStatusFilter,
    orderStatus: orderStatusFilter === 'all' ? undefined : orderStatusFilter,
  }) as {
    data?: OrdersResponse;
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
  } = useGetOrdersSummaryQuery({ page: summaryPage, limit: summaryLimit }, { skip: openDialog !== 'summary' }) as {
    data?: { data?: OrdersSummaryData };
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };

  const [addOrder, { isLoading: isAdding }] = useAddOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [bulkUpdateOrders, { isLoading: isBulkUpdating }] = useBulkUpdateOrdersMutation();
  const [bulkDeleteOrders, { isLoading: isBulkDeleting }] = useBulkDeleteOrdersMutation();

  const rows = useMemo(() => data?.data?.orders || [], [data]);
  const total = data?.data?.total || 0;
  const activeFilter = q.startsWith('createdAt:range:') ? q.replace('createdAt:range:', '').replace('_', ' to ') : '';
  const visibleHeaders = useMemo(() => tableHeaders.filter(header => columnVisibility[header.key]), [columnVisibility]);
  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;
    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === bValue) return 0;
      const result = String(aValue ?? '').localeCompare(String(bValue ?? ''), undefined, { numeric: true });
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [rows, sortConfig]);
  const selectedIds = useMemo(() => new Set(selected.map(item => item._id).filter(Boolean)), [selected]);
  const ordersSummaryData = summaryResponse?.data;
  const summaryTableHeaders = useMemo(() => {
    const firstRow = ordersSummaryData?.monthlyTable?.[0];
    return firstRow ? Object.keys(firstRow) : ['month', 'totalAmount', 'totalSubtotal', 'totalDiscount'];
  }, [ordersSummaryData]);
  const summaryBarChartData = ordersSummaryData?.monthlyTable || [];

  const handleSearch = useCallback((query: string) => {
    setQ(query);
    setPage(1);
  }, []);

  const handleSort = (key: DisplayableOrderKeys) => {
    setSortConfig(prev => {
      if (prev?.key === key) return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      return { key, direction: 'asc' };
    });
  };

  const handleSelect = (order: OrderItem, checked: boolean) => {
    setSelected(prev => {
      if (checked) return prev.some(item => item._id === order._id) ? prev : [...prev, order];
      return prev.filter(item => item._id !== order._id);
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelected(prev => prev.filter(item => !rows.some(row => row._id === item._id)));
      return;
    }
    setSelected(prev => {
      const next = [...prev];
      rows.forEach(row => {
        if (!next.some(item => item._id === row._id)) next.push(row);
      });
      return next;
    });
  };

  const handleFilter = ({ type, value }: FilterPayload) => {
    if (type === 'month' || type === 'range') {
      setQ(`createdAt:range:${value.start}_${value.end}`);
      setPage(1);
    }
  };

  const handleApplyMonthFilter = () => {
    if (!selectedMonth) return;
    const date = new Date(`${selectedMonth}-01T00:00:00`);
    handleFilter({
      type: 'month',
      value: {
        start: format(startOfMonth(date), 'yyyy-MM-dd'),
        end: format(endOfMonth(date), 'yyyy-MM-dd'),
      },
    });
    setOpenDialog(null);
  };

  const handleApplyDateRange = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    handleFilter({
      type: 'range',
      value: {
        start: format(dateRange.from, 'yyyy-MM-dd'),
        end: format(dateRange.to, 'yyyy-MM-dd'),
      },
    });
    setOpenDialog(null);
  };

  const handleReload = async () => {
    try {
      const result = await refetch();
      if (result && typeof result === 'object' && 'error' in result && result.error) {
        handleError('Unable to reload orders.');
        return;
      }
      handleSuccess('Reloaded successfully!');
    } catch {
      handleError('Unable to reload orders.');
    }
  };

  const handleAddSubmit = async () => {
    try {
      await addOrder(sanitizeOrderPayload(draft)).unwrap();
      handleSuccess('Order created successfully!');
      setDraft(emptyOrder());
      setOpenDialog(null);
    } catch {
      handleError('Unable to create order.');
    }
  };

  const handleEditSubmit = async () => {
    if (!editing?._id) return;
    try {
      await updateOrder({ id: editing._id, ...sanitizeOrderPayload(editing) }).unwrap();
      handleSuccess('Order updated successfully!');
      setEditing(null);
    } catch {
      handleError('Unable to update order.');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleting?._id) return;
    try {
      await deleteOrder({ id: deleting._id }).unwrap();
      handleSuccess('Order deleted successfully!');
      setSelected(prev => prev.filter(item => item._id !== deleting._id));
      setDeleting(null);
    } catch {
      handleError('Unable to delete order.');
    }
  };

  const handleBulkUpdateFieldChangeForAll = (nextStatus: OrderStatus) => {
    setBulkUpdateStatus(nextStatus);
  };

  const submitBulkUpdateSelected = async () => {
    try {
      await bulkUpdateOrders(selected.map(item => ({ id: item._id, updateData: { orderStatus: bulkUpdateStatus } }))).unwrap();
      handleSuccess('Selected orders updated successfully!');
      setOpenDialog(null);
      setSelected([]);
    } catch {
      handleError('Unable to update selected orders.');
    }
  };

  const handleBulkEditFieldChange = <K extends keyof OrderItem>(id: string, key: K, value: OrderItem[K]) => {
    setSelected(prev => prev.map(item => (item._id === id ? { ...item, [key]: value } : item)));
  };

  const submitBulkEdit = async () => {
    try {
      await bulkUpdateOrders(selected.filter(item => item._id).map(item => ({ id: item._id as string, updateData: sanitizeOrderPayload(item) }))).unwrap();
      handleSuccess('Selected orders edited successfully!');
      setOpenDialog(null);
      setSelected([]);
    } catch {
      handleError('Unable to edit selected orders.');
    }
  };

  const submitBulkDelete = async () => {
    try {
      await bulkDeleteOrders({ ids: selected.map(item => item._id).filter(Boolean) }).unwrap();
      handleSuccess('Selected orders deleted successfully!');
      setOpenDialog(null);
      setSelected([]);
    } catch {
      handleError('Unable to delete selected orders.');
    }
  };

  const handleExportCheckedChange = (key: string, checked: boolean) => {
    setSelectedExportColumns(prev => ({ ...prev, [key]: checked }));
  };

  const submitExport = () => {
    const keys = Object.keys(selectedExportColumns).filter(key => selectedExportColumns[key]);
    const finalKeys = keys.length > 0 ? keys : tableHeaders.map(header => header.key);
    const exportRows = sortedRows.map(row => {
      const next: Record<string, unknown> = {};
      finalKeys.forEach(key => {
        if (key === 'createdAt') {
          next.CreatedAt = formatDate(row.createdAt);
        } else {
          const label = tableHeaders.find(header => header.key === key)?.label || key;
          next[label] = row[key];
        }
      });
      return next;
    });
    downloadXlsx(exportRows, 'orders.xlsx');
    setOpenDialog(null);
  };

  const handleSummaryPageChange = (nextPage: number) => {
    const totalPages = ordersSummaryData?.pagination?.totalPages || 1;
    setSummaryPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const resetFilters = () => {
    setQ('');
    setSelectedMonth('');
    setDateRange(undefined);
    setTempDateRange(undefined);
    setPaymentStatusFilter('all');
    setDeliveryStatusFilter('all');
    setOrderStatusFilter('all');
    setPage(1);
    setOpenDialog(null);
  };

  const renderCell = (order: OrderItem, key: DisplayableOrderKeys) => {
    if (key === 'createdAt') return formatDate(order.createdAt);
    if (key === 'totalAmount') return formatCurrency(order.totalAmount);
    if (key.endsWith('Status')) {
      return (
        <Badge variant="outline" className={cn('capitalize', getStatusBadgeClass(String(order[key] || 'pending')))}>
          {String(order[key] || 'pending')}
        </Badge>
      );
    }
    return (
      <span className="block max-w-[220px] truncate" title={String(order[key] || '')}>
        {String(order[key] || '')}
      </span>
    );
  };

  const renderOrderActions = (order: OrderItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setViewing(order)}>
          <EyeIcon className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setEditing(order)}>
          <PencilIcon className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeleting(order)} className="text-red-200">
          <TrashIcon className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const OrderCard = ({ order }: { order: OrderItem }) => (
    <div className="rounded-md border border-white/10 bg-white/5 p-3">
      <div className="flex items-start gap-3">
        <Checkbox checked={selectedIds.has(order._id)} onCheckedChange={checked => handleSelect(order, Boolean(checked))} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{order.orderNo || 'Untitled order'}</h3>
              <p className="truncate text-xs text-white/60">{order.customerName || 'No customer name'}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-white">{formatCurrency(order.totalAmount)}</p>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-white/70">
            <p className="truncate">Email: {order.customerEmail || 'N/A'}</p>
            <p className="truncate">Phone: {order.customerPhone || 'N/A'}</p>
            <p>Date: {formatDate(order.createdAt)}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className={cn('capitalize', getStatusBadgeClass(order.paymentStatus))}>
              {titleCase(order.paymentStatus)}
            </Badge>
            <Badge variant="outline" className={cn('capitalize', getStatusBadgeClass(order.deliveryStatus))}>
              {titleCase(order.deliveryStatus)}
            </Badge>
            <Badge variant="outline" className={cn('capitalize', getStatusBadgeClass(order.orderStatus))}>
              {titleCase(order.orderStatus)}
            </Badge>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">{renderOrderActions(order)}</div>
    </div>
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={JSON.stringify(error)} />;

  return (
    <div className="container mx-auto text-white md:p-4 pb-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Orders </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outlineGlassy" onClick={() => setOpenDialog('summary')}>
              <TrendingUp className="mr-2 h-4 w-4" /> Summary
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('filter')}>
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outlineWater">
                  <CalendarDays className="mr-2 h-4 w-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tableHeaders.map(header => (
                  <DropdownMenuCheckboxItem
                    key={header.key}
                    checked={columnVisibility[header.key]}
                    onCheckedChange={checked => setColumnVisibility(prev => ({ ...prev, [header.key]: Boolean(checked) }))}
                  >
                    {header.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('export')}>
              <DownloadIcon className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button size="sm" variant="outlineWater" onClick={handleReload} disabled={isFetching}>
              {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
              Reload
            </Button>
            <Button
              size="sm"
              variant="outlineGarden"
              onClick={() => {
                setDraft(emptyOrder());
                setOpenDialog('add');
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Order
            </Button>
          </div>
        </div>

        <Card className="border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-xl">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-300" />
                Orders
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {activeFilter && (
                  <Badge variant="outline" className="border-blue-300/40 text-blue-100">
                    {activeFilter}
                  </Badge>
                )}
                {(paymentStatusFilter !== 'all' || deliveryStatusFilter !== 'all' || orderStatusFilter !== 'all') && (
                  <Badge variant="outline" className="border-blue-300/40 text-blue-100">
                    Status filters active
                  </Badge>
                )}
                {selected.length > 0 && (
                  <>
                    <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-update')}>
                      B.update ({selected.length})
                    </Button>
                    <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-edit')}>
                      B.Edit
                    </Button>
                    <Button size="sm" variant="outlineFire" onClick={() => setOpenDialog('bulk-delete')}>
                      B.Delete
                    </Button>
                  </>
                )}
                <Select value={String(limit)} onValueChange={value => setLimit(Number(value))}>
                  <SelectTrigger className="w-[110px] border-white/20 bg-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageLimits.map(item => (
                      <SelectItem key={item} value={String(item)}>
                        {item}/page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <OrderSearchBox onSearch={handleSearch} placeholder="Search orders by order no, customer, phone, status, item..." />
          </CardHeader>
          <CardContent>
            <div className={`relative transition-opacity duration-200 ${isFetching ? 'opacity-60' : ''}`}>
              {isFetching && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/30 backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              {sortedRows.length === 0 && <div className="py-12 text-center text-white/70 md:hidden">No orders found.</div>}

              {sortedRows.length > 0 && (
                <div className="flex flex-col gap-3 md:hidden">
                  {sortedRows.map(order => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              )}

              <div className="hidden overflow-x-auto rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl md:block">
                <Table className="min-w-[900px] border text-white">
                  <TableHeader>
                    <TableRow className="bg-blue-300/40 text-white font-bold hover:bg-blue-300/40">
                      <TableHead className="w-[48px] text-white">
                        <Checkbox
                          checked={rows.length > 0 && rows.every(row => selectedIds.has(row._id))}
                          onCheckedChange={checked => handleSelectAll(Boolean(checked))}
                        />
                      </TableHead>
                      {visibleHeaders.map(header => (
                        <TableHead
                          key={header.key}
                          className="cursor-pointer bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap"
                          onClick={() => handleSort(header.key)}
                        >
                          {header.label}
                          {sortConfig?.key === header.key && <span className="ml-1">{sortConfig.direction === 'asc' ? 'ASC' : 'DESC'}</span>}
                        </TableHead>
                      ))}
                      <TableHead className="sticky right-0 z-10 w-[80px] bg-accent-100/95 text-right text-slate-50 font-bold shadow-[-8px_0_16px_rgba(15,23,42,0.30)]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={visibleHeaders.length + 2} className="h-32 text-center text-white/70">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedRows.map(order => (
                        <TableRow key={order._id} className="border-white/5 transition-colors hover:bg-white/10">
                          <TableCell>
                            <Checkbox checked={selectedIds.has(order._id)} onCheckedChange={checked => handleSelect(order, Boolean(checked))} />
                          </TableCell>
                          {visibleHeaders.map(header => (
                            <TableCell key={header.key} className="text-white/90">
                              {renderCell(order, header.key)}
                            </TableCell>
                          ))}
                          <TableCell className="sticky right-0 z-10 bg-accent-100/95 text-right shadow-[-8px_0_16px_rgba(15,23,42,0.30)]">
                            {renderOrderActions(order)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <OrderPagination currentPage={page} totalItems={total} itemsPerPage={limit} onPageChange={setPage} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDialog === 'add'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="max-h-[85vh] mt-10 overflow-hidden rounded-xl border border-white/20 bg-white/10 p-0 text-white shadow-2xl backdrop-blur-2xl sm:max-w-4xl">
          <DialogHeader className="border-b border-white/10 p-6 pb-0">
            <DialogTitle>Add Order</DialogTitle>
            <DialogDescription className="text-white/70"></DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[68vh]">
            <OrderForm value={draft} onChange={setDraft} />
          </ScrollArea>
          <DialogFooter className="border-t border-white/10 p-4">
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button disabled={isAdding} onClick={handleAddSubmit} variant="outlineGarden">
              {isAdding ? 'Saving...' : 'Save Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className="max-h-[92vh] overflow-hidden rounded-xl border border-white/20 bg-white/10 p-0 text-white shadow-2xl backdrop-blur-2xl sm:max-w-4xl">
          <DialogHeader className="border-b border-white/10 p-6">
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription className="text-white/70">{editing?.orderNo || 'Order details'}</DialogDescription>
          </DialogHeader>
          {editing && (
            <ScrollArea className="max-h-[68vh]">
              <OrderForm value={editing} onChange={setEditing} />
            </ScrollArea>
          )}
          <DialogFooter className="border-t border-white/10 p-4">
            <Button variant="outlineWater" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button disabled={isUpdating} onClick={handleEditSubmit} variant="outlineGarden">
              {isUpdating ? 'Updating...' : 'Update Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={open => !open && setViewing(null)}>
        <DialogContent className="rounded-xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Preview</DialogTitle>
            <DialogDescription className="text-white/70">{viewing?.orderNo || 'Order details'}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-sm text-white/60">Customer</p>
                  <p className="font-medium">{viewing.customerName || 'N/A'}</p>
                  <p className="text-sm text-white/70">{viewing.customerEmail || viewing.customerPhone || 'N/A'}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-sm text-white/60">Total</p>
                  <p className="text-xl font-semibold">{formatCurrency(viewing.totalAmount)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={cn('capitalize', getStatusBadgeClass(viewing.paymentStatus))}>
                  {viewing.paymentStatus}
                </Badge>
                <Badge variant="outline" className={cn('capitalize', getStatusBadgeClass(viewing.deliveryStatus))}>
                  {viewing.deliveryStatus}
                </Badge>
                <Badge variant="outline" className={cn('capitalize', getStatusBadgeClass(viewing.orderStatus))}>
                  {viewing.orderStatus}
                </Badge>
              </div>
              <ScrollArea className="h-52 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="space-y-2">
                  {(viewing.items || []).map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md bg-white/5 p-2 text-sm">
                      <span>{item.title || 'Untitled item'}</span>
                      <span>
                        {item.quantity} x {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                  {viewing.items.length === 0 && <p className="text-sm text-white/60">No items listed.</p>}
                </div>
              </ScrollArea>
              <p className="text-sm text-white/70">{viewing.shippingAddress || 'No shipping address.'}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={open => !open && setDeleting(null)}>
        <DialogContent className="rounded-xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-white/70">Delete {deleting?.orderNo || 'this order'} permanently.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="outlineFire" disabled={isDeleting} onClick={handleDeleteSubmit}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'filter'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="rounded-xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filter Orders</DialogTitle>
            <DialogDescription className="text-white/70">Filter by date and status.</DialogDescription>
          </DialogHeader>
          <Tabs value={filterActiveTab} onValueChange={setFilterActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg rounded-lg text-white border border-white/20">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="range">Range</TabsTrigger>
            </TabsList>
            <TabsContent value="month" className="space-y-3 pt-4">
              <Label>Month</Label>
              <Input type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value)} />
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2].map(offset => {
                  const date = subMonths(new Date(), offset);
                  return (
                    <Button key={offset} size="sm" variant="outlineWater" onClick={() => setSelectedMonth(format(date, 'yyyy-MM'))}>
                      {format(date, 'MMM yyyy')}
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="range" className="space-y-3 pt-4">
              <Button variant="outlineWater" onClick={() => setIsCalendarOpen(prev => !prev)}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to ? `${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}` : 'Select date range'}
              </Button>
              {isCalendarOpen && (
                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <Calendar mode="range" selected={tempDateRange} onSelect={setTempDateRange} numberOfMonths={1} />
                  <div className="mt-3 flex justify-end gap-2">
                    <Button variant="outlineWater" size="sm" onClick={() => setTempDateRange(undefined)}>
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setDateRange(tempDateRange);
                        setIsCalendarOpen(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Payment</Label>
              <Select value={paymentStatusFilter} onValueChange={(value: 'all' | PaymentStatus) => setPaymentStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {paymentStatusOptions.map(status => (
                    <SelectItem key={status} value={status}>
                      {titleCase(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Delivery</Label>
              <Select value={deliveryStatusFilter} onValueChange={(value: 'all' | DeliveryStatus) => setDeliveryStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {deliveryStatusOptions.map(status => (
                    <SelectItem key={status} value={status}>
                      {titleCase(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Select value={orderStatusFilter} onValueChange={(value: 'all' | OrderStatus) => setOrderStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {orderStatusOptions.map(status => (
                    <SelectItem key={status} value={status}>
                      {titleCase(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outlineWater" onClick={resetFilters}>
              Reset
            </Button>
            {filterActiveTab === 'month' ? (
              <Button onClick={handleApplyMonthFilter} disabled={!selectedMonth}>
                Apply Filter
              </Button>
            ) : (
              <Button onClick={handleApplyDateRange} disabled={!dateRange?.from || !dateRange?.to}>
                Apply Filter
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'summary'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 text-white shadow-2xl backdrop-blur-3xl sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Orders Summary</DialogTitle>
            <DialogDescription className="text-white/70">Monthly order totals and quick counts.</DialogDescription>
          </DialogHeader>
          {isSummaryLoading ? (
            <LoadingComponent />
          ) : isSummaryError ? (
            <ErrorMessageComponent message="Unable to load summary." />
          ) : (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    ['Total', ordersSummaryData?.overall.totalRecords || 0],
                    ['Paid', ordersSummaryData?.overall.paidRecords || 0],
                    ['Pending', ordersSummaryData?.overall.pendingRecords || 0],
                    ['Delivered', ordersSummaryData?.overall.deliveredRecords || 0],
                    ['Last 24 Hours', ordersSummaryData?.overall.recordsLast24Hours || 0],
                  ].map(([label, value]) => (
                    <Card
                      key={String(label)}
                      className="border-white/20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl shadow-lg text-white"
                    >
                      <CardContent className="p-4">
                        <p className="text-sm text-white/60">{label}</p>
                        <p className="text-2xl font-semibold">{value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-300" /> Monthly Table
                      </CardTitle>
                      <div className="flex gap-1 rounded-lg bg-white/10 p-1">
                        <Button size="sm" variant={summaryViewMode === 'table' ? 'default' : 'ghost'} onClick={() => setSummaryViewMode('table')}>
                          Table
                        </Button>
                        <Button size="sm" variant={summaryViewMode === 'bar' ? 'default' : 'ghost'} onClick={() => setSummaryViewMode('bar')}>
                          <BarChart3 className="mr-1 h-4 w-4" /> Bar
                        </Button>
                        <Button size="sm" variant={summaryViewMode === 'pie' ? 'default' : 'ghost'} onClick={() => setSummaryViewMode('pie')}>
                          <PieChart className="mr-1 h-4 w-4" /> Pie
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`relative transition-opacity duration-200 ${isSummaryFetching ? 'opacity-50' : ''}`}>
                      {isSummaryFetching && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/30 backdrop-blur-sm">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}
                      {summaryViewMode === 'table' && (
                        <div className="overflow-x-auto rounded-xl border border-white/20 bg-white/5">
                          <Table className="text-white">
                            <TableHeader className="bg-linear-to-r from-blue-500/20 to-purple-500/20">
                              <TableRow className="border-white/10 hover:bg-transparent">
                                {summaryTableHeaders.map(header => (
                                  <TableHead key={header} className="text-white">
                                    {titleCase(header)}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(ordersSummaryData?.monthlyTable || []).length > 0 ? (
                                ordersSummaryData?.monthlyTable?.map((row, index) => (
                                  <TableRow key={index}>
                                    {summaryTableHeaders.map(header => (
                                      <TableCell key={header}>{row[header]}</TableCell>
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
                        <ResponsiveContainer width="100%" height={380}>
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
                      )}
                      {summaryViewMode === 'pie' && summaryBarChartData.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {summaryTableHeaders.slice(1).map((header, idx) => {
                            const chartData = summaryBarChartData
                              .map(row => ({ name: String(row[summaryTableHeaders[0]]), value: Number(row[header]) || 0 }))
                              .filter(item => item.value > 0);
                            return (
                              <div key={header} className="rounded-xl border border-white/20 bg-gradient-to-br from-white/5 to-white/10 p-5 backdrop-blur-xl">
                                <h3 className="mb-4 border-b border-white/10 pb-2 text-center font-semibold">{titleCase(header)}</h3>
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
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="border-t border-white/10 pt-4">
            {ordersSummaryData?.pagination && ordersSummaryData.pagination.totalPages > 1 && (
              <Pagination className="w-full justify-center text-white">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        handleSummaryPageChange(summaryPage - 1);
                      }}
                      className={cn(summaryPage <= 1 && 'pointer-events-none opacity-40')}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive>
                      Page {summaryPage} of {ordersSummaryData.pagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        handleSummaryPageChange(summaryPage + 1);
                      }}
                      className={cn(summaryPage >= ordersSummaryData.pagination.totalPages && 'pointer-events-none opacity-40')}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'export'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="rounded-xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customize Your Export</DialogTitle>
            <DialogDescription className="text-white/70">Select the columns you want to include in your XLSX file.</DialogDescription>
          </DialogHeader>
          <div className="grid max-h-60 gap-4 overflow-y-auto py-4 pr-2">
            {tableHeaders.map(header => (
              <div key={String(header.key)} className="flex items-center space-x-2">
                <Checkbox
                  id={`col-${String(header.key)}`}
                  checked={!!selectedExportColumns[String(header.key)]}
                  onCheckedChange={checked => handleExportCheckedChange(String(header.key), !!checked)}
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
        <DialogContent className="rounded-xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-white/80">
            You are deleting <strong>({selected.length})</strong> orders.
          </p>
          <ScrollArea className="mt-3 h-[320px] rounded-lg border border-white/20 bg-white/5 p-4">
            <div className="flex flex-col gap-2">
              {selected.map((item, idx) => (
                <span key={`${item._id || 'order'}-${idx}`} className="text-sm text-white/90">
                  {idx + 1}. {String(item.orderNo || item.customerName || '')}
                </span>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-3 gap-2">
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
        <DialogContent className="rounded-xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Edit Orders</DialogTitle>
          </DialogHeader>
          <p className="text-white/80">
            Editing <strong>{selected.length}</strong> selected orders.
          </p>
          <ScrollArea className="mt-3 h-[420px] rounded-lg border border-white/20 bg-white/5 p-4">
            <div className="flex flex-col gap-3">
              {selected.map((item, idx) => (
                <div key={item._id || idx} className="flex flex-col gap-3 rounded-lg border border-white/20 bg-white/10 p-3">
                  <span className="font-medium">
                    {idx + 1}. {String(item.orderNo || item.customerName || '')}
                  </span>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Select
                      onValueChange={(value: PaymentStatus) => handleBulkEditFieldChange(item._id as string, 'paymentStatus', value)}
                      defaultValue={item.paymentStatus}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white backdrop-blur-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {titleCase(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value: DeliveryStatus) => handleBulkEditFieldChange(item._id as string, 'deliveryStatus', value)}
                      defaultValue={item.deliveryStatus}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white backdrop-blur-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryStatusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {titleCase(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value: OrderStatus) => handleBulkEditFieldChange(item._id as string, 'orderStatus', value)}
                      defaultValue={item.orderStatus}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white backdrop-blur-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {titleCase(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    className="bg-white/10 text-white"
                    value={item.note}
                    onChange={event => handleBulkEditFieldChange(item._id as string, 'note', event.target.value)}
                    placeholder="Note"
                  />
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
        <DialogContent className="rounded-xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Bulk Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="pt-2 text-white/80">
              You are about to update <span className="font-semibold text-white">({selected.length})</span> orders.
            </p>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-white/90">
                Set all <span className="font-semibold text-blue-300">Order Status</span> to
              </p>
              <Select onValueChange={handleBulkUpdateFieldChangeForAll} defaultValue={bulkUpdateStatus}>
                <SelectTrigger className="w-[180px] border-white/20 bg-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orderStatusOptions.map(status => (
                    <SelectItem key={status} value={status}>
                      {titleCase(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <ScrollArea className="mt-3 h-[260px] rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-2">
              {selected.map((item, idx) => (
                <div key={item._id || idx} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 p-2 text-white/90">
                  <span>
                    {idx + 1}. {String(item.orderNo || item.customerName || '')}
                  </span>
                  <span className="capitalize text-blue-300">{bulkUpdateStatus}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button disabled={isBulkUpdating} onClick={submitBulkUpdateSelected} className="bg-green-600/80 text-white hover:bg-green-600">
              {isBulkUpdating ? 'Updating...' : 'Update Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
