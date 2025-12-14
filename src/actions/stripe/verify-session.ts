'use server';

import { stripe } from '@/lib/stripe';

export async function verifyStripeSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, error: 'Session ID is required' };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isPaid =
      session.payment_status === 'paid' ||
      session.payment_status === 'no_payment_required';

    if (session.status !== 'complete' || !isPaid) {
      return { success: false, error: 'Payment not completed' };
    }

    return { success: true, customerId: session.customer };
  } catch (error) {
    console.error('Verify Error:', error);
    return { success: false, error: 'Verification failed' };
  }
}
