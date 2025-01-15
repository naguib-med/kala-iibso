'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                if (!token) {
                    setStatus('error');
                    setMessage('Token is missing');
                    return;
                }

                const res = await fetch(`/api/auth/verify-email?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    setStatus('error');
                    setMessage(data.error);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setStatus('error');
                    setMessage('An error occurred while verifying your email');
                }
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                {status === 'loading' && <p>Verifying your email...</p>}
                {status === 'success' && (
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-green-600 mb-2">✅ Email Verified</h1>
                        <p className="text-gray-600">{message}</p>
                        <a href="/auth/signin" className="mt-4 inline-block text-blue-500 hover:underline">
                            Go to Sign In
                        </a>
                    </div>
                )}
                {status === 'error' && (
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Verification Failed</h1>
                        <p className="text-gray-600">{message}</p>
                        <a href="/auth/signin" className="mt-4 inline-block text-blue-500 hover:underline">
                            Go to Sign In
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}