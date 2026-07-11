'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, RotateCcw, Save, Search, Smartphone } from 'lucide-react';
import { toast } from 'react-toastify';

import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

type DashboardFooterMenuAction = 'link' | 'menu';

interface DashboardFooterMenuItem {
  id: number;
  logo?: string;
  name: string;
  path?: string;
  action: DashboardFooterMenuAction;
}

interface DashboardFooterMenuConfig {
  dashboardFooterMenuItems: DashboardFooterMenuItem[];
}

const defaultItems: DashboardFooterMenuItem[] = [
  { id: 1, logo: 'Home', name: 'Home', path: '/dashboard', action: 'link' },
  { id: 2, logo: 'Package', name: 'Products', path: '/dashboard/assets/products', action: 'link' },
  { id: 3, logo: 'ShoppingCart', name: 'Orders', path: '/dashboard/assets/orders', action: 'link' },
  { id: 4, logo: 'Settings', name: 'Menu', path: '', action: 'menu' },
];

const defaultConfig: DashboardFooterMenuConfig = {
  dashboardFooterMenuItems: defaultItems,
};

const slotLabels = ['Home Link', 'Products Link', 'Orders Link', 'Menu Trigger'];

const normalizeItems = (items?: DashboardFooterMenuItem[]) =>
  defaultItems.map((fallback, index) => ({
    ...fallback,
    ...(items?.[index] || {}),
    id: fallback.id,
    action: fallback.action,
  }));

const MobileFooterDashboardMenuEditor = () => {
  const [config, setConfig] = useState<DashboardFooterMenuConfig>(defaultConfig);
  const [draftItem, setDraftItem] = useState<DashboardFooterMenuItem>(defaultItems[0]);
  const [iconSearch, setIconSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const previewItems = useMemo(() => normalizeItems(config.dashboardFooterMenuItems), [config.dashboardFooterMenuItems]);

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions.slice(0, 100);
    return iconOptions.filter(iconName => iconName.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/menu/mobile-dashboard-footer-menu');
        if (!response.ok) return;
        const settings = await response.json();
        setConfig({
          dashboardFooterMenuItems: normalizeItems(settings.dashboardFooterMenuItems),
        });
      } catch {
        toast.error('Dashboard footer menu sync failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const renderMenuIcon = (item: DashboardFooterMenuItem, className = 'h-5 w-5') => {
    const logo = item.logo?.trim();
    if (logo) {
      const IconComp = iconMap[logo];
      if (IconComp) return <IconComp className={className} />;
    }
    return <span className="text-xl font-bold leading-none">{item.name.slice(0, 2)}</span>;
  };

  const renderIconGrid = (selectedIcon: string | undefined, onSelect: (iconName: string) => void) => (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          value={iconSearch}
          onChange={e => setIconSearch(e.target.value)}
          placeholder="Search icons..."
          className="h-8 border-white/10 bg-white/5 pl-8 text-xs"
        />
      </div>
      <ScrollArea className="h-48 rounded-lg border border-white/10 bg-white/5 p-2">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {filteredIcons.map(iconName => {
            const IconComp = iconMap[iconName];
            if (!IconComp) return null;
            const isSelected = selectedIcon === iconName;

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onSelect(iconName)}
                className={`flex h-16 flex-col items-center justify-center gap-1 rounded border p-2 transition-all ${
                  isSelected
                    ? 'scale-105 border-blue-500 bg-blue-600 text-white shadow-md'
                    : 'border-transparent bg-transparent text-gray-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
                }`}
                title={iconName}
              >
                <IconComp size={18} />
                <span className="w-full truncate px-1 text-center text-[9px]">{iconName}</span>
              </button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && <div className="py-8 text-center text-xs text-gray-500">No icons found</div>}
      </ScrollArea>
    </div>
  );

  const handleOpenUpdateDialog = (item: DashboardFooterMenuItem, index: number) => {
    setDraftItem({ ...item });
    setIconSearch('');
    setEditingItemIndex(index);
  };

  const handleSubmitItem = () => {
    if (editingItemIndex === null) return;
    const name = draftItem.name.trim();
    const path = draftItem.path?.trim() || '';
    const logo = draftItem.logo?.trim() || '';
    if (!name) {
      toast.error('Name is required');
      return;
    }
    if (draftItem.action === 'link' && !path && editingItemIndex === 0) {
      toast.error('Home path is required');
      return;
    }
    setConfig(prev => {
      const nextItems = normalizeItems(prev.dashboardFooterMenuItems);
      nextItems[editingItemIndex] = { ...nextItems[editingItemIndex], logo, name, path };
      return { dashboardFooterMenuItems: nextItems };
    });
    setEditingItemIndex(null);
    setIconSearch('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/menu/mobile-dashboard-footer-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      if (data?.data) {
        setConfig({
          dashboardFooterMenuItems: normalizeItems(data.data.dashboardFooterMenuItems),
        });
      }
      window.dispatchEvent(new Event('dashboard-footer-menu-updated'));
      toast.success('Dashboard footer menu updated successfully');
    } catch {
      toast.error('Dashboard footer menu update failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-sm border border-white/20 bg-white/5">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-sm border border-white/40 bg-white/10 p-4 text-white backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-white/10 bg-white/10">
            <Smartphone className="h-6 w-6 text-white/80" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Dashboard Footer Menu</h2>
            <p className="text-xs text-white/50">Preview and manage dashboard mobile footer buttons.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outlineGlassy" onClick={() => setConfig(defaultConfig)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving} variant="outlineGlassy">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Update
          </Button>
        </div>
      </div>

      <div className="w-full flex-col md:flex-row flex items-start justify-between gap-4">
        <div className="rounded-sm border border-white/10 bg-white/5 p-4 w-full">
          <div className="mb-4">
            <h3 className="text-sm font-bold">Preview</h3>
            <p className="text-xs text-white/50">How the dashboard footer menu looks on mobile.</p>
          </div>
          <div className="mx-auto flex min-h-[360px] max-w-[320px] flex-col justify-end overflow-hidden rounded-[28px] border border-white/20 bg-slate-950 p-3 shadow-2xl">
            <div className="mb-3 flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-white/30">
              Dashboard Preview
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10">{renderMenuIcon(previewItems[0])}</div>
              <div className="flex items-center gap-3">
                {previewItems.slice(1, 3).map(item => (
                  <div key={item.id} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/20">
                    {renderMenuIcon(item)}
                  </div>
                ))}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10">{renderMenuIcon(previewItems[3])}</div>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-white/10 bg-white/5 p-4 w-full">
          <div className="mb-4">
            <h3 className="text-sm font-bold">Footer Slots</h3>
            <p className="text-xs text-white/50">Update the fixed dashboard footer slots.</p>
          </div>
          <Accordion type="single" collapsible className="rounded-sm border border-white/10 bg-black/10">
            {previewItems.map((item, index) => (
              <AccordionItem key={item.id} value={String(item.id)} className="border-white/10 px-4">
                <AccordionTrigger className="text-white hover:no-underline">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 bg-white/10">
                      {renderMenuIcon(item, 'h-4 w-4')}
                    </span>
                    <span className="truncate text-sm font-bold">{slotLabels[index]}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pb-3 text-white/70 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{item.name}</div>
                      <div className="truncate text-xs text-white/50">{item.action === 'menu' ? 'Opens dashboard menu sheet' : item.path || 'No path'}</div>
                    </div>
                    <Button type="button" onClick={() => handleOpenUpdateDialog(item, index)} variant="outlineGlassy" size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Update
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Dialog
        open={editingItemIndex !== null}
        onOpenChange={open => {
          if (!open) {
            setEditingItemIndex(null);
            setIconSearch('');
          }
        }}
      >
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white overflow-y-auto max-h-[85vh] sm:max-w-lg mt-[45px]">
          <DialogHeader>
            <DialogTitle>Update {editingItemIndex === null ? 'Footer Item' : slotLabels[editingItemIndex]}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={draftItem.name}
                onChange={e => setDraftItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Home"
                className="bg-white/5 border-white/10"
              />
            </div>
            {draftItem.action === 'link' && (
              <div className="space-y-2">
                <Label>Path</Label>
                <Input
                  value={draftItem.path || ''}
                  onChange={e => setDraftItem(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="/dashboard"
                  className="bg-white/5 border-white/10"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Icon</Label>
              {draftItem.logo && (
                <Button type="button" variant="outlineWater" size="sm" onClick={() => setDraftItem(prev => ({ ...prev, logo: '' }))}>
                  Use Text Instead
                </Button>
              )}
              {renderIconGrid(draftItem.logo, iconName => setDraftItem(prev => ({ ...prev, logo: iconName })))}
            </div>
            <Button onClick={handleSubmitItem} className="w-full bg-blue-600 hover:bg-blue-500 transition-colors">
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MobileFooterDashboardMenuEditor;
