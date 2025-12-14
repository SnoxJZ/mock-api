import { NextRequest } from 'next/server';

import { POST } from './route';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { stripe } from '@/lib/stripe';
import User from '@/models/User';

const mocks = vi.hoisted(() => {
  return {
    constructEvent: vi.fn(),
    subscriptionsRetrieve: vi.fn(),
  };
});

vi.mock('@/lib/dbConnect', () => ({ default: vi.fn() }));
vi.mock('@/models/User', () => ({
  default: {
    findById: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: mocks.constructEvent,
    },
    subscriptions: {
      retrieve: mocks.subscriptionsRetrieve,
    },
  },
}));

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test_secret');
    vi.stubEnv('STRIPE_MONTHLY_PRICE', 'price_monthly_pro');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('checkout.session.completed', () => {
    it('should update user status on checkout.session.completed', async () => {
      const userId = 'user_mongo_id_123';
      const subscriptionId = 'sub_123';
      const customerId = 'cus_123';
      const overageItemId = 'si_metered_123';
      const flatItemId = 'si_flat_123';

      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        save: vi.fn(),
        subscriptionId: undefined,
        stripeCustomerId: undefined,
        trialUsed: false,
        subscriptionStatus: 'free',
        overageSubscriptionItemId: undefined,
        subscriptionPlan: 'free',
        currentPeriodStart: undefined,
        currentPeriodEnd: undefined,
      };

      vi.mocked(User.findById).mockResolvedValue(mockUser);

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            customer: customerId,
            subscription: subscriptionId,
            metadata: { userId: userId },
          },
        },
      } as any);

      vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
        id: subscriptionId,
        status: 'trialing',
        items: {
          data: [
            {
              id: flatItemId,
              price: { id: 'price_monthly_pro' },
              current_period_start: 1700000000,
              current_period_end: 1700000000 + 86400 * 30,
            },
            {
              id: overageItemId,
              price: {
                id: 'price_metered',
                recurring: { usage_type: 'metered' },
              },
            },
          ],
        },
      } as any);

      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'raw_stripe_body',
        headers: {
          'stripe-signature': 'dummy_signature',
        },
      });

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mocks.constructEvent).toHaveBeenCalled();
      const json = await response.json();
      expect(json).toEqual({ received: true });

      expect(User.findById).toHaveBeenCalledWith(userId);

      expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith(
        subscriptionId,
      );

      expect(mockUser.save).toHaveBeenCalled();

      expect(mockUser.stripeCustomerId).toBe(customerId);
      expect(mockUser.subscriptionId).toBe(subscriptionId);
      expect(mockUser.trialUsed).toBe(true);
      expect(mockUser.subscriptionStatus).toBe('trialing');
      expect(mockUser.subscriptionPlan).toBe('pro');
      expect(mockUser.overageSubscriptionItemId).toBe(overageItemId);
      expect(mockUser.currentPeriodStart).toBeInstanceOf(Date);
      expect(mockUser.currentPeriodEnd).toBeInstanceOf(Date);
    });

    it('should return 400 on signature error', async () => {
      vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'bad_body',
        headers: { 'stripe-signature': 'bad_sig' },
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe('customer.subscription.updated', () => {
    it('should reset usageCount if a new billing period starts', async () => {
      const customerId = 'cus_existing_123';
      const subscriptionId = 'sub_existing_123';

      const oldStart = new Date('2025-10-01');
      const oldEnd = new Date('2025-11-01');
      const newStartTimestamp = Math.floor(
        new Date('2025-11-01').getTime() / 1000,
      );
      const newEndTimestamp = Math.floor(
        new Date('2025-12-01').getTime() / 1000,
      );

      const mockUser = {
        save: vi.fn(),
        stripeCustomerId: customerId,
        currentPeriodStart: oldStart,
        currentPeriodEnd: oldEnd,
        usageCount: 500,
        subscriptionStatus: 'active',
        subscriptionPlan: 'pro',
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser);

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: subscriptionId,
            customer: customerId,
            status: 'active',
            cancel_at_period_end: false,
            items: {
              data: [
                {
                  price: { id: 'price_monthly_pro' },
                  current_period_start: newStartTimestamp,
                  current_period_end: newEndTimestamp,
                },
              ],
            },
          },
        },
      } as any);

      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'raw',
        headers: { 'stripe-signature': 'sig' },
      });

      await POST(req);

      expect(User.findOne).toHaveBeenCalledWith({
        stripeCustomerId: customerId,
      });
      expect(mockUser.usageCount).toBe(0);

      expect(mockUser.currentPeriodStart).toEqual(
        new Date(newStartTimestamp * 1000),
      );
      expect(mockUser.currentPeriodEnd).toEqual(
        new Date(newEndTimestamp * 1000),
      );
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should NOT reset usageCount if period is the same', async () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);

      const mockUser = {
        save: vi.fn(),
        usageCount: 100,
        currentPeriodStart: new Date(currentTimestamp * 1000),
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser);

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
        type: 'customer.subscription.updated',
        data: {
          object: {
            items: {
              data: [
                {
                  price: { id: 'any' },
                  current_period_start: currentTimestamp,
                  current_period_end: currentTimestamp + 86400,
                },
              ],
            },
          },
        },
      } as any);

      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'raw',
        headers: { 'stripe-signature': 'sig' },
      });
      await POST(req);

      expect(mockUser.usageCount).toBe(100);
    });

    it('should update user status if subscription is canceled', async () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);

      const mockUser = {
        save: vi.fn(),
        subscriptionStatus: 'active',
        subscriptionId: 'sub_123',
        overageSubscriptionItemId: 'si_123',
        cancelAtPeriodEnd: false,
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser);

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
        type: 'customer.subscription.updated',
        data: {
          object: {
            customer: 'cus_123',
            status: 'active',
            cancel_at_period_end: false,
            cancel_at: currentTimestamp + 86400,
            items: {
              data: [
                {
                  price: { id: 'any' },
                  current_period_start: currentTimestamp,
                  current_period_end: currentTimestamp + 86400,
                },
              ],
            },
          },
        },
      } as any);

      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'raw',
        headers: { 'stripe-signature': 'sig' },
      });
      await POST(req);

      expect(mockUser.subscriptionStatus).toBe('active');
      expect(mockUser.cancelAtPeriodEnd).toBe(true);
    });
  });

  describe('invoice.payment_failed', () => {
    it('should update subscription status to past_due', async () => {
      const mockUser = {
        save: vi.fn(),
        subscriptionStatus: 'active',
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser);

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
        type: 'invoice.payment_failed',
        data: { object: { customer: 'cus_123' } },
      } as any);

      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'raw',
        headers: { 'stripe-signature': 'sig' },
      });
      await POST(req);

      expect(mockUser.subscriptionStatus).toBe('past_due');
    });
  });

  describe('customer.subscription.deleted', () => {
    it('should mark subscription as canceled', async () => {
      const mockUser = {
        save: vi.fn(),
        subscriptionStatus: 'active',
        subscriptionId: 'sub_123',
        overageSubscriptionItemId: 'si_123',
        cancelAtPeriodEnd: true,
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser);

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
        type: 'customer.subscription.deleted',
        data: { object: { customer: 'cus_123' } },
      } as any);

      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'raw',
        headers: { 'stripe-signature': 'sig' },
      });
      await POST(req);

      expect(mockUser.subscriptionStatus).toBe('canceled');
      expect(mockUser.subscriptionId).toBeUndefined();
      expect(mockUser.overageSubscriptionItemId).toBeUndefined();
      expect(mockUser.cancelAtPeriodEnd).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
