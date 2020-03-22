import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateNotificationInput {
  @Field()
  targetId: string;

  @Field()
  userId: string;

  @Field()
  content: string;
}
