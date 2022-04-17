import { toJkError } from '@juki-team/commons';
import { Request } from 'express';
import fs from 'fs';
import os from 'os';
import { NODE_ENV, VERSION } from '../config';
import { JkResponse } from '../types';

export function routerGetPing(request: Request, response: JkResponse) {
  try {
    response.sendContent('pong');
  } catch (error) {
    response.send500(toJkError(error), { message: 'Error handling "routerGetPing"' });
  }
}

export function routerGetVersion(request: Request, response: JkResponse) {
  try {
    response.sendContent(VERSION);
  } catch (error) {
    response.send500(toJkError(error), { message: 'Error handling "routerGetVersion"' });
  }
}

export function routerGetEnv(request: Request, response: JkResponse) {
  try {
    response.sendContent(NODE_ENV);
  } catch (error) {
    response.send500(toJkError(error), { message: 'Error handling "routerGetEnv"' });
  }
}

export function routerGetStatus(request: Request, response: JkResponse) {
  try {
    response.sendContent({
      time: new Date(),
      cpus: os.cpus(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
    });
  } catch (error) {
    response.send500(toJkError(error), { message: 'Error handling "routerGetStatus"' });
  }
}

export function routerGetLsFolderPath(request: Request<{ folderPath: string }>, response: JkResponse) {
  try {
    response.sendContent(fs.readdirSync(request.params.folderPath));
  } catch (error) {
    response.send500(toJkError(error), { message: 'Error handling "routerGetLsFolderPath" /ls/' + request.params.folderPath });
  }
}

export function routerGetCatFilePath(request: Request<{ filePath: string }>, response: JkResponse) {
  try {
    response.sendContent(fs.readFileSync(request.params.filePath, 'utf8'));
  } catch (error) {
    response.send500(toJkError(error), { message: 'Error handling "routerGetCatFilePath" /cat/' + request.params.filePath });
  }
}
