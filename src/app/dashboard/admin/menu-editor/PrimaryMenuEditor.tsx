/*
|-----------------------------------------
| setting up PrimaryMenuEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Type,
  Upload,
  Anchor,
  Loader2,
  Palette,
  Activity,
  RotateCcw,
  GlassWater,
  ChevronRight,
  MousePointer2,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';

import LogoEditor from './LogoEditor';

export type BrandFontSize = 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
export type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono';
type NavigationPosition = 'fixed' | 'sticky' | 'scroll';
type MenuButtonMode = 'auth' | 'contact' | 'account';
type MenuButtonRadius = 'none' | 'sm' | 'xl' | 'full';
type MenuButtonPadding = 'none' | 'sm' | 'xl' | '2xl';

export interface BrandConfiguration {
  brandName: string;
  logoUrl: string | null;
  logoIsPublished: boolean;
  logoDesktopOffsetX: number;
  logoDesktopOffsetY: number;
  logoMobileOffsetX: number;
  logoMobileOffsetY: number;
  textColor: string;
  fontSize: BrandFontSize;
  fontFamily: BrandFontFamily;
  menuTextColor: string;
  menuFontSize: BrandFontSize;
  menuFontFamily: BrandFontFamily;
  menuBackgroundColor: string;
  backgroundTransparent: number;
  menuSticky: boolean;
  menuPosition: NavigationPosition;
  menuButtonMode: MenuButtonMode;
  menuButtonIconName: string;
  menuButtonContactText: string;
  menuButtonContactLink: string;
  menuButtonBackgroundColor: string;
  menuButtonTextColor: string;
  menuButtonPaddingY: MenuButtonPadding;
  menuButtonPaddingX: MenuButtonPadding;
  menuButtonRadius: MenuButtonRadius;
  menuButtonBackgroundTransparent: boolean;
}

const defaultBrandConfig: BrandConfiguration = {
  brandName: 'Aether Digital',
  logoUrl: null,
  logoIsPublished: true,
  logoDesktopOffsetX: 0,
  logoDesktopOffsetY: 0,
  logoMobileOffsetX: 0,
  logoMobileOffsetY: 0,
  textColor: '#ffffff',
  fontSize: 'text-2xl',
  fontFamily: 'font-sans',
  menuTextColor: '#cbd5e1',
  menuFontSize: 'text-lg',
  menuFontFamily: 'font-sans',
  menuBackgroundColor: 'rgba(15, 23, 42, 0.8)',
  backgroundTransparent: 100,
  menuSticky: true,
  menuPosition: 'fixed',
  menuButtonMode: 'auth',
  menuButtonIconName: '',
  menuButtonContactText: 'Contact Me',
  menuButtonContactLink: '/contact',
  menuButtonBackgroundColor: '#ffffff',
  menuButtonTextColor: '#0f172a',
  menuButtonPaddingY: 'xl',
  menuButtonPaddingX: '2xl',
  menuButtonRadius: 'full',
  menuButtonBackgroundTransparent: false,
};

const fontOptions = [
  { label: 'Sans Serif', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Monospace', value: 'font-mono' },
];

const sizeOptions = [
  { label: 'Small', value: 'text-lg' },
  { label: 'Medium', value: 'text-xl' },
  { label: 'Large', value: 'text-2xl' },
  { label: 'Extra Large', value: 'text-3xl' },
];

const positionOptions: { label: string; value: NavigationPosition; description: string }[] = [
  { label: 'Fixed', value: 'fixed', description: 'Always pinned to the viewport top' },
  { label: 'Sticky', value: 'sticky', description: 'Sticks after reaching the top' },
  { label: 'Scroll', value: 'scroll', description: 'Normal div flow' },
];

const buttonRadiusOptions: { label: string; value: MenuButtonRadius; className: string }[] = [
  { label: 'None', value: 'none', className: 'rounded-none' },
  { label: 'SM', value: 'sm', className: 'rounded-sm' },
  { label: 'XL', value: 'xl', className: 'rounded-xl' },
  { label: 'Full', value: 'full', className: 'rounded-full' },
];

const buttonPaddingOptions: { label: string; value: MenuButtonPadding }[] = [
  { label: 'None', value: 'none' },
  { label: 'SM', value: 'sm' },
  { label: 'XL', value: 'xl' },
  { label: '2XL', value: '2xl' },
];

const buttonPaddingYValues: Record<MenuButtonPadding, string> = {
  none: '0px',
  sm: '8px',
  xl: '12px',
  '2xl': '16px',
};

const buttonPaddingXValues: Record<MenuButtonPadding, string> = {
  none: '0px',
  sm: '16px',
  xl: '28px',
  '2xl': '40px',
};

export type PrimaryMenuSection = 'brand' | 'menu' | 'button';

export default function PrimaryMenuEditor({ activeSection }: { activeSection: PrimaryMenuSection }) {
  const [config, setConfig] = useState<BrandConfiguration>(defaultBrandConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const SelectedButtonIcon = config.menuButtonIconName ? iconMap[config.menuButtonIconName] || MousePointer2 : MousePointer2;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/menu/primary-menu', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch primary menu settings');
        const payload = await res.json();
        const settings = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
        if (settings && typeof settings === 'object') {
          setConfig({ ...defaultBrandConfig, ...(settings as Partial<BrandConfiguration>) });
        }
      } catch {
        toast.error('Sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/menu/primary-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Update failed');
      const payload = await response.json();
      const settings = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
      if (settings && typeof settings === 'object') {
        setConfig(prev => ({ ...prev, ...(settings as Partial<BrandConfiguration>) }));
      }
      window.dispatchEvent(new Event('brand-settings-updated'));
      toast.success('Settings Synced Successfully');
    } catch {
      toast.error('Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-[60vh] relative overflow-hidden bg-transparent border border-slate-100/40 rounded-sm text-white selection:bg-indigo-500/30">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full" />
        </div>

        <div className="container mx-auto relative z-10 p-4 max-w-7xl">
          <ToastContainer position="bottom-right" theme="dark" hideProgressBar />

          <Tabs value={activeSection} className="w-full">
            <header className="mb-8 flex items-center justify-end gap-3 transition-all">
                <Button size="sm" onClick={() => setConfig(defaultBrandConfig)} variant="outlineGlassy">
                  <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
                </Button>
                <Button onClick={handleSave} disabled={isSaving} variant="outlineGlassy">
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" /> Update
                    </>
                  )}
                </Button>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'circOut' }}
              >
                <TabsContent value="brand" className="m-0 focus-visible:ring-0">
                  <LogoEditor config={config} setConfig={setConfig} />
                </TabsContent>

                <TabsContent value="menu" className="m-0 focus-visible:ring-0">
                  <div className="flex flex-col gap-8 backdrop-blur-xl bg-white/10 border border-white/60 p-6 md:p-10 rounded-sm shadow-2xl">
                    <div className="flex flex-col gap-5 p-8 rounded-sm bg-white/5 border border-white/10 group hover:border-white/40 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center border border-white/10">
                          <Anchor className="w-6 h-6 text-white/80" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white font-black italic tracking-tight text-lg uppercase leading-tight">Menu Position</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Control how the navbar behaves while scrolling</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {positionOptions.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setConfig(p => ({ ...p, menuPosition: option.value, menuSticky: option.value !== 'scroll' }))}
                            className={`rounded-sm border p-4 text-left transition-all ${
                              config.menuPosition === option.value
                                ? 'bg-white/20 border-white text-white shadow-xl'
                                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span className="block text-xs font-black uppercase tracking-widest">{option.label}</span>
                            <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider opacity-70">{option.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4 flex flex-col p-8 rounded-sm bg-white/5 border border-white/10 hover:border-white/40 transition-all">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                          <Palette className="w-3 h-3" /> Menu Background Colour
                        </label>
                        <div className="relative group flex-1">
                          <div className="h-20 bg-black/40 rounded-sm border border-white/20 flex items-center justify-between px-6 cursor-pointer hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-sm border border-white/40 shadow-2xl group-hover:rotate-6 transition-transform"
                                style={{ backgroundColor: config.menuBackgroundColor }}
                              />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Hex Code</span>
                                <span className="text-sm font-mono font-bold text-white uppercase">{config.menuBackgroundColor}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </div>
                          <input
                            type="color"
                            value={config.menuBackgroundColor}
                            onChange={e => setConfig(p => ({ ...p, menuBackgroundColor: e.target.value }))}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col p-8 rounded-sm bg-white/5 border border-white/10 hover:border-white/40 transition-all">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                          <Palette className="w-3 h-3" /> text Colour
                        </label>
                        <div className="relative group flex-1">
                          <div className="h-20 bg-black/40 rounded-sm border border-white/20 flex items-center justify-between px-6 cursor-pointer hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-sm border border-white/40 shadow-2xl group-hover:rotate-6 transition-transform"
                                style={{ backgroundColor: config.menuTextColor }}
                              />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ink Value</span>
                                <span className="text-sm font-mono font-bold text-white uppercase">{config.menuTextColor}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </div>
                          <input
                            type="color"
                            value={config.menuTextColor}
                            onChange={e => setConfig(p => ({ ...p, menuTextColor: e.target.value }))}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-8 rounded-sm bg-white/5 border border-white/10 flex flex-col gap-10 hover:border-white/40 transition-all">
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                            <GlassWater className="w-3.5 h-3.5" /> Background Transparency
                          </label>
                          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                            <Activity className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-black text-white">{config.backgroundTransparent}%</span>
                          </div>
                        </div>

                        <div className="relative pt-4 pb-2 px-1">
                          <Slider
                            value={[config.backgroundTransparent]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={v => setConfig(p => ({ ...p, backgroundTransparent: v[0] }))}
                            className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-indigo-500 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
                          />
                          <div className="flex justify-between mt-4">
                            {[0, 25, 50, 75, 100].map(tick => (
                              <button
                                key={tick}
                                onClick={() => setConfig(p => ({ ...p, backgroundTransparent: tick }))}
                                className={`text-sm font-black text-white/60`}
                              >
                                {tick}%
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="h-12 w-full rounded-sm relative overflow-hidden border border-white/10 bg-white/5">
                          <div className="absolute inset-0 grid grid-cols-12 opacity-10">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div key={i} className="border-r border-b border-white" />
                            ))}
                          </div>
                          <motion.div
                            initial={false}
                            animate={{ opacity: config.backgroundTransparent / 100 }}
                            className="absolute inset-0 flex items-center justify-center font-black text-[10px] uppercase tracking-[0.5em]"
                            style={{ backgroundColor: config.menuBackgroundColor, color: config.menuTextColor }}
                          >
                            Visual Preview
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between md:items-end gap-8">
                        <div className="flex-1 space-y-6">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                            <Type className="w-3.5 h-3.5" /> Interaction Geometry
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em]">Sizing Hierarchy</span>
                              <div className="relative">
                                <select
                                  value={config.menuFontSize}
                                  onChange={e => setConfig(p => ({ ...p, menuFontSize: e.target.value as BrandFontSize }))}
                                  className="w-full h-14 bg-white/5 rounded-sm border border-white/20 px-4 text-xs font-black text-white appearance-none focus:outline-none focus:border-white transition-colors"
                                >
                                  {sizeOptions.map(o => (
                                    <option key={o.value} value={o.value} className="bg-slate-900">
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-white/30 pointer-events-none" />
                              </div>
                            </div>
                            <div className="flex items-center gap-6 pt-6">
                              <div className="flex-1 h-px bg-white/10" />
                              <div className={`${config.menuFontSize} ${config.menuFontFamily} italic font-black text-white/60 tracking-tight`}>
                                Preview Text
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                          <MousePointer2 className="w-3.5 h-3.5" /> Theme Typeface
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {fontOptions.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setConfig(p => ({ ...p, menuFontFamily: opt.value as BrandFontFamily }))}
                              className={`h-28 rounded-sm border transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${config.menuFontFamily === opt.value ? 'bg-white/20 border-white text-white shadow-2xl' : 'bg-white/5 border-white/10 text-white/20 hover:bg-white/10 hover:text-white/40'}`}
                            >
                              <span className={`text-3xl font-black italic ${opt.value}`}>Aa</span>
                              <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                              {config.menuFontFamily === opt.value && (
                                <motion.div layoutId="menu-font-active" className="absolute top-0 left-0 right-0 h-0.5 bg-white" />
                              )}
                              <div
                                className={`absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold uppercase tracking-widest ${config.menuFontFamily === opt.value ? 'opacity-100 text-white/60' : 'text-white/20'}`}
                              >
                                Select Style
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="button" className="m-0 focus-visible:ring-0">
                  <div className="flex flex-col gap-8 backdrop-blur-xl bg-white/10 border border-white/60 p-6 md:p-10 rounded-sm shadow-2xl">
                    <div className="flex flex-col gap-5 p-8 rounded-sm bg-white/5 border border-white/10 hover:border-white/40 transition-all">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center border border-white/10">
                            <MousePointer2 className="w-6 h-6 text-white/80" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-white font-black italic tracking-tight text-lg uppercase leading-tight">Menu Button</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                              Switch the menu action between account access and a custom contact button
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 p-1">
                          {[
                            { label: 'Login/Dashboard', value: 'auth' as const },
                            { label: 'Contact Me', value: 'contact' as const },
                            { label: 'Account', value: 'account' as const },
                          ].map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setConfig(p => ({ ...p, menuButtonMode: option.value }))}
                              className={`rounded-sm px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                config.menuButtonMode === option.value ? 'bg-white/20 text-white shadow-lg' : 'text-white/50 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {config.menuButtonMode === 'contact' && (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Contact Button Text</label>
                            <Input
                              value={config.menuButtonContactText}
                              onChange={e => setConfig(p => ({ ...p, menuButtonContactText: e.target.value }))}
                              className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
                              placeholder="Contact Me"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Contact Button Link</label>
                            <Input
                              value={config.menuButtonContactLink}
                              onChange={e => setConfig(p => ({ ...p, menuButtonContactLink: e.target.value }))}
                              className="h-12 rounded-sm border-white/20 bg-white/5 text-white"
                              placeholder="/contact"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                      <div className="flex flex-col gap-6 rounded-sm border border-white/10 bg-white/5 p-8 hover:border-white/40 transition-all">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Button Icon</label>
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-white/20 bg-white/10">
                              <SelectedButtonIcon className="h-5 w-5 text-white" />
                            </div>
                            <select
                              value={config.menuButtonIconName}
                              onChange={e => setConfig(p => ({ ...p, menuButtonIconName: e.target.value }))}
                              className="h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 text-xs font-black text-white outline-none focus:border-white/40"
                            >
                              <option value="" className="bg-slate-900">
                                Automatic (Based on mode)
                              </option>
                              {iconOptions.map(iconName => (
                                <option key={iconName} value={iconName} className="bg-slate-900">
                                  {iconName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Button Background</label>
                            <div className="flex h-12 overflow-hidden rounded-sm border border-white/20 bg-white/5">
                              <input
                                type="color"
                                value={config.menuButtonBackgroundColor}
                                onChange={e => setConfig(p => ({ ...p, menuButtonBackgroundColor: e.target.value }))}
                                className="h-full w-14 cursor-pointer border-0 bg-transparent p-1"
                              />
                              <Input
                                value={config.menuButtonBackgroundColor}
                                onChange={e => setConfig(p => ({ ...p, menuButtonBackgroundColor: e.target.value }))}
                                className="h-full rounded-none border-0 bg-transparent font-mono text-xs uppercase text-white"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Text Color</label>
                            <div className="flex h-12 overflow-hidden rounded-sm border border-white/20 bg-white/5">
                              <input
                                type="color"
                                value={config.menuButtonTextColor}
                                onChange={e => setConfig(p => ({ ...p, menuButtonTextColor: e.target.value }))}
                                className="h-full w-14 cursor-pointer border-0 bg-transparent p-1"
                              />
                              <Input
                                value={config.menuButtonTextColor}
                                onChange={e => setConfig(p => ({ ...p, menuButtonTextColor: e.target.value }))}
                                className="h-full rounded-none border-0 bg-transparent font-mono text-xs uppercase text-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Py</label>
                            <select
                              value={config.menuButtonPaddingY}
                              onChange={e => setConfig(p => ({ ...p, menuButtonPaddingY: e.target.value as MenuButtonPadding }))}
                              className="h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-white/40"
                            >
                              {buttonPaddingOptions.map(option => (
                                <option key={option.value} value={option.value} className="bg-slate-900">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Px</label>
                            <select
                              value={config.menuButtonPaddingX}
                              onChange={e => setConfig(p => ({ ...p, menuButtonPaddingX: e.target.value as MenuButtonPadding }))}
                              className="h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-white/40"
                            >
                              {buttonPaddingOptions.map(option => (
                                <option key={option.value} value={option.value} className="bg-slate-900">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                          <div className="space-y-3 flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Background Transparent</label>
                            <div className="flex h-12 items-center justify-between rounded-sm border border-white/20 bg-white/5 px-4">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 pr-2">
                                {config.menuButtonBackgroundTransparent ? 'Transparent' : 'Solid'}
                              </span>
                              <Switch
                                checked={config.menuButtonBackgroundTransparent}
                                onCheckedChange={value => setConfig(p => ({ ...p, menuButtonBackgroundTransparent: value }))}
                                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Border Radius</label>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {buttonRadiusOptions.map(option => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setConfig(p => ({ ...p, menuButtonRadius: option.value }))}
                                className={`h-12 border text-[10px] font-black uppercase tracking-widest transition-all ${option.className} ${
                                  config.menuButtonRadius === option.value
                                    ? 'border-white bg-white/20 text-white shadow-xl'
                                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/40 hover:text-white'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex min-h-72 flex-col items-center justify-center gap-5 rounded-sm border border-white/10 bg-white/5 p-8 hover:border-white/40 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Live Preview</span>
                        <button
                          type="button"
                          className={`inline-flex items-center justify-center gap-2 border text-sm font-bold shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] transition-all ${
                            buttonRadiusOptions.find(option => option.value === config.menuButtonRadius)?.className || 'rounded-full'
                          }`}
                          style={{
                            paddingBlock: buttonPaddingYValues[config.menuButtonPaddingY],
                            paddingInline: buttonPaddingXValues[config.menuButtonPaddingX],
                            color: config.menuButtonTextColor,
                            backgroundColor: config.menuButtonBackgroundTransparent ? 'transparent' : config.menuButtonBackgroundColor,
                            borderColor: config.menuButtonBackgroundTransparent ? config.menuButtonTextColor : 'transparent',
                          }}
                        >
                          <SelectedButtonIcon className="h-4 w-4" />
                          {config.menuButtonMode === 'contact' ? config.menuButtonContactText || 'Contact Me' : config.menuButtonMode === 'account' ? 'Account' : 'Login / Dashboard'}
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
