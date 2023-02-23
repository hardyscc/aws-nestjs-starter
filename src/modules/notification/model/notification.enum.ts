import { registerEnumType } from '@nestjs/graphql';

enum NotificationStatus {
  Active = 'Active',
  Deleted = 'Deleted',
}

registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
});

export { NotificationStatus };
