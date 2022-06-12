import { NextFunction, Request } from 'express';
import { responseContent, responseContents, responseError } from '../helpers/responses';
import { JkResponse } from '../types';

export const responsesMiddleware = (req: Request, res: JkResponse, next: NextFunction) => {
  res.sendError = responseError(req, res);
  res.sendContents = responseContents(req, res);
  res.sendContent = responseContent(req, res);
  next();
};
