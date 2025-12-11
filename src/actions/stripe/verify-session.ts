'use server';

import dbConnect from '@/lib/dbConnect';
import { stripe } from '@/lib/stripe';
import User, { IUser } from '@/models/User';

export async function verifyStripeSession(sessionId: string) {
  try {
    await dbConnect();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return { success: false, error: 'Payment not completed' };
    }

    const user: IUser | null = await User.findOne({
      stripeCustomerId: session.customer,
    });

    if (user && user.subscriptionStatus !== 'active') {
      user.subscriptionStatus = 'active';
      await user.save();
    }

    return { success: true };
  } catch (error) {
    console.error('Verify Error:', error);
    return { success: false, error: 'Verification failed' };
  }
}
