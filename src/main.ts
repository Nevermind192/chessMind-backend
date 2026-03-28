import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const messages = errors.reduce(
          (acc, error) => ({
            ...acc,
            [error.property]: error.constraints,
          }),
          {},
        );
        throw new BadRequestException({
          ok: false,
          errors: messages,
        });
      },
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder().setTitle('Cats example').setDescription('The cats API description').setVersion('1.0').addTag('cats').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(3000);
}
bootstrap();
