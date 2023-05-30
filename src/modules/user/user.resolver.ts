import { CurrentUser } from '@decorators/currentUser.decorator';
import { Public } from '@decorators/isPublicRoute.decorator';
import { GraphqlAuthGuard } from '@guards/graphql-jwt-auth.guard';
import { IAuth } from '@interfaces/auth.interface';
import { HttpCode, Inject } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUtils } from '@utils/file.utils';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { User } from 'src/entities/user.entity';
import { CreateFileDTO } from '../file/presenters/file.dto';
import { CreateUserDTO, UpdateUserDTO } from './presenters/user.dto';
import { UserPresenter } from './presenters/user.presenter';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { FindAllUserUseCase } from './use-cases/find-all-users.usecase';
import { FindOneUserUseCase } from './use-cases/find-one-user.usecase';
import { UpdateUserFileUseCase } from './use-cases/update-user-file.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { UserModule } from './user.module';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    @Inject(UserModule.GET_USERS_USECASES_PROXY)
    private readonly findAllUserUseCase: UseCaseProxy<FindAllUserUseCase>,
    @Inject(UserModule.GET_USER_USECASES_PROXY)
    private readonly findOneUserUseCase: UseCaseProxy<FindOneUserUseCase>,
    @Inject(UserModule.POST_USER_USECASES_PROXY)
    private readonly createUserUseCase: UseCaseProxy<CreateUserUseCase>,
    @Inject(UserModule.PUT_USER_USECASES_PROXY)
    private readonly updateUserUseCase: UseCaseProxy<UpdateUserUseCase>,
    @Inject(UserModule.PUT_USER_FILE_USECASES_PROXY)
    private readonly updateUserFileUseCase: UseCaseProxy<UpdateUserFileUseCase>,
    @Inject(UserModule.DELETE_USER_USECASES_PROXY)
    private readonly deleteUserUseCase: UseCaseProxy<DeleteUserUseCase>,
  ) {}

  @Query((returns) => User)
  @UseGuards(GraphqlAuthGuard)
  public async findUser(
    @CurrentUser() currentUser: IAuth,
  ): Promise<UserPresenter> {
    const user = await this.findOneUserUseCase
      .getInstance()
      .execute(currentUser.id);
    return new UserPresenter(user);
  }

  @Query((returns) => User)
  public async findOneUser(@Args('id') id: string): Promise<UserPresenter> {
    const user = await this.findOneUserUseCase.getInstance().execute(id);
    return new UserPresenter(user);
  }

  @Query((returns) => [User])
  public async findAllUser(): Promise<UserPresenter[]> {
    const users = await this.findAllUserUseCase.getInstance().execute();
    return users.map((user) => new UserPresenter(user));
  }

  @Mutation((returns) => UserPresenter)
  @Public()
  public async createUser(
    @Args('user') user: CreateUserDTO,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: FileUpload,
  ): Promise<UserPresenter> {
    const newFile: CreateFileDTO = await FileUtils.createFile(file);
    const newUSer: CreateUserDTO = new CreateUserDTO(user);
    return await this.createUserUseCase.getInstance().execute(newUSer, newFile);
  }

  @Mutation((returns) => UserPresenter)
  public async updateUser(
    @Args('id') id: string,
    @Args('user', { nullable: true }) user: UpdateUserDTO,
  ): Promise<UserPresenter> {
    return await this.updateUserUseCase.getInstance().execute(id, user);
  }

  @Mutation((returns) => User)
  public async updateUserFile(
    @Args('id') id: string,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: FileUpload,
  ): Promise<UserPresenter> {
    const newFile: CreateFileDTO = await FileUtils.createFile(file);
    return await this.updateUserFileUseCase.getInstance().execute(id, newFile);
  }

  @HttpCode(204)
  @Mutation((returns) => User)
  public async deleteUser(@Args('id') id: string): Promise<User> {
    return await this.deleteUserUseCase.getInstance().execute(id);
  }
}
