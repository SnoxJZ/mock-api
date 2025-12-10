import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { stripe } from '@/lib/stripe';
import User, { IUser } from '@/models/User';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, isYearly }: { email: string; isYearly: boolean } = body;

  await dbConnect();

  const user: IUser | null = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

  const subscription_data: any = {
    metadata: { userId: user._id.toString() },
  };

  if (!user.trialUsed) {
    subscription_data.trial_period_days = 14;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
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
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pricing`,

      metadata: {
        userId: user._id.toString(),
      },
      subscription_data,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
