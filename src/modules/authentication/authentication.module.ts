import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { AuthenticationResolver } from './resolver/authentication.resolver';
import {AuthenticationService} from "./service/authentication.service";
import {AuthenticationSchema} from "./schema/authentication.schema";
import {AuthenticationController} from "./controller/authentication.controller";

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'authentication',
        schema: AuthenticationSchema,
      },
    ]),
  ],
  providers: [AuthenticationService, AuthenticationResolver],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
