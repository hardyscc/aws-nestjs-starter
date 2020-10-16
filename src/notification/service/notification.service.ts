import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as uuid from 'uuid';
import { CreateNotificationInput } from '../model/create-notification.input';
import { NotificationStatus } from '../model/notification.enum';
import { Notification, NotificationKey } from '../model/notification.model';
import { UpdateNotificationInput } from '../model/update-notification.input';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('notification')
    private readonly model: Model<Notification, NotificationKey>,
  ) {}

  create(input: CreateNotificationInput) {
    return this.model.create({
      ...input,
      id: uuid.v4(),
      status: NotificationStatus.Active,
      createAt: new Date().toISOString(),
    });
  }

  update(key: NotificationKey, input: UpdateNotificationInput) {
    return this.model.update(key, input);
  }

  findOne(key: NotificationKey) {
    return this.model.get(key);
  }

  findByTargetId(targetId: string) {
    return this.model
      .query('targetId')
      .eq(targetId)
      .where('status')
      .eq(NotificationStatus.Active)
      .exec();
  }

  findByUserId(userId: string) {
    return this.model
      .query('userId')
      .eq(userId)
      .where('status')
      .eq(NotificationStatus.Active)
      .exec();
  }
}
