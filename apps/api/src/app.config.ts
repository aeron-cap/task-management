import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as validator from 'class-validator';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: validator,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
