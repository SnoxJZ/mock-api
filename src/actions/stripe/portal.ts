'use server';

import { redirect } from 'next/navigation';

import dbConnect from '@/lib/dbConnect';
import { stripe } from '@/lib/stripe';
import User, { IUser } from '@/models/User';

export async function createPortalSession() {
  // TODO: Get email from session later (e.g., const session = await auth(); email = session.user.email)
  const email = 'joleneunited@tiffincrane.com';

  try {
    await dbConnect();

    const user: IUser | null = await User.findOne({ email });

    if (!user || !user.stripeCustomerId) {
      throw new Error('User has no stripe id');
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    redirect(portalSession.url);
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    throw new Error(
      error instanceof Error ? error.message : 'Internal Server Error',
    );
  }
}
