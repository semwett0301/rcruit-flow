import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "@/interfaces/http/users/users.module";
import { DatabaseModule } from "@/infrastructure/persistence/database.module";
import { CvsModule } from "@/interfaces/http/cv/cvs.module";
import { EmailsModule } from "@/interfaces/http/emails/email.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    UsersModule,
    CvsModule,
    DatabaseModule,
    EmailsModule,
  ],
})
export class AppModule {}
