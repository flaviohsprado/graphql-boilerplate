import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './presenters/user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  public async findByKey(key: string, value: string): Promise<User> {
    return await this.userEntityRepository.findOne({
      where: { [key]: value },
      relations: ['file'],
    });
  }

  public async findAll(): Promise<User[]> {
    return this.userEntityRepository.find({
      relations: ['file'],
    });
  }

  public async findOne(id: string): Promise<User> {
    return await this.userEntityRepository.findOne({
      where: { id },
      relations: ['file'],
    });
  }

  public async create(user: CreateUserDTO): Promise<User> {
    const newUser = this.userEntityRepository.create(user);
    return this.userEntityRepository.save(newUser);
  }

  public async update(id: string, user: User): Promise<User> {
    return this.userEntityRepository.save({ ...user, id });
  }

  public async delete(id: string): Promise<any> {
    const user = await this.userEntityRepository.findOne({ where: { id } });

    if (user) {
      this.userEntityRepository.delete(id);
      return user;
    }
  }

  public async alreadyExists(
    key: string,
    value: string,
    id?: string,
  ): Promise<boolean> {
    if (!value) return false;

    const alreadyExists: User = await this.userEntityRepository.findOne({
      where: { [key]: value },
    });

    if (alreadyExists && alreadyExists.id !== id) return true;

    return false;
  }
}
