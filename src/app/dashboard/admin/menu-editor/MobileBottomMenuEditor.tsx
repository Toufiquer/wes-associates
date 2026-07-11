/*
|-----------------------------------------
| setting up MobileBottomMenuEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import { Save, Plus, Search, Pencil, Trash2, Loader2, RotateCcw, Smartphone } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';
import { BrandSettings, MobileMenuItem, MobileMenuVariant } from '@/redux/features/brand-settings/brandSettingsSlice';

type MobileFooterConfig = Pick<BrandSettings, 'mobileMenuVariant' | 'mobileMenuItems'>;

const defaultItems: MobileMenuItem[] = [
  { id: 1, logo: 'Home', name: 'Home', path: '/' },
  { id: 2, logo: 'FolderKanban', name: 'Assets', path: '/dashboard/assets/products' },
  { id: 3, logo: 'ShoppingCart', name: 'Cart', path: '/cart' },
  { id: 4, logo: 'LogIn', name: 'Login', path: '/login' },
];

const previewFallbackItems: MobileMenuItem[] = [...defaultItems, { id: 5, logo: 'Phone', name: 'Contact', path: '/contact' }];

const defaultConfig: MobileFooterConfig = {
  mobileMenuVariant: '4-icon',
  mobileMenuItems: defaultItems,
};

const previewOptions: { value: MobileMenuVariant; label: string }[] = [
  { value: '4-icon', label: '4 icon' },
  { value: '5-icon', label: '5 icon' },
];

const createEmptyItem = (): MobileMenuItem => ({
  id: Date.now(),
  logo: '',
  name: '',
  path: '',
});

const getPreviewItems = (items: MobileMenuItem[], variant: MobileMenuVariant) => {
  const limit = variant === '5-icon' ? 5 : 4;
  return previewFallbackItems.slice(0, limit).map((fallback, index) => ({
    ...fallback,
    ...(items[index] || {}),
  }));
};

const MobileBottomMenuEditor = () => {
  const [config, setConfig] = useState<MobileFooterConfig>(defaultConfig);
  const [draftItem, setDraftItem] = useState<MobileMenuItem>(createEmptyItem);
  const [iconSearch, setIconSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const previewItems = useMemo(() => getPreviewItems(config.mobileMenuItems, config.mobileMenuVariant), [config.mobileMenuItems, config.mobileMenuVariant]);
  const itemLimit = config.mobileMenuVariant === '5-icon' ? 5 : 4;

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions.slice(0, 100);
    return iconOptions.filter(iconName => iconName.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/menu/mobile-bottom-menu');
        if (!response.ok) return;
        const brandSettings = await response.json();
        setConfig({
          mobileMenuVariant: brandSettings.mobileMenuVariant || '4-icon',
          mobileMenuItems: brandSettings.mobileMenuItems?.length ? brandSettings.mobileMenuItems : defaultItems,
        });
      } catch {
        toast.error('Mobile bottom menu sync failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSubmitItem = () => {
    const name = draftItem.name.trim();
    const path = draftItem.path.trim();
    const logo = draftItem.logo?.trim() || '';
    if (!name || !path) {
      toast.error('Name and URL are required');
      return;
    }
    setConfig(prev => ({
      ...prev,
      mobileMenuItems:
        editingItemIndex === null
          ? [...prev.mobileMenuItems, { id: Date.now(), logo, name, path }]
          : (() => {
              const nextItems = [...prev.mobileMenuItems];
              while (nextItems.length <= editingItemIndex) {
                nextItems.push(previewFallbackItems[nextItems.length]);
              }
              nextItems[editingItemIndex] = { ...previewFallbackItems[editingItemIndex], logo, name, path };
              return nextItems;
            })(),
    }));
    setDraftItem(createEmptyItem());
    setIconSearch('');
    setIsAddDialogOpen(false);
    setEditingItemIndex(null);
  };

  const handleRemoveItem = (index: number) => {
    setConfig(prev => ({ ...prev, mobileMenuItems: prev.mobileMenuItems.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const handleOpenAddDialog = () => {
    if (config.mobileMenuItems.length >= itemLimit) {
      toast.error(`${config.mobileMenuVariant === '5-icon' ? '5 icon' : '4 icon'} menu is already full`);
      return;
    }
    setDraftItem(createEmptyItem());
    setIconSearch('');
    setEditingItemIndex(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenUpdateDialog = (item: MobileMenuItem, index: number) => {
    setDraftItem({ ...item });
    setIconSearch('');
    setEditingItemIndex(index);
    setIsAddDialogOpen(true);
  };

  const renderMenuIcon = (iconName: string | undefined) => {
    const IconComp = iconName ? iconMap[iconName] : undefined;
    if (!IconComp) return <Smartphone className="h-5 w-5" />;
    return <IconComp className="h-5 w-5" />;
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/menu/mobile-bottom-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      if (data?.data) {
        setConfig(prev => ({
          ...prev,
          mobileMenuVariant: data.data.mobileMenuVariant,
          mobileMenuItems: data.data.mobileMenuItems,
        }));
      }
      window.dispatchEvent(new Event('brand-settings-updated'));
      toast.success('Mobile footer menu updated successfully');
    } catch {
      toast.error('Mobile footer menu update failed');
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
            <h2 className="text-xl font-black tracking-tight">Mobile Nav</h2>
            <p className="text-xs text-white/50">Preview and manage mobile footer menu items.</p>
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

      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-4">
          <div>
            <h3 className="text-sm font-bold">Mobile Nav</h3>
            <p className="text-xs text-white/50">Preview and manage mobile footer menu items.</p>
          </div>
          <Button type="button" onClick={handleOpenAddDialog} variant="outlineGlassy">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
        <div className="w-full flex-col md:flex-row flex items-start justify-between gap-4">
          <div className="rounded-sm border border-white/10 bg-white/5 p-4 w-full">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold">Preview</h3>
                <p className="text-xs text-white/50">How it looks like in mobile.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-sm border border-white/10 bg-black/10 p-1">
                {previewOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, mobileMenuVariant: option.value }))}
                    className={`
                        relative px-6 py-2 rounded-lg font-black uppercase text-[10px] transition-all duration-300
                        ${
                          config.mobileMenuVariant === option.value
                            ? 'bg-white/20 border border-white/40 text-white shadow-lg scale-105 ring-1 ring-white/20'
                            : 'bg-white/5 border border-transparent text-white/50 hover:bg-white/10 hover:text-white hover:border-white/10'
                        }
                      `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mx-auto flex min-h-[360px] max-w-[320px] flex-col justify-end overflow-hidden rounded-[28px] border border-white/20 bg-slate-950 p-3 shadow-2xl">
              <div className="mb-3 flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-white/30">
                Mobile Preview
              </div>
              <div
                className={`rounded-2xl border border-slate-200 bg-white px-2 text-slate-700 shadow-[0_-10px_30px_rgba(15,23,42,0.16)] ${
                  config.mobileMenuVariant === '5-icon' ? 'py-[5px]' : 'py-2'
                }`}
              >
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${config.mobileMenuVariant === '5-icon' ? 5 : 4}, minmax(0, 1fr))` }}>
                  {previewItems.map((item, index) => {
                    const isMiddleIcon = config.mobileMenuVariant === '5-icon' && index === 2;

                    return (
                      <div key={item.id} className="group relative flex min-w-0 flex-col items-center justify-center rounded-xl px-1 py-2 text-slate-700">
                        <span
                          className={`relative inline-flex items-center justify-center  ${
                            isMiddleIcon ? '-mt-5 h-12 w-12 rounded-full border border-slate-500/40 bg-white shadow-lg' : ''
                          }`}
                        >
                          {renderMenuIcon(item.logo)}
                        </span>
                        <span className="mt-1 max-w-full truncate text-[10px] font-black uppercase tracking-tight">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-white/10 bg-white/5 p-4 w-full">
            <div className="mb-4">
              <h3 className="text-sm font-bold">Accordion</h3>
              <p className="text-xs text-white/50">
                Showing {itemLimit} visible slots for the selected {config.mobileMenuVariant === '5-icon' ? '5 icon' : '4 icon'} menu.
              </p>
            </div>
            <Accordion type="single" collapsible className="rounded-sm border border-white/10 bg-black/10">
              {previewItems.map((item, index) => (
                <AccordionItem key={item.id} value={String(item.id)} className="border-white/10 px-4">
                  <AccordionTrigger className="text-white hover:no-underline">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 bg-white/10">
                        {renderMenuIcon(item.logo)}
                      </span>
                      <span className="truncate text-sm font-bold">{item.name}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-3 pb-3 text-white/70 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Path</div>
                        <div className="truncate text-sm font-semibold text-white">{item.path}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" onClick={() => handleOpenUpdateDialog(item, index)} variant="outlineGlassy" size="sm">
                          <Pencil className="mr-2 h-4 w-4" />
                          Update
                        </Button>
                        <Button type="button" onClick={() => handleRemoveItem(index)} variant="outlineFire" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={open => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingItemIndex(null);
            setDraftItem(createEmptyItem());
            setIconSearch('');
          }
        }}
      >
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white overflow-y-auto max-h-[85vh] sm:max-w-lg mt-[45px]">
          <DialogHeader>
            <DialogTitle>{editingItemIndex === null ? 'Add Mobile Footer Item' : 'Update Mobile Footer Item'}</DialogTitle>
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
            <div className="space-y-2">
              <Label>Path</Label>
              <Input
                value={draftItem.path}
                onChange={e => setDraftItem(prev => ({ ...prev, path: e.target.value }))}
                placeholder="/path"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              {renderIconGrid(draftItem.logo, iconName => setDraftItem(prev => ({ ...prev, logo: iconName })))}
            </div>
            <Button onClick={handleSubmitItem} className="w-full bg-blue-600 hover:bg-blue-500 transition-colors">
              {editingItemIndex === null ? 'Submit' : 'Update'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MobileBottomMenuEditor;
