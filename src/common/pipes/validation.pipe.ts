import {
  ValidationPipe,
  ValidationPipeOptions,
  BadRequestException,
  ValidationError,
  HttpStatus,
} from '@nestjs/common';

export const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  stopAtFirstError: true,
  errorHttpStatusCode: 422,
};

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      ...validationPipeOptions,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors: Record<string, string[]> = {};
        errors.forEach((error) => {
          if (error.constraints) {
            formattedErrors[error.property] = Object.values(error.constraints);
          }
        });
        return new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Validation failed', // TODO: Translate this message
          error: formattedErrors,
        });
      },
    });
  }
}
