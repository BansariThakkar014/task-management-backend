import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { GlobalExceptionFilter } from './common/exception/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)
  const port = configService.get<number>('port') ?? 3000

  app.useGlobalPipes(new CustomValidationPipe())

  app.useGlobalFilters(new GlobalExceptionFilter())

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
