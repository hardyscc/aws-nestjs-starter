import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CreateNotificationInput } from './create-notification.input';
import { NotificationStatus } from './notification.enum';

export type NotificationKey = {
  id: string;
};

@ObjectType({ implements: CreateNotificationInput })
export class Notification extends CreateNotificationInput {
  @Field(/* istanbul ignore next */ () => ID)
  id: string;

  @Field(/* istanbul ignore next */ () => NotificationStatus)
  status: NotificationStatus;

  @Field()
  createAt: string;
}
