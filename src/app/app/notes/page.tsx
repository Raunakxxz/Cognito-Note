'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useNotesContext } from "@/contexts/notes-context";

export default function NotesPage() {
  const { setIsNoteListVisible } = useNotesContext();

  // By default, the note list is visible on the placeholder page
  useEffect(() => {
    setIsNoteListVisible(true);
  }, [setIsNoteListVisible]);

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-background">
      <div className="max-w-md">
        <h2 className="font-display text-h2 font-semibold text-text-primary">Select a note to view</h2>
        <p className="mt-2 text-text-secondary">Or create a new one to get started.</p>
        <Button asChild className="mt-6">
          <Link href="/app/notes/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Note
          </Link>
        </Button>
      </div>
    </div>
  );
}
