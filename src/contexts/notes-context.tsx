'use client';

import { useNotes } from '@/hooks/use-notes';
import { Note } from '@/lib/types';
import { createContext, useState, ReactNode, Dispatch, SetStateAction, useContext } from 'react';

interface NotesContextType {
    notes: Note[];
    loading: boolean;
    createNote: (title: string, content: string) => Promise<string | null>;
    isNoteListVisible: boolean;
    setIsNoteListVisible: Dispatch<SetStateAction<boolean>>;
}

export const NotesContext = createContext<NotesContextType>({
    notes: [],
    loading: true,
    createNote: async () => null,
    isNoteListVisible: true,
    setIsNoteListVisible: () => {},
});

export function NotesProvider({ children }: { children: ReactNode }) {
    const { notes, loading, createNote } = useNotes();
    const [isNoteListVisible, setIsNoteListVisible] = useState(true);

    return (
        <NotesContext.Provider value={{ notes, loading, createNote, isNoteListVisible, setIsNoteListVisible }}>
            {children}
        </NotesContext.Provider>
    );
}

export const useNotesContext = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotesContext must be used within a NotesProvider');
    }
    return context;
}
