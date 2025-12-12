'use server';

import { stripe } from '@/lib/stripe';

export async function verifyStripeSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status !== 'complete' && session.payment_status !== 'paid') {
      return { success: false, error: 'Payment not completed' };
    }

    return { success: true, customerId: session.customer };
  } catch (error) {
    console.error('Verify Error:', error);
    return { success: false, error: 'Verification failed' };
  }
}
