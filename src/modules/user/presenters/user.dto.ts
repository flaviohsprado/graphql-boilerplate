import { CreateFileDTO } from '@/modules/file/presenters/file.dto';
import { IsOptionalString } from '@decorators/validators/isOptionalString.decorator';
import { IsRequiredString } from '@decorators/validators/isRequiredString.decorator';
import { InputType } from '@nestjs/graphql';
import { uuid } from 'uuidv4';

@InputType()
export class CreateUserDTO {
  public id?: string;

  @IsRequiredString()
  public username: string;

  @IsOptionalString()
  public email: string;

  @IsRequiredString()
  public password: string;

  @IsOptionalString()
  public file?: CreateFileDTO;

  constructor(props: CreateUserDTO) {
    Object.assign(this, props);
    this.id = uuid();
  }
}

@InputType()
export class UpdateUserDTO {
  @IsOptionalString()
  public username?: string;

  @IsOptionalString()
  public email?: string;

  @IsOptionalString()
  public password?: string;

  @IsOptionalString()
  public file?: CreateFileDTO;
}
