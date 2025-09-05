import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Task Management API')
  .setDescription('The NestJS Task Management API documentation')
  .setVersion('1.0')
  .addBearerAuth(undefined, 'JWT-auth')
  .build();
