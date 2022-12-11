import { registerEnumType } from '@nestjs/graphql';

enum AuthenticationStatus {
  Active = 'Active',
  Deleted = 'Deleted',
}

registerEnumType(AuthenticationStatus, {
  name: 'AuthenticationStatus',
});

export { AuthenticationStatus };
