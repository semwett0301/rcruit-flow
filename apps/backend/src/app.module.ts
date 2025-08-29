import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'interfaces/http/users/users.module';
import { DatabaseModule } from 'infrastructure/persistence/database.module';
import { CvsModule } from 'interfaces/http/cv/cvs.module';
import { EmailsModule } from './interfaces/http/emails/emails.module';
import { HealthModule } from './interfaces/http/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,
    CvsModule,
    DatabaseModule,
    HealthModule,
    EmailsModule,
  ],
})
export class AppModule {}
