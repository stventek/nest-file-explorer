import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //global pipe for class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  //global interceptor for serializing with class-serializer

  // not used since it causes type error when using @Res decorator
  //app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = app.get(ConfigService);

  //disable cors in prod
  if (config.get<string>('NODE_ENV') !== 'production') {
    app.enableCors();
  }
  await app.listen(3000);
}
bootstrap();
