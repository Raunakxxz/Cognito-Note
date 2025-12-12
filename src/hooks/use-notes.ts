'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Note } from '@/lib/types';
import { useToast } from './use-toast';
import { useFirestore } from '@/firebase';

export function useNotes(workspaceId?: string) {
  const db = useFirestore();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const effectiveWorkspaceId = workspaceId || 'guest_workspace';

  useEffect(() => {
    if (!effectiveWorkspaceId || !db) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const notesCollection = collection(db, 'notes');
    const q = query(
      notesCollection, 
      where('workspaceId', '==', effectiveWorkspaceId), 
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData: Note[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notesData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as Note);
      });
      setNotes(notesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notes: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [effectiveWorkspaceId, db]);

  const createNote = async (title: string, content: string): Promise<string | null> => {
    if (!effectiveWorkspaceId || !db) {
      toast({ title: 'Error', description: 'Cannot create note without a workspace.', variant: 'destructive' });
      return null;
    }

    if (notes.length >= 3) {
      toast({
        title: "Guest limit reached",
        description: "You can only create 3 notes. Please sign up to create more.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        title,
        content,
        tags: [],
        aiInsights: {},
        workspaceId: effectiveWorkspaceId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({ title: 'Error', description: 'Failed to create new note.', variant: 'destructive' });
      return null;
    }
  };

  return { notes, loading, createNote };
}
