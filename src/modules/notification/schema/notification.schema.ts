import { Schema } from 'dynamoose';

export const NotificationSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  targetId: {
    type: String,
    index: {
      type: 'global',
      rangeKey: 'status',
    },
  },
  userId: {
    type: String,
    index: {
      type: 'global',
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
});
