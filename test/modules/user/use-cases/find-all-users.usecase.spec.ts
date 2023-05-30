import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { FindAllUserUseCase } from '@modules/user/use-cases/find-all-users.usecase';

describe('FindAllUsersUseCase', () => {
  let repository: IUserRepository;
  let cacheManager: ICacheManager;
  let findAllUserUseCase: FindAllUserUseCase;

  beforeEach(() => {
    const CacheManagerMock = jest.fn<ICacheManager, []>(() => ({
      getCachedObject: jest.fn(),
      setObjectInCache: jest.fn(),
    }));

    cacheManager = new CacheManagerMock();
  });

  it('should return an user', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      findAll: jest.fn().mockResolvedValue([
        {
          id: '1',
          email: 'example@example.com',
          username: 'example',
          accessToken: undefined,
          file: undefined,
          role: undefined,
          createdAt: '01/01/2023 11:00:00',
          updatedAt: '01/01/2023 11:00:00',
        },
      ]),
    }));

    repository = new UserRepositoryMock();

    findAllUserUseCase = new FindAllUserUseCase(repository, cacheManager);

    const users = await findAllUserUseCase.execute();

    expect(users).toEqual([
      {
        id: '1',
        email: 'example@example.com',
        username: 'example',
        accessToken: undefined,
        file: undefined,
        role: undefined,
        createdAt: '01/01/2023 11:00:00',
        updatedAt: '01/01/2023 11:00:00',
      },
    ]);
  });

  it('should return undefined if dont have users found', async () => {
    const UserRepositoryMockUndefined = jest.fn<IUserRepository, []>(() => ({
      findAll: jest.fn().mockReturnValue(undefined),
    }));

    repository = new UserRepositoryMockUndefined();

    findAllUserUseCase = new FindAllUserUseCase(repository, cacheManager);

    expect(await findAllUserUseCase.execute()).toEqual(undefined);
  });
});
