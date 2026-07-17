/*
|-----------------------------------------
| setting up FooterEditorPage for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, July, 2026
|-----------------------------------------
*/

'use client';

import { LayoutDashboard, PanelBottom, Smartphone } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import MainFooterEditor from './MainFooterEditor';
import MobileNaviation from './MobileNaviation';
import DashboardNavigation from './DashboardNavigation';

export default function FooterEditorPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 p-2 text-slate-100 md:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-black tracking-tight text-white">Footer Editor</h1>
          <p className="mt-1 text-xs text-white/50">Manage the website footer and mobile navigation surfaces from one place.</p>
        </header>

        <Tabs defaultValue="main-footer" className="gap-5">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-xl border border-white/15 bg-white/5 p-2 backdrop-blur-xl sm:grid-cols-3">
            <TabsTrigger
              value="main-footer"
              className="h-12 rounded-lg text-white/60 data-[state=active]:border-white/20 data-[state=active]:bg-white/15 data-[state=active]:text-white"
            >
              <PanelBottom className="h-4 w-4" />
              Main Footer
            </TabsTrigger>
            <TabsTrigger
              value="mobile-navigation"
              className="h-12 rounded-lg text-white/60 data-[state=active]:border-white/20 data-[state=active]:bg-white/15 data-[state=active]:text-white"
            >
              <Smartphone className="h-4 w-4" />
              Mobile Navigation
            </TabsTrigger>
            <TabsTrigger
              value="dashboard-navigation"
              className="h-12 rounded-lg text-white/60 data-[state=active]:border-white/20 data-[state=active]:bg-white/15 data-[state=active]:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard Navigation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main-footer" className="mt-0">
            <MainFooterEditor />
          </TabsContent>
          <TabsContent value="mobile-navigation" className="mt-0">
            <MobileNaviation />
          </TabsContent>
          <TabsContent value="dashboard-navigation" className="mt-0">
            <DashboardNavigation />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
