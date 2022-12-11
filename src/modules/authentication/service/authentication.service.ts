import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as uuid from 'uuid';
import { CreateAuthenticationInput } from '../model/createAuthentication.input';
import { AuthenticationStatus } from '../model/authentication.enum';
import { Authentication, AuthenticationKey } from '../model/authentication.model';
import { UpdateAuthenticationInput } from '../model/updateAuthentication.input';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel('authentication')
    private readonly model: Model<Authentication, AuthenticationKey>,
  ) {}

  create(input: CreateAuthenticationInput) {
    return this.model.create({
      ...input,
      id: uuid.v4(),
      status: AuthenticationStatus.Active,
      createAt: new Date().toISOString(),
    });
  }

  update(key: AuthenticationKey, input: UpdateAuthenticationInput) {
    return this.model.update(key, input);
  }

  findOne(key: AuthenticationKey) {
    return this.model.get(key);
  }

  findByTargetId(targetId: string) {
    return this.model
      .query('targetId')
      .eq(targetId)
      .where('status')
      .eq(AuthenticationStatus.Active)
      .exec();
  }

  findByUserId(userId: string) {
    return this.model
      .query('userId')
      .eq(userId)
      .where('status')
      .eq(AuthenticationStatus.Active)
      .exec();
  }
}
