'use client';

import { useNotes } from '@/hooks/use-notes';
import { NoteItem } from './note-item';
import { Input } from './ui/input';
import { File, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export function NoteList({ activeNoteId }: { activeNoteId?: string }) {
  const { notes, loading } = useNotes();

  return (
    <div className="flex h-full flex-col bg-bg-surface">
      <div className="p-4 space-y-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-tertiary" />
            <Input placeholder="Search notes..." className="pl-9 bg-bg-input border-border-default" />
          </div>
          <Select defaultValue="updatedAt-desc">
            <SelectTrigger className="w-auto bg-bg-input border-border-default">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt-desc">Last Edited</SelectItem>
              <SelectItem value="createdAt-desc">Created Date</SelectItem>
              <SelectItem value="title-asc">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <NoteItem key={note.id} note={note} isActive={note.id === activeNoteId} />
            ))
          ) : (
            <div className="p-8 text-center text-text-secondary">
              <File className="w-12 h-12 mx-auto opacity-30" />
              <p className="mt-4 text-sm">No notes yet.</p>
              <Button asChild variant="link" className="mt-2 text-sm text-accent-primary">
                <Link href="/app/notes/new">Create one now</Link>
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
