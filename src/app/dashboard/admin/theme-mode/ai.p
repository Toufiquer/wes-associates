look at the page.tsx 
```
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Check, Settings, Save } from 'lucide-react';
import { useGetThemeModeQuery, useUpdateThemeModeMutation } from '@/redux/features/theme-mode/theme-mode-Slice';
import { Button } from '@/components/ui/button';

export default function ThemeModePage() {
  const { data, isLoading } = useGetThemeModeQuery({});
  const [updateTheme] = useUpdateThemeModeMutation();
  const [modes, setModes] = useState<string[]>([]);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    if (data?.data) {
      setModes(data.data.theme_modes);
      setCurrent(data.data.current_theme_mode);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateTheme({ theme_modes: modes, current_theme_mode: current }).unwrap();
      toast.success('Theme settings updated');
    } catch {
      toast.error('Update failed');
    }
  };

  if (isLoading) return <div className="p-12 text-white">Loading...</div>;

  return (
    <main className="min-h-screen p-6 md:p-12 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10"
      >
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
          <Settings className="text-blue-400" /> Theme Configuration
        </h1>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Current Active Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {modes.map(m => (
                <button
                  key={m}
                  onClick={() => setCurrent(m)}
                  className={`p-4 rounded-xl border transition-all ${current === m ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-white/10'}`}
                >
                  {m} {current === m && <Check className="inline ml-2" size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500 h-12">
              <Save className="mr-2" size={18} /> Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
```

there is data for all theme-mode 
```
{
    'all-theme-mode': ['custom','TB Glory','TB Lite', 'TB Dark']
}
```

Now your task is update the page.tsx with the following instructions.
1. At the top there is a button in right side named Update theme mode. 
2. at the top  in left side name theme configuration and after that there is name current theme.
3. After that there is a section with all theme choose able. If I choose one of them then it will update the preview option.
4. After that there is a section named preview. Please add Title, description, image, input filed, in preview. and this section will change if the select option is changes. 
5. If there the theme mode has changes then the top button is enable if not then disabled the button. 