import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { NODE_ENV, ORIGINS, PORT, VERSION } from '../config';
import {
  errorLoggerHandler,
  errorResponderHandler,
  failSafeHandler,
  loggerRequestTimeHandler,
  responsesMiddleware,
} from '../middlewares';
import { logMessage } from './log';
import { Response500, ResponseContent, ResponseContents, ResponseError } from './responses';

declare global {
  namespace Express {
    export interface Response {
      send500: Response500,
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
  app.use(loggerRequestTimeHandler);
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
