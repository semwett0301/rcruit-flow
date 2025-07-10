import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { IUserRepository } from '@/domain/user/interfaces/user.repository.interface';
import { UserDomainEntity } from '@/domain/user/enities/user.domain.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(IUserRepository) private repo: IUserRepository) {}

  async execute(dto: CreateUserDto) {
    const user = dto.createUserDomainEntity();
    await this.repo.save(user);
  }
}
