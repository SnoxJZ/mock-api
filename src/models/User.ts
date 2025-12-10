import { Document, model, models, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  overageSubscriptionItemId?: string;
  subscriptionStatus:
    | 'free'
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'
    | 'paused';
  subscriptionPlan: 'free' | 'pro' | 'team';
  trialUsed: boolean;
  usageCount: number;
  currentPeriodEnd?: Date;
  currentPeriodStart?: Date;
  cancelAtPeriodEnd: boolean;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  stripeCustomerId: { type: String, unique: true, sparse: true },
  subscriptionId: { type: String },

  overageSubscriptionItemId: { type: String },

  subscriptionStatus: {
    type: String,
    default: 'free',
    enum: [
      'free',
      'incomplete',
      'incomplete_expired',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'paused',
    ],
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'pro', 'team'],
    default: 'free',
  },
  trialUsed: { type: Boolean, default: false },
  usageCount: { type: Number, default: 0 },

  currentPeriodEnd: { type: Date },
  currentPeriodStart: { type: Date },
  cancelAtPeriodEnd: { type: Boolean, default: false },
});

const User = models.User || model<IUser>('User', UserSchema);
export default User;
