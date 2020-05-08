import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateNotificationInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  content: string;
}
