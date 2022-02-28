import { NextFunction, Request, Response } from 'express';
import { errorsResponse } from '../helpers';
import { jkLogTelegramBot } from '../services';
import { ErrorCode, JkError } from '../types';

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const { headers, method, url } = req;
  const error = {
    headers,
    method,
    url,
    error: err.stack,
  };
  jkLogTelegramBot.sendErrorMessage(`Logging error [[${url}]]`, error);
  next(err);
}

export function errorResponder(err: any, req: Request, res: Response, next: NextFunction) {
  if (req.xhr) {
    res
      .status(500)
      .send(errorsResponse(
        ErrorCode.ERR500,
        new JkError(ErrorCode.ERR500, { message: err?.message || undefined, stack: err?.stack || undefined }),
      ));
  } else {
    next(err);
  }
}

export function failSafeHandler(err: any, req: Request, res: Response) {
  res
    .status(500)
    .send(errorsResponse(
      ErrorCode.ERR500,
      new JkError(ErrorCode.ERR500, { message: err?.message || undefined, stack: err?.stack || undefined }),
    ));
}
