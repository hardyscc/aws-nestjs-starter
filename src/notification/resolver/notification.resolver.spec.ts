import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationSchema } from '../schema/notification.schema';
import { NotificationService } from '../service/notification.service';
import * as notificationJson from './notification.data.json';
import { NotificationResolver } from './notification.resolver';

let resolver: NotificationResolver;

beforeAll(async () => {
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
          prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
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

describe('Notification Resolver', () => {
  beforeAll(async () => {
    expect(resolver).toBeDefined();

    // create notification records
    await Promise.all(
      notificationJson.map(async (input) => {
        const result = await resolver.createNotification(input);
        expect(result).toMatchObject({
          ...input,
          status: 'Active',
        });
        expect(result.id).toBeDefined();
      }),
    );
  });

  it('find by userId and targetId', async () => {
    // test findByUserId and findByTargetId
    expect(await resolver.notificationByUserId('mary')).toHaveLength(0);
    expect(await resolver.notificationByUserId('hardys')).toHaveLength(2);
    expect(await resolver.notificationByTargetId('iphone')).toHaveLength(0);
  });

  it('update content', async () => {
    const notifications = await resolver.notificationByTargetId('device1');
    expect(notifications).toHaveLength(1);
    expect(notifications[0].content).toBe('Hello');

    const updated = await resolver.updateNotification(notifications[0].id, {
      content: 'World',
    });
    expect(updated).toBeDefined();
    expect(updated.content).toBe('World');
  });

  it('find by id', async () => {
    const notifications = await resolver.notificationByTargetId('device3');
    expect(notifications).toHaveLength(1);

    const notification = await resolver.notification(notifications[0].id);
    expect(notification).toBeDefined();
    expect(notification.id).toBe(notifications[0].id);
  });

  it('find all', async () => {
    expect(await resolver.allNotification()).toHaveLength(3);
  });
});
