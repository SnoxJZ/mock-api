import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CheckCircle, XCircle } from 'lucide-react';
import * as Motion from 'motion/react-client';

import { createPortalSession } from '@/actions/stripe/portal';
import { verifyStripeSession } from '@/actions/stripe/verify-session';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect('/#pricing');
  }

  const result = await verifyStripeSession(session_id);

  if (!result.success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <XCircle className="text-destructive mb-4 h-20 w-20" />
        <h1 className="text-2xl font-bold">Payment Verification Failed</h1>
        <p className="text-muted-foreground mt-2">
          We couldn't verify your payment. Please contact support.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Error: {result.error}
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/#pricing">Back to Pricing</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <Motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="h-20 w-20 text-green-500" />
        </Motion.div>

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
          <form action={createPortalSession}>
            <Button
              variant="outline"
              size="lg"
              type="submit"
              data-testid="manage-billing-button"
            >
              Manage your billing information
            </Button>
          </form>
        </div>
      </Motion.div>
    </main>
  );
}
