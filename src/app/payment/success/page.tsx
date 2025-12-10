'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push('/pricing');
      return;
    }

    // Optional: verify session with your API
    // const verifySession = async () => {
    //   const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
    //   const data = await res.json();
    //   if (!data.valid) {
    //     router.push('/pricing');
    //   }
    // };
    // verifySession();

    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="h-20 w-20 text-green-500" />
        </motion.div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mt-4 max-w-md text-lg">
          Thank you for subscribing to MockAPI. Your account has been upgraded
          and you now have access to all premium features.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
