'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Check, Settings, Save, Sun, Moon, Sparkles, Layers } from 'lucide-react';
import { useGetThemeModeQuery, useUpdateThemeModeMutation } from '@/redux/features/theme-mode/theme-mode-Slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const ALL_THEME_MODES = ['custom', 'TB Glory', 'TB Lite', 'TB Dark'];

type ThemeKey = 'custom' | 'TB Glory' | 'TB Lite' | 'TB Dark';

interface ThemePreset {
  label: string;
  icon: React.ReactNode;
  bg: string;
  card: string;
  border: string;
  accent: string;
  text: string;
  subtext: string;
  inputBg: string;
  image: string;
  title: string;
  description: string;
}

const THEME_PRESETS: Record<ThemeKey, ThemePreset> = {
  custom: {
    label: 'Custom',
    icon: <Sparkles size={16} />,
    bg: 'from-violet-950 via-slate-900 to-slate-950',
    card: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    accent: 'text-violet-400',
    text: 'text-white',
    subtext: 'text-violet-300/70',
    inputBg: 'bg-violet-500/10 border-violet-500/30 placeholder:text-violet-400/40',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    title: 'Custom Theme',
    description: 'Tailored to your vision — mix, adjust, and make it entirely yours.',
  },
  'TB Glory': {
    label: 'TB Glory',
    icon: <Sun size={16} />,
    bg: 'from-amber-950 via-orange-950 to-slate-950',
    card: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-400',
    text: 'text-white',
    subtext: 'text-amber-300/70',
    inputBg: 'bg-amber-500/10 border-amber-500/30 placeholder:text-amber-400/40',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    title: 'TB Glory',
    description: 'Bold and radiant — built for experiences that demand presence and power.',
  },
  'TB Lite': {
    label: 'TB Lite',
    icon: <Layers size={16} />,
    bg: 'from-sky-950 via-slate-900 to-slate-950',
    card: 'bg-sky-400/10',
    border: 'border-sky-400/30',
    accent: 'text-sky-400',
    text: 'text-white',
    subtext: 'text-sky-300/70',
    inputBg: 'bg-sky-400/10 border-sky-400/30 placeholder:text-sky-400/40',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    title: 'TB Lite',
    description: 'Clean and airy — optimised for clarity and fast, distraction-free workflows.',
  },
  'TB Dark': {
    label: 'TB Dark',
    icon: <Moon size={16} />,
    bg: 'from-slate-950 via-zinc-950 to-neutral-950',
    card: 'bg-white/5',
    border: 'border-white/10',
    accent: 'text-slate-300',
    text: 'text-white',
    subtext: 'text-slate-400',
    inputBg: 'bg-white/5 border-white/10 placeholder:text-slate-500',
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&q=80',
    title: 'TB Dark',
    description: 'Focused and minimal — designed for deep work in low-light environments.',
  },
};

export default function ThemeModePage() {
  const { data, isLoading } = useGetThemeModeQuery({});
  const [updateTheme, { isLoading: isSaving }] = useUpdateThemeModeMutation();
  const [modes, setModes] = useState<string[]>(ALL_THEME_MODES);
  const [current, setCurrent] = useState<ThemeKey>('TB Dark');
  const [preview, setPreview] = useState<ThemeKey>('TB Dark');
  const [originalCurrent, setOriginalCurrent] = useState<ThemeKey>('TB Dark');

  useEffect(() => {
    if (data?.data) {
      const allModes: string[] = data.data['all-theme-mode'] ?? ALL_THEME_MODES;
      setModes(allModes);
      const active = (data.data.current_theme_mode ?? allModes[0]) as ThemeKey;
      setCurrent(active);
      setPreview(active);
      setOriginalCurrent(active);
    }
  }, [data]);

  const isDirty = current !== originalCurrent;
  const preset = THEME_PRESETS[preview] ?? THEME_PRESETS['TB Dark'];

  const handleSave = async () => {
    try {
      await updateTheme({ 'all-theme-mode': modes, current_theme_mode: current }).unwrap();
      setOriginalCurrent(current);
      toast.success('Theme settings updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleSelect = (mode: string) => {
    const key = mode as ThemeKey;
    setCurrent(key);
    setPreview(key);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">Loading…</div>;
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${preset.bg} transition-all duration-700 p-6 md:p-12`}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ── Header Row ── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings size={20} className={`${preset.accent} shrink-0`} />
            <div>
              <h1 className="text-xl font-bold text-white leading-none">Theme Configuration</h1>
              <p className={`text-xs mt-1 ${preset.subtext}`}>
                Current:&nbsp;
                <span className={`font-semibold ${preset.accent}`}>{originalCurrent}</span>
              </p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`gap-2 text-sm font-semibold h-10 px-5 rounded-xl transition-all
              ${
                isDirty
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
              }`}
          >
            <Save size={15} />
            {isSaving ? 'Saving…' : 'Update theme mode'}
          </Button>
        </div>

        {/* ── Theme Selector ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl border ${preset.border} ${preset.card} backdrop-blur-xl p-6`}
        >
          <p className={`text-xs font-bold uppercase tracking-widest ${preset.subtext} mb-4`}>Select Theme</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {modes.map(m => {
              const p = THEME_PRESETS[m as ThemeKey];
              const isActive = current === m;
              return (
                <button
                  key={m}
                  onClick={() => handleSelect(m)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all duration-300
                    ${
                      isActive
                        ? `${p.card} ${p.border} ${p.accent} shadow-md`
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                    }`}
                >
                  <span className={isActive ? p.accent : 'text-white/40'}>{p?.icon}</span>
                  <span>{p?.label ?? m}</span>
                  {isActive && (
                    <span className={`absolute top-2 right-2 ${p.accent}`}>
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ── Preview Section ── */}
        <AnimatePresence mode="wait">
          <motion.section
            key={preview}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className={`rounded-2xl border ${preset.border} ${preset.card} backdrop-blur-xl overflow-hidden`}
          >
            <div className={`px-6 py-4 border-b ${preset.border} flex items-center justify-between`}>
              <p className={`text-xs font-bold uppercase tracking-widest ${preset.subtext}`}>Preview</p>
              <span className={`text-xs font-semibold ${preset.accent} flex items-center gap-1.5`}>
                {preset.icon} {preset.label}
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Image */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden">
                <Image src={preset.image} alt={`${preset.label} preview`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 700px" />
                <div className={`absolute inset-0 bg-gradient-to-t ${preset.bg} opacity-40`} />
              </div>

              {/* Title & Description */}
              <div>
                <h2 className={`text-lg font-bold ${preset.text}`}>{preset.title}</h2>
                <p className={`text-sm mt-1 leading-relaxed ${preset.subtext}`}>{preset.description}</p>
              </div>

              {/* Input */}
              <Input
                placeholder="Type something to preview the input style…"
                className={`rounded-xl border ${preset.inputBg} ${preset.text} text-sm h-11 focus-visible:ring-1 focus-visible:ring-offset-0`}
              />
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
