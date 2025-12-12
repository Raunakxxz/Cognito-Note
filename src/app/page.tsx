'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-app p-4 text-center">
      <div className="flex flex-col items-center space-y-8">
        <Logo className="text-4xl" />
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
            Your Thoughts, AI-Organized
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            Welcome to CognitoNote. The intelligent note-taking app that helps you summarize, analyze, and organize your ideas with the power of AI.
          </p>
        </div>
        <Button asChild size="lg" className="text-base">
          <Link href="/app/notes">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
