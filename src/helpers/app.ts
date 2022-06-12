import { LogLevel } from '@juki-team/commons';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { LOG_LEVEL, NODE_ENV, ORIGINS, PORT, VERSION } from '../config';
import {
  errorLoggerHandler,
  errorResponderHandler,
  failSafeHandler,
  loggerAllRequestHandler,
  loggerRequestTimeHandler,
  responsesMiddleware,
} from '../middlewares';
import { logMessage } from './log';
import { Response500, ResponseContent, ResponseContents, ResponseError } from './responses';

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
  logMessage(`NODE_ENV [${NODE_ENV}]`);
  logMessage(`VERSION [${VERSION}]`);
  logMessage(`PORT [${PORT}]`);
  logMessage(`ORIGINS [${ORIGINS.join(',')}]`);
  
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (LOG_LEVEL === LogLevel.TRACE || LOG_LEVEL === LogLevel.DEBUG) {
    app.use(loggerAllRequestHandler);
  } else if (LOG_LEVEL === LogLevel.INFO) {
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
  
  return app.listen(PORT, () => logMessage(`Listening on port ${PORT}`));
};
