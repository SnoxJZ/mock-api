import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import MockEndpoint from '@/models/MockEndpoint';

let mongoServer: MongoMemoryServer;

describe('MockEndpoint Model Test', () => {
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
    await MockEndpoint.deleteMany({});
  });

  it('should create endpoint with default values', async () => {
    const validEndpoint = {
      ownerId: new mongoose.Types.ObjectId(),
      path: '/test',
    };

    const endpoint = await MockEndpoint.create(validEndpoint);

    expect(endpoint.ownerId).toBeDefined();
    expect(endpoint.path).toBe('/test');
    expect(endpoint.method).toBe('GET');
    expect(endpoint.responseBody).toEqual({});
    expect(endpoint.statusCode).toBe(200);
    expect(endpoint.delay).toBe(0);
  });

  it('should throw validation error if required fields are missing', async () => {
    const invalidEndpoint = {};

    await expect(MockEndpoint.create(invalidEndpoint)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });

  it('should throw validation error for invalid field type', async () => {
    const invalidEndpoint = {
      ownerId: new mongoose.Types.ObjectId(),
      path: '/test',
      statusCode: 'not-a-number',
      delay: true,
    };

    await expect(MockEndpoint.create(invalidEndpoint)).rejects.toThrow();
  });

  it('should throw error for invalid HTTP method', async () => {
    const invalidMethodEndpoint = {
      ownerId: new mongoose.Types.ObjectId(),
      path: '/test',
      method: 'INVALID_METHOD',
    };

    await expect(MockEndpoint.create(invalidMethodEndpoint)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});
