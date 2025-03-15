import { Item } from 'nestjs-dynamoose';

import { Test, TestingModule } from '@nestjs/testing';

import { NotificationStatus } from '../model/notification.enum';
import { NotificationService } from '../service/notification.service';
import { NotificationTestImports } from '../test/notification-test.imports';
import { NotificationResolver } from './notification.resolver';

const notificationJson = [
  {
    targetId: 'device21',
    userId: 'user21',
    content: 'Hello',
  },
  {
    targetId: 'device22',
    userId: 'user21',
    content: 'Hello',
  },
  {
    targetId: 'device23',
    userId: 'user22',
    content: 'Hello',
  },
];

let resolver: NotificationResolver;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: NotificationTestImports,
    providers: [NotificationService, NotificationResolver],
  }).compile();

  resolver = module.get<NotificationResolver>(NotificationResolver);
});

describe('Notification Resolver', () => {
  let notifications: Item<Notification>[] = [];

  beforeAll(async () => {
    // create notification records
    notifications = await Promise.all(
      notificationJson.map(
        async (input) => (await resolver.createNotification(input)) as any,
      ),
    );
  });

  afterAll(async () => {
    // create notification records
    await Promise.all(
      notifications.map(
        async (notification) =>
          await resolver.deleteNotification(notification.toJSON().id),
      ),
    );
  });

  it('find by userId or targetId', async () => {
    // test findByUserId and findByTargetId
    expect(await resolver.notificationByUserId('mary')).toHaveLength(0);
    expect(await resolver.notificationByUserId('user21')).toHaveLength(2);
    expect(await resolver.notificationByTargetId('iphone')).toHaveLength(0);
  });

  it('update status', async () => {
    const notifications = await resolver.notificationByTargetId('device21');
    expect(notifications).toHaveLength(1);
    expect(notifications[0].status).toBe(NotificationStatus.Active);

    const updated = await resolver.updateNotification(notifications[0].id, {
      status: NotificationStatus.Deleted,
    });
    expect(updated).toBeDefined();
    expect(updated.status).toBe(NotificationStatus.Deleted);
  });

  it('find by id', async () => {
    const notifications = await resolver.notificationByTargetId('device23');
    expect(notifications).toHaveLength(1);

    const notification = await resolver.notification(notifications[0].id);
    expect(notification).toBeDefined();
    expect(notification.id).toBe(notifications[0].id);
  });
});
