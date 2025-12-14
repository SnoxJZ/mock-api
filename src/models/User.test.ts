import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import User from '@/models/User';

let mongoServer: MongoMemoryServer;

describe('User Model Test', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);
  }, 20000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create user with default values', async () => {
    const validUser = {
      email: 'test@example.com',
    };

    const user = await User.create(validUser);

    expect(user.email).toBe('test@example.com');
    expect(user.subscriptionStatus).toBe('free');
    expect(user.subscriptionPlan).toBe('free');
    expect(user.usageCount).toBe(0);
    expect(user.trialUsed).toBe(false);
    expect(user._id).toBeDefined();
  });

  it('should throw error if email is not provided (required)', async () => {
    const invalidUser = {};

    await expect(User.create(invalidUser)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });

  it('should throw validation error for invalid enum', async () => {
    const invalidEnumUser = {
      email: 'enum@test.com',
      subscriptionStatus: 'SUPER_VIP',
    };

    await expect(User.create(invalidEnumUser)).rejects.toThrow();
  });

  it('should correctly save stripe fields (sparse index)', async () => {
    await User.create({
      email: 'user1@test.com',
      stripeCustomerId: 'cus_123',
    });

    await expect(
      User.create({
        email: 'user2@test.com',
        stripeCustomerId: 'cus_123',
      }),
    ).rejects.toThrow(/duplicate key/);
  });
});
