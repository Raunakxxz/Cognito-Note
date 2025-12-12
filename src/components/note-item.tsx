import type { Note } from '@/lib/types';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface NoteItemProps {
  note: Note;
  isActive?: boolean;
}

export function NoteItem({ note, isActive }: NoteItemProps) {
  const updatedAt = note.updatedAt ? new Date(note.updatedAt) : new Date();

  return (
    <Link
      href={`/app/notes/${note.id}`}
      className="block w-full text-left rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div
        className={cn(
          'p-4 rounded-lg border border-transparent transition-colors',
          isActive ? 'bg-bg-elevated' : 'bg-bg-surface hover:bg-bg-hover',
          'border-l-2',
          isActive ? 'border-accent-primary' : 'border-transparent'
        )}
      >
        <h3 className="text-base font-semibold truncate text-text-primary">{note.title || 'Untitled'}</h3>
        <p className="text-sm text-text-secondary line-clamp-2 h-10 mt-1">{note.content}</p>
        <div className="mt-3 flex justify-between items-end">
          <div className="flex flex-wrap gap-1 overflow-x-auto">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-bg-elevated text-text-secondary hover:bg-bg-hover">
                #{tag}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-text-tertiary flex-shrink-0 pl-2">
            {formatDistanceToNow(updatedAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  );
}
