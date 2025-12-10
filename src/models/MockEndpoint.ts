import { model, models, Schema } from 'mongoose';

const MockEndpointSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  path: { type: String, required: true },
  method: { type: String, default: 'GET' },
  responseBody: { type: Object, default: {} },
  statusCode: { type: Number, default: 200 },
  delay: { type: Number, default: 0 },
});

const MockEndpoint =
  models.MockEndpoint || model('MockEndpoint', MockEndpointSchema);
export default MockEndpoint;
