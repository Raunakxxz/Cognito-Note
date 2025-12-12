'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { useFirestore } from '@/firebase';
import { Note } from '@/lib/types';


export function useNote(noteId: string | null) {
  const { user, isGuest } = useAuth();
  const db = useFirestore();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
        return;
    }
    if (!noteId) {
      setNote(null);
      setLoading(false);
      return;
    }

    if (!user && !isGuest) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const docRef = doc(db, 'notes', noteId);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const workspaceId = isGuest ? 'guest_workspace' : user?.uid;
          
          if (data.workspaceId === workspaceId) {
            setNote({
              id: docSnap.id,
              ...data,
              createdAt: data.createdAt?.toDate().toISOString(),
              updatedAt: data.updatedAt?.toDate().toISOString(),
            } as Note);
            setError(null);
          } else {
            setError('Permission denied. You do not have access to this note.');
            setNote(null);
          }
        } else {
          setError('Note not found.');
          setNote(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching note:', err);
        setError('Failed to load the note.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [noteId, user, isGuest, db]);

  return { note, loading, error };
}
