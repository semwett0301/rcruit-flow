import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserPreference } from './entities/user-preference.entity';
import { UserService } from './services/user.service';
import { UserPreferenceService } from './services/user-preference.service';
import { UserController } from './controllers/user.controller';
import { UserPreferenceController } from './controllers/user-preference.controller';

/**
 * User module that handles user-related functionality including
 * user management and user preferences.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, UserPreference])],
  controllers: [UserController, UserPreferenceController],
  providers: [UserService, UserPreferenceService],
  exports: [UserService, UserPreferenceService],
})
export class UserModule {}
