import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationResolver } from './resolver/notification.resolver';
import { NotificationSchema } from './schema/notification.schema';
import { NotificationService } from './service/notification.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Notification',
        schema: NotificationSchema,
      },
    ]),
  ],
  providers: [NotificationService, NotificationResolver],
})
export class NotificationModule {}
