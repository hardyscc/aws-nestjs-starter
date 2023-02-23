import { IsEnum, IsIn } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

import { NotificationStatus } from './notification.enum';

@InputType()
export class UpdateNotificationInput {
  @IsIn([NotificationStatus.Deleted])
  @IsEnum(NotificationStatus)
  @Field(/* istanbul ignore next */ () => NotificationStatus)
  status: NotificationStatus;
}
