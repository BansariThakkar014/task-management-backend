import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    error?: string,
  ) {
    super(
      {
        message,
        error: error || HttpStatus[status],
      },
      status,
    );
  }
}
