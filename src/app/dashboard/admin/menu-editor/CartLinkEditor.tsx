/*
|-----------------------------------------
| setting up CartLinkEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import { Save, Loader2, RotateCcw, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BrandSettings } from '@/redux/features/brand-settings/brandSettingsSlice';

type CartIconConfig = Pick<
  BrandSettings,
  'cartIconIsPublished' | 'cartIconBorderIsVisible' | 'cartIconPath' | 'cartIconBackgroundTransparent' | 'cartIconBackgroundColor' | 'cartIconTextColor'
>;

const defaultConfig: CartIconConfig = {
  cartIconIsPublished: true,
  cartIconBorderIsVisible: true,
  cartIconPath: '/cart',
  cartIconBackgroundTransparent: false,
  cartIconBackgroundColor: '#ffffff',
  cartIconTextColor: '#0f172a',
};

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{label}</Label>
    <div className="flex h-12 overflow-hidden rounded-sm border border-white/20 bg-white/5">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-full w-14 cursor-pointer border-0 bg-transparent p-1" />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-full rounded-none border-0 bg-transparent font-mono text-xs uppercase text-white"
      />
    </div>
  </div>
);

const CartLinkEditor = () => {
  const [config, setConfig] = useState<CartIconConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/menu/cart-link');
        if (!response.ok) return;
        const brandSettings = await response.json();
        setConfig({
          cartIconIsPublished: brandSettings.cartIconIsPublished,
          cartIconBorderIsVisible: brandSettings.cartIconBorderIsVisible ?? true,
          cartIconPath: brandSettings.cartIconPath || '/cart',
          cartIconBackgroundTransparent: brandSettings.cartIconBackgroundTransparent ?? false,
          cartIconBackgroundColor: brandSettings.cartIconBackgroundColor || '#ffffff',
          cartIconTextColor: brandSettings.cartIconTextColor || '#0f172a',
        });
      } catch {
        toast.error('Cart link sync failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/menu/cart-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      if (data?.data) {
        setConfig(prev => ({ ...prev, ...data.data }));
      }
      window.dispatchEvent(new Event('brand-settings-updated'));
      toast.success('Cart icon updated successfully');
    } catch {
      toast.error('Cart icon update failed');
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
            <ShoppingCart className="h-6 w-6 text-white/80" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Cart Icon</h2>
            <p className="text-xs text-white/50">Manage the cart shortcut shown in the client menu.</p>
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

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-4">
          <div>
            <h3 className="text-sm font-bold">Publish Cart Icon</h3>
            <p className="text-xs text-white/50">Turn this off to hide the cart shortcut from the menu.</p>
          </div>
          <Switch checked={config.cartIconIsPublished} onCheckedChange={value => setConfig(prev => ({ ...prev, cartIconIsPublished: value }))} />
        </div>
        <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-4">
          <div>
            <h3 className="text-sm font-bold">Cart Border</h3>
            <p className="text-xs text-white/50">Show or hide the border around the cart icon.</p>
          </div>
          <Switch checked={config.cartIconBorderIsVisible} onCheckedChange={value => setConfig(prev => ({ ...prev, cartIconBorderIsVisible: value }))} />
        </div>
        <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-4">
          <div>
            <h3 className="text-sm font-bold">Transparent Bg</h3>
            <p className="text-xs text-white/50">Use a transparent background for the cart icon.</p>
          </div>
          <Switch
            checked={config.cartIconBackgroundTransparent}
            onCheckedChange={value => setConfig(prev => ({ ...prev, cartIconBackgroundTransparent: value }))}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Cart Path</Label>
          <Input
            value={config.cartIconPath}
            onChange={e => setConfig(prev => ({ ...prev, cartIconPath: e.target.value }))}
            placeholder="/cart"
            className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
          />
        </div>
        <div className="rounded-sm border border-white/20 p-3">
          <div
            className={`flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold ${
              config.cartIconBorderIsVisible ? 'border' : 'border border-transparent'
            }`}
            style={{
              backgroundColor: config.cartIconBackgroundTransparent ? 'transparent' : config.cartIconBackgroundColor,
              borderColor: config.cartIconBorderIsVisible ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: config.cartIconTextColor,
            }}
          >
            <span className="relative inline-flex">
              <ShoppingCart size={18} />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">3</span>
            </span>
            <span>{config.cartIconIsPublished ? 'Visible' : 'Hidden'}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <ColorInput
          label="Icon Bg"
          value={config.cartIconBackgroundColor}
          onChange={value => setConfig(prev => ({ ...prev, cartIconBackgroundColor: value }))}
        />
        <ColorInput label="Icon Text" value={config.cartIconTextColor} onChange={value => setConfig(prev => ({ ...prev, cartIconTextColor: value }))} />
      </div>
    </section>
  );
};

export default CartLinkEditor;
