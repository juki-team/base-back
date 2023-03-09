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
import { logMessage, shouldDisplayLog } from './log';
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
  
  logMessage(LogLevel.INFO)(`NODE_ENV [${NODE_ENV}]`);
  logMessage(LogLevel.INFO)(`VERSION [${VERSION}]`);
  logMessage(LogLevel.INFO)(`PORT [${PORT}]`);
  logMessage(LogLevel.INFO)(`ORIGINS [${ORIGINS.join(',')}]`);
  
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (shouldDisplayLog(LogLevel.DEBUG)) {
    app.use(loggerAllRequestHandler);
  } else if (shouldDisplayLog(LogLevel.INFO)) {
    app.use(loggerRequestTimeHandler);
  }
  
  app.use(responsesMiddleware);
  app.use(cors({ origin: ORIGINS, credentials: true }));
  app.use(cookieParser());
  
  return app;
};

export const finishSetupApp = (app: Express) => {
  app.use(errorLoggerHandler);
  app.use(errorResponderHandler);
  app.use(failSafeHandler);
  
  return app.listen(PORT, () => logMessage(LogLevel.INFO)(`Listening on port ${PORT}`));
};
