'use client';
import { NoteEditor } from '@/components/note-editor';
import { useNote } from '@/hooks/use-note';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useNotes } from '@/hooks/use-notes';
import { Loader2 } from 'lucide-react';
import { useNotesContext } from '@/contexts/notes-context';

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const noteId = params.noteId as string;
  const { createNote } = useNotes();
  const { setIsNoteListVisible } = useNotesContext();


  const { note, loading, error } = useNote(noteId === 'new' ? null : noteId);

  const handleCreateNew = async (title: string, content: string) => {
    const newNoteId = await createNote(title, content);
    if (newNoteId) {
      router.replace(`/app/notes/${newNoteId}`);
      setIsNoteListVisible(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }
  
  const workspaceId = isGuest ? 'guest_workspace' : user?.uid;

  if (noteId === 'new') {
    return <NoteEditor workspaceId={workspaceId} onNoteCreated={handleCreateNew} />;
  }

  return <NoteEditor note={note} onNoteCreated={handleCreateNew} workspaceId={workspaceId}/>;
}
