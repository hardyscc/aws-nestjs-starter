import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Authentication } from '../model/authentication.model';
import { CreateAuthenticationInput } from '../model/createAuthentication.input';
import { UpdateAuthenticationInput } from '../model/updateAuthentication.input';
import { AuthenticationService } from '../service/authentication.service';

@Resolver(() => Authentication)
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(/* istanbul ignore next */ () => Authentication)
  createAuthentication(@Args('input') input: CreateAuthenticationInput) {
    return this.authenticationService.create(input);
  }

  @Mutation(/* istanbul ignore next */ () => Authentication)
  updateAuthentication(
    @Args('id', { type: /* istanbul ignore next */ () => ID }) id: string,
    @Args('input') input: UpdateAuthenticationInput,
  ) {
    return this.authenticationService.update({ id }, input);
  }

  @Query(/* istanbul ignore next */ () => Authentication)
  authentication(
    @Args('id', { type: /* istanbul ignore next */ () => ID }) id: string,
  ) {
    return this.authenticationService.findOne({ id });
  }

  @Query(/* istanbul ignore next */ () => [Authentication])
  authenticationByUserId(@Args('userId') userId: string) {
    return this.authenticationService.findByUserId(userId);
  }

  @Query(/* istanbul ignore next */ () => [Authentication])
  authenticationByTargetId(@Args('targetId') targetId: string) {
    return this.authenticationService.findByTargetId(targetId);
  }
}
