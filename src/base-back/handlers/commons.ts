import { Request, Response } from 'express';
import fs from 'fs';
import os from 'os';
import { NODE_ENV, VERSION } from '../config';
import { response500 } from '../helpers';

export function routerGetPing(req: Request, res: Response) {
  try {
    res.send('pong ');
  } catch (error) {
    response500(res, error, 'Error handling "handlePing"');
  }
}

export function routerGetVersion(req: Request, res: Response) {
  try {
    res.send(VERSION);
  } catch (error) {
    response500(res, error, 'Error handling "handleVersion"');
  }
}

export function routerGetEnv(req: Request, res: Response) {
  try {
    res.send(NODE_ENV);
  } catch (error) {
    response500(res, error, 'Error handling "handleEnv"');
  }
}

export function routerGetStatus(req: Request, res: Response) {
  try {
    res.send({
      time: new Date(),
      cpus: os.cpus(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
    });
  } catch (error) {
    response500(res, error, 'Error handling "handleStatus"');
  }
}

export function routerGetLsFolderPath(req: Request<{ folderPath: string }>, res: Response) {
  try {
    res.send(fs.readdirSync(req.params.folderPath));
  } catch (error) {
    response500(res, error, 'Error handling "handleLs" /ls/' + req.params.folderPath);
  }
}

export function routerGetCatFilePath(req: Request<{ filePath: string }>, res: Response) {
  try {
    res.send(fs.readFileSync(req.params.filePath, 'utf8'));
  } catch (error) {
    response500(res, error, 'Error handling "handleCat" /cat/' + req.params.filePath);
  }
}
