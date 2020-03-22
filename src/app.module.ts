import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: {
        endpoint:
          process.env.PLAYGOUND_ENDPOINT || `/${process.env.STAGE}/graphql`,
      },
    }),
    DynamooseModule.forRoot({
      aws: { region: process.env.REGION },
      model: {
        create: false,
        prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
      },
    }),
    NotificationModule,
  ],
})
export class AppModule {}
