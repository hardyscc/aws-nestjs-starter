import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType, InterfaceType } from '@nestjs/graphql';

@InputType()
@InterfaceType('BaseNotification')
export class CreateNotificationInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  targetId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  content: string;
}
