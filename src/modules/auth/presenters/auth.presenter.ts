import { IsRequiredString } from '@decorators/validators/isRequiredString.decorator';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPresenter {
  @IsRequiredString()
  public accessToken: string;

  constructor(auth: AuthPresenter) {
    Object.assign(this, auth);
  }
}
