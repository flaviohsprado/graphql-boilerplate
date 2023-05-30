import { IBcryptService } from '@interfaces/abstracts/bcrypt.service';
import { IExceptionService } from '@interfaces/abstracts/exceptions.interface';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { UpdateUserUseCase } from '@modules/user/use-cases/update-user.usecase';

describe.only('UpdateUserUseCase', () => {
  let logger: ILogger;
  let repository: IUserRepository;
  let bcryptService: IBcryptService;
  let exceptionService: IExceptionService;
  let updateUserUseCase: UpdateUserUseCase;

  const createdAt = new Date('2023-01-01T14:00:00Z');
  const updatedAt = new Date('2023-01-02T14:00:00Z');

  beforeEach(() => {
    const LoggerMock = jest.fn<ILogger, []>(() => ({
      log: jest.fn(),
    }));

    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      update: jest.fn().mockResolvedValue({
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        email: 'example@example.com',
        username: 'example',
        createdAt,
        updatedAt,
      }),
      alreadyExists: jest.fn().mockResolvedValue(false),
    }));

    const BcryptServiceMock = jest.fn<IBcryptService, []>(() => ({
      createHash: jest.fn(),
    }));

    const ExceptionServiceMock = jest.fn<IExceptionService, []>(() => ({
      throwForbiddenException: jest.fn(),
    }));

    logger = new LoggerMock();
    repository = new UserRepositoryMock();
    bcryptService = new BcryptServiceMock();
    exceptionService = new ExceptionServiceMock();

    updateUserUseCase = new UpdateUserUseCase(
      logger,
      repository,
      bcryptService,
    );
  });

  it('should be defined', () => {
    expect(updateUserUseCase).toBeDefined();
  });

  it('should be able to update a user without a file, on success', async () => {
    const updateUser = await updateUserUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
      {
        email: 'example@example.com',
        username: 'example',
        password: '123456',
      },
    );

    expect(updateUser).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      email: 'example@example.com',
      username: 'example',
      file: undefined,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '02/01/2023 11:00:00',
    });
  });

  it('should be not able to update a user, because the email changed already exists', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      alreadyExists: jest.fn().mockResolvedValue(true),
    }));

    repository = new UserRepositoryMock();

    updateUserUseCase = new UpdateUserUseCase(
      logger,
      repository,
      bcryptService,
    );

    const updateUser = await updateUserUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
      {
        email: 'example@example.com',
        username: 'example',
        password: '123456',
      },
    );

    expect(updateUser).toEqual(undefined);
  });
});
