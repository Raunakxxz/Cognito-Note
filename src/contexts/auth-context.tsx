'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useAuth as useFirebaseAuth } from '@/firebase';


interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: false,
  loading: true,
  loginAsGuest: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsGuest(user?.isAnonymous || false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const loginAsGuest = async () => {
    setLoading(true);
    try {
        const userCred = await signInAnonymously(auth);
        setUser(userCred.user);
        setIsGuest(true);
    } catch(error) {
        console.error("Guest login failed", error);
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsGuest(false);
  };

  const value = { user, loading, isGuest, logout, loginAsGuest };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
