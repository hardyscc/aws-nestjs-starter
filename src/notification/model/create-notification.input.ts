import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationInput {
  @Field()
  targetId: string;

  @Field()
  userId: string;

  @Field()
  content: string;
}
