import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'domain/user/interfaces/user.repository.interface';
import { UserDomainEntity } from 'domain/user/enities/user.domain.entity';
import { CreateUserRequest } from '@repo/dto';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(IUserRepository) private repo: IUserRepository) {}

  async execute(dto: CreateUserRequest) {
    const user = UserDomainEntity.fromCreateUserDto(dto);
    await this.repo.save(user);
  }
}
