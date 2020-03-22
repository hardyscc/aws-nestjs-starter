import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateNotificationInput } from '../model/create-notification.input';
import { Notification } from '../model/notification.entity';
import { NotificationService } from '../service/notification.service';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => Notification)
  createNotification(@Args('input') input: CreateNotificationInput) {
    return this.notificationService.create(input);
  }

  @Query(() => [Notification])
  notification(@Args('userId') userId: string) {
    return this.notificationService.findByUserId(userId);
  }

  @Query(() => [Notification])
  notificationByTarget(@Args('targetId') targetId: string) {
    return this.notificationService.findByTargetId(targetId);
  }
}
