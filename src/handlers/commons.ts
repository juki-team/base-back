import { ErrorCode, JkError, toJkError } from '@juki-team/commons';
import { Request } from 'express';
import fs from 'fs';
import os from 'os';
import { JUKI_SECRET_TOKEN, NODE_ENV, VERSION } from '../config';
import { JkResponse } from '../types';

export function routerGetPing(request: Request, response: JkResponse) {
  try {
    response.sendContent('pong');
  } catch (error) {
    response.sendError(toJkError(error), { message: 'Error handling "routerGetPing"', notify: true });
  }
}

export function routerGetVersion(request: Request, response: JkResponse) {
  try {
    response.sendContent(VERSION);
  } catch (error) {
    response.sendError(toJkError(error), { message: 'Error handling "routerGetVersion"', notify: true });
  }
}

export function routerGetNodeEnv(request: Request, response: JkResponse) {
  try {
    response.sendContent(NODE_ENV);
  } catch (error) {
    response.sendError(toJkError(error), { message: 'Error handling "routerGetEnv"', notify: true });
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
    response.sendError(toJkError(error), { message: 'Error handling "routerGetStatus"', notify: true });
  }
}

export function routerGetLsFolderPath(request: Request<{ folderPath: string }>, response: JkResponse) {
  try {
    if (request.query.secretToken !== JUKI_SECRET_TOKEN) {
      return response.sendError(new JkError(ErrorCode.ERR401), {
        message: 'Unauthorized "routerGetLsFolderPath" /ls/' + request.params.folderPath,
        notify: true,
      });
    }
    response.sendContent(fs.readdirSync(request.params.folderPath));
  } catch (error) {
    response.sendError(toJkError(error), {
      message: 'Error handling "routerGetLsFolderPath" /ls/' + request.params.folderPath,
      notify: true,
    });
  }
}

export function routerGetCatFilePath(request: Request<{ filePath: string }>, response: JkResponse) {
  try {
    if (request.query.secretToken !== JUKI_SECRET_TOKEN) {
      return response.sendError(new JkError(ErrorCode.ERR401), {
        message: 'Unauthorized "routerGetCatFilePath" /cat/' + request.params.filePath,
        notify: true,
      });
    }
    response.sendContent(fs.readFileSync(request.params.filePath, 'utf8'));
  } catch (error) {
    response.sendError(toJkError(error), {
      message: 'Error handling "routerGetCatFilePath" /cat/' + request.params.filePath,
      notify: true,
    });
  }
}

export function routerGetEnvs(request: Request, response: JkResponse) {
  try {
    if (request.query.secretToken !== JUKI_SECRET_TOKEN) {
      return response.sendError(new JkError(ErrorCode.ERR401), {
        message: 'Unauthorized "routerGetEnvs"',
        notify: true,
      });
    }
    response.sendContent({
      ...process.env,
    });
  } catch (error) {
    response.sendError(toJkError(error), {
      message: 'Error handling "routerGetEnvs"',
      notify: true,
    });
  }
}
