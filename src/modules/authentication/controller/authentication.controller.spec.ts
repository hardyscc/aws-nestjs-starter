import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationStatus } from '../model/authentification.enum';
import { AuthenticationService } from '../service/authentification.service';
import { AuthenticationTestImports } from '../test/authentification-test.imports';
import { AuthenticationController } from './authentification.controller';
import authentificationJson from './authentification.data.json';

let controller: AuthenticationController;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: AuthenticationTestImports,
    providers: [AuthenticationService],
    controllers: [AuthenticationController],
  }).compile();

  controller = module.get<AuthenticationController>(AuthenticationController);
});

describe('Authentication Controller', () => {
  beforeAll(async () => {
    expect(controller).toBeDefined();

    // create authentification records
    await Promise.all(
      authentificationJson.map(async (input) => {
        const result = await controller.create(input);
        expect(result).toMatchObject({
          ...input,
          status: 'Active',
        });
        expect(result.id).toBeDefined();
      }),
    );
  });

  it('find by userId or targetId', async () => {
    // test findByUserId and findByTargetId
    expect(await controller.find({ userId: 'mary' })).toHaveLength(0);
    expect(await controller.find({ userId: 'user21' })).toHaveLength(2);
    expect(await controller.find({ targetId: 'iphone' })).toHaveLength(0);
  });

  it('update status', async () => {
    const authentifications = await controller.find({ targetId: 'device21' });
    expect(authentifications).toHaveLength(1);
    expect(authentifications[0].status).toBe(AuthenticationStatus.Active);

    const updated = await controller.update(authentifications[0].id, {
      status: AuthenticationStatus.Deleted,
    });
    expect(updated).toBeDefined();
    expect(updated.status).toBe(AuthenticationStatus.Deleted);
  });

  it('find by id', async () => {
    const authentifications = await controller.find({ targetId: 'device23' });
    expect(authentifications).toHaveLength(1);

    const authentification = await controller.findOne(authentifications[0].id);
    expect(authentification).toBeDefined();
    expect(authentification.id).toBe(authentifications[0].id);
  });

  it('find by userId and targetId (bad request)', async () => {
    try {
      await controller.find({ targetId: 'device21', userId: 'user21' });
    } catch (e) {
      expect(e).toMatchObject({ status: 400 });
    }
  });

  it('find all (bad request)', async () => {
    try {
      await controller.find({});
    } catch (e) {
      expect(e).toMatchObject({ status: 400 });
    }
  });
});
