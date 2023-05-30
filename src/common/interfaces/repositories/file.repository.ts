import { File } from '@entities/file.entity';
import { CreateFileDTO } from '@modules/file/presenters/file.dto';
import { OwnerType } from '../../enums/ownerType.enum';

export interface IFileRepository {
  findOne?(ownerId: string, ownerType: OwnerType): Promise<File>;
  findByKey?(key: string, value: string): Promise<File>;
  create?(
    files: CreateFileDTO,
    ownerId: string,
    ownerType: OwnerType,
  ): Promise<File>;
  update?(
    files: CreateFileDTO,
    ownerId: string,
    ownerType: OwnerType,
  ): Promise<File>;
  delete?(ownerId: string, ownerType: OwnerType): Promise<File>;
}
