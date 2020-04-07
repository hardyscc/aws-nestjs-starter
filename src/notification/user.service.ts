import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as uuid from 'uuid';

type UserKey = {
  id: string;
};

type UserInput = {
  name: string;
};

type User = UserKey & UserInput;

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  create(input: UserInput) {
    return this.userModel.create({
      ...input,
      id: uuid.v4(),
    });
  }

  update(key: UserKey, input: UserInput) {
    return this.userModel.update(key, input);
  }

  find() {
    return this.userModel.scan().exec();
  }
}
