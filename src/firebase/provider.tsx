'use client';
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export type FirebaseProviderProps = PropsWithChildren<{
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}>;

const FirebaseContext = createContext<
  Omit<FirebaseProviderProps, 'children'> | undefined
>(undefined);

export function FirebaseProvider(props: FirebaseProviderProps) {
  const { firebaseApp, auth, firestore } = props;
  const context = useMemo(
    () => ({ firebaseApp, auth, firestore }),
    [firebaseApp, auth, firestore]
  );
  return (
    <FirebaseContext.Provider value={context}>
      {props.children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useFirebaseApp() {
  const context = useFirebase();
  if (context === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
}

export function useAuth() {
  const context = useFirebase();
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export function useFirestore() {
  const context = useFirebase();
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}
