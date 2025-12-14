import { createPortalSession } from './portal';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import User from '@/models/User';

const mocks = vi.hoisted(() => {
  return {
    sessionsCreate: vi.fn().mockResolvedValue({ url: 'https://fake-url.com' }),
    redirect: vi.fn(),
  };
});

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}));
vi.mock('@/lib/stripe', () => {
  return {
    stripe: {
      billingPortal: {
        sessions: {
          create: mocks.sessionsCreate,
        },
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

describe('createPortalSession Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should create a portal session', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });

    await createPortalSession();

    expect(mocks.sessionsCreate).toHaveBeenCalledWith({
      customer: 'cus_123',
      return_url: 'http://localhost:3000/',
    });

    expect(mocks.redirect).toHaveBeenCalledWith('https://fake-url.com');
  });

  it('should throw error if user is not found', async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);

    await expect(createPortalSession()).rejects.toThrow(
      'User has no stripe id',
    );
  });

  it('should throw error if user has no stripeCustomerId', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      email: 'joleneunited@tiffincrane.com',
    });

    await expect(createPortalSession()).rejects.toThrow(
      'User has no stripe id',
    );
  });

  it('should throw Internal Server Error if stripe fails', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });

    mocks.sessionsCreate.mockRejectedValueOnce(new Error('Stripe API Error'));

    await expect(createPortalSession()).rejects.toThrow('Stripe API Error');
  });

  it('should rethrow NEXT_REDIRECT error', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });

    mocks.redirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(createPortalSession()).rejects.toThrow('NEXT_REDIRECT');
  });
});
