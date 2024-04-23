import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Swagger - DebtPay')
    .setDescription('Essa é uma API do sistema de pagamentos de dívidas')
    .setVersion('1.0')
    .addBearerAuth()
    .setContact(
      'Emerson Vieira',
      'https://vieiradevcode.com.br',
      'emevieira.dev@gmail.com',
    )
    .addTag('Auth')
    .addTag('Usuários')
    .setBasePath('http://localhost:3333')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(3333);
}
bootstrap();
