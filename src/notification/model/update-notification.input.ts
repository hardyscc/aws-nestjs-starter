import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput {
  @Field()
  content: string;
}
