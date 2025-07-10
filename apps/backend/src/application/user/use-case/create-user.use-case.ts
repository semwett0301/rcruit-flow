import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@/domain/user/interfaces/user.repository.interface';
import { CreateUserDto } from '@repo/dto';
import { UserDomainEntity } from '@/domain/user/enities/user.domain.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(IUserRepository) private repo: IUserRepository) {}

  async execute(dto: CreateUserDto) {
    const user = UserDomainEntity.fromCreateUserDto(dto);
    await this.repo.save(user);
  }
}
