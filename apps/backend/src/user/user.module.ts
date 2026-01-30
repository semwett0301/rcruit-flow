/**
 * User Module
 *
 * This module encapsulates all user-related functionality including
 * the UserController for handling HTTP requests and UserService for
 * business logic. It imports PrismaModule for database access and
 * exports UserService for use in other modules.
 */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
