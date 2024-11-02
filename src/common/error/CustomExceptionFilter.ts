import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from './custom-exception';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.customExceptionInfo.statusCode;

    response.status(status).json({
      statusCode: status,
      message: exception.customExceptionInfo.message,
      detailStatusCode: exception.customExceptionInfo.detailStatusCode,
    });
  }
}