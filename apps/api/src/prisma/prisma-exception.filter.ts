import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    // Default mapping
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Database error';

    // Prisma error codes
    switch (exception.code) {
      case 'P2002': // Unique constraint
        status = HttpStatus.CONFLICT; // 409
        message = 'Unique constraint failed';
        break;

      case 'P2003': // Foreign key constraint
        status = HttpStatus.BAD_REQUEST; // 400
        message = 'Foreign key constraint failed';
        break;

      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND; // 404
        message = 'Record not found';
        break;

      default:
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
    }

    res.status(status).json({
      statusCode: status,
      message,
      prismaCode: exception.code,
    });
  }
}
