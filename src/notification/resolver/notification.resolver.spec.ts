import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationSchema } from '../schema/notification.schema';
import { NotificationService } from '../service/notification.service';
import { NotificationResolver } from './notification.resolver';

describe('NotificationResolver', () => {
  let resolver: NotificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DynamooseModule.forRoot({
          local: true,
          aws: {
            region: 'any',
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

  it('should be defined', async () => {
    expect(resolver).toBeDefined();

    const result = await resolver.createNotification({
      targetId: 'device1',
      userId: 'tommy',
      content: 'Message',
    });

    expect(result).toMatchObject({
      targetId: 'device1',
      userId: 'tommy',
      content: 'Message',
      status: 'Active',
    });
    expect(result.id).toBeDefined();
  });
});
