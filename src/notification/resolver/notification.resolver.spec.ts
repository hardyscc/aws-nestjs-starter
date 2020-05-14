import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationStatus } from '../model/notification.enum';
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

  it('find by userId or targetId', async () => {
    // test findByUserId and findByTargetId
    expect(await resolver.notificationByUserId('mary')).toHaveLength(0);
    expect(await resolver.notificationByUserId('user11')).toHaveLength(2);
    expect(await resolver.notificationByTargetId('iphone')).toHaveLength(0);
  });

  it('update content', async () => {
    const notifications = await resolver.notificationByTargetId('device11');
    expect(notifications).toHaveLength(1);
    expect(notifications[0].content).toBe('Hello');

    const updated = await resolver.updateNotification(notifications[0].id, {
      status: NotificationStatus.Deleted,
    });
    expect(updated).toBeDefined();
    expect(updated.status).toBe(NotificationStatus.Deleted);
  });

  it('find by id', async () => {
    const notifications = await resolver.notificationByTargetId('device13');
    expect(notifications).toHaveLength(1);

    const notification = await resolver.notification(notifications[0].id);
    expect(notification).toBeDefined();
    expect(notification.id).toBe(notifications[0].id);
  });
});
