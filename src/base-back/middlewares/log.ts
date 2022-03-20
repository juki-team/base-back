import { NextFunction, Request, Response } from 'express';
import { logInfo, logMessage } from '../helpers';

export function loggerAllRequestHandler(request: Request, response: Response, next: NextFunction) {
  const { rawHeaders, httpVersion, method, socket, url } = request;
  const { remoteAddress, remoteFamily } = socket;
  
  const data = {
    timestamp: Date.now(),
    rawHeaders,
    httpVersion,
    method,
    remoteAddress,
    remoteFamily,
    url,
  };
  logInfo(data, 'Request: ' + url);
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
  logMessage(`[request: ${no}] ${url}`);
  response.on('finish', () => logMessage(`[request: ${no}] ${url} [${Date.now() - requestStart}]`));
  next();
}
