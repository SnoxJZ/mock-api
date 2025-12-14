import { createCheckoutSession } from './checkout';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import User from '@/models/User';

const mocks = vi.hoisted(() => {
  return {
    sessionsCreate: vi.fn().mockResolvedValue({ url: 'https://fake-url.com' }),
    customersCreate: vi.fn().mockResolvedValue({ id: 'cus_fake' }),
  };
});

vi.mock('@/lib/stripe', () => {
  return {
    stripe: {
      checkout: {
        sessions: {
          create: mocks.sessionsCreate,
        },
      },
      customers: {
        create: mocks.customersCreate,
      },
    },
  };
});
vi.mock('@/lib/dbConnect', () => ({ default: vi.fn() }));
vi.mock('@/models/User', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

describe('createCheckoutSession Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('STRIPE_TRIAL_ACCESS_FEE', 'price_trial_fee');
    vi.stubEnv('STRIPE_MONTHLY_PRICE', 'price_monthly');
    vi.stubEnv('STRIPE_YEARLY_PRICE', 'price_yearly');
    vi.stubEnv('STRIPE_OVERAGE_PRICE', 'price_overage');
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should include Trial Fee and Trial Days if trial NOT used', async () => {
    const mockSave = vi.fn();
    vi.mocked(User.findOne).mockResolvedValue({
      _id: 'user_123',
      email: 'test@example.com',
      subscriptionStatus: 'free',
      trialUsed: false,
      stripeCustomerId: null,
      save: mockSave,
    });

    const res = await createCheckoutSession(false);

    expect(mocks.customersCreate).toHaveBeenCalledWith({
      email: 'test@example.com',
      metadata: { userId: 'user_123' },
    });

    expect(mockSave).toHaveBeenCalledTimes(1);

    expect(mocks.sessionsCreate).toHaveBeenCalledTimes(1);

    const callArgs = mocks.sessionsCreate.mock.calls[0][0];

    expect(callArgs.customer).toEqual('cus_fake');

    expect(callArgs.line_items).toHaveLength(3);
    expect(callArgs.line_items).toEqual([
      { price: 'price_trial_fee', quantity: 1 },
      { price: 'price_monthly', quantity: 1 },
      { price: 'price_overage' },
    ]);

    expect(callArgs.metadata.userId).toEqual('user_123');

    expect(callArgs.subscription_data.trial_period_days).toBe(15);

    expect(callArgs.success_url).toContain('/success');

    expect(res).toEqual({ url: 'https://fake-url.com' });
  });

  it('should NOT include Trial Fee and Trial Days if trial WAS used', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      _id: 'user_123',
      email: 'test@example.com',
      subscriptionStatus: 'free',
      trialUsed: true,
      stripeCustomerId: 'cus_existing',
    });

    const res = await createCheckoutSession(false);

    expect(mocks.customersCreate).not.toHaveBeenCalled();
    expect(mocks.sessionsCreate).toHaveBeenCalledTimes(1);

    const callArgs = mocks.sessionsCreate.mock.calls[0][0];

    expect(callArgs.customer).toEqual('cus_existing');

    expect(callArgs.line_items).toHaveLength(2);
    expect(callArgs.line_items).toEqual([
      { price: 'price_monthly', quantity: 1 },
      { price: 'price_overage' },
    ]);

    expect(callArgs.metadata.userId).toEqual('user_123');

    expect(callArgs.success_url).toContain('/success');

    expect(callArgs.subscription_data).toEqual({
      metadata: {
        userId: 'user_123',
      },
    });

    expect(res).toEqual({ url: 'https://fake-url.com' });
  });

  it('should use Yearly price if isYearly is true', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      _id: 'user_123',
      email: 'test@example.com',
      subscriptionStatus: 'free',
      trialUsed: true,
      stripeCustomerId: 'cus_existing',
    });

    await createCheckoutSession(true);

    const callArgs = mocks.sessionsCreate.mock.calls[0][0];

    expect(callArgs.line_items[0]).toEqual({
      price: 'price_yearly',
      quantity: 1,
    });
  });

  it('should throw error if user is already subscribed', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      email: 'test@example.com',
      subscriptionStatus: 'active',
    });

    await expect(createCheckoutSession(false)).rejects.toThrow(
      'You are already subscribed',
    );
  });

  it('should throw error if user does not exist', async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);

    await expect(createCheckoutSession(false)).rejects.toThrow(
      'User not found',
    );
  });
});
