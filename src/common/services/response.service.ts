import { Injectable, HttpStatus } from '@nestjs/common';
import { MetaDto } from '../dto/meta.dto';
import { BaseResponseDto } from '../dto/base-response.dto';

@Injectable()
export class ResponseService {
  formatSuccess<T>(data: T, message = 'Success'): BaseResponseDto<T> {
    return {
      status: HttpStatus.OK,
      message,
      data,
    };
  }

  formatCreated<T>(
    data: T,
    message = 'Created successfully',
  ): BaseResponseDto<T> {
    return {
      status: HttpStatus.CREATED,
      message,
      data,
    };
  }

  formatError(
    message: string,
    status = HttpStatus.BAD_REQUEST,
    error = 'Bad Request',
  ): BaseResponseDto<null> {
    return {
      status,
      message,
      error,
      data: null,
    };
  }

  formatPaginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Success',
  ): BaseResponseDto<{
    items: T[];
    meta: MetaDto;
  }> {
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
    return {
      status: HttpStatus.OK,
      message,
      data: {
        items: data,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    };
  }

  formatList<T>(
    data: T[],
    metaData: MetaDto,
    message = 'Success',
  ): BaseResponseDto<{
    items: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const hasNextPage = metaData.page < metaData.totalPages;
    const hasPreviousPage = metaData.page > 1;
    const totalPages = Math.ceil(metaData.total / metaData.limit);
    return {
      status: HttpStatus.OK,
      message,
      data: {
        meta: {
          total: metaData.total,
          page: metaData.page,
          limit: metaData.limit,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
        items: data,
      },
    };
  }

  formatValidationError(errors: Record<string, string[]>): BaseResponseDto<{
    errors: Record<string, string[]>;
  }> {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      error: 'Validation Error',
      data: {
        errors,
      },
    };
  }

  formatNotFound(message = 'Resource not found'): BaseResponseDto<null> {
    return {
      status: HttpStatus.NOT_FOUND,
      message,
      error: 'Not Found',
      data: null,
    };
  }

  formatUnauthorized(message = 'Unauthorized'): BaseResponseDto<null> {
    return {
      status: HttpStatus.UNAUTHORIZED,
      message,
      error: 'Unauthorized',
      data: null,
    };
  }

  formatForbidden(message = 'Forbidden'): BaseResponseDto<null> {
    return {
      status: HttpStatus.FORBIDDEN,
      message,
      error: 'Forbidden',
      data: null,
    };
  }

  formatConflict(message = 'Conflict'): BaseResponseDto<null> {
    return {
      status: HttpStatus.CONFLICT,
      message,
      error: 'Conflict',
      data: null,
    };
  }

  formatDatabaseError(
    message = 'Database error occurred',
  ): BaseResponseDto<null> {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      error: 'Database Error',
      data: null,
    };
  }

  formatInternalError(
    message = 'Internal server error',
  ): BaseResponseDto<null> {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      error: 'Internal Server Error',
      data: null,
    };
  }
}
