import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CreateAuthenticationInput } from './createAuthentication.input';
import { AuthenticationStatus } from './authentication.enum';

export type AuthenticationKey = {
  id: string;
};

@ObjectType({ implements: CreateAuthenticationInput })
export class Authentication extends CreateAuthenticationInput {
  @Field(/* istanbul ignore next */ () => ID)
  id: string;

  @Field(/* istanbul ignore next */ () => AuthenticationStatus)
  status: AuthenticationStatus;

  @Field()
  createAt: string;
}
