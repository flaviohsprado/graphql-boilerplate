import { Public } from '@decorators/isPublicRoute.decorator';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { AuthModule } from './auth.module';
import { AuthDTO } from './presenters/auth.dto';
import { AuthPresenter } from './presenters/auth.presenter';
import { LoginUseCase } from './use-cases/login.usecase';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(AuthModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCase: UseCaseProxy<LoginUseCase>,
  ) {}

  @Mutation((returns) => AuthPresenter)
  @Public()
  public async login(
    @Args('authCredentials') authCredentials: AuthDTO,
  ): Promise<AuthPresenter> {
    const credentials = new AuthDTO(authCredentials);
    return this.loginUseCase.getInstance().execute(credentials);
  }
}
