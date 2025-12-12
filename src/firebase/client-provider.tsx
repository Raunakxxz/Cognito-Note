'use client';
import {useEffect, useState} from 'react';

import {
  initializeFirebase,
  FirebaseProvider,
  type FirebaseProviderProps,
} from '@/firebase';

export function FirebaseClientProvider(
  props: Omit<FirebaseProviderProps, 'firestore' | 'auth' | 'firebaseApp'>
) {
  const [firebase, setFirebase] = useState(initializeFirebase());

  useEffect(() => {
    if (!firebase) {
      setFirebase(initializeFirebase());
    }
  }, [firebase]);

  if (!firebase) {
    return null;
  }

  return <FirebaseProvider {...firebase} {...props} />;
}
