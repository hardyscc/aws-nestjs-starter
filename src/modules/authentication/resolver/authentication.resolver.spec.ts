import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationStatus } from '../model/authentication.enum';
import { AuthenticationService } from '../service/authentication.service';
import { AuthenticationTestImports } from '../test/authenticationTest.imports';
import authenticationJson from './authentication.data.json';
import { AuthenticationResolver } from './authentication.resolver';
let resolver: AuthenticationResolver;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: AuthenticationTestImports,
    providers: [AuthenticationService, AuthenticationResolver],
  }).compile();

  resolver = module.get<AuthenticationResolver>(AuthenticationResolver);
});

describe('Authentication Resolver', () => {
  beforeAll(async () => {
    expect(resolver).toBeDefined();

    // create authentication records
    await Promise.all(
      authenticationJson.map(async (input) => {
        const result = await resolver.createAuthentication(input);
        expect(result).toMatchObject({
          ...input,
          status: AuthenticationStatus.Active,
        });
        expect(result.id).toBeDefined();
      }),
    );
  });

  it('find by userId or targetId', async () => {
    // test findByUserId and findByTargetId
    expect(await resolver.authenticationByUserId('mary')).toHaveLength(0);
    expect(await resolver.authenticationByUserId('user11')).toHaveLength(2);
    expect(await resolver.authenticationByTargetId('iphone')).toHaveLength(0);
  });

  it('update status', async () => {
    const authentications = await resolver.authenticationByTargetId('device11');
    expect(authentications).toHaveLength(1);
    expect(authentications[0].status).toBe(AuthenticationStatus.Active);

    const updated = await resolver.updateAuthentication(authentications[0].id, {
      status: AuthenticationStatus.Deleted,
    });
    expect(updated).toBeDefined();
    expect(updated.status).toBe(AuthenticationStatus.Deleted);
  });

  it('find by id', async () => {
    const authentications = await resolver.authenticationByTargetId('device13');
    expect(authentications).toHaveLength(1);

    const authentication = await resolver.authentication(authentications[0].id);
    expect(authentication).toBeDefined();
    expect(authentication.id).toBe(authentications[0].id);
  });
});
