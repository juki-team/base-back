import { contentResponse, ContentsMetaType, contentsResponse, ERROR, ErrorCode, errorsResponse, JkError } from '@juki-team/commons';
import { Request, Response } from 'express';
import { jkLogTelegramBot } from '../services';
import { ResponseOptionsType } from '../types';

export type ResponseError = (error: JkError, options?: ResponseOptionsType, ...restErrors: JkError[]) => void;
export type ResponseContents = <T, >(contents: T[], meta: ContentsMetaType, options?: ResponseOptionsType) => void;
export type ResponseContent = <T, >(content: T, options?: ResponseOptionsType) => void;

export const getRequestData = (request: Request) => {
  return {
    method: request.method,
    originalUrl: request.originalUrl,
    baseUrl: request.baseUrl,
    path: request.path,
    query: request.query,
    headers: request.headers,
    body: request.body,
  };
};

export const responseError = (request: Request, response: Response) => (error: JkError, options?: ResponseOptionsType, ...restErrors: JkError[]) => {
  
  const { message: _message, status: _status } = options || {};
  let { notify } = options || {};
  
  const errors = [error, ...restErrors];
  
  if (errors.some(error => error.code === ErrorCode.ERR500 || !ERROR[error.code] || ERROR[error.code]?.status >= 500 || ERROR[error.code]?.status < 400)) {
    notify = true;
  }
  
  const message = _message || error.message;
  const status = _status || ERROR[error.code].status;
  
  if (notify) {
    jkLogTelegramBot.sendErrorMessage(`${status}: ${message}`, errors, getRequestData(request));
  }
  
  if (!response.headersSent) {
    return response.status(status).send(errorsResponse(message, ...errors));
  }
  
};

export const responseContents = (request: Request, response: Response) => <T, >(contents: T[], meta: ContentsMetaType, options?: ResponseOptionsType) => {
  
  const { message: _message, status: _status, notify } = options || {};
  
  const message = _message || 'OK';
  const status = _status || 200;
  
  if (notify) {
    jkLogTelegramBot.sendInfoMessage(`${status}: ${message}`, { contents, meta, request: getRequestData(request) });
  }
  
  return response.status(status).send(contentsResponse(message, contents, meta));
};

export const responseContent = (request: Request, response: Response) => <T, >(content: T, options?: ResponseOptionsType) => {
  
  const { message: _message, status: _status, notify } = options || {};
  
  const message = _message || 'OK';
  const status = _status || 200;
  
  if (notify) {
    jkLogTelegramBot.sendInfoMessage(`${status}: ${message}`, { content, request: getRequestData(request) });
  }
  return response.status(status).send(contentResponse(message, content));
};
