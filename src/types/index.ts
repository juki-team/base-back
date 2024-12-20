import { Response } from 'express';
import { ResponseContent, ResponseContents, ResponseError } from '../helpers';

export type ResponseOptionsType = { message?: string, notify?: boolean, status?: number };

export interface JkResponse extends Response {
  sendError: ResponseError,
  sendContents: ResponseContents,
  sendContent: ResponseContent,
}

export enum ImagesJukiPub {
  O = 'o', // image original
  T = 't', // image thumbnail
  U = 'u', // user images
  C = 'c', // company images
}

export enum FilesJukiPub {
  SHARED = 'shared', // files to share
  TEMP = 'temp', // temporal files
  PROBLEMS = 'problems',
  CONTESTS = 'contents',
}

export enum FilesJukiPrivate {
  TEST_CASES = 'test-cases',
}

export enum LinkFilesJukiLy {
  PUBLIC = 'p',
  CUSTOM = 'c',
}
