import { LogLevel } from '@juki-team/commons';

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const VERSION = process.env.VERSION || '0.0.0';
export const ORIGINS = [
  ...(process.env.ORIGINS || '').split(','),
  /^((https:\/\/juki\.app)|(https:\/\/[a-zA-Z0-9\-_]+\.juki\.app))$/,
  /^((https:\/\/juk\.app)|(https:\/\/[a-zA-Z0-9\-_]+\.juk\.app))$/,
  /^((https:\/\/juki\.team)|(https:\/\/[a-zA-Z0-9\-_]+\.juki\.team))$/,
  /^((https:\/\/jukijudge\.com)|(https:\/\/[a-zA-Z0-9\-_]+\.jukijudge\.com))$/,
  /^((https:\/\/juki-ui\.com)|(https:\/\/[a-zA-Z0-9\-_]+\.juki-ui\.com))$/,
  /^((https:\/\/oscargauss\.com)|(https:\/\/[a-zA-Z0-9\-_]+\.oscargauss\.com))$/,
];
export const LOG_LEVEL: LogLevel = process.env.LOG_LEVEL as LogLevel || LogLevel.INFO;

export const PORT = process.env.PORT || 4000;

export const TELEGRAM_JUKI_LOGS_BOT_TOKEN = process.env.TELEGRAM_JUKI_LOGS_BOT_TOKEN || '';
export const TELEGRAM_JUKI_INFO_LOGS_CHAT_ID = process.env.TELEGRAM_JUKI_INFO_LOGS_CHAT_ID || '';
export const TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID = process.env.TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID || '';

export const JUKI_SECRET_TOKEN = process.env.JUKI_SECRET_TOKEN || '';
export const SHARED_TASK_STATUSES_FOLDER = process.env.SHARED_TASK_STATUSES_FOLDER || '';
