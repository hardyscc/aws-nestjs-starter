import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationController } from './controller/notification.controller';
import { NotificationResolver } from './resolver/notification.resolver';
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
  providers: [NotificationService, NotificationResolver],
  controllers: [NotificationController],
})
export class NotificationModule {}
