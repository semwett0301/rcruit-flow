import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDomainEntity } from '@/domain/user/enities/user.domain.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'John' })
  name!: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  createUserDomainEntity(): UserDomainEntity {
    return new UserDomainEntity(this.name, this.email);
  }
}
