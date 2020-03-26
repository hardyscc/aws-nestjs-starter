import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationSchema } from '../schema/notification.schema';
import { NotificationService } from '../service/notification.service';
import { NotificationResolver } from './notification.resolver';

const dynamooseOptions = {
  local: 'http://localhost:8001',
  aws: { region: 'local' },
};

describe('NotificationResolver', () => {
  let resolver: NotificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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

  it('create notification', async () => {
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
