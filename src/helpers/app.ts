import { LogLevel } from '@juki-team/commons';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { NODE_ENV, ORIGINS, PORT, VERSION } from '../config';
import {
  errorLoggerHandler,
  errorResponderHandler,
  failSafeHandler,
  loggerAllRequestHandler,
  loggerRequestTimeHandler,
  responsesMiddleware,
} from '../middlewares';
import { log, shouldDisplayLog } from './log';
import { ResponseContent, ResponseContents, ResponseError } from './responses';

declare global {
  namespace Express {
    export interface Response {
      sendError: ResponseError,
      sendContents: ResponseContents,
      sendContent: ResponseContent,
    }
  }
}

export const initialSetupApp = () => {
  log(LogLevel.INFO)('starting initial express set up', { NODE_ENV, VERSION, PORT, ORIGINS });
  
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  if (shouldDisplayLog(LogLevel.DEBUG)) {
    app.use(loggerAllRequestHandler);
  } else if (shouldDisplayLog(LogLevel.INFO)) {
    app.use(loggerRequestTimeHandler);
  }
  
  app.use(responsesMiddleware);
  app.use(cors({ origin: ORIGINS, credentials: true }));
  app.use(cookieParser());
  log(LogLevel.INFO)('completed express set up');
  return app;
};

export const finishSetupApp = (app: Express) => {
  log(LogLevel.INFO)('starting finish express set up');
  app.use(errorLoggerHandler);
  app.use(errorResponderHandler);
  app.use(failSafeHandler);
  log(LogLevel.INFO)('completed finish express set up');
  return app.listen(PORT, () => log(LogLevel.INFO)(`listening on port ${PORT}`));
};
