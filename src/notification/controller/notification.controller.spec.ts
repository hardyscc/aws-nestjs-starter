import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationSchema } from '../schema/notification.schema';
import { NotificationService } from '../service/notification.service';
import { NotificationController } from './notification.controller';
import * as notificationJson from './notification.data.json';

let controller: NotificationController;

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
    providers: [NotificationService],
    controllers: [NotificationController],
  }).compile();

  controller = module.get<NotificationController>(NotificationController);
});

describe('Notification Controller', () => {
  beforeAll(async () => {
    expect(controller).toBeDefined();

    // create notification records
    await Promise.all(
      notificationJson.map(async (input) => {
        const result = await controller.create(input);
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
    expect(await controller.find({ userId: 'mary' })).toHaveLength(0);
    expect(await controller.find({ userId: 'user21' })).toHaveLength(2);
    expect(await controller.find({ targetId: 'iphone' })).toHaveLength(0);
  });

  it('update content', async () => {
    const notifications = await controller.find({ targetId: 'device21' });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].content).toBe('Hello');

    const updated = await controller.update(notifications[0].id, {
      content: 'World',
    });
    expect(updated).toBeDefined();
    expect(updated.content).toBe('World');
  });

  it('find by id', async () => {
    const notifications = await controller.find({ targetId: 'device23' });
    expect(notifications).toHaveLength(1);

    const notification = await controller.findOne(notifications[0].id);
    expect(notification).toBeDefined();
    expect(notification.id).toBe(notifications[0].id);
  });

  it('find by userId and targetId (bad request)', async () => {
    try {
      await controller.find({ targetId: 'device21', userId: 'user21' });
    } catch (e) {
      expect(e).toMatchObject({ status: 400 });
    }
  });

  it('find all (bad request)', async () => {
    try {
      await controller.find({});
    } catch (e) {
      expect(e).toMatchObject({ status: 400 });
    }
  });
});
