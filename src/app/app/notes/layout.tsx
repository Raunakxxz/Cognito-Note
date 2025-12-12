'use client';
import { NoteList } from '@/components/note-list';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useNotesContext } from '@/contexts/notes-context';

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const noteId = Array.isArray(params.noteId) ? params.noteId[0] : params.noteId;
  const { isNoteListVisible } = useNotesContext();

  return (
    <div className="flex h-full">
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          'bg-bg-surface border-r border-border-default',
          isNoteListVisible ? 'w-full md:w-1/3 max-w-sm' : 'w-0'
        )}
      >
        <div className={cn('h-full', !isNoteListVisible && 'hidden')}>
            <NoteList activeNoteId={noteId} />
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
