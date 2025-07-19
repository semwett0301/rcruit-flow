import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from 'application/user/use-case/create-user.use-case';
import { CreateUserDto } from '@repo/dto';

@Controller('users')
export class UsersController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    await this.createUser.execute(dto);
  }
}
