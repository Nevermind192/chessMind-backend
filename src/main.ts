import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

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
    }),
  );
  await app.listen(3000);
}
bootstrap();
