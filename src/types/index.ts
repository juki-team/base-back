import { Response } from 'express';
import { Response500, ResponseContent, ResponseContents, ResponseError } from '../helpers';

export type ResponseOptionsType = { message?: string, notify?: boolean, status?: number };

export interface JkResponse extends Response {
  sendError: ResponseError,
  sendContents: ResponseContents,
  sendContent: ResponseContent,
}
