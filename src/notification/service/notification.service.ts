import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as uuid from 'uuid';
import { CreateNotificationInput } from '../model/create-notification.input';
import { Notification } from '../model/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private model: Model<Notification, string>,
  ) {}

  create(input: CreateNotificationInput) {
    return this.model.create({
      ...input,
      id: uuid.v4(),
      status: Notification.ACTIVE,
      createAt: new Date().toISOString(),
    });
  }

  findByTargetId(targetId: string) {
    return this.model
      .query()
      .using('targetIdLocalIndex')
      .where('targetId')
      .eq(targetId)
      .where('status')
      .eq(Notification.ACTIVE)
      .exec();
  }

  findByUserId(userId: string) {
    return this.model
      .query()
      .using('userIdGlobalIndex')
      .where('userId')
      .eq(userId)
      .where('status')
      .eq(Notification.ACTIVE)
      .exec();
  }
}
