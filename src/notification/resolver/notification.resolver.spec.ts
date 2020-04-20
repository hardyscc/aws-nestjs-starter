import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationSchema } from '../schema/notification.schema';
import { NotificationService } from '../service/notification.service';
import { NotificationResolver } from './notification.resolver';

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
        ConfigModule.forRoot(),
        GraphQLModule.forRoot({
          autoSchemaFile: true,
        }),
        DynamooseModule.forRoot({
          local: 'http://localhost:8001',
          aws: { region: 'local' },
          model: {
            create: false,
            prefix: `${process.env.SERVICE}-${process.env.ENV}-`,
          },
        }),
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

    // create three notification records
    await createNotificationWithTest(resolver, 'device1', 'hardys', 'Hello');
    await createNotificationWithTest(resolver, 'device2', 'hardys', 'Hello');
    await createNotificationWithTest(resolver, 'device3', 'timmy', 'Hello');

    // test findByUserId and findByTargetId
    expect(await resolver.notificationByUserId('mary')).toHaveLength(0);
    expect(await resolver.notificationByUserId('hardys')).toHaveLength(2);
    expect(await resolver.notificationByTargetId('iphone')).toHaveLength(0);

    // find a single record
    const notifications = await resolver.notificationByTargetId('device1');
    expect(notifications).toHaveLength(1);
    expect(notifications[0].content).toBe('Hello');

    // test update
    const updated = await resolver.updateNotification(notifications[0].id, {
      content: 'World',
    });
    expect(updated).toBeDefined();
    expect(updated.content).toBe('World');

    // test findOne
    const notification = await resolver.notification(notifications[0].id);
    expect(notification).toBeDefined();
    expect(notification.id).toBe(notifications[0].id);

    // test findAll
    expect(await resolver.allNotification()).toHaveLength(3);
  });
});
