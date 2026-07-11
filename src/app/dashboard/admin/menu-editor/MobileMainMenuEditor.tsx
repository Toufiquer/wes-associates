/*
|-----------------------------------------
| setting up MobileMainMenuEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import { Loader2, Pencil, Plus, RotateCcw, Save, Search, Smartphone, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BrandSettings, MobileMenuGridLayout, MobileMenuItem, MobileMenuViewStyle } from '@/redux/features/brand-settings/brandSettingsSlice';

type MobileMainMenuConfig = Pick<BrandSettings, 'mobileMenuIsPublished' | 'mobileMenuViewStyle' | 'mobileMenuGridLayout' | 'mobileMainMenuItems'>;

const defaultItems: MobileMenuItem[] = [
  { id: 1, logo: 'Home', name: 'Home', path: '/' },
  { id: 2, logo: 'LayoutGrid', name: 'Categories', path: '/categories' },
  { id: 3, logo: 'FolderKanban', name: 'Assets', path: '/dashboard/assets/products' },
  { id: 4, logo: 'ShoppingCart', name: 'Cart', path: '/cart' },
];

const previewFallbackItems: MobileMenuItem[] = [
  ...defaultItems,
  { id: 5, logo: 'Search', name: 'Search', path: '/search' },
  { id: 6, logo: 'Heart', name: 'Wishlist', path: '/wishlist' },
  { id: 7, logo: 'User', name: 'Account', path: '/dashboard' },
  { id: 8, logo: 'Phone', name: 'Contact', path: '/contact' },
  { id: 9, logo: 'Info', name: 'About', path: '/about' },
];

const defaultConfig: MobileMainMenuConfig = {
  mobileMenuIsPublished: true,
  mobileMenuViewStyle: 'grid',
  mobileMenuGridLayout: '2x2',
  mobileMainMenuItems: defaultItems,
};

const gridOptions: MobileMenuGridLayout[] = ['2x2', '2x3', '3x2', '3x3'];
const viewOptions: { value: MobileMenuViewStyle; label: string; description: string }[] = [
  { value: 'grid', label: 'Grid View', description: 'Render items in row and column layout' },
  { value: 'flex', label: 'Flex View', description: 'Render one item per line' },
];

const createEmptyItem = (): MobileMenuItem => ({
  id: Date.now(),
  logo: '',
  name: '',
  path: '',
});

const getGridShape = (layout: MobileMenuGridLayout) => {
  const [rows, columns] = layout.split('x').map(Number);
  return { rows: rows || 2, columns: columns || 2 };
};

const getPreviewItems = (items: MobileMenuItem[], limit: number) => {
  return previewFallbackItems.slice(0, limit).map((fallback, index) => ({
    ...fallback,
    ...(items[index] || {}),
  }));
};

const MobileMainMenuEditor = () => {
  const [config, setConfig] = useState<MobileMainMenuConfig>(defaultConfig);
  const [draftItem, setDraftItem] = useState<MobileMenuItem>(createEmptyItem);
  const [iconSearch, setIconSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const gridShape = useMemo(() => getGridShape(config.mobileMenuGridLayout), [config.mobileMenuGridLayout]);
  const itemLimit = gridShape.rows * gridShape.columns;
  const previewItems = useMemo(() => getPreviewItems(config.mobileMainMenuItems, itemLimit), [config.mobileMainMenuItems, itemLimit]);

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions.slice(0, 100);
    return iconOptions.filter(iconName => iconName.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/menu/mobile-main-menu');
        if (!response.ok) return;
        const brandSettings = await response.json();
        const layout = brandSettings.mobileMenuGridLayout || '2x2';
        const shape = getGridShape(layout);
        const limit = shape.rows * shape.columns;
        setConfig({
          mobileMenuIsPublished: brandSettings.mobileMenuIsPublished,
          mobileMenuViewStyle: brandSettings.mobileMenuViewStyle || 'grid',
          mobileMenuGridLayout: layout,
          mobileMainMenuItems: brandSettings.mobileMainMenuItems?.length ? brandSettings.mobileMainMenuItems.slice(0, limit) : defaultItems,
        });
      } catch {
        toast.error('Mobile main menu sync failed');
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
      mobileMainMenuItems:
        editingItemIndex === null
          ? [...prev.mobileMainMenuItems.slice(0, itemLimit), { id: Date.now(), logo, name, path }].slice(0, itemLimit)
          : (() => {
              const nextItems = [...prev.mobileMainMenuItems];
              while (nextItems.length <= editingItemIndex) {
                nextItems.push(previewFallbackItems[nextItems.length]);
              }
              nextItems[editingItemIndex] = { ...previewFallbackItems[editingItemIndex], logo, name, path };
              return nextItems.slice(0, itemLimit);
            })(),
    }));
    setDraftItem(createEmptyItem());
    setIconSearch('');
    setIsItemDialogOpen(false);
    setEditingItemIndex(null);
  };

  const handleRemoveItem = (index: number) => {
    setConfig(prev => ({ ...prev, mobileMainMenuItems: prev.mobileMainMenuItems.filter((_, itemIndex) => itemIndex !== index).slice(0, itemLimit) }));
  };

  const handleOpenAddDialog = () => {
    if (config.mobileMainMenuItems.slice(0, itemLimit).length >= itemLimit) {
      toast.error(`${config.mobileMenuGridLayout.replace('x', '*')} menu is already full`);
      return;
    }
    setDraftItem(createEmptyItem());
    setIconSearch('');
    setEditingItemIndex(null);
    setIsItemDialogOpen(true);
  };

  const handleOpenUpdateDialog = (item: MobileMenuItem, index: number) => {
    setDraftItem({ ...item });
    setIconSearch('');
    setEditingItemIndex(index);
    setIsItemDialogOpen(true);
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
        <Input value={iconSearch} onChange={e => setIconSearch(e.target.value)} placeholder="Search icons..." className="h-8 border-white/10 bg-white/5 pl-8 text-xs" />
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
      const response = await fetch('/api/menu/mobile-main-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, mobileMainMenuItems: config.mobileMainMenuItems.slice(0, itemLimit) }),
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      if (data?.data) {
        setConfig(prev => ({
          ...prev,
          mobileMenuIsPublished: data.data.mobileMenuIsPublished,
          mobileMenuViewStyle: data.data.mobileMenuViewStyle,
          mobileMenuGridLayout: data.data.mobileMenuGridLayout,
          mobileMainMenuItems: data.data.mobileMainMenuItems?.length ? data.data.mobileMainMenuItems : defaultItems,
        }));
      }
      window.dispatchEvent(new Event('brand-settings-updated'));
      toast.success('Mobile main menu updated successfully');
    } catch {
      toast.error('Mobile main menu update failed');
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
            <h2 className="text-xl font-black tracking-tight">Mobile Menu</h2>
            <p className="text-xs text-white/50">Control whether mobile uses the custom mobile menu or the original menu items.</p>
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
            <h3 className="text-sm font-bold">Mobile Menu</h3>
            <p className="mt-1 rounded-sm border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-xs font-semibold text-amber-100">
              Enable to render the custom mobile menu. Disable to render the original menu items.
            </p>
          </div>
          <Switch checked={config.mobileMenuIsPublished} onCheckedChange={value => setConfig(prev => ({ ...prev, mobileMenuIsPublished: value }))} />
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
          <div className="w-full space-y-5">
            <div className="rounded-sm border border-white/10 bg-white/5 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-bold">View Style</h3>
                <p className="text-xs text-white/50">Choose grid or one-item-per-line mobile menu layout.</p>
              </div>
              <div className="grid gap-3">
                {viewOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, mobileMenuViewStyle: option.value }))}
                    className={`rounded-sm border p-4 text-left transition-all ${
                      config.mobileMenuViewStyle === option.value
                        ? 'border-white bg-white/20 text-white shadow-xl'
                        : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="block text-xs font-black uppercase tracking-widest">{option.label}</span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider opacity-70">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-white/10 bg-white/5 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-bold">Grid Layout</h3>
                <p className="text-xs text-white/50">Select row by column layout.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {gridOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, mobileMenuGridLayout: option }))}
                    className={`rounded-sm border p-4 text-left transition-all ${
                      config.mobileMenuGridLayout === option
                        ? 'border-white bg-white/20 text-white shadow-xl'
                        : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="block text-xs font-black uppercase tracking-widest">{option.replace('x', '*')}</span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider opacity-70">{getGridShape(option).rows * getGridShape(option).columns} items</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full space-y-5">
            <div className="rounded-sm border border-white/10 bg-white/5 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-bold">Layout Preview</h3>
                <p className="text-xs text-white/50">Showing {itemLimit} visible slots for the selected mobile menu layout.</p>
              </div>
              {config.mobileMenuViewStyle === 'grid' ? (
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridShape.columns}, minmax(0, 1fr))` }}>
                  {previewItems.map(item => (
                    <div key={item.id} className="flex min-w-0 flex-col items-center justify-center rounded-sm border border-white/10 bg-white/10 p-3 text-center text-xs font-bold text-white/70">
                      {renderMenuIcon(item.logo)}
                      <span className="mt-2 max-w-full truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-2">
                  {previewItems.map(item => (
                    <div key={item.id} className="flex min-w-0 items-center gap-3 rounded-sm border border-white/10 bg-white/10 p-3 text-xs font-bold text-white/70">
                      {renderMenuIcon(item.logo)}
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-sm border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold">Accordion</h3>
                  <p className="text-xs text-white/50">
                    Showing {itemLimit} visible slots for the selected {config.mobileMenuGridLayout.replace('x', '*')} menu.
                  </p>
                </div>
                <Button type="button" onClick={handleOpenAddDialog} variant="outlineGlassy">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </div>
              <Accordion type="single" collapsible className="rounded-sm border border-white/10 bg-black/10">
                {previewItems.map((item, index) => (
                  <AccordionItem key={`${item.id}-${index}`} value={String(index)} className="border-white/10 px-4">
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
      </div>

      <Dialog
        open={isItemDialogOpen}
        onOpenChange={open => {
          setIsItemDialogOpen(open);
          if (!open) {
            setEditingItemIndex(null);
            setDraftItem(createEmptyItem());
            setIconSearch('');
          }
        }}
      >
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white overflow-y-auto max-h-[85vh] sm:max-w-lg mt-[45px]">
          <DialogHeader>
            <DialogTitle>{editingItemIndex === null ? 'Add Mobile Menu Item' : 'Update Mobile Menu Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={draftItem.name} onChange={e => setDraftItem(prev => ({ ...prev, name: e.target.value }))} placeholder="Home" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Path</Label>
              <Input value={draftItem.path} onChange={e => setDraftItem(prev => ({ ...prev, path: e.target.value }))} placeholder="/path" className="bg-white/5 border-white/10" />
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

export default MobileMainMenuEditor;
