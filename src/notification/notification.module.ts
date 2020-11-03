import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationController } from './controller/notification.controller';
import { NotificationSchema } from './schema/notification.schema';
import { NotificationService } from './service/notification.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'notification',
        schema: NotificationSchema,
      },
    ]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
