'use client';

import type { Note } from '@/lib/types';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MoreVertical, Tag, X, Sparkles, ArrowLeft, Loader2, Plus } from 'lucide-react';
import { AiInsightsPanel } from './ai-insights-panel';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useNotes } from '@/hooks/use-notes';
import { useFirestore } from '@/firebase';

interface NoteEditorProps {
  note?: Note | null;
  onNoteCreated: (title: string, content: string) => Promise<void>;
}

const newNoteTemplate = {
  title: '',
  content: '',
  tags: [],
  aiInsights: {},
  workspaceId: 'guest_workspace'
};

export function NoteEditor({ note: initialNote, onNoteCreated }: NoteEditorProps) {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const { notes } = useNotes();

  const [note, setNote] = useState(initialNote ? { ...newNoteTemplate, ...initialNote } : newNoteTemplate);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isTagInputVisible, setIsTagInputVisible] = useState(false);

  const isCreatingNewNote = !initialNote;
  const workspaceId = 'guest_workspace';

  const noteRef = useRef(note);

  useEffect(() => {
    const currentNoteState = initialNote ? { ...newNoteTemplate, ...initialNote } : newNoteTemplate;
    setNote(currentNoteState);
    noteRef.current = currentNoteState;
    setSaveStatus('Saved');
    setIsTagInputVisible(false);
  }, [initialNote]);

  const handleSave = useCallback(async (currentNote: Note | typeof newNoteTemplate) => {
    const noteId = (currentNote as Note).id;
    if (!workspaceId) {
      toast({
        title: 'Error',
        description: 'Cannot save note without a workspace.',
        variant: 'destructive',
      });
      return;
    }

    if (!db) return;

    if (!isCreatingNewNote) {
        const noteCount = notes.length;
        if(noteCount > 3) {
            toast({
                title: "Guest limit reached",
                description: "Guests can only edit up to 3 notes. Please sign up to create more.",
                variant: "destructive",
            });
            return;
        }
    }

    setIsSaving(true);
    setSaveStatus('Saving...');
    
    try {
      if (!noteId) {
        await onNoteCreated(currentNote.title, currentNote.content);
        setSaveStatus('Saved');
        return;
      }
      
      const noteToSave = {
        ...currentNote,
        workspaceId: workspaceId,
        updatedAt: serverTimestamp(),
      };
      
      const docRef = doc(db, 'notes', noteId);
      await setDoc(docRef, noteToSave, { merge: true });
      
      noteRef.current = { ...noteRef.current, ...noteToSave, id: noteId } as Note;
      setSaveStatus('Saved');

    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus('Error');
      toast({
        title: 'Save Failed',
        description: 'Could not save your changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [workspaceId, toast, notes.length, onNoteCreated, isCreatingNewNote, db]);

  useEffect(() => {
    const hasChanged = JSON.stringify(note) !== JSON.stringify(noteRef.current);
    
    if (hasChanged && saveStatus !== 'Saving...') {
      setSaveStatus('Unsaved changes');
      const handler = setTimeout(() => {
        handleSave(note);
      }, 2000);

      return () => clearTimeout(handler);
    }
  }, [note, handleSave, saveStatus]);


  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      const newTag = tagInput.replace(/^#/, '').trim().toLowerCase();
      if (newTag && !note.tags.includes(newTag)) {
        const newTags = [...note.tags, newTag];
        setNote(prev => ({ ...prev, tags: newTags }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNote(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleAddSuggestedTag = (tag: string) => {
    const newTag = tag.toLowerCase();
    if (!note.tags.includes(newTag)) {
        const newTags = [...new Set([...note.tags, newTag])];
        setNote(prev => ({ ...prev, tags: newTags }));
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote({ ...note, title: e.target.value });
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote({ ...note, content: e.target.value });
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <div className="flex-1 flex flex-col h-full">
        <header className="flex h-16 items-center gap-4 border-b border-border-default px-6 flex-shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.push('/app/notes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Untitled Note"
            value={note.title}
            onChange={handleTitleChange}
            className="h-auto text-h2 font-display font-bold text-text-primary bg-transparent border-none focus:ring-0 focus:border-none p-0"
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-bg-elevated hover:bg-bg-hover border-border-default"
              onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
              disabled={isCreatingNewNote}
            >
              <Sparkles className="h-5 w-5 text-accent-purple" />
              <span className="ml-2 hidden sm:inline">{isAiPanelOpen ? 'Hide AI' : 'Show AI'}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Textarea
            placeholder="Start writing..."
            value={note.content}
            onChange={handleContentChange}
            className="w-full h-full p-6 font-mono text-[15px] leading-relaxed bg-transparent border-none resize-none focus:ring-0 focus:border-none"
          />
        </div>

        <footer className="flex h-14 items-center gap-4 border-t border-border-default px-6 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Tag className="h-4 w-4 text-text-tertiary flex-shrink-0" />
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-bg-elevated text-text-secondary hover:bg-bg-hover cursor-pointer">
                #{tag}
                <X className="ml-1.5 h-3 w-3" onClick={() => handleRemoveTag(tag)} />
              </Badge>
            ))}
            {isTagInputVisible ? (
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-tertiary">#</span>
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  onBlur={() => setIsTagInputVisible(false)}
                  placeholder="new-tag"
                  className="h-6 w-28 bg-bg-input pl-5"
                  autoFocus
                />
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="text-text-secondary" onClick={() => setIsTagInputVisible(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add tag
              </Button>
            )}
          </div>
          <div className="ml-auto text-xs text-text-tertiary flex items-center gap-2">
            {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>{saveStatus}</span>
          </div>
        </footer>
      </div>
      
      {initialNote && (
        <AiInsightsPanel 
          note={note as Note}
          isOpen={isAiPanelOpen} 
          onClose={() => setIsAiPanelOpen(false)}
          onAddSuggestedTag={handleAddSuggestedTag}
        />
      )}
    </div>
  );
}
