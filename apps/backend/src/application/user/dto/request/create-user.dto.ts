import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: "John" })
  name!: string;

  @IsEmail()
  @ApiProperty({ example: "john.doe@example.com" })
  email!: string;
}
