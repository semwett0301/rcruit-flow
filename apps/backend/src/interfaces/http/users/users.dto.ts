import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserRequest } from '@repo/dto';

export class CreateUserDto implements CreateUserRequest {
  @IsNotEmpty()
  @ApiProperty({ example: 'John' })
  name!: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;
}
