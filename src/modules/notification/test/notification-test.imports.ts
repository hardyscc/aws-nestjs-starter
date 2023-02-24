import { DynamooseModule } from 'nestjs-dynamoose';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { NotificationSchema } from '../schema/notification.schema';

export const NotificationTestImports = [
  ConfigModule.forRoot(),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: true,
  }),
  DynamooseModule.forRoot({
    local: 'http://localhost:8001',
    aws: { region: 'local' },
    table: {
      create: false,
      prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
      suffix: '-table',
    },
  }),
  DynamooseModule.forFeature([
    {
      name: 'notification',
      schema: NotificationSchema,
    },
  ]),
];
