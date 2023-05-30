import { IEnvironmentConfigService } from '@interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { IFileRepository } from '@interfaces/repositories/file.repository';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { UpdateUserFileUseCase } from '@modules/user/use-cases/update-user-file.usecase';

describe('UpdateUserFileUseCase', () => {
  let logger: ILogger;
  let repository: IUserRepository;
  let fileRepository: IFileRepository;
  let uploadService: IUploadService;
  let environmentConfig: IEnvironmentConfigService;
  let updateUserFileUseCase: UpdateUserFileUseCase;

  const createdAt = new Date('2023-01-01T14:00:00Z');
  const updatedAt = new Date('2023-01-02T14:00:00Z');
  const file = {
    id: 'b37e90b4-f68d-49ea-a7e4-848ff2055816',
    ownerId: '1d3c8230-4664-48da-a076-163b4c268d7e',
    ownerType: 'user',
    key: 'examplekey',
    originalname: 'example.jpg',
    mimetype: 'image/jpeg',
  };
  const user = {
    id: '1d3c8230-4664-48da-a076-163b4c268d7e',
    email: 'example@example.com',
    username: 'example',
    createdAt,
    updatedAt,
  };

  beforeEach(() => {
    const LoggerMock = jest.fn<ILogger, []>(() => ({
      log: jest.fn(),
    }));

    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      findOne: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockResolvedValue({ ...user, file }),
    }));

    const FileRepositoryMock = jest.fn<IFileRepository, []>(() => ({
      findOne: jest.fn().mockResolvedValue(file),
      update: jest.fn().mockResolvedValue(file),
      delete: jest.fn().mockResolvedValue({}),
    }));

    const UploadServiceMock = jest.fn<IUploadService, []>(() => ({
      uploadFile: jest.fn().mockResolvedValue(file),
      deleteFile: jest.fn().mockResolvedValue({}),
    }));

    const EnvironmentConfigServiceMock = jest.fn<IEnvironmentConfigService, []>(
      () => ({
        getCloudUpload: jest.fn().mockReturnValue(false),
      }),
    );

    logger = new LoggerMock();
    repository = new UserRepositoryMock();
    fileRepository = new FileRepositoryMock();
    uploadService = new UploadServiceMock();
    environmentConfig = new EnvironmentConfigServiceMock();

    updateUserFileUseCase = new UpdateUserFileUseCase(
      logger,
      repository,
      fileRepository,
      uploadService,
      environmentConfig,
    );
  });

  it('should be defined', () => {
    expect(updateUserFileUseCase).toBeDefined();
  });

  it('should be able to update a user file in local upload, on success', async () => {
    const updateUser = await updateUserFileUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
      file,
    );

    expect(updateUser).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      email: 'example@example.com',
      username: 'example',
      file,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '02/01/2023 11:00:00',
    });
  });

  it('should be able to update a user file ihn cloud upload, on success', async () => {
    const EnvironmentConfigServiceMock = jest.fn<IEnvironmentConfigService, []>(
      () => ({
        getCloudUpload: jest.fn().mockReturnValue(true),
      }),
    );

    environmentConfig = new EnvironmentConfigServiceMock();

    updateUserFileUseCase = new UpdateUserFileUseCase(
      logger,
      repository,
      fileRepository,
      uploadService,
      environmentConfig,
    );

    const updateUser = await updateUserFileUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
      file,
    );

    expect(updateUser).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      email: 'example@example.com',
      username: 'example',
      file,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '02/01/2023 11:00:00',
    });
  });
});
