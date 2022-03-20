import { Response } from 'express';
import { errorsResponse } from '../helpers';
import { jkLogTelegramBot } from '../services';
import { ErrorCode, JkError } from '../types';

export const response500 = (response: Response, error: any, title?: string) => {
  const message = title || error?.message;
  jkLogTelegramBot.sendErrorMessage(message, error);
  response.status(500)
    .send(errorsResponse(ErrorCode.ERR500, new JkError(ErrorCode.ERR500, {
      message,
      stack: error?.stack || error,
    })));
};
