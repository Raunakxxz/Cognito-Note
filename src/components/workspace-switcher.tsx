'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, PlusCircle, Settings, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockWorkspaces, type Workspace } from '@/lib/mock-data';

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | undefined>(mockWorkspaces[0]);

  if (!selectedWorkspace) {
    return (
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-48 justify-between bg-bg-elevated border-border-default hover:bg-bg-hover">
          <span className="truncate">No Workspace</span>
          <HardDrive className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-48 justify-between bg-bg-elevated border-border-default hover:bg-bg-hover">
          <span className="truncate">{selectedWorkspace.name}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-bg-surface border-border-default shadow-lg">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {mockWorkspaces.map((workspace) => (
            <DropdownMenuItem key={workspace.id} onSelect={() => {
                setSelectedWorkspace(workspace);
                setOpen(false);
            }}
            className="focus:bg-bg-elevated focus:text-accent-primary"
            >
              {workspace.icon && <span className="mr-2">{workspace.icon}</span>}
              <span className="flex-1 truncate">{workspace.name}</span>
              <Check className={cn('ml-auto h-4 w-4 text-accent-primary', selectedWorkspace.id === workspace.id ? 'opacity-100' : 'opacity-0')} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="focus:bg-bg-elevated" onSelect={() => { /* TODO: Implement create workspace modal */ }}>
          <PlusCircle className="mr-2 h-4 w-4 text-accent-primary" />
          <span>Create Workspace</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-bg-elevated">
          <Settings className="mr-2 h-4 w-4" />
          <span>Manage Workspaces</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
