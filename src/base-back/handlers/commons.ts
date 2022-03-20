import { Request, Response } from 'express';
import fs from 'fs';
import os from 'os';
import { NODE_ENV, VERSION } from '../config';
import { response500 } from '../helpers';

export function routerGetPing(request: Request, response: Response) {
  try {
    response.send('pong ');
  } catch (error) {
    response500(response, error, 'Error handling "handlePing"');
  }
}

export function routerGetVersion(request: Request, response: Response) {
  try {
    response.send(VERSION);
  } catch (error) {
    response500(response, error, 'Error handling "handleVersion"');
  }
}

export function routerGetEnv(request: Request, response: Response) {
  try {
    response.send(NODE_ENV);
  } catch (error) {
    response500(response, error, 'Error handling "handleEnv"');
  }
}

export function routerGetStatus(request: Request, response: Response) {
  try {
    response.send({
      time: new Date(),
      cpus: os.cpus(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
    });
  } catch (error) {
    response500(response, error, 'Error handling "handleStatus"');
  }
}

export function routerGetLsFolderPath(request: Request<{ folderPath: string }>, response: Response) {
  try {
    response.send(fs.readdirSync(request.params.folderPath));
  } catch (error) {
    response500(response, error, 'Error handling "handleLs" /ls/' + request.params.folderPath);
  }
}

export function routerGetCatFilePath(request: Request<{ filePath: string }>, response: Response) {
  try {
    response.send(fs.readFileSync(request.params.filePath, 'utf8'));
  } catch (error) {
    response500(response, error, 'Error handling "handleCat" /cat/' + request.params.filePath);
  }
}
