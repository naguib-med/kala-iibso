'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error();
        }

        setStatus('success');
      } catch (error) {
        if (error instanceof Error) {
          setStatus('error');
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="mt-4 text-xl font-semibold">
              Verifying your email...
            </h2>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Email verified successfully!</h2>
            <p className="text-muted-foreground">
              Your email has been verified. You can now sign in to your account.
            </p>
            <Button onClick={() => router.push('/auth/signin')}>
              Continue to login
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-destructive">
              Verification failed
            </h2>
            <p className="text-muted-foreground">
              The verification link is invalid or has expired.
            </p>
            <Button onClick={() => router.push('/auth/signin')}>
              Back to login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
