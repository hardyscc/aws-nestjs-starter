import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  static ACTIVE = 'Active';
  static DELETED = 'Deleted';

  @Field(() => ID)
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
