import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DynamooseModule } from 'nestjs-dynamoose';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { NotificationModule } from './modules/notification/notification.module';
import {SentryModule} from "./modules/sentry/sentry.module";

const envType =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.local',
        `.env.${envType}.local`,
        '.env',
        `.env.${envType}`,
      ],
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    DynamooseModule.forRoot({
      local: process.env.IS_DDB_LOCAL === 'true',
      aws: { region: process.env.REGION },
      table: {
        create: process.env.IS_DDB_LOCAL === 'true',
        prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
        suffix: '-table',
      },
    }),
    NotificationModule,
    AuthenticationModule,
    SentryModule,
  ],
})
export class AppModule {}
