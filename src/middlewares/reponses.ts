import { NextFunction, Request } from 'express';
import { response500, responseContent, responseContents, responseError } from '../helpers/responses';
import { JkResponse } from '../types';

export const responsesMiddleware = (req: Request, res: JkResponse, next: NextFunction) => {
  res.send500 = response500(req, res);
  res.sendError = responseError(req, res);
  res.sendContents = responseContents(req, res);
  res.sendContent = responseContent(req, res);
  next();
};
