import { NextRequest, NextResponse } from 'next/server';

import Stripe from 'stripe';

import dbConnect from '@/lib/dbConnect';
import { stripe } from '@/lib/stripe';
import User, { IUser } from '@/models/User';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  if (endpointSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err: any) {
      console.error('⚠️ Webhook signature verification failed.', err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  } else {
    return NextResponse.json(
      { error: 'Invalid signature or endpoint secret' },
      { status: 400 },
    );
  }

  await dbConnect();

  const getPeriodDates = (sub: Stripe.Subscription) => {
    const item = sub.items.data[0];
    if (!item) return { start: undefined, end: undefined };

    return {
      start: new Date(item.current_period_start * 1000),
      end: new Date(item.current_period_end * 1000),
    };
  };

  const getPlanType = (items: Stripe.SubscriptionItem[]) => {
    const isPro = items.some(
      (item) => item.price.id === process.env.STRIPE_MONTHLY_PRICE,
    );
    return isPro ? 'pro' : 'team';
  };

  switch (event?.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (!userId) {
        console.error('No userId in metadata');
        break;
      }

      const user: IUser | null = await User.findById(userId);
      if (!user) {
        console.error('User not found in DB');
        break;
      }

      const subscriptionId = session.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      user.subscriptionId = subscriptionId;
      user.stripeCustomerId = session.customer as string;
      user.trialUsed = true;
      user.subscriptionStatus = subscription.status;
      user.subscriptionPlan = getPlanType(subscription.items.data);

      const meteredItem = subscription.items.data.find(
        (item) => item.price.recurring?.usage_type === 'metered',
      );
      if (meteredItem) {
        user.overageSubscriptionItemId = meteredItem.id;
      }

      const { start, end } = getPeriodDates(subscription);
      user.currentPeriodStart = start;
      user.currentPeriodEnd = end;

      await user.save();
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      let user = await User.findOne({
        stripeCustomerId: subscription.customer,
      });

      if (!user && subscription.metadata?.userId) {
        user = await User.findById(subscription.metadata.userId);
        if (user) {
          user.stripeCustomerId = subscription.customer as string;
        }
      }

      if (!user) {
        console.error('User not found for subscription:', subscription.id);
        break;
      }

      const { start: newPeriodStart, end: newPeriodEnd } =
        getPeriodDates(subscription);

      if (
        user.currentPeriodStart &&
        newPeriodStart &&
        user.currentPeriodStart < newPeriodStart
      ) {
        user.usageCount = 0;
      }

      user.currentPeriodStart = newPeriodStart;
      user.currentPeriodEnd = newPeriodEnd;
      user.subscriptionStatus = subscription.status;
      user.cancelAtPeriodEnd =
        subscription.cancel_at_period_end || subscription.cancel_at !== null;

      user.subscriptionPlan = getPlanType(subscription.items.data);
      const meteredItem = subscription.items.data.find(
        (item) => item.price.recurring?.usage_type === 'metered',
      );
      if (meteredItem) {
        user.overageSubscriptionItemId = meteredItem.id;
      }
      await user.save();
      break;
    }
    case 'invoice.payment_succeeded':
      break;
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const user = await User.findOne({ stripeCustomerId: invoice.customer });

      if (user) {
        user.subscriptionStatus = 'past_due';
        await user.save();
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const user = await User.findOne({
        stripeCustomerId: subscription.customer,
      });

      if (user) {
        user.subscriptionStatus = 'canceled';
        user.subscriptionId = undefined;
        user.overageSubscriptionItemId = undefined;
        user.cancelAtPeriodEnd = false;
        await user.save();
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
