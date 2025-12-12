'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Note } from '@/lib/types';

export interface TagInfo {
  name: string;
  count: number;
}

export function useTags() {
  const db = useFirestore();
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const workspaceId = 'guest_workspace';

  useEffect(() => {
    if (!workspaceId || !db) {
      setTags([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const notesCollection = collection(db, 'notes');
    const q = query(notesCollection, where('workspaceId', '==', workspaceId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tagCounts: { [key: string]: number } = {};
      
      querySnapshot.forEach((doc) => {
        const note = doc.data() as Note;
        if (note.tags) {
          note.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      const tagsData = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setTags(tagsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tags: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspaceId, db]);

  return { tags, loading };
}
