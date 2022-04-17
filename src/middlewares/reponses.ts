import { NextFunction, Request } from 'express';
import { response500, responseContent, responseContents, responseError } from '../helpers/responses';
import { JkResponse } from '../types';

export const responsesMiddleware = (req: Request, res: JkResponse, next: NextFunction) => {
  res.send500 = response500(res);
  res.sendError = responseError(res);
  res.sendContents = responseContents(res);
  res.sendContent = responseContent(res);
  next();
};
