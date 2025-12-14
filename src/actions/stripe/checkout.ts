'use server';

import Stripe from 'stripe';

import dbConnect from '@/lib/dbConnect';
import { stripe } from '@/lib/stripe';
import User, { IUser } from '@/models/User';

export async function createCheckoutSession(isYearly: boolean) {
  // TODO: Get email from session later (e.g., const session = await auth(); email = session.user.email)
  const email = 'joleneunited@tiffincrane.com';

  try {
    await dbConnect();

    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    if (
      user.subscriptionStatus === 'active' ||
      user.subscriptionStatus === 'trialing'
    ) {
      throw new Error('You are already subscribed');
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const subscription_data: Stripe.Checkout.SessionCreateParams.SubscriptionData =
      {
        metadata: { userId: user._id.toString() },
      };

    if (!user.trialUsed) {
      subscription_data.trial_period_days = 15;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        ...(user.trialUsed
          ? []
          : [{ price: process.env.STRIPE_TRIAL_ACCESS_FEE!, quantity: 1 }]),
        {
          price: isYearly
            ? process.env.STRIPE_YEARLY_PRICE!
            : process.env.STRIPE_MONTHLY_PRICE!,
          quantity: 1,
        },
        {
          price: process.env.STRIPE_OVERAGE_PRICE!,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=true#pricing`,
      metadata: {
        userId: user._id.toString(),
      },
      subscription_data,
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    return { url: session.url };
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Internal Server Error',
    );
  }
}
