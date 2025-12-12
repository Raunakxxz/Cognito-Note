'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('Personal Notes');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setStep(2);
  };

  const handleCreateWorkspace = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      router.push('/login');
      return;
    }
    if (!workspaceName.trim()) {
        toast({ title: "Error", description: "Workspace name cannot be empty.", variant: "destructive" });
        return;
    }
    if (!db) {
        toast({ title: "Error", description: "Database connection not found.", variant: "destructive" });
        return;
    }

    setLoading(true);
    try {
      const workspaceRef = doc(db, 'workspaces', `${user.uid}_${Date.now()}`);
      await setDoc(workspaceRef, {
        name: workspaceName,
        ownerId: user.uid,
        icon: '📝',
        color: '#3B82F6',
        createdAt: serverTimestamp(),
        memberIds: [user.uid],
      });

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        defaultWorkspace: workspaceRef.id,
      });
      
      toast({ title: "Success", description: "Welcome to CognitoNote!" });
      router.push('/app');
    } catch (error) {
      console.error("Error creating workspace: ", error);
      toast({ title: "Error", description: "Failed to create workspace. Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-app p-4">
      <Card className="w-full max-w-md bg-bg-surface border-border-default shadow-lg">
        {step === 1 && (
          <>
            <CardHeader className="items-center text-center p-8">
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className="font-display text-h1 font-bold text-text-primary">Welcome to CognitoNote!</CardTitle>
              <CardDescription className="text-base text-text-secondary mt-2">You&apos;re all set. Let&apos;s create your first workspace to get started.</CardDescription>
            </CardHeader>
            <CardFooter className="p-6">
              <Button onClick={handleContinue} className="w-full text-base py-3">Continue →</Button>
            </CardFooter>
          </>
        )}
        {step === 2 && (
           <>
           <CardHeader className="p-8">
             <CardTitle className="font-display text-h2 font-semibold text-text-primary">Create Your First Workspace</CardTitle>
             <CardDescription className="text-text-secondary mt-2">This will be your default space for organizing notes.</CardDescription>
           </CardHeader>
           <CardContent className="px-8 pb-8">
             <div className="space-y-2">
               <Label htmlFor="workspace-name" className="text-text-primary">Workspace name</Label>
               <Input
                 id="workspace-name"
                 value={workspaceName}
                 onChange={(e) => setWorkspaceName(e.target.value)}
                 placeholder="e.g., Personal Notes"
                 disabled={loading}
                 className="bg-bg-input border-border-default text-base"
               />
             </div>
           </CardContent>
           <CardFooter className="p-6 pt-0">
             <Button onClick={handleCreateWorkspace} className="w-full text-base py-3" disabled={loading}>
               {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Workspace & Start'}
             </Button>
           </CardFooter>
         </>
        )}
      </Card>
    </div>
  );
}
