'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { SidebarNav } from '@/components/sidebar-nav';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface AppLayoutProps {
  children: React.ReactNode;
  isNoteListVisible: boolean;
  onToggleNoteList: () => void;
}

export function AppLayout({ children, isNoteListVisible, onToggleNoteList }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg-app">
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-72 p-0 bg-bg-surface border-r-0">
                <SidebarNav onToggleNoteList={onToggleNoteList} isNoteListVisible={isNoteListVisible} />
            </SheetContent>
        </Sheet>
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 flex-shrink-0 border-r border-border-default bg-bg-surface">
          <SidebarNav onToggleNoteList={onToggleNoteList} isNoteListVisible={isNoteListVisible} />
        </aside>

        <main className="flex-1 bg-background overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
