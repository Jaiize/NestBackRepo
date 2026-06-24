import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './ErrorFilter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  const config = new DocumentBuilder()
    .setTitle('NestJS API for Hotel app')
    .setDescription('The API description')
    .setVersion('0.1')
    .addTag('nestjs')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  app.useGlobalFilters(new ErrorFilter());

  app.enableCors({
    origin: '*',
    credentials: true
    // exposedHeaders: ['Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      skipMissingProperties: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (error) => {
        const messages = error.map(
          (e) => Object.values(e.constraints || {})[0],
        );
        return new BadRequestException({
          message: messages[0],
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
