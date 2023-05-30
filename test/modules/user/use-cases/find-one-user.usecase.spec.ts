import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { FindOneUserUseCase } from '@modules/user/use-cases/find-one-user.usecase';

describe('FindOneUserUseCase', () => {
  let repository: IUserRepository;
  let cacheManager: ICacheManager;
  let findOneUserUseCase: FindOneUserUseCase;

  beforeEach(() => {
    const CacheManagerMock = jest.fn<ICacheManager, []>(() => ({
      getCachedObject: jest.fn(),
      setObjectInCache: jest.fn(),
    }));

    cacheManager = new CacheManagerMock();
  });

  it('should return an user', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      findOne: jest.fn().mockResolvedValue({
        id: '1',
        email: 'example@example.com',
        username: 'example',
        accessToken: undefined,
        file: undefined,
        role: undefined,
        createdAt: '01/01/2023 11:00:00',
        updatedAt: '01/01/2023 11:00:00',
      }),
    }));

    repository = new UserRepositoryMock();

    findOneUserUseCase = new FindOneUserUseCase(repository, cacheManager);

    const user = await findOneUserUseCase.execute('1');

    expect(user).toEqual({
      id: '1',
      email: 'example@example.com',
      username: 'example',
      accessToken: undefined,
      file: undefined,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '01/01/2023 11:00:00',
    });
  });

  it('should throw an exception if user is not found', async () => {
    const UserRepositoryMockUndefined = jest.fn<IUserRepository, []>(() => ({
      findOne: jest.fn().mockReturnValue(undefined),
    }));

    repository = new UserRepositoryMockUndefined();

    findOneUserUseCase = new FindOneUserUseCase(repository, cacheManager);

    expect(await findOneUserUseCase.execute('1')).toEqual(undefined);
  });
});
