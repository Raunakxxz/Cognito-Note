'use client';

import { AppLayout } from '@/components/app-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { NotesProvider, useNotesContext } from '@/contexts/notes-context';

function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isNoteListVisible, setIsNoteListVisible } = useNotesContext();
  return (
    <AppLayout
      isNoteListVisible={isNoteListVisible}
      onToggleNoteList={() => setIsNoteListVisible(prev => !prev)}
    >
      {children}
    </AppLayout>
  );
}

export default function LayoutForApp({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <NotesProvider>
        <AppLayoutWrapper>
          {children}
        </AppLayoutWrapper>
      </NotesProvider>
    </ProtectedRoute>
  );
}
