import { Item } from 'nestjs-dynamoose';

import { Test, TestingModule } from '@nestjs/testing';

import { NotificationStatus } from '../model/notification.enum';
import { NotificationService } from '../service/notification.service';
import { NotificationTestImports } from '../test/notification-test.imports';
import { NotificationController } from './notification.controller';
import notificationJson from './notification.data.json';

let controller: NotificationController;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: NotificationTestImports,
    providers: [NotificationService],
    controllers: [NotificationController],
  }).compile();

  controller = module.get<NotificationController>(NotificationController);
});

describe('Notification Controller', () => {
  let notifications: Item<Notification>[] = [];

  beforeAll(async () => {
    notifications = await Promise.all(
      notificationJson.map(
        async (input) => await controller.create(input),
      ) as any,
    );
  });

  afterAll(async () => {
    await Promise.all(
      notifications.map(
        async (notification) =>
          await controller.delete(notification.toJSON().id),
      ),
    );
  });

  it('find by userId or targetId', async () => {
    // test findByUserId and findByTargetId
    expect(await controller.find({ userId: 'mary' })).toHaveLength(0);
    expect(await controller.find({ userId: 'user12' })).toHaveLength(1);
    expect(await controller.find({ targetId: 'iphone' })).toHaveLength(0);
  });

  it('update status', async () => {
    const notifications = await controller.find({ targetId: 'device12' });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].status).toBe(NotificationStatus.Active);

    const updated = await controller.update(notifications[0].id, {
      status: NotificationStatus.Deleted,
    });
    expect(updated).toBeDefined();
    expect(updated.status).toBe(NotificationStatus.Deleted);
  });

  it('find by id', async () => {
    const notifications = await controller.find({ targetId: 'device13' });
    expect(notifications).toHaveLength(1);

    const notification = await controller.findOne(notifications[0].id);
    expect(notification).toBeDefined();
    expect(notification.id).toBe(notifications[0].id);
  });

  it('find by id (not found)', async () => {
    let error = null;
    try {
      await controller.findOne('dummyid');
    } catch (e) {
      error = e;
    }
    expect(error).toMatchObject({ status: 404 });
  });

  it('find by userId and targetId (bad request)', async () => {
    let error = null;
    try {
      await controller.find({ targetId: 'device01', userId: 'user01' });
    } catch (e) {
      error = e;
    }
    expect(error).toMatchObject({ status: 400 });
  });

  it('find all (bad request)', async () => {
    let error = null;
    try {
      await controller.find({});
    } catch (e) {
      error = e;
    }
    expect(error).toMatchObject({ status: 400 });
  });
});
