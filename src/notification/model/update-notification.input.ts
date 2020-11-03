import { IsEnum, IsIn } from 'class-validator';
import { NotificationStatus } from './notification.enum';

export class UpdateNotificationInput {
  @IsIn([NotificationStatus.Deleted])
  @IsEnum(NotificationStatus)
  status: NotificationStatus;
}
