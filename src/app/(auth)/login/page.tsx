'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/firebase';
import { useAuth } from '@/contexts/auth-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const firebaseAuth = useFirebaseAuth();
  const { loginAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
      router.push('/app');
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Incorrect email or password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many login attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
            setError('Connection error. Please check your internet.');
            break;
        default:
          setError('An unexpected error occurred. Please try again.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    router.push('/app');
  };

  return (
    <div className="w-full bg-bg-surface border border-border-default rounded-lg p-8 shadow-md">
      {error && (
        <Alert variant="destructive" className="mb-6 bg-accent-danger/10 text-accent-danger border-accent-danger">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-text-primary">Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    className="w-full px-3 py-2 bg-bg-input border border-border-default text-base text-text-primary rounded-md focus:border-border-focus focus:ring-2 focus:ring-accent-primary/20"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text-primary">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                        className="w-full px-3 py-2 bg-bg-input border border-border-default text-base text-text-primary rounded-md focus:border-border-focus focus:ring-2 focus:ring-accent-primary/20"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full text-text-secondary hover:text-text-primary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Link href="#" className="text-sm text-accent-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" className="w-full mt-6 py-2 px-4 bg-accent-primary text-text-primary hover:bg-accent-primary-hover rounded-md font-medium text-base transition-colors duration-150" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-bg-surface px-2 text-xs text-text-secondary">OR</span>
      </div>

      <Button variant="outline" className="w-full" onClick={handleGuestLogin}>
        Continue as Guest
      </Button>

      <p className="w-full text-center text-sm text-text-secondary mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-accent-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
