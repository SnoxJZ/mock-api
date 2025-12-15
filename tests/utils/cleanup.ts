import mongoose from 'mongoose';

import { stripe } from '../../src/lib/stripe';
import User from '../../src/models/User';

export async function resetTestUser(email: string) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }

  const user = await User.findOne({ email });

  if (user?.stripeCustomerId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
    });
    for (const sub of subscriptions.data) {
      await stripe.subscriptions.cancel(sub.id);
    }
    await stripe.customers.del(user.stripeCustomerId);
  }

  if (user) {
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          subscriptionStatus: 'free',
          subscriptionPlan: 'free',
          trialUsed: false,
          usageCount: 0,
          cancelAtPeriodEnd: false,
        },
        $unset: {
          stripeCustomerId: '',
          subscriptionId: '',
          overageSubscriptionItemId: '',
          currentPeriodStart: '',
          currentPeriodEnd: '',
        },
      },
    );
  }
}
