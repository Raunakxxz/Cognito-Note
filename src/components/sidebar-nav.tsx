import { Archive, File, Plus, Tag, Pin, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './logo';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useTags } from '@/hooks/use-tags';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';


interface SidebarNavProps {
  isNoteListVisible: boolean;
  onToggleNoteList: () => void;
}

export function SidebarNav({ onToggleNoteList, isNoteListVisible }: SidebarNavProps) {
  const { tags, loading } = useTags();

  return (
    <div className="flex h-full flex-col text-sm pt-4">
      <div className="px-4 mb-4 md:hidden">
        <Link href="/app">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        <Button
          variant="ghost"
          className="w-full h-10 justify-start text-base text-text-secondary hover:text-text-primary hover:bg-bg-hover group"
          onClick={onToggleNoteList}
        >
          {isNoteListVisible ? <PanelLeftClose className="mr-3 h-5 w-5" /> : <PanelLeftOpen className="mr-3 h-5 w-5" />}
          <span className="flex-1">All Notes</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full h-10 justify-start text-base text-text-secondary hover:text-text-primary hover:bg-bg-hover group"
        >
          <Pin className="mr-3 h-5 w-5" />
          <span className="flex-1">Pinned</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full h-10 justify-start text-base text-text-secondary hover:text-text-primary hover:bg-bg-hover group"
        >
          <Archive className="mr-3 h-5 w-5" />
          <span className="flex-1">Archived</span>
        </Button>
      </nav>

      <div className="flex-1 px-2 mt-4">
        <Accordion type="single" collapsible defaultValue="tags" className="w-full">
          <AccordionItem value="tags" className="border-b-0">
            <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-text-tertiary hover:no-underline py-2 px-2 rounded-md hover:bg-bg-hover">
              <span className="flex-1 text-left">Tags</span>
            </AccordionTrigger>
            <AccordionContent className="pb-0 mt-1 space-y-1">
              {loading ? (
                <div className="space-y-2 px-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : tags.length > 0 ? (
                tags.map((tag) => (
                  <Button
                    key={tag.name}
                    variant="ghost"
                    className="w-full h-10 justify-start text-base text-text-secondary hover:text-text-primary hover:bg-bg-hover group"
                  >
                    <Tag className="mr-3 h-5 w-5" />
                    <span className="flex-1 text-left">#{tag.name}</span>
                    <span className="text-sm text-text-tertiary group-hover:text-text-secondary">{tag.count}</span>
                  </Button>
                ))
              ) : (
                <p className="px-4 text-xs text-text-secondary">No tags yet.</p>
              )}
              <Button variant="ghost" className="w-full h-10 justify-start text-text-secondary hover:text-text-primary hover:bg-bg-hover">
                <Plus className="mr-3 h-5 w-5" />
                Add tag
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="p-4">{/* Can be a footer */}</div>
    </div>
  );
}
