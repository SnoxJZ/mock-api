import { verifyStripeSession } from './verify-session';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    sessionsRetrieve: vi.fn().mockResolvedValue({
      status: 'complete',
      payment_status: 'paid',
      customer: 'cus_123',
    }),
  };
});

vi.mock('@/lib/stripe', () => {
  return {
    stripe: {
      checkout: {
        sessions: {
          retrieve: mocks.sessionsRetrieve,
        },
      },
    },
  };
});

describe('verifyStripeSession Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should verify a valid session', async () => {
    const result = await verifyStripeSession('session_123');
    expect(result).toEqual({ success: true, customerId: 'cus_123' });
  });

  it('should return false if session is not complete', async () => {
    mocks.sessionsRetrieve.mockResolvedValueOnce({
      status: 'incomplete',
      payment_status: 'paid',
      customer: 'cus_123',
    });

    const result = await verifyStripeSession('session_123');
    expect(result).toEqual({ success: false, error: 'Payment not completed' });
  });

  it('should throw error if sessionID is empty', async () => {
    const result = await verifyStripeSession('');
    expect(mocks.sessionsRetrieve).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: 'Session ID is required' });
  });

  it('should throw error if Stripe API fails', async () => {
    mocks.sessionsRetrieve.mockRejectedValueOnce(new Error('Stripe API Error'));

    const result = await verifyStripeSession('invalid-session-id');
    expect(result).toEqual({ success: false, error: 'Verification failed' });
  });
});
