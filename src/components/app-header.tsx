'use client';

import { Search, Plus, Menu, Command } from 'lucide-react';
import { Button } from './ui/button';
import { WorkspaceSwitcher } from './workspace-switcher';
import { UserNav } from './user-nav';
import { Logo } from './logo';
import Link from 'next/link';
import { Input } from './ui/input';

export function AppHeader({ onMenuClick }: { onMenuClick: () => void; }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border-default bg-bg-surface px-4 md:px-6">
        {/* Mobile Menu */}
        <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
        </Button>

      <div className="flex items-center gap-6">
        <Link href="/app" className="hidden md:block">
            <Logo />
        </Link>
        <WorkspaceSwitcher />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input type="search" placeholder="Search notes..." className="pl-10 w-64 xl:w-96 bg-bg-input border-border-default focus:w-[450px] transition-all duration-300" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-tertiary bg-bg-elevated px-1.5 py-0.5 rounded-sm flex items-center gap-1">
            <Command size={12} />K
          </div>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5"/>
        </Button>
        <Button asChild>
          <Link href="/app/notes/new">
            <Plus className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">New Note</span>
          </Link>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
