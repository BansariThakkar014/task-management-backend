import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseService } from '../services/response.service';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  constructor(private readonly responseService: ResponseService) {}

  catch(error: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (error instanceof HttpException) {
      const status = error.getStatus();
      const exceptionResponse = error.getResponse();

      if (typeof exceptionResponse === 'object') {
        const message = (exceptionResponse as any).message || error.message;
        const errorMessage = (exceptionResponse as any).error;
        switch (status) {
          case HttpStatus.CONFLICT:
            response
              .status(status)
              .json(this.responseService.formatConflict(message));
            break;
          case HttpStatus.BAD_REQUEST:
            response
              .status(status)
              .json(this.responseService.formatValidationError(errorMessage));
            break;
          case HttpStatus.UNAUTHORIZED:
            response
              .status(status)
              .json(this.responseService.formatUnauthorized(message));
            break;
          case HttpStatus.FORBIDDEN:
            response
              .status(status)
              .json(this.responseService.formatForbidden(message));
            break;
          case HttpStatus.NOT_FOUND:
            response
              .status(status)
              .json(this.responseService.formatNotFound(message));
            break;
          case HttpStatus.INTERNAL_SERVER_ERROR:
            response
              .status(status)
              .json(this.responseService.formatError(message, status));
            break;
          default:
            response
              .status(status)
              .json(this.responseService.formatError(error.message, status));
        }
      } else {
        response
          .status(status)
          .json(this.responseService.formatError(error.message, status));
      }
      return;
    }

    if (error instanceof QueryFailedError) {
      const err = error as any;
      console.log('Error', error);

      if (err.code === 'ER_DUP_ENTRY') {
        response
          .status(HttpStatus.CONFLICT)
          .json(this.responseService.formatConflict('Duplicate entry found'));
      } else if (err.code === 'ER_NO_REFERENCED_ROW') {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            this.responseService.formatError(
              'Referenced record does not exist',
              HttpStatus.BAD_REQUEST,
            ),
          );
      } else {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            this.responseService.formatDatabaseError(
              `Database error: ${err.message}`,
            ),
          );
      }
      return;
    }

    if (error instanceof EntityNotFoundError) {
      response
        .status(HttpStatus.NOT_FOUND)
        .json(this.responseService.formatNotFound('Entity not found'));
      return;
    }

    if (error instanceof Error) {
      this.logger.error(`Unexpected error: ${error.message}`, error.stack);
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          this.responseService.formatError(
            error.message || 'An unexpected error occurred',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      return;
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        this.responseService.formatError(
          'Sorry, something went wrong. Please try again later.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
  }
}
