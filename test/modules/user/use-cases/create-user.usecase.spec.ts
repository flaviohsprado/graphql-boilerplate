import { IBcryptService } from '@interfaces/abstracts/bcrypt.service';
import { IEnvironmentConfigService } from '@interfaces/abstracts/environmentConfigService.interface';
import { IJwtService } from '@interfaces/abstracts/jwt.service';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { IFileRepository } from '@interfaces/repositories/file.repository';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { CreateFileDTO } from '@modules/file/presenters/file.dto';
import { FilePresenter } from '@modules/file/presenters/file.presenter';
import { CreateUserUseCase } from '@modules/user/use-cases/create-user.usecase';

describe.only('CreateUserUseCase', () => {
  let logger: ILogger;
  let repository: IUserRepository;
  let fileRepository: IFileRepository;
  let bcryptService: IBcryptService;
  let jwtService: IJwtService;
  let uploadService: IUploadService;
  let environmentConfig: IEnvironmentConfigService;
  let createUserUseCase: CreateUserUseCase;

  const createdAt = new Date('2023-01-01T14:00:00Z');
  const updatedAt = new Date('2023-01-01T14:00:00Z');
  const mockedToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjFkM2M4MjMwLTQ2NjQtNDhkYS1hMDc2LTE2M2I0YzI2OGQ3ZSIsImF2YXRhciI6Im51bGwiLCJ1c2VybmFtZSI6ImV4YW1wbGUifQ.AXfdNVQhrfqPgtBBJ6rEOVAzQILOk5QfsYkXgRtYFjc';
  const fileEntity = {
    id: 'c1774e73-22f5-4dae-b9a8-ea077d77269a',
    ownerId: '1d3c8230-4664-48da-a076-163b4c268d7e',
    originalname: 'example.jpg',
    ownerType: 'user',
    key: 'example.jpg',
    url: 'www.example.com',
    buffer: Buffer.from('example'),
  };
  const filePresenter: FilePresenter = {
    fieldname: 'example.jpg',
    originalname: 'example.jpg',
    url: 'www.example.com',
  };

  beforeEach(() => {
    const LoggerMock = jest.fn<ILogger, []>(() => ({
      log: jest.fn(),
    }));

    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      create: jest.fn().mockResolvedValue({
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        email: 'example@example.com',
        username: 'example',
        accessToken: 'example',
        createdAt,
        updatedAt,
      }),
      alreadyExists: jest.fn(),
    }));

    const FileRepositoryMock = jest.fn<IFileRepository, []>(() => ({
      create: jest.fn(),
    }));

    const BcryptServiceMock = jest.fn<IBcryptService, []>(() => ({
      createHash: jest.fn(),
    }));

    const JwtServiceMock = jest.fn<IJwtService, []>(() => ({
      createToken: jest.fn().mockResolvedValue(mockedToken),
    }));

    const UploadServiceMock = jest.fn<IUploadService, []>(() => ({
      uploadFile: jest.fn(),
    }));

    const EnvironmentConfigServiceMock = jest.fn<IEnvironmentConfigService, []>(
      () => ({
        getCloudUpload: jest.fn(),
      }),
    );

    logger = new LoggerMock();
    repository = new UserRepositoryMock();
    fileRepository = new FileRepositoryMock();
    bcryptService = new BcryptServiceMock();
    jwtService = new JwtServiceMock();
    uploadService = new UploadServiceMock();
    environmentConfig = new EnvironmentConfigServiceMock();

    createUserUseCase = new CreateUserUseCase(
      logger,
      repository,
      fileRepository,
      bcryptService,
      jwtService,
      uploadService,
      environmentConfig,
    );
  });

  it('should be defined', () => {
    expect(createUserUseCase).toBeDefined();
  });

  it('should be able to create a new user without a file, on success', async () => {
    const createdUser = await createUserUseCase.execute({
      email: 'example@example.com',
      username: 'example',
      password: '123456',
    });

    expect(createdUser).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      email: 'example@example.com',
      username: 'example',
      accessToken: mockedToken,
      file: undefined,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '01/01/2023 11:00:00',
    });
  });

  it('should be not able to create a user, because the email inputed already exists', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      alreadyExists: jest.fn().mockResolvedValue(true),
    }));

    repository = new UserRepositoryMock();

    createUserUseCase = new CreateUserUseCase(
      logger,
      repository,
      fileRepository,
      bcryptService,
      jwtService,
      uploadService,
      environmentConfig,
    );

    const createdUser = await createUserUseCase.execute({
      email: 'example@example.com',
      username: 'example',
      password: '123456',
    });

    expect(createdUser).toEqual(undefined);
  });

  it('should be able to create a new user with a file in local upload, on success', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      create: jest.fn().mockResolvedValue({
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        email: 'example@example.com',
        username: 'example',
        accessToken: 'example',
        createdAt,
        updatedAt,
      }),
      alreadyExists: jest.fn(),
    }));

    const FileRepositoryMock = jest.fn<IFileRepository, []>(() => ({
      create: jest.fn().mockReturnValue(fileEntity),
    }));

    const EnvironmentConfigServiceMock = jest.fn<IEnvironmentConfigService, []>(
      () => ({
        getCloudUpload: jest.fn().mockReturnValue(false),
      }),
    );

    repository = new UserRepositoryMock();
    fileRepository = new FileRepositoryMock();
    environmentConfig = new EnvironmentConfigServiceMock();

    createUserUseCase = new CreateUserUseCase(
      logger,
      repository,
      fileRepository,
      bcryptService,
      jwtService,
      uploadService,
      environmentConfig,
    );

    const file: CreateFileDTO = {
      fieldname: 'example.jpg',
      originalname: 'example.jpg',
      buffer: Buffer.from('example'),
      url: 'www.example.com',
      encoding: '7bit',
      mimetype: 'image/jpeg',
    };

    const user = {
      email: 'example@example.com',
      username: 'example',
      password: '123456',
    };

    const createdUser = await createUserUseCase.execute(user, file);

    expect(createdUser).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      email: 'example@example.com',
      username: 'example',
      accessToken: mockedToken,
      file: filePresenter,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '01/01/2023 11:00:00',
    });
  });

  it('should be able to create a new user with a file in cloud upload, on success', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      create: jest.fn().mockResolvedValue({
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        email: 'example@example.com',
        username: 'example',
        accessToken: 'example',
        createdAt,
        updatedAt,
      }),
      alreadyExists: jest.fn(),
    }));

    const FileRepositoryMock = jest.fn<IFileRepository, []>(() => ({
      create: jest.fn().mockReturnValue(fileEntity),
    }));

    const UploadServiceMock = jest.fn<IUploadService, []>(() => ({
      uploadFile: jest.fn().mockResolvedValue(filePresenter),
    }));

    const EnvironmentConfigServiceMock = jest.fn<IEnvironmentConfigService, []>(
      () => ({
        getCloudUpload: jest.fn().mockReturnValue(true),
      }),
    );

    repository = new UserRepositoryMock();
    fileRepository = new FileRepositoryMock();
    environmentConfig = new EnvironmentConfigServiceMock();
    uploadService = new UploadServiceMock();

    createUserUseCase = new CreateUserUseCase(
      logger,
      repository,
      fileRepository,
      bcryptService,
      jwtService,
      uploadService,
      environmentConfig,
    );

    const file: CreateFileDTO = {
      fieldname: 'example.jpg',
      originalname: 'example.jpg',
      buffer: Buffer.from('example'),
      url: 'www.example.com',
      encoding: '7bit',
      mimetype: 'image/jpeg',
    };

    const user = {
      email: 'example@example.com',
      username: 'example',
      password: '123456',
    };

    const createdUser = await createUserUseCase.execute(user, file);

    expect(createdUser).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      email: 'example@example.com',
      username: 'example',
      accessToken: mockedToken,
      file: filePresenter,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '01/01/2023 11:00:00',
    });
  });
});
