import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationInput {
  @IsNotEmpty()
  @IsString()
  targetId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
