import { LogLevel } from '@juki-team/commons';
import { NextFunction, Request, Response } from 'express';
import { log } from '../helpers/log';

export function loggerAllRequestHandler(request: Request, response: Response, next: NextFunction) {
  const { rawHeaders, httpVersion, method, socket, url, body, params } = request;
  const { remoteAddress, remoteFamily } = socket;
  
  const data = {
    timestamp: Date.now(),
    rawHeaders,
    httpVersion,
    method,
    remoteAddress,
    remoteFamily,
    url,
    body,
    params,
  };
  const requestStart = Date.now();
  const no = nextNRequest().padStart(5);
  log(LogLevel.DEBUG)(`[request: ${no}] ${url}`, data);
  response.on('finish', () => log(LogLevel.DEBUG)(`[request: ${no}] ${url} [${Date.now() - requestStart}]`));
  next();
}

let nRequest = 0;

const nextNRequest = (): number => {
  nRequest++;
  return nRequest;
};

export function loggerRequestTimeHandler(request: Request, response: Response, next: NextFunction) {
  const { url } = request;
  const requestStart = Date.now();
  const no = nextNRequest().padStart(5);
  log(LogLevel.INFO)(`[request: ${no}] ${url}`);
  response.on('finish', () => log(LogLevel.INFO)(`[request: ${no}] ${url} [${Date.now() - requestStart}]`));
  next();
}
