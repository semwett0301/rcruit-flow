import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '@/application/user/dto/request/create-user.dto';
import { CreateUserUseCase } from '@/application/user/use-case/create-user.use-case';

@Controller('users')
export class UsersController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    await this.createUser.execute(dto);
  }
}
