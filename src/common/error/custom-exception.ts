import { ErrorCodes } from './error-codes';
import { ErrorCode } from './error-codes.enum';
import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  public readonly customExceptionInfo: {
    statusCode: number;
    message: string;
    detailStatusCode: number;
  };

  constructor(errorCode: ErrorCode) {
    const customExceptionInfo = ErrorCodes[errorCode];
    super(customExceptionInfo.message, customExceptionInfo.statusCode);
    this.customExceptionInfo = customExceptionInfo;
  }
}
