import { Schema } from 'dynamoose';
import { SchemaAttributes } from 'nestjs-dynamoose';

const schemaAttributes: SchemaAttributes = {
  id: {
    type: String,
    hashKey: true,
  },
  targetId: {
    type: String,
    index: {
      name: 'targetIdGlobalIndex',
      global: true,
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
  content: {
    type: String,
  },
  status: {
    type: String,
  },
  createAt: {
    type: String,
  },
};

export const NotificationSchema = new Schema(schemaAttributes);
