import { ERROR, ErrorCode, errorsResponse, JkError } from '@juki-team/commons';
import { NextFunction, Request, Response } from 'express';
import { getRequestData } from '../helpers';
import { jkLogTelegramBot } from '../services/telegram/telegram-bot';
import { JkResponse } from '../types';

/*
 https://github.com/visionmedia/supertest/issues/416
 
 Error-handling middleware always takes four arguments.
 You must provide four arguments to identify it as an error-handling middleware function.
 Even if you don’t need to use the next object, you must specify it to maintain the signature.
 Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 */

export function errorLoggerHandler(err: any, request: Request, response: Response, next: NextFunction) {
  const { headers, method, url, body, params } = request;
  const error = {
    headers,
    method,
    url,
    body,
    params,
    error: err.stack,
  };
  void jkLogTelegramBot.sendErrorMessage(`Logging error [[${url}]]`, error, getRequestData(request));
  next(err);
}

export function errorResponderHandler(err: any, request: Request, response: Response, next: NextFunction) {
  if (request.xhr) {
    response
      .status(500)
      .send(errorsResponse(
        err?.message || ERROR[ErrorCode.ERR500].message,
        new JkError(ErrorCode.ERR500, { message: err?.message, stack: err?.stack }),
      ));
  } else {
    next(err);
  }
}

export function failSafeHandler(err: any, request: Request, response: Response, next: NextFunction) {
  response
    .status(500)
    .send(errorsResponse(
      err?.message || ERROR[ErrorCode.ERR500].message,
      new JkError(ErrorCode.ERR500, { message: err?.message, stack: err?.stack }),
    ));
}

export function notFoundResponse(req: Request, res: JkResponse, next: NextFunction) {
  res.sendError(new JkError(ErrorCode.ERR404));
}
