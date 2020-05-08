import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CreateNotificationInput } from './create-notification.input';

export type NotificationKey = {
  id: string;
};

@ObjectType({ implements: CreateNotificationInput })
export class Notification extends CreateNotificationInput {
  static ACTIVE = 'Active';
  static DELETED = 'Deleted';

  @Field(/* istanbul ignore next */ () => ID)
  id: string;

  status: string;

  @Field()
  createAt: string;
}
