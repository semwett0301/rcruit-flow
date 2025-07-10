// persistence/typeorm/repositories/user.repository.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "@/infrastructure/persistence/entities/user.orm.entity";
import { IUserRepository } from "@/domain/user/interfaces/user.repository.interface";
import { UserDomainEntity } from "@/domain/user/enities/user.domain.entity";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private userRepo: Repository<UserOrmEntity>,
  ) {}

  async save(user: UserDomainEntity): Promise<void> {
    console.log(user);

    await this.userRepo.save({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    });
  }
}
