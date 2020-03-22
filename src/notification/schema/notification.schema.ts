import { Schema } from 'dynamoose';
import { SchemaAttributes } from 'nestjs-dynamoose';

const schemaAttributes: SchemaAttributes = {
  id: String,
  targetId: {
    type: String,
    hashKey: true,
    index: {
      name: 'targetIdLocalIndex',
      rangeKey: 'status',
    },
  },
  userId: {
    type: String,
    index: {
      name: 'userIdGlobalIndex',
      global: true,
      rangeKey: 'status',
    },
  },
  content: String,
  status: {
    type: String,
  },
  createAt: {
    type: String,
    rangeKey: true,
  },
};

export const NotificationSchema = new Schema(schemaAttributes);
