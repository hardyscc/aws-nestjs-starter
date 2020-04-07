import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationSchema } from '../schema/notification.schema';
import { NotificationService } from '../service/notification.service';
import { NotificationResolver } from './notification.resolver';

const dynamooseOptions = {
  local: 'http://localhost:8001',
  aws: { region: 'local' },
};

async function createNotificationWithTest(
  resolver: NotificationResolver,
  targetId: string,
  userId: string,
  content: string,
) {
  const createResult = await resolver.createNotification({
    targetId,
    userId,
    content,
  });
  expect(createResult).toMatchObject({
    targetId,
    userId,
    content,
    status: 'Active',
  });
  expect(createResult.id).toBeDefined();
}

describe('NotificationResolver', () => {
  let resolver: NotificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: true,
        }),
        DynamooseModule.forRoot(dynamooseOptions),
        DynamooseModule.forFeature([
          {
            name: 'Notification',
            schema: NotificationSchema,
          },
        ]),
      ],
      providers: [NotificationService, NotificationResolver],
    }).compile();

    resolver = module.get<NotificationResolver>(NotificationResolver);
  });

  it('success case', async () => {
    expect(resolver).toBeDefined();

    await createNotificationWithTest(resolver, 'device1', 'hardys', 'Hello');
    await createNotificationWithTest(resolver, 'device2', 'hardys', 'Hello');
    await createNotificationWithTest(resolver, 'device3', 'timmy', 'Hello');

    expect(await resolver.notificationByUserId('mary')).toHaveLength(0);
    expect(await resolver.notificationByUserId('hardys')).toHaveLength(2);
    expect(await resolver.notificationByTargetId('iphone')).toHaveLength(0);

    let notifications = await resolver.notificationByTargetId('device1');
    expect(notifications).toHaveLength(1);
    expect(notifications[0].content).toBe('Hello');

    const updated = await resolver.updateNotification(notifications[0].id, {
      content: 'World',
    });
    expect(updated).toBeDefined();
    expect(updated.content).toBe('World');

    notifications = await resolver.notificationByTargetId('device1');
    expect(notifications).toHaveLength(1);
    expect(notifications[0].content).toBe('World');

    expect(await resolver.notification()).toHaveLength(3);
  });
});
