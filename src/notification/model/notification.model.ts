import { Field, ID, ObjectType } from '@nestjs/graphql';

export type NotificationKey = {
  id: string;
};

@ObjectType()
export class Notification {
  static ACTIVE = 'Active';
  static DELETED = 'Deleted';

  @Field(/* istanbul ignore next */ () => ID)
  id: string;

  @Field()
  targetId: string;

  @Field()
  userId: string;

  @Field()
  content: string;

  @Field()
  status: string;

  @Field()
  createAt: string;
}
