import { Response } from 'express';
import { ERROR } from '../constants';
import { jkLogTelegramBot } from '../services';
import { ContentResponseType, ContentsMetaType, ContentsResponseType, ErrorCode, ErrorResponseType, JkError } from '../types';

export const errorsResponse = (code: ErrorCode, ...errors: JkError[]): ErrorResponseType => ({
  success: false,
  message: ERROR[code].message,
  errors: errors.map(error => ({
    code: error.code,
    message: error.message,
    detail: error.stack || '',
  })),
});

export const contentResponse = <T>(message: string, content: T): ContentResponseType<T> => ({
  success: true,
  message,
  content,
});

export const contentsResponse = <T>(message: string, contents: T[], meta: ContentsMetaType): ContentsResponseType<T> => ({
  success: true,
  message,
  contents,
  meta,
});

export const response500 = (res: Response, error: any, title: string) => {
  jkLogTelegramBot.sendErrorMessage(title, error);
  res.status(500)
    .send(errorsResponse(ErrorCode.ERR500, new JkError(ErrorCode.ERR500, {
      message: title || error?.message,
      stack: error?.stack || error,
    })));
};
