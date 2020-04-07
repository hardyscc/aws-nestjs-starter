import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as uuid from 'uuid';
import { CreateNotificationInput } from '../model/create-notification.input';
import { Notification, NotificationKey } from '../model/notification.model';
import { UpdateNotificationInput } from '../model/update-notification.input';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private model: Model<Notification, NotificationKey>,
  ) {}

  create(input: CreateNotificationInput) {
    return this.model.create({
      ...input,
      id: uuid.v4(),
      status: Notification.ACTIVE,
      createAt: new Date().toISOString(),
    });
  }

  update(key: NotificationKey, input: UpdateNotificationInput) {
    return this.model.update(key, input);
  }

  find() {
    return this.model.scan().exec();
  }

  findByTargetId(targetId: string) {
    return this.model
      .query()
      .using('targetIdGlobalIndex')
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
