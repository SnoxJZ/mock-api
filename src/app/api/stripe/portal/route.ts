import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { stripe } from '@/lib/stripe';
import User from '@/models/User';

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  await dbConnect();

  const user = await User.findOne({ email });

  if (!user || !user.stripeCustomerId) {
    return NextResponse.json(
      { error: 'User has no stripe id' },
      { status: 400 },
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  });

  return NextResponse.json({ url: portalSession.url });
}
