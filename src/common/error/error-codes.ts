import { ErrorCode } from './error-codes.enum';

export const ErrorCodes: Record<
  ErrorCode,
  { statusCode: number; message: string; detailStatusCode: number }
> = {
  [ErrorCode.END_REPEAT_NECESSARY]: {
    statusCode: 400,
    message: 'end repeat day is required',
    detailStatusCode: 400001,
  },
  [ErrorCode.INVALID_STATUS]: {
    statusCode: 400,
    message: 'invalid status',
    detailStatusCode: 400002,
  },
  [ErrorCode.INVALID_LOGIN]: {
    statusCode: 401,
    message: 'Invalid id or password',
    detailStatusCode: 401001,
  },
  [ErrorCode.UNAUTHORIZED_ACCESS]: {
    statusCode: 403,
    message: 'access not permission',
    detailStatusCode: 403001,
  },
  [ErrorCode.NOT_FOUND_USER]: {
    statusCode: 404,
    message: 'user is not exist',
    detailStatusCode: 404001,
  },
  [ErrorCode.NOT_FOUND_TAG]: {
    statusCode: 404,
    message: 'tag is not exist',
    detailStatusCode: 404002,
  },
  [ErrorCode.NOT_FOUND_TODO]: {
    statusCode: 404,
    message: 'todo is not exist',
    detailStatusCode: 404003,
  },
  [ErrorCode.DUPLICATED_USERNAME]: {
    statusCode: 409,
    message: 'username already exists',
    detailStatusCode: 409001,
  },
  [ErrorCode.DUPLICATED_LOGIN_ID]: {
    statusCode: 409,
    message: 'loginId already exists',
    detailStatusCode: 409002,
  },
};
