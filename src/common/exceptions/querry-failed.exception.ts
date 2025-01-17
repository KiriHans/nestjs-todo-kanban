import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Default values for the error response
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected database error occurred';

    // Check if the error is due to unique constraint violation
    if (exception['code'] === PostgresErrorCode.UniqueViolation) {
      status = HttpStatus.CONFLICT; // 409 conflict
      message = 'A resource with the same unique key already exists';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
