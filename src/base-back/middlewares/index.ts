import { NextFunction, Request, Response } from 'express';
import {
  response500,
  Response500,
  responseContent,
  ResponseContent,
  responseContents,
  ResponseContents,
  responseError,
  ResponseError,
} from '../helpers';

export interface JkResponse extends Response {
  send500: Response500,
  sendError: ResponseError,
  sendContents: ResponseContents,
  sendContent: ResponseContent,
}

export const responsesMiddleware = (req: Request, res: JkResponse, next: NextFunction) => {
  res.send500 = response500(res);
  res.sendError = responseError(res);
  res.sendContents = responseContents(res);
  res.sendContent = responseContent(res);
  next();
};

export * from './error';
export * from './log';
