import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsIn } from 'class-validator';
import { NotificationStatus } from './authentication.enum';

@InputType()
export class UpdateAuthenticationInput {
  @IsIn([NotificationStatus.Deleted])
  @IsEnum(NotificationStatus)
  @Field(/* istanbul ignore next */ () => NotificationStatus)
  status: NotificationStatus;
}
