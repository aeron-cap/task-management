import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);
  app.enableCors({
    origin: process.env.WEB_URL ?? 'http://localhost:5173',
  });
  app.enableShutdownHooks();

  await app.listen(Number(process.env.PORT) || 3000);
}
void bootstrap();
