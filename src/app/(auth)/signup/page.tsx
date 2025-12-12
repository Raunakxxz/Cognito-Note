'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signupSchema = z
  .object({
    name: z.string().max(100).optional(),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
  const getStrength = () => {
    let score = 0;
    if (!password) return { score: 0, text: '', color: '' };

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    switch (score) {
      case 1: return { score: 25, text: 'Weak', color: 'bg-accent-danger' };
      case 2: return { score: 50, text: 'Fair', color: 'bg-accent-warning' };
      case 3: return { score: 75, text: 'Good', color: 'bg-yellow-500' };
      case 4: return { score: 100, text: 'Strong', color: 'bg-accent-success' };
      default: return { score: 0, text: 'Very Weak', color: 'bg-accent-danger' };
    }
  };

  const { score, text, color } = getStrength();

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="h-1 w-full bg-bg-elevated rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-text-secondary">{text}</p>
    </div>
  );
};

export default function SignupPage() {
  const router = useRouter();
  const firebaseAuth = useFirebaseAuth();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const password = form.watch('password');

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
      
      if (data.name) {
        await updateProfile(userCredential.user, { displayName: data.name });
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: data.email,
        displayName: data.name || null,
        createdAt: serverTimestamp(),
        defaultWorkspace: null,
        preferences: { theme: 'dark', defaultView: 'list' },
      });

      router.push('/onboarding');
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try signing in.');
          break;
        case 'auth/weak-password':
          setError('Please choose a stronger password.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-bg-surface border border-border-default rounded-lg p-8 shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-h2 font-display font-semibold text-text-primary">Create your account</h2>
      </div>
      {error && (
          <Alert variant="destructive" className="mb-4 bg-accent-danger/10 text-accent-danger border-accent-danger">
              <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full name (optional)</FormLabel>
                <FormControl><Input className="bg-bg-input border-border-default" placeholder="John Doe" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl><Input className="bg-bg-input border-border-default" type="email" placeholder="you@example.com" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><div className="relative">
                    <Input className="bg-bg-input border-border-default" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" {...field} disabled={loading}/>
                    <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full text-text-secondary" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div></FormControl>
                <PasswordStrengthIndicator password={password} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                 <FormControl><div className="relative">
                    <Input className="bg-bg-input border-border-default" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" {...field} disabled={loading}/>
                    <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full text-text-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="agreeToTerms" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={loading} /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal text-text-secondary">
                    I agree to the{' '}
                    <Link href="#" className="text-accent-primary hover:underline">Terms of Service</Link> and{' '}
                    <Link href="#" className="text-accent-primary hover:underline">Privacy Policy</Link>.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full !mt-6 bg-accent-primary text-text-primary hover:bg-accent-primary-hover" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </Button>
        </form>
      </Form>
      <p className="w-full text-center text-sm text-text-secondary mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
