import { Module } from '@nestjs/common';
import { UsersController } from '@/interfaces/http/users/users.controller';
import { CreateUserUseCase } from '@/application/user/use-case/create-user.use-case';
import { IUserRepository } from '@/domain/user/interfaces/user.repository.interface';
import { UserRepository } from '@/infrastructure/persistence/repositories/user.repository';
import { UserOrmEntity } from '@/infrastructure/persistence/entities/user.orm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    { provide: IUserRepository, useClass: UserRepository },
  ],
})
export class UsersModule {}
