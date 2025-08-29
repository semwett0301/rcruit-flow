import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    cors: {},
  });

  const config = app.get(ConfigService);

  const originsEnv = config.get<string>('CORS_ORIGINS', '');
  const origins = originsEnv
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o);

  console.log(origins);

  app.enableCors({
    origin: origins,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api/v1');

  const docBuilder = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('Swagger generation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docBuilder);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(PORT, '0.0.0.0', () =>
    console.log(`Server started on port = ${PORT}`),
  );
}

void start();
